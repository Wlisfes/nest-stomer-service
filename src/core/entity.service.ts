import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/entity/user.entity'
import { RouterEntity } from '@/entity/router.entity'

@Injectable()
export class EntityService {
	constructor(
		@InjectRepository(UserEntity) public readonly userModel: Repository<UserEntity>,
		@InjectRepository(RouterEntity) public readonly routerModel: Repository<RouterEntity>
	) {}
}
