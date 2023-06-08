import { Controller, Post, Body, Request, Response } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
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
	public async httpLogin(@Body() body: User.ILogin, @Request() request, @Response() response) {
		return await this.userService.httpLogin(body, request.cookies.AUTN_CAPTCHA)
		// response.cookie('AUTH-SESSION', session, { maxAge: seconds, httpOnly: true, path: '/' })
		// response.send({
		// 	data: { session, seconds, message },
		// 	code: 200,
		// 	message: 'OK',
		// 	timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
		// })
	}
}
