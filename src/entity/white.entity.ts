import { Entity, Column } from 'typeorm'
import { NEntity } from '@/entity/common.entity'

@Entity('tb-white')
export class WhiteEntity extends NEntity {
	@Column({ comment: '白名单名称', nullable: false })
	name: string

	@Column({ comment: '白名单地址', nullable: false })
	path: string

	@Column({ comment: '状态: 0.禁用 1.启用 2.删除', default: 1, nullable: false })
	status: number
}
