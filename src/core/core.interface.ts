import { ApiProperty, PickType, OmitType } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'
import { IsOptional, IsMobile } from '@/decorator/common.decorator'
import { ICommon, RCommon } from '@/interface/common.interface'
import { Repository, FindOneOptions } from 'typeorm'

export interface ICoreDator<T> {
	message: string //模型描述名称
	empty?: boolean //是否验证为空
	delete?: boolean //是否判断已删除
	close?: boolean //是否判断已关闭
	model: Repository<T>
	options?: FindOneOptions<T>
}

/********************************************************/
export class ICaptcha {
	@ApiProperty({ description: 'size', required: false })
	@IsOptional()
	size: number

	@ApiProperty({ description: 'fontSize', required: false })
	@IsOptional()
	fontSize?: number

	@ApiProperty({ description: 'width', required: false })
	@IsOptional()
	width?: number

	@ApiProperty({ description: 'height', required: false })
	@IsOptional()
	height?: number
}
export class AliCloud {
	@ApiProperty({ description: '手机号', example: 18888888888 })
	@IsNotEmpty({ message: '手机号 必填' })
	@IsMobile({ message: '手机号 错误' })
	mobile: string
}
export class IMobile extends PickType(AliCloud, ['mobile']) {}
