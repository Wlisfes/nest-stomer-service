import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Brackets } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { RedisService } from '@/core/redis.service'
import { AlicloudService } from '@/core/alicloud.service'
import { usuCurrent } from '@/i18n'
import { compareSync } from 'bcryptjs'
import * as User from './user.interface'

@Injectable()
export class UserService extends CoreService {
	constructor(
		private readonly entity: EntityService,
		private readonly redis: RedisService,
		private readonly aliCloud: AlicloudService
	) {
		super()
	}

	/**注册用户**/
	public async httpRegister(props: User.IRegister) {
		const i18n = usuCurrent()
		try {
			if (await this.entity.userModel.findOne({ where: { mobile: props.mobile } })) {
				throw new HttpException('手机号已注册', HttpStatus.BAD_REQUEST)
			}

			const code = await this.redis.getStore(props.mobile)
			if (props.code !== code) {
				throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST)
			}

			const node = await this.entity.userModel.create({
				nickname: props.nickname,
				password: props.password,
				mobile: props.mobile
			})
			await this.entity.userModel.save(node)
			return { message: '注册成功' }
		} catch (e) {
			throw new HttpException(e.message || i18n.t('common.100500'), HttpStatus.BAD_REQUEST)
		}
	}

	/**登录**/
	public async httpLogin(props: User.ILogin, code: string) {
		const i18n = usuCurrent()
		try {
			if (code !== props.code) {
				throw new HttpException(i18n.translate('user.101000'), HttpStatus.BAD_REQUEST)
			}
			await this.validator({
				model: this.entity.userModel,
				message: '账号',
				empty: true,
				close: true,
				delete: true,
				options: { where: { mobile: props.mobile } }
			})
			const node = await this.entity.userModel
				.createQueryBuilder('t')
				.where('t.mobile = :mobile', { mobile: props.mobile })
				.addSelect('t.password')
				.getOne()
			if (!compareSync(props.password, node.password)) {
				throw new HttpException('密码错误', HttpStatus.BAD_REQUEST)
			}

			const session = await this.aliCloud.customSession()
			const seconds = 5 * 60 * 60
			await this.redis.setStore(session, node, seconds)
			return { session, seconds }
		} catch (e) {
			throw new HttpException(e.message || i18n.t('common.100500'), HttpStatus.BAD_REQUEST)
		}
	}
}
