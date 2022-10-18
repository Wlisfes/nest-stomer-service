import { Module, Global } from '@nestjs/common'
import { CoreController } from './core.controller'
//service
import { CoreService } from './core.service'
import { EntityService } from './entity.service'
import { RedisService } from './redis.service'
import { AlicloudService } from './alicloud.service'
//entity
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '@/entity/user.entity'
import { RouterEntity } from '@/entity/router.entity'
//module
import { QueueModule } from '@/module/queue/queue.module'
import { DispatchModule } from '@/module/dispatch/dispatch.module'
import { WeChatModule } from '@/module/we-chat/we-chat.module'
import { UserModule } from '@/module/user/user.module'
import { RouterModule } from '@/module/router/router.module'

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity, RouterEntity]),
		QueueModule,
		DispatchModule,
		WeChatModule,
		UserModule,
		RouterModule
	],
	providers: [CoreService, EntityService, RedisService, AlicloudService],
	controllers: [CoreController],
	exports: [CoreService, EntityService, RedisService, AlicloudService]
})
export class CoreModule {}
