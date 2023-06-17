import { CanActivate, SetMetadata, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserService } from '@/module/user/user.service'
import { RedisService } from '@/module/basic/redis.service'
import { usuCurrent } from '@/i18n'
import { USER_AUTHORIZE } from '@/config/redis-config'

export const APP_AUTH_INJECT = 'APP_AUTH_INJECT'
export const APP_AUTH_TOKEN = 'x-token'

export class IBearer {
	decorator: boolean
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

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const i18n = usuCurrent()
		const request = context.switchToHttp().getRequest()
		const bearer = this.reflector.get<IBearer>(APP_AUTH_INJECT, context.getHandler())

		/**验证登录**/
		if (bearer && bearer.decorator) {
			const token = request.headers[APP_AUTH_TOKEN]
			if (!token) {
				//未携带token，未登录; error为true时抛出错误
				if (bearer.error) {
					throw new HttpException(i18n.t('user.notice.LOGIN_NOT'), HttpStatus.UNAUTHORIZED)
				}
			} else {
				const { uid } = await this.userService.untieJwtToken(token)
				const expire = Date.now()
				const cache = await this.redisService.getStore<{ token: string; refresh: string; expire: number }>(
					`${USER_AUTHORIZE}:${uid}`
				)
				if (!cache || cache.token !== token || cache.expire < expire) {
					//token未存储在redis中、或者redis中存储的token不一致，登录已过期
					if (bearer.error) {
						throw new HttpException(i18n.t('user.notice.TOKEN_EXPIRE'), HttpStatus.UNAUTHORIZED)
					}
					/**停止往下验证**/
					return true
				}

				//读取redis用户信息挂载到request
				const user = await this.userService.httpBasicUser(uid, { cache: true, close: true, delete: true })
				request.user = user
			}
		}

		return true
	}
}

//用户登录守卫、使用ApiBearer守卫的接口会验证用户登录
export const ApiBearer = (props: IBearer) => SetMetadata(APP_AUTH_INJECT, props)
