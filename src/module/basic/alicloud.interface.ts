import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { IsOptional, IsMobile } from '@/decorator/common.decorator'

export class RequestCaptcha {
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
export class RequestMobileCaptcha {
	@ApiProperty({ description: '手机号', example: 18888888888 })
	@IsNotEmpty({ message: '手机号 必填' })
	@IsMobile({ message: '手机号 错误' })
	mobile: string
}
