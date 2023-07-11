import { ApiProperty, PickType, PartialType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'
import { Transform } from 'class-transformer'
import { IsOptional, TransferNumber } from '@/decorator/common.decorator'
import { ICommon, RCommon } from '@/interface/common.interface'
import { at } from '@/i18n'

export class RequestRole extends PickType(ICommon, ['id', 'status', 'createTime', 'updateTime']) {
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

/**新增角色**/
export class RequestCreateRole extends PickType(RequestRole, ['bucket', 'name', 'status', 'comment', 'rules']) {}

/**编辑角色**/
export class RequestUpdateRole extends PickType(RequestRole, ['id', 'name', 'status', 'comment', 'rules']) {}

/**角色信息**/
export class RequestBasicRole extends PickType(RequestRole, ['id']) {}

/**角色列表**/
export class RequestColumnRole extends IntersectionType(
	PickType(ICommon, ['page', 'size']),
	PartialType(PickType(RequestRole, ['name', 'status']))
) {}
export class ResultColumnRole extends PickType(RCommon, ['page', 'size', 'total']) {
	@ApiProperty({ description: '列表', type: [RequestRole], example: [] })
	list: RequestRole[]
}

/**编辑角色状态**/
export class RequestTransferRole extends PickType(RequestRole, ['id', 'status']) {}
