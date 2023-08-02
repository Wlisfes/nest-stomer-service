import {
	CanActivate,
	SetMetadata,
	ExecutionContext,
	Injectable,
	HttpException,
	HttpStatus,
	Logger
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
}

@Injectable()
export class AuthGuard implements CanActivate {
	private readonly logger = new Logger(AuthGuard.name)
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
		const i18n = usuCurrent()
		return await this.redisService.getStore<string>(`${USER_ONLINE}:${uid}`).then(async online => {
			if (!online) {
				await this.AuthorizeHttpException(error, i18n.t('user.notice.TOKEN_EXPIRE'), HttpStatus.UNAUTHORIZED)
			}
			return !!online
		})
	}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const i18n = usuCurrent()
		const request = context.switchToHttp().getRequest()
		const bearer = this.reflector.get<IBearer>(APP_AUTH_INJECT, context.getHandler())
		const baseURL = request.route.path

		//验证登录
		if (bearer && bearer.authorize) {
			const authorize = request.headers[SwaggerOption.APP_AUTH_TOKEN]
			if (!authorize) {
				//未携带token
				await this.AuthorizeHttpException(
					bearer.error,
					i18n.t('user.notice.LOGIN_NOT'),
					HttpStatus.UNAUTHORIZED
				)
			} else {
				//解析token
				const data: any = await this.userService.untieJwtToken(authorize).catch(async e => {
					await this.AuthorizeHttpException(
						bearer.error,
						i18n.t('user.notice.TOKEN_EXPIRE'),
						HttpStatus.UNAUTHORIZED
					)
				})
				await this.AuthorizeOnline(data.uid, bearer.error).then(async result => {
					return await this.redisService.getStore<string>(`${USER_TOKEN}:${data.uid}`).then(async token => {
						if (!token || authorize !== token) {
							await this.AuthorizeHttpException(
								bearer.error,
								i18n.t('user.notice.TOKEN_EXPIRE'),
								HttpStatus.UNAUTHORIZED
							)
						}
						return token
					})
				})
				request.user = data
			}
			//未抛出错误、继续往下走
			return true
		}

		return true
	}
}

//用户登录守卫、使用ApiBearer守卫的接口会验证用户登录
export const ApiBearer = (props: IBearer) => SetMetadata(APP_AUTH_INJECT, props)
