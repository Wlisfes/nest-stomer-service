import { Entity, Column } from 'typeorm'
import { NEntity } from '@/entity/common.entity'

@Entity('tb-chacter')
export class ChacterEntity extends NEntity {
	@Column({ comment: '字典标识', nullable: false })
	command: string

	@Column({ charset: 'utf8mb4', comment: '备注', nullable: true })
	comment: string | null

	@Column({ comment: '状态: 禁用-disable、启用-enable、删除-delete', default: 'enable', nullable: false })
	status: string

	@Column({ comment: '字典中文', nullable: false })
	cn: string

	@Column({ comment: '字典英文', nullable: false })
	en: string
}
