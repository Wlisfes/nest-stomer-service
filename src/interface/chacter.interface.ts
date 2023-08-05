import { ApiProperty, PickType, PartialType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'
import { at } from '@/i18n'
import { IsOptional } from '@/decorator/common.decorator'
import { Request } from '@/interface/common.interface'

export class Chacter extends PickType(Request, ['id', 'status', 'createTime', 'updateTime']) {
	@ApiProperty({ description: '字典标识', example: 'enable' })
	@IsNotEmpty({ message: at('chacter.command.required') })
	command: string

	@ApiProperty({ description: '备注', required: false, example: 'enable' })
	@IsOptional()
	comment: string

	@ApiProperty({ description: '字典中文', example: '启用' })
	@IsNotEmpty({ message: at('chacter.cn.required') })
	cn: string

	@ApiProperty({ description: '字典英文', example: 'Enable' })
	@IsNotEmpty({ message: at('chacter.en.required') })
	en: string
}

/**新增字典**/
export class CreateChacter extends PickType(Chacter, ['command', 'cn', 'en', 'comment', 'status']) {}

/**编辑字典**/
export class UpdateChacter extends PickType(Chacter, ['id', 'cn', 'en', 'comment', 'status']) {}

/**字典信息**/
export class BasicChacter extends PickType(Chacter, ['id']) {}

/**字典列表**/
export class ColumnChacter extends IntersectionType(
	PickType(Request, ['page', 'size']),
	PartialType(PickType(Chacter, ['command']))
) {}

/**字典状态**/
export class TransferChacter extends PickType(Chacter, ['id', 'status']) {}
