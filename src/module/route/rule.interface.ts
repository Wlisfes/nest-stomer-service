import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'
import { RequestCommon } from '@/interface/common.interface'

export class RequestRule extends PickType(RequestCommon, ['id', 'status', 'createTime', 'updateTime']) {
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
	route: number
}

/**创建规则**/
export class RequestCreateRule extends PickType(RequestRule, ['path', 'name', 'method', 'status', 'route']) {}

/**编辑规则**/
export class RequestUpdateRule extends PickType(RequestRule, ['id', 'path', 'name', 'method', 'status', 'route']) {}

/**编辑规则状态*/
export class RequestTransferRule extends PickType(RequestRule, ['id', 'status']) {}

/**规则信息*/
export class RequestBasicRule extends PickType(RequestRule, ['id']) {}
