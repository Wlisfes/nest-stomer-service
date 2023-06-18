import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Brackets, In } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { compareSync } from 'bcryptjs'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/module/basic/entity.service'
import { RedisService } from '@/module/basic/redis.service'
import { AlicloudService } from '@/module/basic/alicloud.service'
import { UserEntity } from '@/entity/user.entity'
import { USER_TOKEN, USER_REFRESH, USER_CACHE, COMMON_CAPTCHA, COMMON_MOBILE, USER_ONLINE } from '@/config/redis-config'
import * as uuid from 'uuid'
import * as http from './user.interface'

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
				uid: this.createUIDNumber(),
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

	/**登录**/
	public async httpAuthorize(props: http.RequestAuthorize, AUTN_CAPTCHA: string) {
		return await this.RunCatch(async i18n => {
			const code = await this.redisService.getStore(`${COMMON_CAPTCHA}:${AUTN_CAPTCHA}`)
			if (code !== props.code) {
				//验证码错误、清除redis验证码
				code && (await this.redisService.delStore(`${COMMON_CAPTCHA}:${AUTN_CAPTCHA}`))
				throw new HttpException(i18n.translate('user.code.error'), HttpStatus.BAD_REQUEST)
			}
			const node = await this.validator({
				model: this.entity.userModel,
				name: i18n.t('user.name'), //账号
				empty: { value: true },
				close: { value: true },
				delete: { value: true },
				options: { where: { mobile: props.mobile }, select: ['id', 'uid', 'status', 'password'] }
			})
			if (!compareSync(props.password, node.password)) {
				//密码错误、清除redis验证码
				await this.redisService.delStore(`${COMMON_CAPTCHA}:${AUTN_CAPTCHA}`)
				throw new HttpException(i18n.t('user.password.error'), HttpStatus.BAD_REQUEST)
			}
			return await this.newJwtToken(node).then(async ({ token, expire, refresh }) => {
				//登录成功、清除redis验证码;写入在线用户
				await this.redisService.delStore(`${COMMON_CAPTCHA}:${AUTN_CAPTCHA}`)
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
	public async httpBasicUser(uid: string, props: { cache: boolean; close: boolean; delete: boolean }) {
		return await this.RunCatch(async i18n => {
			const node = await this.entity.userModel
				.createQueryBuilder('t')
				.leftJoinAndSelect('t.roles', 'roles', 'roles.status IN(:...status)', { status: ['enable', 'disable'] })
				.leftJoinAndSelect('roles.rules', 'rules', 'rules.status IN(:...status)', {
					status: ['enable', 'disable']
				})
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

	/**修改用户角色**/
	public async httpUserUpdateRole(props: http.RequestUserRole) {
		return await this.RunCatch(async i18n => {
			const node = await this.validator({
				model: this.entity.userModel,
				name: i18n.t('user.name'),
				empty: { value: true },
				options: { where: { uid: props.uid }, relations: ['roles'] }
			})
			const batch = await this.batchValidator({
				model: this.entity.roleModel,
				name: i18n.t('role.name'),
				ids: props.roles,
				options: { where: { id: In(props.roles), status: In(['disable', 'enable', 'delete']) } }
			})
			//prettier-ignore
			return await this.entity.userModel
				.createQueryBuilder()
				.relation('roles')
				.of(node)
				.addAndRemove(batch.list, node.roles.map(x => x.id)).then(() => {
				return { message: i18n.t('http.UPDATE_SUCCESS') }
			})
		})
	}
}
