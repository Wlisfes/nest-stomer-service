import { Controller, Post, Get, Body, Query, Response } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { AlicloudService } from './alicloud.service'
import { RedisService } from './redis.service'
import { RNotice } from '@/interface/common.interface'
import * as ali from './alicloud.interface'

@ApiTags('基础模块')
@Controller('basic')
export class BasicController {
	constructor(private readonly aliCloud: AlicloudService, private readonly redisService: RedisService) {}

	@Get('/captcha')
	@ApiDecorator({
		operation: { summary: '图形验证码' },
		response: { status: 200, description: 'OK' }
	})
	public async httpCaptcha(@Response() response, @Query() query: ali.RequestCaptcha) {
		const session = await this.aliCloud.customSession()
		const { data, text } = await this.aliCloud.httpCaptcha(query)
		await this.redisService.setStore(session, text, 3 * 60)
		response.cookie('AUTN_CAPTCHA', session, { maxAge: 3 * 60 * 1000, httpOnly: true })
		response.type('svg')
		response.send(data)
	}

	@Post('/mobile-captcha')
	@ApiDecorator({
		operation: { summary: '发送手机验证码' },
		response: { status: 200, description: 'OK', type: RNotice }
	})
	public async httpMobileCaptcha(@Body() body: ali.RequestMobileCaptcha) {
		return await this.aliCloud.httpMobileCaptcha(body, 6)
	}
}
