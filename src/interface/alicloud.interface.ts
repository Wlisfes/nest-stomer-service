import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsEnum } from 'class-validator'
import { IsOptional, IsMobile } from '@/decorator/common.decorator'

export class RequestCaptcha {
	@ApiProperty({ description: '返回类型', enum: ['svg', 'json'], default: 'svg', required: false })
	@IsOptional({}, { filter: ['number', 'string'] })
	@IsEnum(['svg', 'json'], { message: 'type类型错误' })
	type: string

	@ApiProperty({ description: 'size', required: false })
	@IsOptional({}, { filter: ['number', 'string'] })
	size: number

	@ApiProperty({ description: 'fontSize', required: false })
	@IsOptional({}, { filter: ['number', 'string'] })
	fontSize?: number

	@ApiProperty({ description: 'width', required: false })
	@IsOptional({}, { filter: ['number', 'string'] })
	width?: number

	@ApiProperty({ description: 'height', required: false })
	@IsOptional({}, { filter: ['number', 'string'] })
	height?: number
}
export class RequestMobileCaptcha {
	@ApiProperty({ description: '手机号', example: 18888888888 })
	@IsNotEmpty({ message: '手机号 必填' })
	@IsMobile({ message: '手机号 错误' })
	mobile: string
}
