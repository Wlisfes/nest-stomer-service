import { Controller, Post, Put, Get, Body, Query } from '@nestjs/common'
import { ApiTags, PickType } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { WeChatService } from './we-chat.service'
import * as DTO from './we-chat.interface'

@ApiTags('微信模块')
@Controller('wx')
export class WeChatController {
	constructor(private readonly weChatService: WeChatService) {}

	@Get('/access-token')
	@ApiDecorator({
		operation: { summary: '获取小程序凭证' },
		response: { status: 200, description: 'OK', type: DTO.RToken }
	})
	public async httpAccessToken() {
		return await this.weChatService.httpAccessToken()
	}
}
