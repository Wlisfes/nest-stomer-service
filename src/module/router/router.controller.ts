import { Controller, Post, Get, Put, Body, Query } from '@nestjs/common'
import { ApiTags, PickType } from '@nestjs/swagger'
import { ApiCompute } from '@/decorator/compute.decorator'
import { RCommon } from '@/interface/common.interface'
import { RouterService } from './router.service'
import * as Inter from './router.interface'

@ApiTags('路由模块')
@Controller('router')
export class RouterController {
	constructor(private readonly routerService: RouterService) {}

	@Post('/create')
	@ApiCompute({
		operation: { summary: '新增路由' },
		response: { status: 200, description: 'OK', type: [PickType(RCommon, ['message'])] }
	})
	public async httpCreate(@Body() body: Inter.ICreate) {
		return await this.routerService.httpCreate(body)
	}

	@Get('/column')
	@ApiCompute({
		operation: { summary: '路由列表' },
		response: { status: 200, description: 'OK', type: Inter.IColumn }
	})
	public async httpColumn() {
		return await this.routerService.httpColumn()
	}

	@Get('/dynamic')
	@ApiCompute({
		operation: { summary: '动态路由节点' },
		response: { status: 200, description: 'OK', type: Inter.IDynamic }
	})
	public async httpDynamic() {
		return await this.routerService.httpDynamic()
	}
}
