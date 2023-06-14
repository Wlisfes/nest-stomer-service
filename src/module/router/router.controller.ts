import { Controller, Post, Get, Put, Body, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { RNotice } from '@/interface/common.interface'
import { RouterService } from './router.service'
import { RuleService } from './rule.service'
import * as http from './router.interface'
import * as http1 from './rule.interface'

@ApiTags('路由模块')
@Controller('router')
export class RouterController {
	constructor(private readonly routerService: RouterService, private readonly ruleService: RuleService) {}

	@Post('/create')
	@ApiDecorator({
		operation: { summary: '新增路由' },
		response: { status: 200, description: 'OK', type: RNotice }
	})
	public async httpRouterCreate(@Body() body: http.RequestCreateRouter) {
		return await this.routerService.httpRouterCreate(body)
	}

	@Put('/update')
	@ApiDecorator({
		operation: { summary: '编辑路由' },
		response: { status: 200, description: 'OK', type: RNotice }
	})
	public async httpRouterUpdate(@Body() body: http.RequestUpdateRouter) {
		return await this.routerService.httpRouterUpdate(body)
	}

	@Get('/basic')
	@ApiDecorator({
		operation: { summary: '路由信息' },
		response: { status: 200, description: 'OK', type: http.ResultRouter }
	})
	public async httpBasicRouter(@Query() query: http.RequestBasicRouter) {
		return await this.routerService.httpBasicRouter(query)
	}

	@Get('/column')
	@ApiDecorator({
		operation: { summary: '路由列表' },
		response: { status: 200, description: 'OK', type: http.ResultColumnRouter }
	})
	public async httpRouterColumn() {
		return await this.routerService.httpRouterColumn()
	}

	@Get('/dynamic')
	@ApiDecorator({
		operation: { summary: '动态路由节点' },
		response: { status: 200, description: 'OK', type: http.ResultDynamicRouter }
	})
	public async httpRouterDynamic() {
		return await this.routerService.httpRouterDynamic()
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
