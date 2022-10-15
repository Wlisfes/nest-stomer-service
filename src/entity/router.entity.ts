import { Entity, Column, BeforeInsert } from 'typeorm'
import { NEntity } from '@/entity/common.entity'

@Entity('tb-router')
export class RouterEntity extends NEntity {
	@Column({ comment: '节点类型: 1.目录 2.菜单', default: 1, nullable: false })
	type: number

	@Column({ comment: '节点名称', nullable: false })
	name: string

	@Column({ comment: '状态: 0.禁用 1.启用 2.删除', default: 1, nullable: false })
	status: number

	@Column({ comment: '组件路径', nullable: true })
	component: string

	@Column({ comment: '节点图标', nullable: true })
	icon: string
}
