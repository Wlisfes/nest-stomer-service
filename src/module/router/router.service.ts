import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
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
	public async httpCreate(props: http.RequestCreateRouter) {
		const i18n = await this.usuCurrent()
		try {
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
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.HTTP_SERVICE_ERROR'), HttpStatus.BAD_REQUEST)
		}
	}

	/**动态路由节点**/
	public async httpDynamic() {
		const i18n = await this.usuCurrent()
		try {
			const list = await this.entity.routerModel.find({ where: { status: 'enable' } })
			return { list }
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.HTTP_SERVICE_ERROR'), HttpStatus.BAD_REQUEST)
		}
	}

	/**路由列表**/
	public async httpColumn() {
		const i18n = await this.usuCurrent()
		try {
			const list = await this.entity.routerModel.find({
				relations: ['rule'],
				order: { id: 'DESC' }
			})
			return { list: this.listToTree(list) }
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.HTTP_SERVICE_ERROR'), HttpStatus.BAD_REQUEST)
		}
	}
}
