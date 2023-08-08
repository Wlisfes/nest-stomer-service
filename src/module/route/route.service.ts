import { Injectable } from '@nestjs/common'
import { Brackets, In } from 'typeorm'
import { isEmpty } from 'class-validator'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { listToTree, delChildren } from '@/utils/utils-common'
import * as http from '@/interface/route.interface'

@Injectable()
export class RouteService extends CoreService {
	constructor(private readonly entity: EntityService) {
		super()
	}

	/**新增路由**/
	public async httpCreateRoute(props: http.CreateRoute) {
		return await this.RunCatch(async i18n => {
			await this.haveCreate({
				model: this.entity.routeModel,
				name: i18n.t('route.name'),
				options: { where: { path: props.path, status: In(['disable', 'enable']) } }
			})
			if (isEmpty(props.parent)) {
				await this.validator({
					model: this.entity.routeModel,
					name: i18n.t('route.name'),
					empty: { value: true },
					options: { where: { id: props.parent } }
				})
			}
			const node = await this.entity.routeModel.create({
				source: props.source,
				title: props.title,
				status: props.status ?? 'enable',
				path: props.path,
				redirect: props.redirect,
				order: props.order,
				icon: props.icon || null,
				parent: props.parent || null
			})
			return await this.entity.routeModel.save(node).then(() => {
				return { message: i18n.t('http.CREATE_SUCCESS') }
			})
		})
	}

	/**编辑路由**/
	public async httpUpdateRoute(props: http.UpdateRoute) {
		return await this.RunCatch(async i18n => {
			await this.haveUpdate(
				{
					model: this.entity.routeModel,
					name: i18n.t('route.name'),
					options: { where: { path: props.path, status: In(['disable', 'enable']) } }
				},
				e => e.id !== props.id
			)
			if (isEmpty(props.parent)) {
				await this.validator({
					model: this.entity.routeModel,
					name: i18n.t('route.name'),
					empty: { value: true },
					options: { where: { id: props.parent } }
				})
			}
			//prettier-ignore
			return await this.entity.routeModel.update(
				{ id: props.id },
				{
					source: props.source,
					title: props.title,
					status: props.status,
					path: props.path,
					redirect: props.redirect,
					order: props.order,
					icon: props.icon ?? null,
					parent: props.parent ?? null
				}
			).then(() => {
				return { message: i18n.t('http.UPDATE_SUCCESS') }
			})
		})
	}

	/**编辑路由状态**/
	public async httpTransferRoute(props: http.TransferRoute) {
		return await this.RunCatch(async i18n => {
			await this.validator({
				model: this.entity.routeModel,
				name: i18n.t('rule.name'),
				empty: { value: true },
				options: { where: { id: props.id } }
			})
			return await this.entity.routeModel.update({ id: props.id }, { status: props.status }).then(() => {
				return { message: i18n.t('http.UPDATE_SUCCESS') }
			})
		})
	}

	/**路由信息**/
	public async httpBasicRoute(props: http.BasicRoute) {
		return await this.RunCatch(async i18n => {
			return await this.validator({
				model: this.entity.routeModel,
				name: i18n.t('route.name'),
				empty: { value: true },
				delete: { value: true },
				options: {
					join: { alias: 'tb' },
					where: new Brackets(qb => {
						qb.where('tb.id = :id', { id: props.id })
					})
				}
			})
		})
	}

	/**动态路由节点**/
	public async httpDynamicRoute() {
		return await this.RunCatch(async i18n => {
			return await this.batchValidator({
				model: this.entity.routeModel,
				options: {
					join: { alias: 'tb' },
					order: { order: 'DESC', id: 'DESC' },
					where: new Brackets(qb => {
						qb.where('tb.source IN(:...source)', { source: ['folder', 'menu'] })
					})
				}
			}).then(({ total, list }) => {
				return {
					total,
					list: listToTree(list, ['enable'])
				}
			})
		})
	}

	/**路由列表**/
	public async httpColumnRoute() {
		return await this.RunCatch(async i18n => {
			return await this.batchValidator({
				model: this.entity.routeModel,
				options: {
					join: { alias: 'tb' },
					order: { order: 'DESC', id: 'DESC' }
				}
			}).then(({ total, list }) => {
				return {
					total,
					list: listToTree(list, ['enable', 'disable'])
				}
			})
		})
	}

	/**路由权限列表**/
	public async httpOptionsRoute() {
		return await this.RunCatch(async i18n => {
			return await this.RunCatch(async i18n => {
				return await this.batchValidator({
					model: this.entity.routeModel,
					options: {
						join: { alias: 'tb' },
						order: { order: 'DESC', id: 'DESC' },
						select: ['id', 'status', 'title', 'source', 'parent', 'order']
					}
				}).then(({ total, list }) => {
					return {
						total,
						list: delChildren(listToTree(list, ['enable', 'disable']))
					}
				})
			})
		})
	}

	/**新增接口规则**/
	public async httpCreateRule(props: http.CreateRule) {
		return await this.RunCatch(async i18n => {
			await this.haveCreate({
				model: this.entity.routeModel,
				name: i18n.t('route.rule'),
				options: { where: { path: props.path, status: In(['disable', 'enable']) } }
			})
			await this.validator({
				model: this.entity.routeModel,
				name: i18n.t('route.name'),
				empty: { value: true },
				close: { value: true },
				delete: { value: true },
				options: { where: { id: props.parent } }
			})
			const node = await this.entity.routeModel.create({
				source: 'rule',
				path: props.path,
				title: props.title,
				method: props.method,
				status: props.status,
				parent: props.parent
			})
			return await this.entity.routeModel.save(node).then(() => {
				return { message: i18n.t('http.CREATE_SUCCESS') }
			})
		})
	}

	/**编辑接口规则**/
	public async httpUpdateRule(props: http.UpdateRule) {
		return await this.RunCatch(async i18n => {
			await this.haveUpdate(
				{
					model: this.entity.routeModel,
					name: i18n.t('route.rule'),
					options: { where: { path: props.path, status: In(['disable', 'enable']) } }
				},
				rule => rule.id !== props.id
			)
			await this.validator({
				model: this.entity.routeModel,
				name: i18n.t('route.name'),
				empty: { value: true },
				options: { where: { id: props.parent } }
			})
			//prettier-ignore
			return await this.entity.routeModel.update(
				{ id: props.id },
				{
					path: props.path ,
					title: props.title,
					method: props.method,
					status: props.status,
					parent: props.parent
				}
			).then(() => {
				return { message: i18n.t('http.UPDATE_SUCCESS') }
			})
		})
	}

	/**编辑接口规则状态**/
	public async httpTransferRule(props: http.TransferRule) {
		return await this.RunCatch(async i18n => {
			await this.validator({
				model: this.entity.routeModel,
				name: i18n.t('route.rule'),
				empty: { value: true },
				options: { where: { id: props.id } }
			})
			return await this.entity.routeModel.update({ id: props.id }, { status: props.status }).then(() => {
				return { message: i18n.t('http.UPDATE_SUCCESS') }
			})
		})
	}

	/**接口规则信息**/
	public async httpBasicRule(props: http.BasicRule) {
		return await this.RunCatch(async i18n => {
			return await this.validator({
				model: this.entity.routeModel,
				name: i18n.t('route.rule'),
				empty: { value: true },
				delete: { value: true },
				options: { where: { id: props.id } }
			})
		})
	}
}
