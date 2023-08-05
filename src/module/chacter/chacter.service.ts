import { Injectable } from '@nestjs/common'
import { Brackets, In } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import * as http from '@/interface/chacter.interface'

@Injectable()
export class ChacterService extends CoreService {
	constructor(private readonly entity: EntityService) {
		super()
	}

	/**新增字典**/
	public async httpCreateChacter(props: http.CreateChacter) {
		return await this.RunCatch(async i18n => {
			await this.haveCreate({
				model: this.entity.chacterModel,
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
				return { message: i18n.t('http.CREATE_SUCCESS') }
			})
		})
	}

	/**编辑字典**/
	public async httpUpdateChacter(props: http.UpdateChacter) {
		return await this.RunCatch(async i18n => {
			await this.validator({
				model: this.entity.chacterModel,
				name: i18n.t('chacter.name'),
				empty: { value: true },
				delete: { value: true },
				options: { where: { id: props.id } }
			})
			//prettier-ignore
			return await this.entity.chacterModel.update(
				{ id: props.id },
				{ comment: props.comment, status: props.status, cn: props.cn, en: props.en }
			).then(() => {
				return { message: i18n.t('http.UPDATE_SUCCESS') }
			})
		})
	}

	/**字典详情**/
	public async httpBasicChacter(props: http.BasicChacter) {
		return await this.RunCatch(async i18n => {
			return await this.validator({
				model: this.entity.chacterModel,
				name: i18n.t('chacter.name'),
				empty: { value: true },
				options: { where: { id: props.id } }
			})
		})
	}

	/**字典列表**/
	public async httpColumnChacter(props: http.ColumnChacter) {
		return await this.RunCatch(async i18n => {
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

	/**编辑字典状态**/
	public async httpTransferChacter(props: http.TransferChacter) {
		return await this.RunCatch(async i18n => {
			await this.validator({
				model: this.entity.chacterModel,
				name: i18n.t('rule.name'),
				empty: { value: true },
				options: { where: { id: props.id } }
			})
			return await this.entity.chacterModel.update({ id: props.id }, { status: props.status }).then(() => {
				return { message: i18n.t('http.UPDATE_SUCCESS') }
			})
		})
	}
}
