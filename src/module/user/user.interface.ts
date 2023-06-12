import { ApiProperty, PickType, OmitType } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'
import { IsOptional, IsMobile } from '@/decorator/common.decorator'
import { ICommon, RCommon } from '@/interface/common.interface'

export class IUser extends PickType(ICommon, ['id', 'uid']) {
	@ApiProperty({ description: '昵称', example: '昵称' })
	@IsNotEmpty({ message: '昵称 必填' })
	nickname: string

	@ApiProperty({ description: '手机号' })
	@IsNotEmpty({ message: '手机号 必填' })
	@IsMobile({ message: '手机号 错误' })
	mobile: string

	@ApiProperty({ description: '密码' })
	@IsNotEmpty({ message: '密码 必填' })
	@Length(6, 18, { message: '密码 格式错误' })
	password: string

	@ApiProperty({ description: '头像', required: false })
	@IsOptional()
	avatar: string

	@ApiProperty({ description: 'OpenID' })
	@IsNotEmpty({ message: 'OpenID 必填' })
	openid: string

	@ApiProperty({ description: '验证码' })
	@IsNotEmpty({ message: '验证码 必填' })
	@Length(4, 6, { message: '验证码 错误' })
	code: string
}

export class RequestRegister extends PickType(IUser, ['nickname', 'password', 'mobile', 'code']) {}
export class RequestAuthorize extends PickType(IUser, ['mobile', 'password', 'code']) {}
