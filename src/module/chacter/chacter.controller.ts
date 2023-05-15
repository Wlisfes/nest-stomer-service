import { Controller, Post, Get, Put, Body, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiCompute } from '@/decorator/compute.decorator'
import { RNotice } from '@/interface/common.interface'
import { ChacterService } from './chacter.service'
import * as Inter from './chacter.interface'

@ApiTags('字典模块')
@Controller('chacter')
export class ChacterController {
	constructor(private readonly chacterService: ChacterService) {}

	@Post('/create')
	@ApiCompute({
		operation: { summary: '新增字典' },
		response: { status: 200, description: 'OK', type: RNotice }
	})
	public async httpCreate(@Body() body: Inter.ICreate) {
		return await this.chacterService.httpCreate(body)
	}

	@Get('/column')
	@ApiCompute({
		operation: { summary: '字典列表' },
		response: { status: 200, description: 'OK', type: Inter.RColumn }
	})
	public async httpColumn(@Query() query: Inter.IColumn) {
		return await this.chacterService.httpColumn(query)
	}

	@Get('/one')
	@ApiCompute({
		operation: { summary: '字典详情' },
		response: { status: 200, description: 'OK', type: Inter.RColumn }
	})
	public async httpOne(@Query() query) {
		return await this.chacterService.httpColumn(query)
	}
}
