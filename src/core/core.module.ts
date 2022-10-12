import { Module, Global } from '@nestjs/common'
//service
import { CoreService } from './core.service'
import { EntityService } from './entity.service'
import { RedisService } from './redis.service'
//entity

//module
import { QueueModule } from '@/module/queue/queue.module'
import { DispatchModule } from '@/module/dispatch/dispatch.module'
import { WeChatModule } from '@/module/we-chat/we-chat.module'

@Global()
@Module({
	imports: [QueueModule, DispatchModule, WeChatModule],
	providers: [CoreService, EntityService, RedisService],
	exports: [CoreService, EntityService, RedisService]
})
export class CoreModule {}
