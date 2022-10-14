import { Controller, Post, Put, Get, Body, Query, Response, Request } from '@nestjs/common'
import { ApiTags, PickType } from '@nestjs/swagger'
import { ApiCompute } from '@/decorator/compute.decorator'
import { UserService } from './user.service'
import * as User from './user.interface'

@ApiTags('用户模块')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/register')
	@ApiCompute({
		operation: { summary: '注册用户' },
		response: { status: 200, description: 'OK' }
	})
	public async httpRegister(@Body() body: User.IRegister) {
		return await this.userService.httpRegister(body)
	}

	@Post('/login')
	@ApiCompute({
		operation: { summary: '登录' },
		response: { status: 200, description: 'OK' }
	})
	public async httpLogin(@Body() body: User.ILogin, @Response() response, @Request() request) {
		const { session, seconds } = await this.userService.httpLogin(body, request.cookies.captcha)
		response.cookie('session', session, { maxAge: seconds, httpOnly: true })
		response.send({ session, seconds })
	}
}
