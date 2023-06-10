import { Controller, Post, Get, Body, Query, Response } from '@nestjs/common'
import { ApiTags, PickType } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { AlicloudService } from './alicloud.service'
import { RedisService } from './redis.service'
import { RCommon } from '@/interface/common.interface'
import * as Core from './core.interface'

@ApiTags('基础模块')
@Controller('core')
export class CoreController {
	constructor(private readonly aliCloud: AlicloudService, private readonly redisService: RedisService) {}

	@Get('/fetch-captcha')
	@ApiDecorator({
		operation: { summary: '图形验证码' },
		response: { status: 200, description: 'OK' }
	})
	public async fetchCaptcha(@Response() response, @Query() query: Core.ICaptcha) {
		const session = await this.aliCloud.customSession()
		const { data, text } = await this.aliCloud.fetchCaptcha(query)
		await this.redisService.setStore(session, text, 3 * 60)
		response.cookie('AUTN_CAPTCHA', session, { maxAge: 3 * 60 * 1000, httpOnly: true })
		response.type('svg')
		response.send(data)
	}

	@Post('/fetch-mobile')
	@ApiDecorator({
		operation: { summary: '发送手机验证码' },
		response: { status: 200, description: 'OK', type: PickType(RCommon, ['message']) }
	})
	public async fetchMobile(@Body() body: Core.IMobile) {
		return await this.aliCloud.fetchMobile(body, 6)
	}
}
