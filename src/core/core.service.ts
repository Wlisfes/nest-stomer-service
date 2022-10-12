import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import * as DTO from './core.interface'

@Injectable()
export class CoreService {
	/**验证数据模型是否有效**/
	public async validator<Entity>(props: DTO.NValidator<Entity>): Promise<Entity> {
		try {
			const node = await props.model.findOne(props.options)
			if (!props.empty) {
				return node
			} else if (!node) {
				throw new HttpException(`${props.message}不存在`, HttpStatus.BAD_REQUEST)
			} else if (props.close && (node as any).status === 0) {
				throw new HttpException(`${props.message}已关闭`, HttpStatus.BAD_REQUEST)
			} else if (props.delete && (node as any).status === 2) {
				throw new HttpException(`${props.message}已删除`, HttpStatus.BAD_REQUEST)
			}
			return node
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
