import { Injectable } from '@nestjs/common'
import { Brackets } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import * as http from './chacter.interface'

@Injectable()
export class ChacterService extends CoreService {
	constructor(private readonly entity: EntityService) {
		super()
	}

	/**新增字典**/
	public async httpCreate(props: http.ICreate) {
		return this.RunCatch(async i18n => {
			await this.haveCreate({
				model: this.entity.ruleModel,
				name: i18n.t('chacter.name'),
				options: { where: { command: props.command } }
			})
			const node = await this.entity.chacterModel.create({
				command: props.command,
				cn: props.cn,
				en: props.en,
				comment: props.comment
			})
			return await this.entity.chacterModel.save(node).then(() => {
				return { message: i18n.t('http.HTTP_CREATE_SUCCESS') }
			})
		})
	}

	/**字典详情**/
	public async httpOnter(props: http.IOnter) {
		return this.RunCatch(async i18n => {
			return await this.validator({
				model: this.entity.chacterModel,
				name: i18n.t('chacter.name'),
				empty: { value: true },
				options: { where: { id: props.id } }
			})
		})
	}

	/**字典列表**/
	public async httpColumn(props: http.IColumn) {
		return this.RunCatch(async i18n => {
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
		})
	}

	/**删除字典**/
	public async httpDelete(props: http.IOnter) {
		return this.RunCatch(async i18n => {
			await this.validator({
				model: this.entity.chacterModel,
				name: i18n.t('chacter.name'),
				empty: { value: true },
				options: { where: { id: props.id } }
			})
			return await this.entity.chacterModel.delete(props.id).then(() => {
				return { message: i18n.t('http.HTTP_DELETE_SUCCESS') }
			})
		})
	}
}
