import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { In } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import * as http from './rule.interface'

@Injectable()
export class RuleService extends CoreService {
	constructor(private readonly entity: EntityService) {
		super()
	}

	/**新增接口规则**/
	public async httpRuleCreate(props: http.RequestCreateRule) {
		const i18n = await this.usuCurrent()
		try {
			await this.haveCreate({
				model: this.entity.ruleModel,
				name: i18n.t('rule.name'),
				options: { where: { path: props.path, status: In(['disable', 'enable']) } }
			})
			const parent = await this.validator({
				model: this.entity.routerModel,
				name: i18n.t('router.name'),
				empty: { value: true },
				close: { value: true },
				delete: { value: true },
				options: { where: { id: props.parent } }
			})
			const node = await this.entity.ruleModel.create({
				path: props.path,
				name: props.name,
				method: props.method,
				status: props.status,
				parent: parent
			})
			await this.entity.ruleModel.save(node)
			return { message: i18n.t('http.HTTP_CREATE_SUCCESS') }
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.HTTP_SERVICE_ERROR'), HttpStatus.BAD_REQUEST)
		}
	}

	/**编辑接口规则**/
	public async httpRuleUpdate(props: http.RequestUpdateRule) {
		const i18n = await this.usuCurrent()
		try {
			const node = await this.haveUpdate(
				{
					model: this.entity.ruleModel,
					name: i18n.t('rule.name'),
					options: { where: { path: props.path, status: In(['disable', 'enable']) } }
				},
				rule => rule.id !== props.id
			)
			const parent = await this.validator({
				model: this.entity.routerModel,
				name: i18n.t('router.name'),
				empty: { value: true },
				options: { where: { id: props.parent } }
			})
			await this.entity.ruleModel.update(
				{ id: props.id },
				{
					path: props.path ?? node.path,
					name: props.name ?? node.name,
					method: props.method ?? node.method,
					status: props.status ?? node.status,
					parent: parent
				}
			)
			return { message: i18n.t('http.HTTP_UPDATE_SUCCESS') }
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.HTTP_SERVICE_ERROR'), HttpStatus.BAD_REQUEST)
		}
	}

	/**编辑接口规则状态**/
	public async httpRuleTransfer(props: http.RequestTransferRule) {
		const i18n = await this.usuCurrent()
		try {
			await this.validator({
				model: this.entity.roleModel,
				name: i18n.t('rule.name'),
				empty: { value: true },
				options: { where: { id: props.id } }
			})
			await this.entity.ruleModel.update({ id: props.id }, { status: props.status })
			return { message: i18n.t('http.HTTP_UPDATE_SUCCESS') }
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.HTTP_SERVICE_ERROR'), HttpStatus.BAD_REQUEST)
		}
	}
}
