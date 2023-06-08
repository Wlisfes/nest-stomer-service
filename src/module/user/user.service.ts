import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Brackets } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { RedisService } from '@/core/redis.service'
import { AlicloudService } from '@/core/alicloud.service'
import { usuCurrent } from '@/i18n'
import { UserEntity } from '@/entity/user.entity'
import { compareSync } from 'bcryptjs'
import * as uuid from 'uuid'
import * as User from './user.interface'

@Injectable()
export class UserService extends CoreService {
	constructor(
		private readonly entity: EntityService,
		private readonly redis: RedisService,
		private readonly aliCloud: AlicloudService,
		private readonly jwtService: JwtService
	) {
		super()
	}

	/**new token**/
	public async newJwtToken(props: UserEntity) {
		console.log(props)
		const expire = 10 * 60 * 60
		const token = await this.jwtService.sign(
			{
				uid: props.uid,
				// password: props.password,
				status: props.status
			},
			{ secret: 'secret' }
		)
		return { expire, token }
	}

	/**untie token**/
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

			const { token, expire } = await this.newJwtToken(node)
			console.log(token)
			// await this.redis.setStore(node.uid, node, expire)
			return { expire, token, message: i18n.t('user.USER_LOGIN_SUCCESS') }
		} catch (e) {
			console.log(e)
			throw new HttpException(e.message || i18n.t('http.HTTP_SERVICE_ERROR'), HttpStatus.BAD_REQUEST)
		}
	}
}
