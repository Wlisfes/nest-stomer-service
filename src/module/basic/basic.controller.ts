import { Controller, Post, Get, Body, Query, Response } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { AlicloudService } from './alicloud.service'
import { RNotice } from '@/interface/common.interface'
import * as ali from './alicloud.interface'

@ApiTags('基础模块')
@Controller('basic')
export class BasicController {
	constructor(private readonly alicloudService: AlicloudService) {}

	@Get('/captcha')
	@ApiDecorator({
		operation: { summary: '图形验证码' },
		response: { status: 200, description: 'OK' }
	})
	public async httpCaptcha(@Response() response, @Query() query: ali.RequestCaptcha) {
		const { data, session } = await this.alicloudService.httpCaptcha(query)
		response.cookie('AUTN_CAPTCHA', session, { maxAge: 5 * 60 * 1000, httpOnly: true })
		if ((query.type ?? 'svg') === 'svg') {
			response.type('svg')
			response.send(data)
		} else {
			response.type('json')
			response.send({ fileSVG: data.toString() })
		}
	}

	@Post('/mobile-captcha')
	@ApiDecorator({
		operation: { summary: '发送手机验证码' },
		response: { status: 200, description: 'OK', type: RNotice }
	})
	public async httpMobileCaptcha(@Body() body: ali.RequestMobileCaptcha) {
		return await this.alicloudService.httpMobileCaptcha(body, 6)
	}
}
