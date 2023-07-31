import {
	CanActivate,
	SetMetadata,
	ExecutionContext,
	Injectable,
	HttpException,
	HttpStatus,
	Request
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserService } from '@/module/user/user.service'
import { RedisService } from '@/core/redis.service'
import { usuCurrent } from '@/i18n'
import { SwaggerOption } from '@/config/swagger-config'
import { USER_TOKEN, USER_REFRESH, USER_CACHE, USER_ONLINE } from '@/config/redis-config'

export const APP_AUTH_INJECT = 'APP_AUTH_INJECT'

export class IBearer {
	authorize: boolean
	error: boolean
	baseURL: string
}

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly userService: UserService,
		private readonly redisService: RedisService
	) {}

	/**验证是否需要抛出异常**/
	private async AuthorizeHttpException(error: boolean, message?: string, code?: number) {
		const i18n = usuCurrent()
		if (error) {
			throw new HttpException(message ?? i18n.t('user.notice.TOKEN_EXPIRE'), code ?? HttpStatus.UNAUTHORIZED)
		}
		return false
	}

	/**验证用户是否在线**/
	private async AuthorizeOnline(uid: number, error: boolean) {
		const online = await this.redisService.getStore<string>(`${USER_ONLINE}:${uid}`)
		if (online) {
			/**在线状态**/
			return true
		} else if (error) {
			/**不在线、并且抛出错误**/
			return await this.AuthorizeHttpException(error)
		}
		return false
	}

	/**验证用户是否携带token**/
	private async AuthorizeToken(request: Request, error: boolean): Promise<[boolean, any]> {
		const token = request.headers[SwaggerOption.APP_AUTH_TOKEN]
		if (token) {
			return [true, await this.userService.untieJwtToken(token)]
		} else if (error) {
			return [false, await this.AuthorizeHttpException(error)]
		}
		return [false, null]
	}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const i18n = usuCurrent()
		const request = context.switchToHttp().getRequest()
		const bearer = this.reflector.get<IBearer>(APP_AUTH_INJECT, context.getHandler())

		/**验证登录**/
		if (bearer && bearer.authorize) {
			const [result, data] = await this.AuthorizeToken(request, bearer.error).then(async ([result1, data1]) => {
				if (result1 && (await this.AuthorizeOnline(data1.uid, bearer.error))) {
					const token = await this.redisService.getStore<string>(`${USER_TOKEN}:${data1.uid}`)
					if (!token || token !== request.headers[SwaggerOption.APP_AUTH_TOKEN]) {
						await this.AuthorizeHttpException(bearer.error)
					}
				}
				return [result1, data1]
			})
			if (result) {
				//读取redis用户信息挂载到request
				const user = await this.userService.httpBasicAuthorize(data.uid, {
					cache: true,
					close: true,
					delete: true
				})
				request.user = user
			}
		}

		return true
	}
}

//用户登录守卫、使用ApiBearer守卫的接口会验证用户登录
export const AuthBearer = (props: IBearer) => SetMetadata(APP_AUTH_INJECT, props)
