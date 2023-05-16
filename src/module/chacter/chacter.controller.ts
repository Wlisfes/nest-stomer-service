import { Controller, Post, Get, Put, Delete, Body, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiCompute } from '@/decorator/compute.decorator'
import { RNotice } from '@/interface/common.interface'
import { ChacterService } from './chacter.service'
import * as http from './chacter.interface'

@ApiTags('字典模块')
@Controller('chacter')
export class ChacterController {
	constructor(private readonly chacterService: ChacterService) {}

	@Get()
	@ApiCompute({
		operation: { summary: '字典详情' },
		response: { status: 200, description: 'OK', type: http.RChacter }
	})
	public async httpOnter(@Query() query: http.IOnter) {
		return await this.chacterService.httpOnter(query)
	}

	@Post('/create')
	@ApiCompute({
		operation: { summary: '新增字典' },
		response: { status: 200, description: 'OK', type: RNotice }
	})
	public async httpCreate(@Body() body: http.ICreate) {
		return await this.chacterService.httpCreate(body)
	}

	@Get('/column')
	@ApiCompute({
		operation: { summary: '字典列表' },
		response: { status: 200, description: 'OK', type: http.RColumn }
	})
	public async httpColumn(@Query() query: http.IColumn) {
		return await this.chacterService.httpColumn(query)
	}

	@Delete('/delete')
	@ApiCompute({
		operation: { summary: '删除字典' },
		response: { status: 200, description: 'OK', type: RNotice }
	})
	public async httpDelete(@Query() query: http.IOnter) {
		return await this.chacterService.httpDelete(query)
	}
}
