import { Entity, Column } from 'typeorm'
import { NEntity } from '@/entity/common.entity'

@Entity('tb-route')
export class RouteEntity extends NEntity {
	@Column({ comment: '节点类型: 目录-folder、菜单-menu、规则-rule', default: 'folder', nullable: false })
	source: string

	@Column({ comment: '节点title', nullable: false })
	title: string

	@Column({ comment: '状态: 禁用-disable、启用-enable、删除-delete', default: 'enable', nullable: false })
	status: string

	@Column({ comment: '排序', default: 1 })
	order: number

	@Column({ comment: '页面路径', nullable: false })
	path: string

	@Column({ comment: '重定向地址', nullable: true })
	redirect: string

	@Column({ comment: '节点图标', nullable: true, default: null })
	icon: string

	@Column({ comment: '父级节点ID', nullable: true, default: null })
	parent: number

	@Column({ comment: '规则类型: GET、POST、PUT、DELETE', nullable: true, default: null })
	method: string
}
