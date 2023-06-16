import { Entity, Column, ManyToMany, JoinTable } from 'typeorm'
import { NEntity } from '@/entity/common.entity'
import { UserEntity } from '@/entity/user.entity'
import { RuleEntity } from '@/entity/rule.entity'

@Entity('tb-role')
export class RoleEntity extends NEntity {
	@Column({ comment: '角色主键', nullable: false })
	bucket: string

	@Column({ comment: '角色名称', nullable: false })
	name: string

	@Column({ charset: 'utf8mb4', comment: '角色备注', nullable: true })
	comment: string

	@Column({ comment: '状态: 禁用-disable、启用-enable、删除-delete', default: 'enable', nullable: false })
	status: string

	@ManyToMany(type => UserEntity, user => user.roles)
	users: UserEntity[]

	@ManyToMany(type => RuleEntity, { cascade: true })
	@JoinTable({ name: 'tb-role_rules' })
	rules: RuleEntity[]
}
