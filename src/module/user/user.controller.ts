import { Controller, Post, Put, Get, Body, Patch, Request, Query, Headers } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { CoreService } from '@/core/core.service'
import { UserService } from './user.service'
import { Notice } from '@/interface/common.interface'
import { SwaggerOption } from '@/config/swagger-config'
import * as http from '@/interface/user.interface'

@ApiTags('用户模块')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService, private readonly coreService: CoreService) {}

	@Post('/register')
	@ApiDecorator({
		operation: { summary: '注册用户' },
		response: { status: 200, description: 'OK', type: Notice }
	})
	public async httpRegister(@Body() body: http.Register) {
		return await this.userService.httpRegister(body)
	}

	@Post('/authorize')
	@ApiDecorator({
		operation: { summary: '登录' },
		response: { status: 200, description: 'OK' }
	})
	public async httpAuthorize(@Headers() headers, @Body() body: http.Authorize) {
		return await this.userService.httpAuthorize(body, headers.origin)
	}

	@Get('/basic-authorize')
	@ApiDecorator({
		operation: { summary: '用户信息' },
		response: { status: 200, description: 'OK', type: http.User },
		authorize: { login: true, error: true }
	})
	public async httpBasicAuthorize(@Request() request: { user: http.BasicUser }) {
		return await this.userService.httpBasicAuthorize(request.user.uid)
	}

	@Post('/create')
	@ApiDecorator({
		operation: { summary: '创建用户' },
		response: { status: 200, description: 'OK' }
	})
	public async httpCreateUser(@Body() body: http.CreateUser) {
		return await this.userService.httpCreateUser(body)
	}

	@Put('/update')
	@ApiDecorator({
		operation: { summary: '编辑用户' },
		response: { status: 200, description: 'OK' }
	})
	public async httpUpdateUser(@Body() body: http.CreateUser) {
		return await this.userService.httpCreateUser(body)
	}

	@Put('/update/authorize')
	@ApiDecorator({
		operation: { summary: '编辑用户权限' },
		response: { status: 200, description: 'OK', type: Notice }
	})
	public async httpUpdateAuthorize(@Body() body: http.UpdateAuthorize) {
		return await this.userService.httpUpdateAuthorize(body)
	}

	@Get('/bearer-authorize')
	@ApiDecorator({
		operation: { summary: '用户权限信息' },
		response: { status: 200, description: 'OK', type: http.User },
		authorize: { login: true, error: true }
	})
	public async httpBearerAuthorize(@Request() request: { user: http.User }, @Query() query: http.BasicUser) {
		return await this.userService.httpBearerAuthorize(query.uid)
	}

	@Get('/column')
	@ApiDecorator({
		operation: { summary: '用户列表' },
		response: { status: 200, description: 'OK', type: http.User }
	})
	public async httpColumnUser(@Query() query: http.ColumnUser) {
		return await this.userService.httpColumnUser(query)
	}
}
