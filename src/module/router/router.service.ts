import { Injectable } from '@nestjs/common'
import { In } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import * as http from './router.interface'

@Injectable()
export class RouterService extends CoreService {
	constructor(private readonly entity: EntityService) {
		super()
	}

	/**新增路由**/
	public async httpRouterCreate(props: http.RequestCreateRouter) {
		return this.RunCatch(async i18n => {
			await this.haveCreate({
				model: this.entity.routerModel,
				name: i18n.t('router.name'),
				options: { where: { path: props.path, status: In(['disable', 'enable']) } }
			})
			const node = await this.entity.routerModel.create({
				type: props.type,
				title: props.title,
				status: props.status ?? 'enable',
				path: props.path,
				redirect: props.redirect,
				icon: props.icon || null,
				parent: props.parent || null
			})
			await this.entity.routerModel.save(node)
			return { message: i18n.t('http.HTTP_CREATE_SUCCESS') }
		})
	}

	/**编辑路由**/
	public async httpRouterUpdate(props: http.RequestUpdateRouter) {}

	/**动态路由节点**/
	public async httpRouterDynamic() {
		return this.RunCatch(async i18n => {
			const list = await this.entity.routerModel.find({ where: { status: 'enable' } })
			return { list }
		})
	}

	/**路由列表**/
	public async httpRouterColumn() {
		return this.RunCatch(async i18n => {
			const list = await this.entity.routerModel.find({
				relations: ['rule'],
				order: { id: 'DESC' }
			})
			return { list: this.listToTree(list) }
		})
	}
}
