import { Module, Global } from '@nestjs/common'
import { BasicController } from './basic.controller'
import { EntityService } from './entity.service'
import { RedisService } from './redis.service'
import { AlicloudService } from './alicloud.service'
//entity
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '@/entity/user.entity'
import { RouteEntity } from '@/entity/route.entity'
import { ChacterEntity } from '@/entity/chacter.entity'
import { RoleEntity } from '@/entity/role.entity'
import { RuleEntity } from '@/entity/rule.entity'

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, RouteEntity, ChacterEntity, RoleEntity, RuleEntity])],
	controllers: [BasicController],
	providers: [EntityService, RedisService, AlicloudService],
	exports: [EntityService, RedisService, AlicloudService]
})
export class BasicModule {}
