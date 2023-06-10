import { Controller, Post, Get, Body, Request } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { ApiBearer } from '@/guard/auth.guard'
import { CoreService } from '@/core/core.service'
import { UserService } from './user.service'
import * as User from './user.interface'

@ApiTags('用户模块')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService, private readonly coreService: CoreService) {}

	@Post('/register')
	@ApiDecorator({
		operation: { summary: '注册用户' },
		response: { status: 200, description: 'OK' }
	})
	public async httpRegister(@Body() body: User.IRegister) {
		return await this.userService.httpRegister(body)
	}

	@Post('/login')
	@ApiDecorator({
		operation: { summary: '登录' },
		response: { status: 200, description: 'OK' }
	})
	public async httpLogin(@Body() body: User.ILogin, @Request() request) {
		return await this.userService.httpLogin(body, request.cookies.AUTN_CAPTCHA)
	}

	@Get('/base')
	@ApiBearer({ decorator: true })
	@ApiDecorator({
		operation: { summary: '用户信息' },
		response: { status: 200, description: 'OK' }
	})
	public async httpBaseUser(@Request() request: { user: User.IUser }) {
		return await this.userService.httpBaseUser(request.user.uid)
	}
}
