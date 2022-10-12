import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class ICommon {
	@ApiProperty({ description: 'ID', example: 1 })
	@IsNotEmpty({ message: 'ID 必填' })
	@IsNumber({}, { message: 'ID 必须是数字且不能小于1' })
	@Min(1, { message: 'ID 必须是数字且不能小于1' })
	@Type(type => Number)
	id: number

	@ApiProperty({ description: 'UID', example: '40b77bff-bd99-4f57-a8a3-71f0dc711c37' })
	@IsNotEmpty({ message: 'UID 必填' })
	@Type(type => String)
	uid: string

	@ApiProperty({ description: '创建时间', example: '2022-04-10 23:33:27' })
	@IsNotEmpty({ message: '创建时间 必填' })
	createTime: string

	@ApiProperty({ description: '修改时间', example: '2022-04-11 19:12:57' })
	@IsNotEmpty({ message: '修改时间 必填' })
	updateTime: string

	@ApiProperty({ description: '分页', example: 1 })
	@IsNotEmpty({ message: 'page 必填' })
	@IsNumber({}, { message: 'page必须是数字' })
	@Min(1, { message: 'page不能小于1' })
	@Type(type => Number)
	page: number

	@ApiProperty({ description: '分页数量', example: 10 })
	@IsNotEmpty({ message: 'size 必填' })
	@IsNumber({}, { message: 'size必须是数字' })
	@Min(1, { message: 'size不能小于1' })
	@Type(type => Number)
	size: number

	@ApiProperty({ description: '状态', example: 1 })
	@IsNotEmpty({ message: 'status 必填' })
	@IsNumber({}, { message: 'status 必须是数字' })
	@Type(type => Number)
	status: number
}

export class RCommon {
	@ApiProperty({ description: 'ID', example: 1 })
	id: number

	@ApiProperty({ description: 'UID', example: '40b77bff-bd99-4f57-a8a3-71f0dc711c37' })
	uid: string

	@ApiProperty({ description: '创建时间', example: '2022-04-10 23:33:27' })
	createTime: string

	@ApiProperty({ description: '修改时间', example: '2022-04-11 19:12:57' })
	updateTime: string

	@ApiProperty({ description: '分页', example: 1 })
	page: number

	@ApiProperty({ description: '分页数量', example: 10 })
	size: number

	@ApiProperty({ description: '状态', example: 1 })
	status: number

	@ApiProperty({ description: '总数', example: 0 })
	total: number

	@ApiProperty({ description: 'message', example: '接口提示' })
	message: string
}
