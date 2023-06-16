import { Controller, Post, Put, Get, Body, Request } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { ApiBearer } from '@/guard/auth.guard'
import { CoreService } from '@/core/core.service'
import { UserService } from './user.service'
import { RNotice } from '@/interface/common.interface'
import * as http from './user.interface'

@ApiTags('用户模块')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService, private readonly coreService: CoreService) {}

	@Post('/register')
	@ApiDecorator({
		operation: { summary: '注册用户' },
		response: { status: 200, description: 'OK', type: RNotice }
	})
	public async httpRegister(@Body() body: http.RequestRegister) {
		return await this.userService.httpRegister(body)
	}

	@Post('/login')
	@ApiDecorator({
		operation: { summary: '登录' },
		response: { status: 200, description: 'OK' }
	})
	public async httpAuthorize(@Body() body: http.RequestAuthorize, @Request() request) {
		return await this.userService.httpAuthorize(body, request.cookies.AUTN_CAPTCHA)
	}

	@Get('/basic')
	@ApiBearer({ decorator: true, error: true, baseURL: '/api/user/basic' })
	@ApiDecorator({
		operation: { summary: '用户信息' },
		response: { status: 200, description: 'OK', type: http.RequestUser }
	})
	public async httpBasicUser(@Request() request: { user: http.RequestUser }) {
		return request.user
	}

	@Put('/update/role')
	// @ApiBearer({ decorator: true, error: true, baseURL: '/api/user/update/role' })
	@ApiDecorator({
		operation: { summary: '修改用户角色' },
		response: { status: 200, description: 'OK', type: RNotice }
	})
	public async httpUserUpdateRole(@Body() body: http.RequestUserRole) {
		return await this.userService.httpUserUpdateRole(body)
	}
}
