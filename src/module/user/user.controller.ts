import { Controller, Post, Put, Get, Body, Query } from '@nestjs/common'
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
	public async httpRegisterUser(@Body() body: User.IRegister) {
		return await this.userService.httpRegisterUser(body)
	}
}
