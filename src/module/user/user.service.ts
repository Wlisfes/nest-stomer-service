import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Brackets, In, EntityManager, QueryBuilder } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { HttpService } from '@nestjs/axios'
import { compareSync } from 'bcryptjs'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { RedisService } from '@/core/redis.service'
import { UserEntity } from '@/entity/user.entity'
import { USER_TOKEN, USER_REFRESH, USER_CACHE, COMMON_MOBILE, USER_ONLINE } from '@/config/redis-config'
import { divineHandler, listToTree, treeToList, delChildren } from '@/utils/utils-common'
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
			//redis
			return await this.redisService.setStore(`${USER_TOKEN}:${node.uid}`, token, expire).then(() => {
				return { expire, token }
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
	public async httpRegister(props: http.Register) {
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
				uid: Number(Date.now() + this.createUIDNumber(3)),
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
	public async httpAuthorize(props: http.Authorize, referer: string) {
		return await this.RunCatch(async i18n => {
			await this.httpService.axiosRef
				.request({
					url: `https://api.lisfes.cn/api-basic/captcha/supervisor/inspector`,
					method: 'POST',
					headers: { origin: referer },
					data: {
						appSecret: 'KB91uw5vzwpDwp5E2q3CAr67y7A7t2un',
						appKey: 'sFnFysvpL0DFGs6H',
						token: props.token,
						session: props.session
					}
				})
				.then(async ({ data }) => {
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
			return await this.newJwtToken(node).then(async ({ token, expire }) => {
				//登录成功、写入在线用户
				await this.redisService.setStore(`${USER_ONLINE}:${node.uid}`, node.uid)
				return {
					expire,
					token,
					message: i18n.t('user.notice.LOGIN_SUCCESS')
				}
			})
		})
	}

	/**获取用户信息**/
	public async httpBasicAuthorize(uid: number) {
		return await this.RunCatch(async i18n => {
			return await this.validator({
				model: this.entity.userModel,
				name: i18n.t('user.name'),
				empty: { value: true },
				close: { value: true },
				delete: { value: true },
				options: {
					join: {
						alias: 'tb',
						leftJoinAndSelect: { routes: 'tb.routes' }
					},
					where: new Brackets(qb => {
						qb.where('tb.uid = :uid', { uid })
						qb.where('routes.status IN(:...status)', { status: ['enable', 'disable'] })
					})
				}
			}).then(async node => {
				return await this.redisService.setStore(`${USER_CACHE}:${uid}`, node).then(() => {
					return node
				})
			})
		})
	}

	/**用户权限信息**/
	public async httpBearerAuthorize(uid: number) {
		return await this.RunCatch(async i18n => {
			return await this.validator({
				model: this.entity.userModel,
				name: i18n.t('user.name'),
				empty: { value: true },
				options: {
					join: {
						alias: 'tb',
						leftJoinAndSelect: { routes: 'tb.routes' }
					},
					select: ['id', 'uid', 'nickname', 'status', 'avatar'],
					where: new Brackets(qb => {
						qb.where('tb.uid = :uid', { uid })
					})
				}
			}).then(data => {
				const routes = treeToList(delChildren(listToTree(data.routes)))
				return Object.assign(data, {
					routes: routes.map(x => ({
						id: x.id,
						status: x.status,
						title: x.title,
						source: x.source,
						isLeaf: x.isLeaf
					}))
				})
			})
		})
	}

	/**创建用户**/
	public async httpCreateUser(props: http.CreateUser) {
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
	public async httpUpdateAuthorize(props: http.UpdateAuthorize) {
		return await this.RunCatch(async i18n => {
			const user = await this.validator({
				model: this.entity.userModel,
				name: i18n.t('user.name'),
				empty: { value: true },
				close: { value: true },
				delete: { value: true },
				options: { where: { uid: props.uid }, relations: ['routes'] }
			})
			const { list } = await this.batchValidator({
				model: this.entity.routeModel,
				options: { where: { id: In(props.route) } }
			}).then(async data => {
				return await divineHandler(
					() => props.route.length !== data.total,
					() => {
						throw new HttpException(
							i18n.t('http.NOT_ISSUE', { args: { name: i18n.t('route.rule') } }),
							HttpStatus.BAD_REQUEST
						)
					}
				).then(e => data)
			})
			return await this.entity.userModel
				.createQueryBuilder('t')
				.relation('routes')
				.of(user)
				.addAndRemove(
					list.map(x => x.id),
					user.routes.map(x => x.id)
				)
				.then(() => {
					return { message: i18n.t('http.UPDATE_SUCCESS') }
				})
		})
	}

	/**用户列表**/
	public async httpColumnUser(props: http.ColumnUser) {
		return await this.RunCatch(async i18n => {
			return await this.batchValidator({
				model: this.entity.userModel,
				options: {
					join: { alias: 'tb' },
					order: { createTime: 'DESC' },
					skip: (props.page - 1) * props.size,
					take: props.size
				}
			}).then(({ list, total }) => {
				return { size: props.size, page: props.page, total, list }
			})
		})
	}
}
