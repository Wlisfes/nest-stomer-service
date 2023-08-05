import { Controller, Post, Get, Put, Body, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { Notice } from '@/interface/common.interface'
import { ChacterService } from './chacter.service'
import * as http from '@/interface/chacter.interface'

@ApiTags('字典模块')
@Controller('chacter')
export class ChacterController {
	constructor(private readonly chacterService: ChacterService) {}

	@Post('/create')
	@ApiDecorator({
		operation: { summary: '新增字典' },
		response: { status: 200, description: 'OK', type: Notice }
	})
	public async httpCreateChacter(@Body() body: http.CreateChacter) {
		return await this.chacterService.httpCreateChacter(body)
	}

	@Put('/update')
	@ApiDecorator({
		operation: { summary: '编辑字典' },
		response: { status: 200, description: 'OK', type: Notice }
	})
	public async httpUpdateChacter(@Body() body: http.UpdateChacter) {
		return await this.chacterService.httpUpdateChacter(body)
	}

	@Get('/basic')
	@ApiDecorator({
		operation: { summary: '字典信息' },
		response: { status: 200, description: 'OK', type: http.Chacter }
	})
	public async httpBasicChacter(@Query() query: http.BasicChacter) {
		return await this.chacterService.httpBasicChacter(query)
	}

	@Get('/column')
	@ApiDecorator({
		operation: { summary: '字典列表' },
		response: { status: 200, description: 'OK', type: http.ColumnChacter }
	})
	public async httpColumnChacter(@Query() query: http.ColumnChacter) {
		return await this.chacterService.httpColumnChacter(query)
	}

	@Put('/transfer')
	@ApiDecorator({
		operation: { summary: '编辑字典状态' },
		response: { status: 200, description: 'OK', type: http.Chacter }
	})
	public async httpTransferChacter(@Body() body: http.TransferChacter) {
		return await this.chacterService.httpTransferChacter(body)
	}
}
