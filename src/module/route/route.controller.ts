import { Controller, Post, Get, Put, Body, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { RNotice } from '@/interface/common.interface'
import { RouteService } from './route.service'
import { RuleService } from './rule.service'
import * as http from './route.interface'
import * as http1 from './rule.interface'

@ApiTags('路由模块')
@Controller('route')
export class RouteController {
	constructor(private readonly routeService: RouteService, private readonly ruleService: RuleService) {}

	@Post('/create')
	@ApiDecorator({
		operation: { summary: '新增路由' },
		response: { status: 200, description: 'OK', type: RNotice }
	})
	public async httpRouteCreate(@Body() body: http.RequestCreateRoute) {
		return await this.routeService.httpRouteCreate(body)
	}

	@Put('/update')
	@ApiDecorator({
		operation: { summary: '编辑路由' },
		response: { status: 200, description: 'OK', type: RNotice }
	})
	public async httpRouteUpdate(@Body() body: http.RequestUpdateRoute) {
		return await this.routeService.httpRouteUpdate(body)
	}

	@Get('/basic')
	@ApiDecorator({
		operation: { summary: '路由信息' },
		response: { status: 200, description: 'OK', type: http.ResultRoute }
	})
	public async httpBasicRoute(@Query() query: http.RequestBasicRoute) {
		return await this.routeService.httpBasicRoute(query)
	}

	@Get('/column')
	@ApiDecorator({
		operation: { summary: '路由列表' },
		response: { status: 200, description: 'OK', type: http.ResultColumnRoute }
	})
	public async httpRouteColumn() {
		return await this.routeService.httpRouteColumn()
	}

	@Get('/dynamic')
	@ApiDecorator({
		operation: { summary: '动态路由节点' },
		response: { status: 200, description: 'OK', type: http.ResultDynamicRoute }
	})
	public async httpRouteDynamic() {
		return await this.routeService.httpRouteDynamic()
	}

	@Post('/create/rule')
	@ApiDecorator({
		operation: { summary: '新增接口规则' },
		response: { status: 200, description: 'OK', type: RNotice }
	})
	public async httpRuleCreate(@Body() body: http1.RequestCreateRule) {
		return await this.ruleService.httpRuleCreate(body)
	}

	@Put('/update/rule')
	@ApiDecorator({
		operation: { summary: '编辑接口规则' },
		response: { status: 200, description: 'OK', type: RNotice }
	})
	public async httpRuleUpdate(@Body() body: http1.RequestUpdateRule) {
		return await this.ruleService.httpRuleUpdate(body)
	}

	@Put('/transfer/rule')
	@ApiDecorator({
		operation: { summary: '编辑接口规则状态' },
		response: { status: 200, description: 'OK', type: RNotice }
	})
	public async httpRuleTransfer(@Body() body: http1.RequestTransferRule) {
		return await this.ruleService.httpRuleTransfer(body)
	}
}
