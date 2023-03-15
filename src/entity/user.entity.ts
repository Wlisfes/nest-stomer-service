import { Entity, Column, BeforeInsert } from 'typeorm'
import { NEntity } from '@/entity/common.entity'
import { hashSync } from 'bcryptjs'

@Entity('tb-user')
export class UserEntity extends NEntity {
	@Column({ type: 'uuid', comment: 'uid', readonly: true })
	uid: string

	@Column({ charset: 'utf8mb4', comment: '昵称', nullable: false })
	nickname: string

	@Column({ comment: '邮箱', nullable: true })
	email: string | null

	@Column({ comment: '头像', nullable: true, default: null })
	avatar: string

	@Column({ comment: 'OpenID', nullable: true, default: null })
	openid: string

	@Column({ charset: 'utf8mb4', comment: '备注', nullable: true })
	comment: string | null

	@Column({
		comment: '手机号',
		transformer: { from: value => Number(value), to: value => value }
	})
	mobile: string

	@Column({
		comment: '密码',
		select: false,
		nullable: true,
		transformer: { from: value => value, to: value => (value ? hashSync(value) : null) }
	})
	password: string
}
