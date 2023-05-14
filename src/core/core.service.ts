import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { usuCurrent } from '@/i18n'
import { ICoreDator } from './core.interface'

@Injectable()
export class CoreService {
	/**验证数据模型是否有效**/
	public async validator<T>(props: ICoreDator<T>): Promise<T> {
		const i18n = usuCurrent()
		try {
			const node = await props.model.findOne(props.options)
			if (!props.empty?.value) {
				return node
			} else if (!node) {
				throw new HttpException(
					i18n.t('common.NOT_EXIST_MERGE', { args: { name: props.empty.message ?? props.name } }),
					HttpStatus.BAD_REQUEST
				)
			} else if (props.close && (node as any).status === 'disable') {
				throw new HttpException(
					i18n.t('common.NOT_CLOSE_MERGE', { args: { name: props.close.message ?? props.name } }),
					HttpStatus.BAD_REQUEST
				)
			} else if (props.delete && (node as any).status === 'delete') {
				throw new HttpException(
					i18n.t('common.NOT_DELETE_MERGE', { args: { name: props.delete.message ?? props.name } }),
					HttpStatus.BAD_REQUEST
				)
			}
			return node
		} catch (e) {
			throw new HttpException(e.message || i18n.t('common.100500'), HttpStatus.BAD_REQUEST)
		}
	}
}
