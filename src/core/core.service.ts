import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { usuCurrent } from '@/i18n'
import { ICoreDator } from './core.interface'
import * as moment from 'dayjs'
import * as Nanoid from 'nanoid'

@Injectable()
export class CoreService {
	public createUIDNumber(size: number = 18) {
		return Nanoid.customAlphabet('1234567890')(size)
	}

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

	public async RunCatch<T extends Object>(callback: (i18n: ReturnType<typeof usuCurrent>) => Promise<T>) {
		const i18n = await this.usuCurrent()
		try {
			return await callback(i18n)
		} catch (e) {
			throw new HttpException(
				e.response || e.message || i18n.t('http.SERVICE_ERROR'),
				e.status || HttpStatus.BAD_REQUEST
			)
		}
	}

	/**数据验证处理**/
	public async nodeValidator<T>(
		option: { node: T; i18n: ReturnType<typeof usuCurrent> },
		props: Pick<ICoreDator<T>, 'name' | 'message' | 'empty' | 'close' | 'delete'>
	) {
		const { node, i18n } = option
		if (!props.empty?.value) {
			return node
		} else if (!node) {
			//不存在
			throw new HttpException(
				i18n.t('http.NOT_DONE', { args: { name: props.empty.message ?? props.name } }),
				HttpStatus.BAD_REQUEST
			)
		} else if (props.close && (node as any).status === 'disable') {
			//已禁用
			throw new HttpException(
				i18n.t('http.NOT_CLOSE', { args: { name: props.close.message ?? props.name } }),
				HttpStatus.BAD_REQUEST
			)
		} else if (props.delete && (node as any).status === 'delete') {
			//已删除
			throw new HttpException(
				i18n.t('http.NOT_DELETE', { args: { name: props.delete.message ?? props.name } }),
				HttpStatus.BAD_REQUEST
			)
		}
		return node
	}

	/**验证数据模型是否有效**/
	public async validator<T>(props: ICoreDator<T>): Promise<T> {
		return await this.RunCatch(async i18n => {
			const node = await props.model.findOne(props.options)
			return await this.nodeValidator({ node, i18n }, props)
		})
	}

	/**批量验证数据模型是否有效**/
	public async batchValidator<T>(props: ICoreDator<T>): Promise<{ list: Array<T>; total: number }> {
		return await this.RunCatch(async i18n => {
			const [list = [], total = 0] = await props.model.findAndCount(props.options)
			return { list, total }
		})
	}

	/**创建时、验证数据模型是否已经存在**/
	public async haveCreate<T>(props: ICoreDator<T>): Promise<T> {
		const i18n = await this.usuCurrent()
		try {
			const node = await props.model.findOne(props.options)
			if (node) {
				throw new HttpException(
					props.message ?? i18n.t('http.NOT_HAS', { args: { name: props.name } }),
					HttpStatus.BAD_REQUEST
				)
			}
			return node
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.SERVICE_ERROR'), HttpStatus.BAD_REQUEST)
		}
	}

	/**编辑时、验证数据模型是否已经存在**/
	public async haveUpdate<T>(props: ICoreDator<T>, handler: (e: T) => boolean): Promise<T> {
		const i18n = await this.usuCurrent()
		try {
			const node = await props.model.findOne(props.options)
			if (node && handler(node)) {
				throw new HttpException(i18n.t('http.NOT_HAS', { args: { name: props.name } }), HttpStatus.BAD_REQUEST)
			}
			return node
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.SERVICE_ERROR'), HttpStatus.BAD_REQUEST)
		}
	}
}
