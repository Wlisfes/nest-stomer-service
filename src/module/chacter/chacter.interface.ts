import { ApiProperty, PickType, PartialType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'
import { at } from '@/i18n'
import { IsOptional } from '@/decorator/common.decorator'
import { ICommon, RCommon } from '@/interface/common.interface'

export class RequestChacter extends PickType(ICommon, ['id', 'status', 'createTime', 'updateTime']) {
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
export class RequestCreateChacter extends PickType(RequestChacter, ['command', 'cn', 'en', 'comment']) {}

/**编辑字典**/
export class RequestUpdateChacter extends PickType(RequestChacter, ['id', 'command', 'cn', 'en', 'comment']) {}

/**字典信息**/
export class RequestBasicChacter extends PickType(RequestChacter, ['id']) {}

/**字典列表**/
export class RequestColumnChacter extends IntersectionType(
	PickType(ICommon, ['page', 'size']),
	PartialType(PickType(RequestChacter, ['command']))
) {}
export class ResultColumnChacter extends PickType(RCommon, ['page', 'size', 'total']) {
	@ApiProperty({ description: '列表', type: [RequestChacter], example: [] })
	list: RequestChacter[]
}

/**字典状态**/
export class RequestTransferChacter extends PickType(RequestChacter, ['id', 'status']) {}
