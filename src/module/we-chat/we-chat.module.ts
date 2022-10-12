import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { WeChatService } from './we-chat.service'
import { WeChatController } from './we-chat.controller'

@Module({
	imports: [
		HttpModule.register({
			baseURL: 'https://api.weixin.qq.com',
			timeout: 60000
		})
	],
	providers: [WeChatService],
	controllers: [WeChatController]
})
export class WeChatModule {}
