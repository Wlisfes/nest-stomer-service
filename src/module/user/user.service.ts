import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Brackets } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { RedisService } from '@/core/redis.service'
import { AlicloudService } from '@/core/alicloud.service'
import { usuCurrent } from '@/i18n'
import { UserEntity } from '@/entity/user.entity'
import { compareSync } from 'bcryptjs'
import * as ms from 'ms'
import * as uuid from 'uuid'
import * as User from './user.interface'

@Injectable()
export class UserService extends CoreService {
	constructor(
		private readonly entity: EntityService,
		private readonly redis: RedisService,
		private readonly aliCloud: AlicloudService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {
		super()
	}

	/**创建token、2小时有效期**/
	public async newJwtToken(node: UserEntity) {
		const expire = this.configService.get('JWT_EXPIRE')
		const expireBig = this.configService.get('JWT_REFRESH_EXPIRE')
		const secret = this.configService.get('JWT_SECRET')
		/************************************************************/
		const token = await this.jwtService.signAsync(
			{ uid: node.uid, password: node.password, status: node.status },
			{ secret, expiresIn: ms(expire) }
		)
		const refresh = await this.jwtService.signAsync(
			{ uid: node.uid, password: node.password, status: node.status },
			{ secret, expiresIn: ms(expireBig) }
		)
		await this.redis.setStore(`token_${node.uid}`, { token, value: node }, expire)
		await this.redis.setStore(`token_refresh_${node.uid}`, refresh, expireBig)
		return { expire, token, refresh }
	}

	/**解析token**/
	public async untieJwtToken(token: string) {}

	/**注册用户**/
	public async httpRegister(props: User.IRegister) {
		const i18n = usuCurrent()
		try {
			if (await this.entity.userModel.findOne({ where: { mobile: props.mobile } })) {
				//手机号已注册
				throw new HttpException(i18n.t('user.USER_MOBILE_EXIST'), HttpStatus.BAD_REQUEST)
			}

			const code = await this.redis.getStore(props.mobile)
			if (props.code !== code) {
				//验证码错误
				throw new HttpException(i18n.t('user.USER_CAPTCHA_ERROR'), HttpStatus.BAD_REQUEST)
			}

			const node = await this.entity.userModel.create({
				uid: uuid.v4(),
				nickname: props.nickname,
				password: props.password,
				mobile: props.mobile
			})
			await this.entity.userModel.save(node)
			return { message: i18n.t('user.USER_REGISTER_SUCCESS') }
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.HTTP_SERVICE_ERROR'), HttpStatus.BAD_REQUEST)
		}
	}

	/**登录**/
	public async httpLogin(props: User.ILogin, AUTN_CAPTCHA: string) {
		const i18n = usuCurrent()
		try {
			const code = await this.redis.getStore(AUTN_CAPTCHA)
			if (code !== props.code) {
				//验证码错误
				throw new HttpException(i18n.translate('user.USER_CAPTCHA_ERROR'), HttpStatus.BAD_REQUEST)
			}
			const node = await this.validator({
				model: this.entity.userModel,
				name: i18n.t('user.USER_ACCOUNT'), //账号
				empty: { value: true },
				close: { value: true },
				delete: { value: true },
				options: { where: { mobile: props.mobile }, select: ['id', 'uid', 'mobile', 'password'] }
			})
			if (!compareSync(props.password, node.password)) {
				//密码错误
				throw new HttpException(i18n.t('user.USER_PASSWORD_ERROR'), HttpStatus.BAD_REQUEST)
			}
			const { token, expire, refresh } = await this.newJwtToken(node)
			return {
				expire,
				token,
				refresh,
				message: i18n.t('user.USER_LOGIN_SUCCESS')
			}
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.HTTP_SERVICE_ERROR'), HttpStatus.BAD_REQUEST)
		}
	}
}
