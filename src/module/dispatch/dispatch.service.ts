import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { QueueService } from '@/module/queue/queue.service'

@Injectable()
export class DispatchService {
	constructor(private readonly queueService: QueueService) {}

	@Cron('1 * * * * *')
	public async fetchCron() {
		// Array.from({ length: 10 }, (x, i) => i).forEach(index => {
		// 	this.queueService.httpCreate(index)
		// })
	}
}
