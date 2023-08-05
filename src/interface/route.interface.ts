import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'
import { IsOptional } from '@/decorator/common.decorator'
import { Request } from '@/interface/common.interface'

export class Route extends PickType(Request, ['id', 'status', 'createTime', 'uid']) {
	@ApiProperty({
		description: '节点类型: 目录-folder、菜单-menu、规则-rule',
		enum: ['directory', 'menu'],
		example: 'directory'
	})
	@IsNotEmpty({ message: '节点类型 必填' })
	@Type(() => String)
	source: string

	@ApiProperty({ description: '接口类型：GET、POST、PUT、DELETE', example: 'POST' })
	@IsNotEmpty({ message: '接口类型 必填' })
	method: string

	@ApiProperty({ description: '节点title', example: '系统设置' })
	@IsNotEmpty({ message: '节点title 必填' })
	title: string

	@ApiProperty({ description: '节点排序', example: 0 })
	@IsNotEmpty({ message: '节点排序 必填' })
	order: number

	@ApiProperty({ description: '页面路径', example: '/manager/system' })
	@IsNotEmpty({ message: '页面路径 必填' })
	path: string

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

/**创建路由**/ //prettier-ignore
export class CreateRoute extends PickType(Route, ['path', 'redirect', 'source', 'title', 'icon', 'parent', 'status', 'order']) {}

/**编辑路由**/ //prettier-ignore
export class UpdateRoute extends PickType(Route, ['id', 'path', 'redirect', 'source', 'title', 'icon', 'parent', 'status', 'order']) {}

/**路由信息**/
export class BasicRoute extends PickType(Route, ['id']) {}

/**路由状态**/
export class TransferRoute extends PickType(Route, ['id', 'status']) {}

/**创建规则**/
export class CreateRule extends PickType(Route, ['path', 'title', 'method', 'status', 'parent']) {}

/**编辑规则**/
export class UpdateRule extends PickType(Route, ['id', 'path', 'title', 'method', 'status', 'parent']) {}

/**编辑规则状态*/
export class TransferRule extends PickType(Route, ['id', 'status']) {}

/**规则信息*/
export class BasicRule extends PickType(Route, ['id']) {}
