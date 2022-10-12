import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BullModule } from '@nestjs/bull'
import { QueueService } from './queue.service'
import { CloudConsumer } from './queue.consumer'

@Module({
	imports: [
		BullModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				return {
					redis: {
						host: config.get('QUEUE_REDIS_HOST'),
						port: parseInt(config.get('QUEUE_REDIS_PORT')),
						password: config.get('QUEUE_REDIS_PASSWORD'),
						db: config.get('QUEUE_REDIS_DB'),
						keyPrefix: config.get('QUEUE_REDIS_KEYPREFIX')
					}
				}
			}
		}),
		BullModule.registerQueue({ name: 'cloud-queue' })
	],
	providers: [QueueService, CloudConsumer],
	exports: [QueueService]
})
export class QueueModule {}
