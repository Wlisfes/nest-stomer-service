import { Controller, Post, Body } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { RNotice } from '@/interface/common.interface'
import { RoleService } from './role.service'
import * as http from './role.interface'

@ApiTags('角色模块')
@Controller('role')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Post('/create')
	@ApiDecorator({
		operation: { summary: '新增角色' },
		response: { status: 200, description: 'OK', type: RNotice }
	})
	public async httpRoleCreate(@Body() body: http.RequestCreateRole) {
		return await this.roleService.httpRoleCreate(body)
	}
}
