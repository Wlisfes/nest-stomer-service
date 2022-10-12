import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/entity/user.entity'

@Injectable()
export class EntityService {
	constructor(@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>) {}
}
