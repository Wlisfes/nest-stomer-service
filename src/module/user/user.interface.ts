import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'
import { IsOptional, IsMobile } from '@/decorator/common.decorator'
import { ICommon } from '@/interface/common.interface'
import { at } from '@/i18n'

export class IUser extends PickType(ICommon, ['id', 'uid']) {
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
}

export class RequestRegister extends PickType(IUser, ['nickname', 'password', 'mobile', 'code']) {}
export class RequestAuthorize extends PickType(IUser, ['mobile', 'password', 'code']) {}
