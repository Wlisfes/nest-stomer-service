import { Module, Global } from '@nestjs/common'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { RedisService } from '@/core/redis.service'
import { BasicModule } from '@/module/basic/basic.module'
import { DispatchModule } from '@/module/dispatch/dispatch.module'
import { WeChatModule } from '@/module/we-chat/we-chat.module'
import { UserModule } from '@/module/user/user.module'
import { RouteModule } from '@/module/route/route.module'
import { ChacterModule } from '@/module/chacter/chacter.module'
//entity
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '@/entity/user.entity'
import { RouteEntity } from '@/entity/route.entity'
import { ChacterEntity } from '@/entity/chacter.entity'

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity, RouteEntity, ChacterEntity]),
		BasicModule,
		DispatchModule,
		WeChatModule,
		UserModule,
		RouteModule,
		ChacterModule
	],
	providers: [CoreService, EntityService, RedisService],
	exports: [CoreService, EntityService, RedisService]
})
export class CoreModule {}
