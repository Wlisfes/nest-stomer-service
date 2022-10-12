import { Entity, Column, BeforeInsert } from 'typeorm'
import { NEntity } from '@/entity/common.entity'

@Entity('user')
export class UserEntity extends NEntity {
	@BeforeInsert()
	BeforeCreate() {
		this.uid = Date.now()
	}

	@Column({ type: 'integer', comment: 'uid', readonly: true })
	uid: number
}
