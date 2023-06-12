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
import { ChacterEntity } from '@/entity/chacter.entity'
import { RoleEntity } from '@/entity/role.entity'
import { RuleEntity } from '@/entity/rule.entity'
//module
import { QueueModule } from '@/module/queue/queue.module'
import { DispatchModule } from '@/module/dispatch/dispatch.module'
import { WeChatModule } from '@/module/we-chat/we-chat.module'
import { UserModule } from '@/module/user/user.module'
import { RouterModule } from '@/module/router/router.module'
import { ChacterModule } from '@/module/chacter/chacter.module'

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity, RouterEntity, ChacterEntity, RoleEntity, RuleEntity]),
		QueueModule,
		DispatchModule,
		WeChatModule,
		UserModule,
		RouterModule,
		ChacterModule
	],
	providers: [CoreService, EntityService, RedisService, AlicloudService],
	controllers: [CoreController],
	exports: [CoreService, EntityService, RedisService, AlicloudService]
})
export class CoreModule {}
