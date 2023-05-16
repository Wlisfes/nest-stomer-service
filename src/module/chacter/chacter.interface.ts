import { ApiProperty, PickType, OmitType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'
import { IsOptional } from '@/decorator/common.decorator'
import { ICommon, RCommon } from '@/interface/common.interface'

export class IChacter extends PickType(ICommon, ['id']) {
	@ApiProperty({ description: '字典标识', example: 'enable' })
	@IsNotEmpty({ message: '字典标识 必填' })
	command: string

	@ApiProperty({ description: '备注', required: false, example: 'enable' })
	@IsOptional()
	comment: string

	@ApiProperty({ description: '字典中文', example: '启用' })
	@IsNotEmpty({ message: '字典中文 必填' })
	cn: string

	@ApiProperty({ description: '字典英文', example: 'Enable' })
	@IsNotEmpty({ message: '字典英文 必填' })
	en: string
}

export class RChacter extends PickType(ICommon, ['id', 'createTime', 'updateTime']) {
	@ApiProperty({ description: '字典标识', example: 'enable' })
	command: string

	@ApiProperty({ description: '备注', example: 'enable' })
	comment: string

	@ApiProperty({ description: '字典中文', example: '启用' })
	cn: string

	@ApiProperty({ description: '字典英文', example: 'Enable' })
	en: string
}

export class ICreate extends PickType(IChacter, ['command', 'cn', 'en', 'comment']) {}
export class IUpdate extends PickType(IChacter, ['id', 'command', 'cn', 'en', 'comment']) {}
export class IOnter extends PickType(IChacter, ['id']) {}
export class IColumn extends PickType(ICommon, ['page', 'size']) {
	@ApiProperty({ description: '字典标识', required: false, example: 'enable' })
	command: string
}
export class RColumn extends PickType(RCommon, ['page', 'size', 'total']) {
	@ApiProperty({ description: '列表', type: [IChacter], example: [] })
	list: IChacter[]
}
