import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { QueueModule } from '@/module/queue/queue.module'
import { DispatchService } from './dispatch.service'

@Module({
	imports: [ScheduleModule.forRoot(), QueueModule],
	providers: [DispatchService]
})
export class DispatchModule {}
