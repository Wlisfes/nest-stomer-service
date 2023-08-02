import { Controller, Post, Put, Get, Body, Request, Query, Headers } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { CoreService } from '@/core/core.service'
import { UserService } from './user.service'
import { ResultNotice } from '@/interface/common.interface'
import { SwaggerOption } from '@/config/swagger-config'
import * as http from '@/interface/user.interface'

@ApiTags('用户模块')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService, private readonly coreService: CoreService) {}

	@Post('/register')
	@ApiDecorator({
		operation: { summary: '注册用户' },
		response: { status: 200, description: 'OK', type: ResultNotice }
	})
	public async httpRegister(@Body() body: http.RequestRegister) {
		return await this.userService.httpRegister(body)
	}

	@Post('/authorize')
	@ApiDecorator({
		operation: { summary: '登录' },
		response: { status: 200, description: 'OK' }
	})
	public async httpAuthorize(@Headers() headers, @Body() body: http.RequestAuthorize) {
		return await this.userService.httpAuthorize(body, headers.origin)
	}

	@Get('/basic-authorize')
	@ApiDecorator({
		operation: { summary: '用户信息' },
		response: { status: 200, description: 'OK', type: http.RequestUser },
		authorize: { login: true, error: true }
	})
	public async httpBasicAuthorize(@Request() request: { user: http.RequestUser }) {
		return await this.userService.httpBasicAuthorize(request.user.uid)
	}

	@Post('/create')
	@ApiDecorator({
		operation: { summary: '创建用户' },
		response: { status: 200, description: 'OK' }
	})
	public async httpCreateUser(@Body() body: http.RequestCreateUser) {
		return await this.userService.httpCreateUser(body)
	}

	@Put('/update/authorize')
	@ApiDecorator({
		operation: { summary: '编辑用户权限' },
		response: { status: 200, description: 'OK', type: ResultNotice }
	})
	public async httpUpdateAuthorize(@Body() body: http.RequestUpdateAuthorize) {
		return await this.userService.httpUpdateAuthorize(body)
	}

	@Get('/column')
	@ApiDecorator({
		operation: { summary: '用户列表' },
		response: { status: 200, description: 'OK', type: http.RequestUser }
	})
	public async httpColumnUser(@Query() query: http.RequestColumnUser) {
		return await this.userService.httpColumnUser(query)
	}
}
