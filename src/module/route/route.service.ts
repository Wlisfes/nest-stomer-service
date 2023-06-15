import { Injectable } from '@nestjs/common'
import { Brackets, In } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import * as http from './route.interface'

@Injectable()
export class RouteService extends CoreService {
	constructor(private readonly entity: EntityService) {
		super()
	}

	/**新增路由**/
	public async httpRouteCreate(props: http.RequestCreateRoute) {
		return await this.RunCatch(async i18n => {
			await this.haveCreate({
				model: this.entity.routeModel,
				name: i18n.t('route.name'),
				options: { where: { path: props.path, status: In(['disable', 'enable']) } }
			})
			const node = await this.entity.routeModel.create({
				type: props.type,
				title: props.title,
				status: props.status ?? 'enable',
				path: props.path,
				redirect: props.redirect,
				icon: props.icon || null,
				parent: props.parent || null
			})
			return await this.entity.routeModel.save(node).then(() => {
				return { message: i18n.t('http.CREATE_SUCCESS') }
			})
		})
	}

	/**编辑路由**/
	public async httpRouteUpdate(props: http.RequestUpdateRoute) {}

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
	public async httpRouteDynamic() {
		return await this.RunCatch(async i18n => {
			const [list = [], total = 0] = await this.entity.routeModel.findAndCount({
				where: { status: 'enable' }
			})
			return { list, total }
		})
	}

	/**路由列表**/
	public async httpRouteColumn() {
		return await this.RunCatch(async i18n => {
			const [list = [], total = 0] = await this.entity.routeModel
				.createQueryBuilder('t')
				.leftJoinAndSelect('t.rule', 'rule', 'rule.status IN(:...status)', { status: ['enable', 'disable'] })
				.where(
					new Brackets(Q => {
						Q.where('t.status IN(:...status)', { status: ['enable', 'disable'] })
					})
				)
				.orderBy({ 't.id': 'DESC' })
				.getManyAndCount()
			return { total, list: this.listToTree(list) }
		})
	}
}
