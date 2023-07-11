import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'
import { IsOptional } from '@/decorator/common.decorator'
import { ICommon, RCommon } from '@/interface/common.interface'

export class RequestRoute extends PickType(ICommon, ['id', 'status', 'createTime', 'uid']) {
	@ApiProperty({
		description: '节点类型: 目录-directory、菜单-menu',
		enum: ['directory', 'menu'],
		example: 'directory'
	})
	@IsNotEmpty({ message: '节点类型 必填' })
	@Type(() => String)
	type: string

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
export class RequestCreateRoute extends PickType(RequestRoute, ['path', 'redirect', 'type', 'title', 'icon', 'parent', 'status', 'order']) {}

/**编辑路由**/ //prettier-ignore
export class RequestUpdateRoute extends PickType(RequestRoute, ['id', 'path', 'redirect', 'type', 'title', 'icon', 'parent', 'status', 'order']) {}

/**路由信息**/
export class RequestBasicRoute extends PickType(RequestRoute, ['id']) {}

/**路由状态**/
export class RequestTransferRoute extends PickType(RequestRoute, ['id', 'status']) {}

/**路由列表**/
export class ResultColumnRoute extends PickType(RCommon, ['page', 'size', 'total']) {
	@ApiProperty({ description: '列表', type: [RequestRoute], example: [] })
	list: RequestRoute[]
}

/**动态路由节点**/
export class ResultDynamicRoute extends ResultColumnRoute {}
