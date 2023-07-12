import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/entity/user.entity'
import { RouteEntity } from '@/entity/route.entity'
import { RuleEntity } from '@/entity/rule.entity'
import { ChacterEntity } from '@/entity/chacter.entity'

@Injectable()
export class EntityService {
	constructor(
		@InjectRepository(UserEntity) public readonly userModel: Repository<UserEntity>,
		@InjectRepository(RouteEntity) public readonly routeModel: Repository<RouteEntity>,
		@InjectRepository(ChacterEntity) public readonly chacterModel: Repository<ChacterEntity>,
		@InjectRepository(RuleEntity) public readonly ruleModel: Repository<RuleEntity>
	) {}
}
