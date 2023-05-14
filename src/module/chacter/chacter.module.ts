import { Module } from '@nestjs/common'
import { ChacterController } from './chacter.controller'
import { ChacterService } from './chacter.service'

@Module({
	controllers: [ChacterController],
	providers: [ChacterService]
})
export class ChacterModule {}
