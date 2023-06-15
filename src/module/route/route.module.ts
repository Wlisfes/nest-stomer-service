import { Module } from '@nestjs/common'
import { RouteController } from './route.controller'
import { RouteService } from './route.service'
import { RuleService } from './rule.service'

@Module({
	controllers: [RouteController],
	providers: [RouteService, RuleService]
})
export class RouteModule {}
