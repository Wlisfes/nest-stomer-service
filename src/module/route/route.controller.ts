import { Controller, Post, Get, Put, Body, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { Notice } from '@/interface/common.interface'
import { RouteService } from './route.service'
import * as http from '@/interface/route.interface'

@ApiTags('路由模块')
@Controller('route')
export class RouteController {
	constructor(private readonly routeService: RouteService) {}

	@Post('/create')
	@ApiDecorator({
		operation: { summary: '新增路由' },
		response: { status: 200, description: 'OK', type: Notice }
	})
	public async httpCreateRoute(@Body() body: http.CreateRoute) {
		return await this.routeService.httpCreateRoute(body)
	}

	@Put('/update')
	@ApiDecorator({
		operation: { summary: '编辑路由' },
		response: { status: 200, description: 'OK', type: Notice }
	})
	public async httpUpdateRoute(@Body() body: http.UpdateRoute) {
		return await this.routeService.httpUpdateRoute(body)
	}

	@Get('/basic')
	@ApiDecorator({
		operation: { summary: '路由信息' },
		response: { status: 200, description: 'OK', type: http.Route }
	})
	public async httpBasicRoute(@Query() query: http.BasicRoute) {
		return await this.routeService.httpBasicRoute(query)
	}

	@Put('/transfer')
	@ApiDecorator({
		operation: { summary: '编辑路由状态' },
		response: { status: 200, description: 'OK', type: Notice }
	})
	public async httpTransferRoute(@Body() body: http.TransferRoute) {
		return await this.routeService.httpTransferRoute(body)
	}

	@Get('/column')
	@ApiDecorator({
		operation: { summary: '路由列表' },
		response: { status: 200, description: 'OK', type: http.ColumnRoute }
	})
	public async httpColumnRoute() {
		return await this.routeService.httpColumnRoute()
	}

	@Get('/options')
	@ApiDecorator({
		operation: { summary: '路由权限列表' },
		response: { status: 200, description: 'OK', type: http.ColumnRoute }
	})
	public async httpOptionsRoute() {
		return await this.routeService.httpOptionsRoute()
	}

	@Get('/dynamic')
	@ApiDecorator({
		operation: { summary: '动态路由节点' },
		response: { status: 200, description: 'OK', type: http.DynamicRoute }
	})
	public async httpDynamicRoute() {
		return await this.routeService.httpDynamicRoute()
	}

	@Post('/create/rule')
	@ApiDecorator({
		operation: { summary: '新增接口规则' },
		response: { status: 200, description: 'OK', type: Notice }
	})
	public async httpCreateRule(@Body() body: http.CreateRule) {
		return await this.routeService.httpCreateRule(body)
	}

	@Put('/update/rule')
	@ApiDecorator({
		operation: { summary: '编辑接口规则' },
		response: { status: 200, description: 'OK', type: Notice }
	})
	public async httpUpdateRule(@Body() body: http.UpdateRule) {
		return await this.routeService.httpUpdateRule(body)
	}

	@Get('/basic/rule')
	@ApiDecorator({
		operation: { summary: '接口规则信息' },
		response: { status: 200, description: 'OK', type: http.Route }
	})
	public async httpBasicRule(@Query() query: http.BasicRule) {
		return await this.routeService.httpBasicRule(query)
	}

	@Put('/transfer/rule')
	@ApiDecorator({
		operation: { summary: '编辑接口规则状态' },
		response: { status: 200, description: 'OK', type: Notice }
	})
	public async httpTransferRule(@Body() body: http.TransferRule) {
		return await this.routeService.httpTransferRule(body)
	}
}
