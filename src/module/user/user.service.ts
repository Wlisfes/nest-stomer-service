import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Brackets } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/module/basic/entity.service'
import { RedisService } from '@/module/basic/redis.service'
import { AlicloudService } from '@/module/basic/alicloud.service'
import { UserEntity } from '@/entity/user.entity'
import { compareSync } from 'bcryptjs'
import * as uuid from 'uuid'
import * as User from './user.interface'

@Injectable()
export class UserService extends CoreService {
	constructor(
		private readonly entity: EntityService,
		private readonly redisService: RedisService,
		private readonly aliCloud: AlicloudService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {
		super()
	}

	/**创建token、2小时有效期**/
	public async newJwtToken(node: UserEntity) {
		return await this.RunCatch(async i18n => {
			const user = { uid: node.uid, nickname: node.nickname, password: node.password, status: node.status }
			//jwt
			const expire = Number(this.configService.get('JWT_EXPIRE') ?? 7200)
			const secret = this.configService.get('JWT_SECRET')
			const token = await this.jwtService.signAsync({ ...user, secret: uuid.v4() }, { secret })
			const refresh = await this.jwtService.signAsync({ ...user, secret: uuid.v4() }, { secret })
			//redis
			await this.redisService.setStore(`user_token_${node.uid}`, token, expire)
			return await this.redisService.setStore(`user_refresh_${node.uid}`, refresh, expire * 10).then(() => {
				return { expire, token, refresh }
			})
		})
	}

	/**解析token**/
	public async untieJwtToken(token: string): Promise<UserEntity> {
		return await this.RunCatch(async i18n => {
			const secret = this.configService.get('JWT_SECRET')
			return await this.jwtService.verifyAsync(token, { secret })
		})
	}

	/**注册用户**/
	public async httpRegister(props: User.RequestRegister) {
		return await this.RunCatch(async i18n => {
			await this.haveCreate({
				model: this.entity.userModel,
				name: i18n.t('user.mobile.value'),
				message: i18n.t('user.mobile.register'),
				options: { where: { mobile: props.mobile } }
			})

			const code = await this.redisService.getStore(props.mobile)
			if (!code) {
				//验证码失效
				throw new HttpException(i18n.t('user.code.expire'), HttpStatus.BAD_REQUEST)
			} else if (props.code !== code) {
				//验证码错误
				throw new HttpException(i18n.t('user.code.error'), HttpStatus.BAD_REQUEST)
			}
			const node = await this.entity.userModel.create({
				uid: uuid.v4(),
				nickname: props.nickname,
				password: props.password,
				mobile: props.mobile
			})
			return await this.entity.userModel.save(node).then(async () => {
				//登录成功、清除redis验证码
				await this.redisService.delStore(props.mobile)
				return { message: i18n.t('user.notice.REGISTER_SUCCESS') }
			})
		})
	}

	/**登录**/
	public async httpAuthorize(props: User.RequestAuthorize, AUTN_CAPTCHA: string) {
		return await this.RunCatch(async i18n => {
			const code = await this.redisService.getStore(AUTN_CAPTCHA)
			if (code !== props.code) {
				//验证码错误、清除redis验证码
				await this.redisService.delStore(AUTN_CAPTCHA)
				throw new HttpException(i18n.translate('user.code.error'), HttpStatus.BAD_REQUEST)
			}
			const node = await this.validator({
				model: this.entity.userModel,
				name: i18n.t('user.name'), //账号
				empty: { value: true },
				close: { value: true },
				delete: { value: true },
				options: { where: { mobile: props.mobile }, select: ['id', 'uid', 'mobile', 'password', 'nickname'] }
			})
			if (!compareSync(props.password, node.password)) {
				//密码错误、清除redis验证码
				await this.redisService.delStore(AUTN_CAPTCHA)
				throw new HttpException(i18n.t('user.password.error'), HttpStatus.BAD_REQUEST)
			}
			return await this.newJwtToken(node).then(async ({ token, expire, refresh }) => {
				//登录成功、清除redis验证码
				await this.redisService.delStore(AUTN_CAPTCHA)
				return {
					expire,
					token,
					refresh,
					message: i18n.t('user.notice.LOGIN_SUCCESS')
				}
			})
		})
	}

	/**获取用户信息**/
	public async httpBasicUser(uid: string, cache: boolean = true) {
		return await this.RunCatch(async i18n => {
			if (cache) {
				//读取redis缓存
				const node = await this.redisService.getStore(`user_cache_${uid}`)
				return node || (await this.httpBasicUser(uid, false))
			} else {
				const node = await this.validator({
					model: this.entity.userModel,
					name: i18n.t('user.name'),
					empty: { value: true },
					options: { where: { uid } }
				})
				return await this.redisService.setStore(`user_cache_${uid}`, node).then(() => {
					return node
				})
			}
		})
	}
}
