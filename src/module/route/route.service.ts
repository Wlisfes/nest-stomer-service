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
	public async httpCreateRoute(props: http.RequestCreateRoute) {
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
	public async httpUpdateRoute(props: http.RequestUpdateRoute) {
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
	public async httpTransferRoute(props: http.RequestTransferRoute) {
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
	public async httpBasicRoute(props: http.RequestBasicRoute) {
		return await this.RunCatch(async i18n => {
			const node = await this.entity.routeModel
				.createQueryBuilder('t')
				.leftJoinAndSelect('t.rule', 'rule', 'rule.status IN(:...status)', { status: ['enable', 'disable'] })
				.where(
					new Brackets(Q => {
						Q.where('t.id = :id', { id: props.id })
						Q.andWhere('t.status IN(:...status)', { status: ['enable', 'disable'] })
					})
				)
				.getOne()
			return await this.nodeValidator(
				{ node, i18n },
				{
					name: i18n.t('route.name'),
					empty: { value: true },
					delete: { value: true }
				}
			)
		})
	}

	/**动态路由节点**/
	public async httpDynamicRoute() {
		return await this.RunCatch(async i18n => {
			const [list = [], total = 0] = await this.entity.routeModel
				.createQueryBuilder('t')
				.where(
					new Brackets(Q => {
						Q.andWhere('t.source IN(:...source)', { source: ['folder', 'menu'] })
					})
				)
				.orderBy({ 't.order': 'DESC', 't.id': 'DESC' })
				.getManyAndCount()
			return {
				total,
				list: listToTree(list, ['enable'])
			}
		})
	}

	/**路由列表**/
	public async httpColumnRoute() {
		return await this.RunCatch(async i18n => {
			const [list = [], total = 0] = await this.entity.routeModel
				.createQueryBuilder('t')
				.orderBy({ 't.order': 'DESC', 't.id': 'DESC' })
				.getManyAndCount()
			return { total, list: delChildren(listToTree(list, ['enable', 'disable'])) }
		})
	}

	/**新增接口规则**/
	public async httpCreateRule(props: http.RequestCreateRule) {
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
	public async httpUpdateRule(props: http.RequestUpdateRule) {
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
	public async httpTransferRule(props: http.RequestTransferRule) {
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
	public async httpBasicRule(props: http.RequestBasicRule) {
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
