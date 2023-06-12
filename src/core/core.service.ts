import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { usuCurrent } from '@/i18n'
import { ICoreDator } from './core.interface'
import * as moment from 'dayjs'

@Injectable()
export class CoreService {
	/**创建国际化实例**/
	public async usuCurrent() {
		return usuCurrent()
	}

	/**结果集合**/
	public async createResult<T extends Record<string, unknown>>(props: T) {
		return Object.assign(props, {
			code: HttpStatus.OK,
			timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
		})
	}

	/**数组转树结构**/
	public listToTree<T extends Record<string, any>>(data: Array<T>) {
		const tree: Array<T> = []
		const map: Object = data.reduce((curr: Object, next: T & { children: Array<T>; id: number }) => {
			next.children = []
			curr[next.id] = next
			return curr
		}, Object.assign({}))
		data.forEach((node: T) => {
			if (node.parent) {
				map[node.parent].children.push(node)
			} else {
				tree.push(node)
			}
		})
		return tree
	}

	/**验证数据模型是否有效**/
	public async validator<T>(props: ICoreDator<T>): Promise<T> {
		const i18n = await this.usuCurrent()
		try {
			const node = await props.model.findOne(props.options)
			if (!props.empty?.value) {
				return node
			} else if (!node) {
				//不存在
				throw new HttpException(
					i18n.t('common.NOT_EXIST_MERGE', { args: { name: props.empty.message ?? props.name } }),
					HttpStatus.BAD_REQUEST
				)
			} else if (props.close && (node as any).status === 'disable') {
				//已禁用
				throw new HttpException(
					i18n.t('common.NOT_CLOSE_MERGE', { args: { name: props.close.message ?? props.name } }),
					HttpStatus.BAD_REQUEST
				)
			} else if (props.delete && (node as any).status === 'delete') {
				//已删除
				throw new HttpException(
					i18n.t('common.NOT_DELETE_MERGE', { args: { name: props.delete.message ?? props.name } }),
					HttpStatus.BAD_REQUEST
				)
			}
			return node
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.HTTP_SERVICE_ERROR'), HttpStatus.BAD_REQUEST)
		}
	}

	/**验证数据模型是否有效**/
	public async isOnter<T>(props: ICoreDator<T>): Promise<T> {
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
			}
			return node
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.HTTP_SERVICE_ERROR'), HttpStatus.BAD_REQUEST)
		}
	}

	/**创建时、验证数据模型是否已经存在**/
	public async haveCreate<T>(props: ICoreDator<T>): Promise<T> {
		const i18n = await this.usuCurrent()
		try {
			const node = await props.model.findOne(props.options)
			if (node) {
				throw new HttpException(
					i18n.t('common.HAS_EXITTED_MERGE', { args: { name: props.name } }),
					HttpStatus.BAD_REQUEST
				)
			}
			return node
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.HTTP_SERVICE_ERROR'), HttpStatus.BAD_REQUEST)
		}
	}

	/**编辑时、验证数据模型是否已经存在**/
	public async haveUpdate<T>(props: ICoreDator<T>, handler: (e: T) => boolean): Promise<T> {
		const i18n = await this.usuCurrent()
		try {
			const node = await props.model.findOne(props.options)
			if (node && handler(node)) {
				throw new HttpException(
					i18n.t('common.HAS_EXITTED_MERGE', { args: { name: props.name } }),
					HttpStatus.BAD_REQUEST
				)
			}
			return node
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.HTTP_SERVICE_ERROR'), HttpStatus.BAD_REQUEST)
		}
	}
}
