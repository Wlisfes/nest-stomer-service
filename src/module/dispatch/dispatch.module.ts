import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { DispatchService } from './dispatch.service'

@Module({
	imports: [ScheduleModule.forRoot()],
	providers: [DispatchService]
})
export class DispatchModule {}
