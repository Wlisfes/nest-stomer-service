import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Brackets } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { HttpService } from '@nestjs/axios'
import { compareSync } from 'bcryptjs'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { RedisService } from '@/core/redis.service'
import { UserEntity } from '@/entity/user.entity'
import { USER_TOKEN, USER_REFRESH, USER_CACHE, COMMON_MOBILE, USER_ONLINE } from '@/config/redis-config'
import { divineHandler } from '@/utils/utils-common'
import * as http from '@/interface/user.interface'
import * as uuid from 'uuid'

@Injectable()
export class UserService extends CoreService {
	constructor(
		private readonly entity: EntityService,
		private readonly redisService: RedisService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly httpService: HttpService
	) {
		super()
	}

	/**创建token、2小时有效期**/
	public async newJwtToken(node: UserEntity) {
		return await this.RunCatch(async i18n => {
			const expire = Number(this.configService.get('JWT_EXPIRE') ?? 7200)
			const secret = this.configService.get('JWT_SECRET')
			const token = await this.jwtService.signAsync({ ...node, secret: uuid.v4() }, { secret })
			const refresh = await this.jwtService.signAsync({ ...node, secret: uuid.v4() }, { secret })
			//redis
			await this.redisService.setStore(`${USER_TOKEN}:${node.uid}`, token, expire)
			return await this.redisService.setStore(`${USER_REFRESH}:${node.uid}`, refresh, expire * 10).then(() => {
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
	public async httpRegister(props: http.RequestRegister) {
		return await this.RunCatch(async i18n => {
			await this.haveCreate({
				model: this.entity.userModel,
				name: i18n.t('user.mobile.value'),
				message: i18n.t('user.mobile.register'),
				options: { where: { mobile: props.mobile } }
			})

			const code = await this.redisService.getStore(`${COMMON_MOBILE}:${props.mobile}`)
			if (!code) {
				//验证码失效
				throw new HttpException(i18n.t('user.code.expire'), HttpStatus.BAD_REQUEST)
			} else if (props.code !== code) {
				//验证码错误
				throw new HttpException(i18n.t('user.code.error'), HttpStatus.BAD_REQUEST)
			}
			const node = await this.entity.userModel.create({
				uid: Date.now(),
				nickname: props.nickname,
				password: props.password,
				mobile: props.mobile
			})
			return await this.entity.userModel.save(node).then(async () => {
				//登录成功、清除redis验证码
				await this.redisService.delStore(`${COMMON_MOBILE}:${props.mobile}`)
				return { message: i18n.t('user.notice.REGISTER_SUCCESS') }
			})
		})
	}

	/**登录**/ //prettier-ignore
	public async httpAuthorize(props: http.RequestAuthorize, referer: string) {
		return await this.RunCatch(async i18n => {
			await this.httpService.axiosRef.request({
				url: `https://api.lisfes.cn/api-captcha/supervisor/inspector`,
				method: 'POST',
				headers: { origin: referer },
				data: {
					appSecret: '5wE2EzGEI4JDn4M1uzsEEMsGCCsAu2pJ',
					appKey: 'sFnFysvpL0DFGs6H',
					token: props.token,
					session: props.session
				}
			}).then(async ({ data }) => {
				return await divineHandler(
					() => data.code !== 200,
					() => {
						throw new HttpException(data.message, HttpStatus.BAD_REQUEST)
					}
				).then(e => data)
			})
			const node = await this.validator({
				model: this.entity.userModel,
				name: i18n.t('user.name'),
				empty: { value: true },
				close: { value: true },
				delete: { value: true },
				options: { where: { mobile: props.mobile }, select: ['id', 'uid', 'status', 'password'] }
			}).then(async data => {
				return await divineHandler(
					() => !compareSync(props.password, data.password),
					() => {
						throw new HttpException(i18n.t('user.password.error'), HttpStatus.BAD_REQUEST)
					}
				).then(e => data)
			})
			return await this.newJwtToken(node).then(async ({ token, expire, refresh }) => {
				//登录成功、写入在线用户
				await this.redisService.setStore(`${USER_ONLINE}:${node.uid}`, node.uid)
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
	public async httpBasicAuthorize(uid: number, props: { cache: boolean; close: boolean; delete: boolean }) {
		return await this.RunCatch(async i18n => {
			const node = await this.entity.userModel
				.createQueryBuilder('t')
				.where(
					new Brackets(Q => {
						Q.where('t.uid = :uid', { uid })
					})
				)
				.getOne()
			await this.nodeValidator(
				{ node, i18n },
				{
					name: i18n.t('user.name'),
					empty: { value: true },
					close: { value: props.close },
					delete: { value: props.delete }
				}
			)
			return await this.redisService.setStore(`${USER_CACHE}:${uid}`, node).then(() => {
				return node
			})
		})
	}

	/**创建用户**/
	public async httpCreateUser(props: http.RequestCreateUser) {
		return await this.RunCatch(async i18n => {
			await this.haveCreate({
				model: this.entity.userModel,
				name: i18n.t('user.mobile.value'),
				message: i18n.t('user.mobile.register'),
				options: { where: { mobile: props.mobile } }
			})
			const node = await this.entity.userModel.create({
				uid: Date.now(),
				nickname: props.nickname,
				password: props.password,
				mobile: props.mobile
			})
			return await this.entity.userModel.save(node).then(async () => {
				return { message: i18n.t('http.CREATE_SUCCESS') }
			})
		})
	}

	/**编辑用户权限**/
	public async httpUpdateAuthorize() {
		// return await this.RunCatch(async i18n => {
		// 	const user = await this.validator({
		// 		model: this.entity.userModel,
		// 		name: i18n.t('user.name'),
		// 		empty: { value: true },
		// 		options: {
		// 			where: { uid: `719773724730736443` },
		// 			relations: ['rules']
		// 		}
		// 	})
		// 	const { list } = await this.batchValidator({
		// 		model: this.entity.ruleModel,
		// 		name: i18n.t('rule.name'),
		// 		options: { where: { id: In([1, 2, 3, 4, 5, 6, 7, 8, 9]) } },
		// 		ids: [1, 2, 3, 4, 5, 6, 7, 8, 9]
		// 	})
		// 	return await this.entity.userModel
		// 		.createQueryBuilder('t')
		// 		.relation('rules')
		// 		.of(user)
		// 		.addAndRemove(
		// 			list.map(x => x.id),
		// 			user.rules.map(x => x.id)
		// 		)
		// 		.then(() => {
		// 			return { message: i18n.t('http.UPDATE_SUCCESS') }
		// 		})
		// })
	}

	/**用户列表**/
	public async httpColumnUser(props: http.RequestColumnUser) {
		return await this.RunCatch(async i18n => {
			const [list = [], total = 0] = await this.entity.userModel
				.createQueryBuilder('t')
				.where(new Brackets(Q => {}))
				.orderBy({ 't.createTime': 'DESC' })
				.skip((props.page - 1) * props.size)
				.take(props.size)
				.getManyAndCount()

			return { size: props.size, page: props.page, total, list }
		})
	}
}
