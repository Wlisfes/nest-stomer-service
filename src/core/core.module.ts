import { Module, Global } from '@nestjs/common'
//service
import { CoreService } from './core.service'
import { EntityService } from './entity.service'
import { RedisService } from './redis.service'
//entity
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '@/entity/user.entity'

//module
import { QueueModule } from '@/module/queue/queue.module'
import { DispatchModule } from '@/module/dispatch/dispatch.module'
import { WeChatModule } from '@/module/we-chat/we-chat.module'
import { UserModule } from '@/module/user/user.module'

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([UserEntity]), QueueModule, DispatchModule, WeChatModule, UserModule],
	providers: [CoreService, EntityService, RedisService],
	exports: [CoreService, EntityService, RedisService]
})
export class CoreModule {}