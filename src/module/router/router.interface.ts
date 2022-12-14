import { ApiProperty, PickType, OmitType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'
import { IsOptional } from '@/decorator/common.decorator'
import { ICommon, RCommon } from '@/interface/common.interface'

export class IRouter extends PickType(ICommon, ['id', 'status']) {
	@ApiProperty({ description: '节点类型: 1.目录 2.菜单', enum: [1, 2], example: 1 })
	@IsNotEmpty({ message: '节点类型 必填' })
	@Type(() => Number)
	type: number

	@ApiProperty({ description: '节点title', example: '系统设置' })
	@IsNotEmpty({ message: '节点title 必填' })
	title: string

	@ApiProperty({ description: '节点name', example: 'System' })
	@IsNotEmpty({ message: '节点name 必填' })
	name: string

	@ApiProperty({ description: '页面路径', example: '/manager/system' })
	@IsNotEmpty({ message: '页面路径 必填' })
	path: string

	@ApiProperty({ description: '组件路径', example: 'Layout' })
	@IsNotEmpty({ message: '组件路径 必填' })
	component: string

	@ApiProperty({ description: '重定向地址', required: false, example: '/manager/system/user' })
	@IsOptional()
	redirect: string

	@ApiProperty({ description: '节点图标', required: false })
	@IsOptional()
	icon: string

	@ApiProperty({ description: '父级节点ID', required: false })
	@IsOptional()
	@Type(() => Number)
	parent: number
}
export class RRouter extends IntersectionType(IRouter, PickType(RCommon, ['createTime', 'updateTime'])) {
	@ApiProperty({ description: '基础路由菜单', enum: [0, 1], example: 0 })
	base: number
}

export class ICreate extends OmitType(IRouter, ['id']) {}
export class IUpdate extends OmitType(IRouter, []) {}
export class IColumn extends PickType(RCommon, ['page', 'size', 'total']) {
	@ApiProperty({ description: '列表', type: [RRouter], example: [] })
	list: RRouter[]
}
export class IDynamic extends IColumn {}
