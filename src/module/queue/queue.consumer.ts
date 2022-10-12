import { Logger } from '@nestjs/common'
import { Processor, Process } from '@nestjs/bull'
import { Job } from 'bull'

@Processor({ name: 'cloud-queue' })
export class CloudConsumer {
	private readonly logger = new Logger(CloudConsumer.name)

	/**执行任务队列**/
	@Process()
	async transcode(job: Job<unknown>) {
		this.logger.log('任务开始', job.id, job.data)
		await new Promise(resolve => {
			setTimeout(() => {
				resolve('')
			}, 1000)
		})
		this.logger.log('任务结束', job.id, job.data)

		await job.remove()
	}
}
