import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { IsOptional, TransferNumber } from '@/decorator/common.decorator'
import { ICommon } from '@/interface/common.interface'
import { at } from '@/i18n'

export class IRole extends PickType(ICommon, ['id', 'status']) {
	@ApiProperty({ description: '角色主键', example: 'admin' })
	@IsNotEmpty({ message: at('user.nickname.required') })
	bucket: string

	@ApiProperty({ description: '角色名称', example: '超级管理员' })
	@IsNotEmpty({ message: at('user.nickname.required') })
	name: string

	@ApiProperty({ description: '角色备注', required: false, example: '超级管理员拥有所有权限' })
	comment: string

	@ApiProperty({ description: '规则ID', type: [Number], example: [] })
	@IsOptional({}, { string: true, number: true })
	@Transform(type => TransferNumber(type), { toClassOnly: true })
	@IsNumber({}, { each: true, message: '规则ID类型必须为Number数组' })
	rules: number[]
}

export class RequestCreateRole extends PickType(IRole, ['bucket', 'name', 'status', 'comment', 'rules']) {}
export class RequestUpdateRole extends PickType(IRole, ['id', 'name', 'status', 'comment', 'rules']) {}
export class RequestBasicRole extends PickType(IRole, ['id']) {}
export class RequestTransferRole extends PickType(IRole, ['id', 'status']) {}

export class ResultBasicRole extends IntersectionType(IRole, PickType(ICommon, ['createTime', 'updateTime'])) {}
