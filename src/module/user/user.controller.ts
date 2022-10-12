import { Controller, Post, Put, Get, Body, Query } from '@nestjs/common'
import { ApiTags, PickType } from '@nestjs/swagger'
import { ApiCompute } from '@/decorator/compute.decorator'
import { UserService } from './user.service'

@ApiTags('用户模块')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/create')
	@ApiCompute({
		operation: { summary: '创建用户' },
		response: { status: 200, description: 'OK' }
	})
	public async httpCreateUser(@Body() body) {
		return body
	}
}
