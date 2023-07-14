import { Controller, Post, Get, Put, Body, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { ResultNotice } from '@/interface/common.interface'
import { ChacterService } from './chacter.service'
import * as http from './chacter.interface'

@ApiTags('字典模块')
@Controller('chacter')
export class ChacterController {
	constructor(private readonly chacterService: ChacterService) {}

	@Post('/create')
	@ApiDecorator({
		operation: { summary: '新增字典' },
		response: { status: 200, description: 'OK', type: ResultNotice }
	})
	public async httpCreateChacter(@Body() body: http.RequestCreateChacter) {
		return await this.chacterService.httpCreateChacter(body)
	}

	@Put('/update')
	@ApiDecorator({
		operation: { summary: '编辑字典' },
		response: { status: 200, description: 'OK', type: ResultNotice }
	})
	public async httpUpdateChacter(@Body() body: http.RequestUpdateChacter) {
		return await this.chacterService.httpUpdateChacter(body)
	}

	@Get('/basic')
	@ApiDecorator({
		operation: { summary: '字典信息' },
		response: { status: 200, description: 'OK', type: http.RequestChacter }
	})
	public async httpBasicChacter(@Query() query: http.RequestBasicChacter) {
		return await this.chacterService.httpBasicChacter(query)
	}

	@Get('/column')
	@ApiDecorator({
		operation: { summary: '字典列表' },
		response: { status: 200, description: 'OK', type: http.ResultColumnChacter }
	})
	public async httpColumnChacter(@Query() query: http.RequestColumnChacter) {
		return await this.chacterService.httpColumnChacter(query)
	}

	@Put('/transfer')
	@ApiDecorator({
		operation: { summary: '编辑字典状态' },
		response: { status: 200, description: 'OK', type: http.RequestChacter }
	})
	public async httpTransferChacter(@Body() body: http.RequestTransferChacter) {
		return await this.chacterService.httpTransferChacter(body)
	}
}
