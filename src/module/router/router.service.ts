import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { In } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import * as Inter from './router.interface'

@Injectable()
export class RouterService extends CoreService {
	constructor(private readonly entity: EntityService) {
		super()
	}

	/**新增路由**/
	public async httpCreate(props: Inter.ICreate) {
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
				status: props.status ?? 1,
				path: props.path,
				redirect: props.redirect,
				icon: props.icon || null,
				parent: props.parent || null
			})
			await this.entity.routerModel.save(node)
			return { message: '创建成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**动态路由节点**/
	public async httpDynamic() {
		try {
			const list = await this.entity.routerModel.find({ where: { status: 1 } })
			return { list }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**路由列表**/
	public async httpColumn() {
		try {
			const list = await this.entity.routerModel.find({ where: { status: 1 } })
			return { list }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
