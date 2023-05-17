import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { In } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { usuCurrent } from '@/i18n'
import * as http from './router.interface'

@Injectable()
export class RouterService extends CoreService {
	constructor(private readonly entity: EntityService) {
		super()
	}

	public formaterTree(data: Array<Object>) {
		const map: Record<string, any> = {}
		const tree: Array<any> = []
		data.forEach((node: any) => {
			map[node.id] = node
			node.children = []
			if (node.parent) {
				map[node.parent].children.push(node)
			} else {
				tree.push(node)
			}
		})
		return tree
	}

	/**新增路由**/
	public async httpCreate(props: http.ICreate) {
		const i18n = usuCurrent()
		try {
			const route = await this.entity.routerModel.findOne({
				where: [{ path: props.path, status: In([0, 1]) }]
			})
			if (route) {
				throw new HttpException('路由已存在', HttpStatus.BAD_REQUEST)
			}
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
			throw new HttpException(e.message || i18n.t('http.HTTP_SERVICE_FAIL'), HttpStatus.BAD_REQUEST)
		}
	}

	/**动态路由节点**/
	public async httpDynamic() {
		const i18n = usuCurrent()
		try {
			const list = await this.entity.routerModel.find({ where: { status: 'enable' } })
			return { list }
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.HTTP_SERVICE_FAIL'), HttpStatus.BAD_REQUEST)
		}
	}

	/**路由列表**/
	public async httpColumn() {
		const i18n = usuCurrent()
		try {
			const list = await this.entity.routerModel.find()
			return { list: this.formaterTree(list) }
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.HTTP_SERVICE_FAIL'), HttpStatus.BAD_REQUEST)
		}
	}
}
