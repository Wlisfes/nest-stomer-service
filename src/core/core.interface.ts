import { Repository, FindOneOptions } from 'typeorm'

export interface NValidator<Entity> {
	message: string //模型描述名称
	empty?: boolean //是否验证为空
	delete?: boolean //是否判断已删除
	close?: boolean //是否判断已关闭
	model: Repository<Entity>
	options?: FindOneOptions<Entity>
}
