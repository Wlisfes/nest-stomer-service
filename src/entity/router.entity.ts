import { Entity, Column } from 'typeorm'
import { NEntity } from '@/entity/common.entity'

@Entity('tb-router')
export class RouterEntity extends NEntity {
	@Column({ comment: '基础路由菜单', default: 0, nullable: false })
	base: number

	@Column({ comment: '节点类型: 1.目录 2.菜单', default: 1, nullable: false })
	type: number

	@Column({ comment: '节点title', nullable: false })
	title: string

	@Column({ comment: '节点name', nullable: false })
	name: string

	@Column({ comment: '状态: 0.禁用 1.启用 2.删除', default: 1, nullable: false })
	status: number

	@Column({ comment: '页面路径', nullable: false })
	path: string

	@Column({ comment: '组件路径', nullable: false })
	component: string

	@Column({ comment: '重定向地址', nullable: true })
	redirect: string

	@Column({ comment: '节点图标', nullable: true, default: null })
	icon: string

	@Column({ comment: '父级节点ID', nullable: true, default: null })
	parent: number
}
