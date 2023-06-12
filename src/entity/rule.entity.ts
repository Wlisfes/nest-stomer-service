import { Entity, Column, ManyToOne } from 'typeorm'
import { NEntity } from '@/entity/common.entity'
import { RouterEntity } from '@/entity/router.entity'

@Entity('tb-rule')
export class RuleEntity extends NEntity {
	@Column({ comment: '接口地址', nullable: false })
	path: string

	@Column({ comment: '接口名称', nullable: false })
	name: string

	@Column({ comment: '接口类型', nullable: false })
	method: string

	@Column({ comment: '状态: 禁用-disable、启用-enable、删除-delete', default: 'enable', nullable: false })
	status: string

	@ManyToOne(type => RouterEntity, router => router.rule)
	parent: RouterEntity
}
