import { Injectable } from '@nestjs/common'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { RedisService } from '@/core/redis.service'

@Injectable()
export class UserService extends CoreService {
	constructor(private readonly entityService: EntityService, private readonly redisService: RedisService) {
		super()
	}
}
