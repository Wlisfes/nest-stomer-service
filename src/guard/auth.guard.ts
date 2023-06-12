import { CanActivate, SetMetadata, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserService } from '@/module/user/user.service'
import { RedisService } from '@/core/redis.service'
import { usuCurrent } from '@/i18n'

export const APP_AUTH_INJECT = 'APP_AUTH_INJECT'
export const APP_AUTH_TOKEN = 'x-token'

export class IBearer {
	decorator: boolean
	transfer?: boolean
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
			const node = await this.userService.untieJwtToken(token)
			const cache = await this.redisService.getStore(`user_token_${node.uid}`)

			if (!cache || cache !== token) {
				//token未存储在redis中、或者redis中存储的token不一致，都是未登录
				if (!bearer.transfer) {
					//transfer为true时无需抛出错误
					throw new HttpException(i18n.t('user.USER_LOGIN_NOT'), HttpStatus.UNAUTHORIZED)
				}
			} else {
				const user = await this.userService.httpBaseUser(node.uid)

				request.user = user
				console.log({ cache })
			}
		}

		return true
	}
}

//用户登录守卫、使用ApiBearer守卫的接口会验证用户登录
export const ApiBearer = (props: IBearer) => SetMetadata(APP_AUTH_INJECT, props)