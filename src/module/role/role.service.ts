import { Injectable } from '@nestjs/common'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { RedisService } from '@/core/redis.service'

@Injectable()
export class RoleService extends CoreService {
	constructor(private readonly entity: EntityService, private readonly redisService: RedisService) {
		super()
	}
}
