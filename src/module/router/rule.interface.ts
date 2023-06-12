import { ApiProperty, PickType, OmitType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'
import { IsOptional } from '@/decorator/common.decorator'
import { ICommon, RCommon } from '@/interface/common.interface'

export class RequestRule extends PickType(ICommon, ['id', 'status']) {
	@ApiProperty({ description: '接口地址', example: '/api/xxx' })
	@IsNotEmpty({ message: '接口地址 必填' })
	path: string

	@ApiProperty({ description: '接口名称', example: '系统设置' })
	@IsNotEmpty({ message: '接口名称 必填' })
	name: string

	@ApiProperty({ description: '接口类型', example: 'POST' })
	@IsNotEmpty({ message: '接口类型 必填' })
	method: string

	@ApiProperty({ description: '接口归属节点', example: 1 })
	@IsNotEmpty({ message: '接口归属节点 必填' })
	@Type(() => Number)
	parent: number
}

export class RequestCreateRule extends PickType(RequestRule, ['path', 'name', 'method', 'status', 'parent']) {}
export class RequestUpdateRule extends PickType(RequestRule, ['id', 'path', 'name', 'method', 'status', 'parent']) {}
export class RequestTransferRule extends PickType(RequestRule, ['id', 'status']) {}
