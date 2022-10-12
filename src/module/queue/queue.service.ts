import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'

@Injectable()
export class QueueService {
	constructor(@InjectQueue('cloud-queue') private readonly cloudQueue: Queue) {}

	/**写入任务队列**/
	public async httpCreate(index: number) {
		return await this.cloudQueue.add({
			index,
			time: Date.now()
		})
	}
}
