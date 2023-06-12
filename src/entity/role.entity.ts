import { Entity, Column } from 'typeorm'
import { NEntity } from '@/entity/common.entity'

@Entity('tb-role')
export class RoleEntity extends NEntity {}
