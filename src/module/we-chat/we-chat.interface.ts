import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from '@/decorator/common.decorator'

export class RToken {
	@ApiProperty({ description: 'ACCESS_TOKEN', example: `1_TxN7Kh47x3EyRReoKJQydbfcS_Fmr......` })
	access_token: string

	@ApiProperty({ description: 'ACCESS_TOKEN 有效时间', example: 7200 })
	expires_in: number
}
