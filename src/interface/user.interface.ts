import { ApiProperty, PickType, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, Length, IsNumber } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { IsOptional, IsMobile } from '@/decorator/common.decorator'
import { Request } from '@/interface/common.interface'
import { at } from '@/i18n'

export class User extends PickType(Request, ['id', 'uid']) {
	@ApiProperty({ description: '昵称', example: '猪头' })
	@IsNotEmpty({ message: at('user.nickname.required') })
	nickname: string

	@ApiProperty({ description: '手机号' })
	@IsNotEmpty({ message: at('user.mobile.required') })
	@IsMobile({ message: at('user.mobile.format') })
	mobile: string

	@ApiProperty({ description: '密码' })
	@IsNotEmpty({ message: at('user.password.required') })
	@Length(6, 18, { message: at('user.password.format') })
	password: string

	@ApiProperty({ description: '头像', required: false })
	@IsOptional()
	avatar: string

	@ApiProperty({ description: 'OpenID' })
	@IsNotEmpty({ message: at('user.openid.required') })
	openid: string

	@ApiProperty({ description: '验证码' })
	@IsNotEmpty({ message: at('user.code.required') })
	@Length(4, 6, { message: at('user.code.error') })
	code: string

	@ApiProperty({ description: 'session记录' })
	@IsNotEmpty({ message: 'session记录 必填' })
	session: string

	@ApiProperty({ description: '校验凭证' })
	@IsNotEmpty({ message: '校验凭证 必填' })
	token: string
}

/**注册用户**/
export class Register extends PickType(User, ['nickname', 'password', 'mobile', 'code']) {}

/**登录**/
export class Authorize extends PickType(User, ['mobile', 'password', 'session', 'token']) {}

/**创建用户**/
export class CreateUser extends PickType(User, ['nickname', 'password', 'mobile']) {}

/**用户信息**/
export class BasicUser extends PickType(User, ['uid']) {}

/**编辑用户信息**/
export class UpdateUser extends PickType(User, ['uid']) {}

/**编辑用户权限**/
export class UpdateAuthorize extends PickType(User, ['uid']) {
	@ApiProperty({ description: '权限ID', type: [Number], example: [] })
	@IsNumber({}, { each: true, message: '权限ID 必须为Array<number>' })
	route: number[]
}

/**用户列表**/
export class ColumnUser extends IntersectionType(
	PickType(Request, ['page', 'size']),
	PartialType(PickType(User, []))
) {}
