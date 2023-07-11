import { Controller, Post, Put, Get, Body, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { Notice } from '@/interface/common.interface'
import { RoleService } from './role.service'
import * as http from './role.interface'

@ApiTags('角色模块')
@Controller('role')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Post('/create')
	@ApiDecorator({
		operation: { summary: '新增角色' },
		response: { status: 200, description: 'OK', type: Notice }
	})
	public async httpCreateRole(@Body() body: http.RequestCreateRole) {
		return await this.roleService.httpCreateRole(body)
	}

	@Put('/update')
	@ApiDecorator({
		operation: { summary: '编辑角色' },
		response: { status: 200, description: 'OK', type: Notice }
	})
	public async httpUpdateRole(@Body() body: http.RequestUpdateRole) {
		return await this.roleService.httpUpdateRole(body)
	}

	@Get('/basic')
	@ApiDecorator({
		operation: { summary: '角色信息' },
		response: { status: 200, description: 'OK', type: http.RequestRole }
	})
	public async httpBasicRole(@Query() query: http.RequestBasicRole) {
		return await this.roleService.httpBasicRole(query)
	}

	@Get('/column')
	@ApiDecorator({
		operation: { summary: '角色列表' },
		response: { status: 200, description: 'OK', type: http.ResultColumnRole }
	})
	public async httpColumnRole(@Query() query: http.RequestColumnRole) {
		return await this.roleService.httpColumnRole(query)
	}

	@Put('/transfer')
	@ApiDecorator({
		operation: { summary: '编辑角色状态' },
		response: { status: 200, description: 'OK', type: Notice }
	})
	public async httpTransferRole(@Body() body: http.RequestTransferRole) {
		return await this.roleService.httpTransferRole(body)
	}
}
