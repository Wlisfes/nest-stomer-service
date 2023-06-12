import { Module } from '@nestjs/common'
import { RouterController } from './router.controller'
import { RouterService } from './router.service'
import { RuleService } from './rule.service'

@Module({
	controllers: [RouterController],
	providers: [RouterService, RuleService]
})
export class RouterModule {}
