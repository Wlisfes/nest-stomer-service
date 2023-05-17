import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Brackets } from 'typeorm'
import { isEmpty } from 'class-validator'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { usuCurrent } from '@/i18n'
import * as http from './chacter.interface'

@Injectable()
export class ChacterService extends CoreService {
	constructor(private readonly entity: EntityService) {
		super()
	}

	/**新增字典**/
	public async httpCreate(props: http.ICreate) {
		const i18n = usuCurrent()
		try {
			if (await this.entity.chacterModel.findOne({ where: { command: props.command } })) {
				throw new HttpException(
					i18n.t('common.HAS_EXITTED_MERGE', { args: { name: i18n.t('chacter.NAME') } }),
					HttpStatus.BAD_REQUEST
				)
			}
			const node = await this.entity.chacterModel.create({
				command: props.command,
				cn: props.cn,
				en: props.en,
				comment: props.comment
			})
			return await this.entity.chacterModel.save(node).then(() => {
				return { message: i18n.t('http.HTTP_CREATE_SUCCESS') }
			})
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.HTTP_SERVICE_FAIL'), HttpStatus.BAD_REQUEST)
		}
	}

	/**字典详情**/
	public async httpOnter(props: http.IOnter) {
		const i18n = usuCurrent()
		try {
			return await this.isOnter({
				model: this.entity.chacterModel,
				name: i18n.t('chacter.NAME'),
				empty: { value: true },
				options: { where: { id: props.id } }
			})
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.HTTP_SERVICE_FAIL'), HttpStatus.BAD_REQUEST)
		}
	}

	/**字典列表**/
	public async httpColumn(props: http.IColumn) {
		const i18n = usuCurrent()
		try {
			const [list = [], total = 0] = await this.entity.chacterModel
				.createQueryBuilder('t')
				.where(
					new Brackets(Q => {
						if (props.command) {
							Q.andWhere('t.command = :command', { command: props.command })
						}
					})
				)
				.orderBy({ 't.createTime': 'DESC' })
				.skip((props.page - 1) * props.size)
				.take(props.size)
				.getManyAndCount()
			return { size: props.size, page: props.page, total, list }
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.HTTP_SERVICE_FAIL'), HttpStatus.BAD_REQUEST)
		}
	}

	/**删除字典**/
	public async httpDelete(props: http.IOnter) {
		const i18n = usuCurrent()
		try {
			await this.isOnter({
				model: this.entity.chacterModel,
				name: i18n.t('chacter.NAME'),
				empty: { value: true },
				options: { where: { id: props.id } }
			})
			return await this.entity.chacterModel.delete(props.id).then(() => {
				return { message: i18n.t('http.HTTP_DELETE_SUCCESS') }
			})
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.HTTP_SERVICE_FAIL'), HttpStatus.BAD_REQUEST)
		}
	}
}
