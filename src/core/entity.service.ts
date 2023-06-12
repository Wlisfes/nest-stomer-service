import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/entity/user.entity'
import { RouterEntity } from '@/entity/router.entity'
import { RuleEntity } from '@/entity/rule.entity'
import { RoleEntity } from '@/entity/role.entity'
import { ChacterEntity } from '@/entity/chacter.entity'

@Injectable()
export class EntityService {
	constructor(
		@InjectRepository(UserEntity) public readonly userModel: Repository<UserEntity>,
		@InjectRepository(RouterEntity) public readonly routerModel: Repository<RouterEntity>,
		@InjectRepository(ChacterEntity) public readonly chacterModel: Repository<ChacterEntity>,
		@InjectRepository(RuleEntity) public readonly ruleModel: Repository<RuleEntity>,
		@InjectRepository(RoleEntity) public readonly roleModel: Repository<RoleEntity>
	) {}
}
