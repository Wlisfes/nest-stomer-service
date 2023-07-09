import { Injectable } from '@nestjs/common'
import { In } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/module/basic/entity.service'
import * as http from './rule.interface'

@Injectable()
export class RuleService extends CoreService {
	constructor(private readonly entity: EntityService) {
		super()
	}

	/**新增接口规则**/
	public async httpRuleCreate(props: http.RequestCreateRule) {
		return await this.RunCatch(async i18n => {
			await this.haveCreate({
				model: this.entity.ruleModel,
				name: i18n.t('rule.name'),
				options: { where: { path: props.path, status: In(['disable', 'enable']) } }
			})
			const parent = await this.validator({
				model: this.entity.routeModel,
				name: i18n.t('route.name'),
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
			return await this.entity.ruleModel.save(node).then(() => {
				return { message: i18n.t('http.CREATE_SUCCESS') }
			})
		})
	}

	/**编辑接口规则**/
	public async httpRuleUpdate(props: http.RequestUpdateRule) {
		return await this.RunCatch(async i18n => {
			const node = await this.haveUpdate(
				{
					model: this.entity.ruleModel,
					name: i18n.t('rule.name'),
					options: { where: { path: props.path, status: In(['disable', 'enable']) } }
				},
				rule => rule.id !== props.id
			)
			const parent = await this.validator({
				model: this.entity.routeModel,
				name: i18n.t('route.name'),
				empty: { value: true },
				options: { where: { id: props.parent } }
			})
			//prettier-ignore
			return await this.entity.ruleModel.update(
				{ id: props.id },
				{
					path: props.path ?? node.path,
					name: props.name ?? node.name,
					method: props.method ?? node.method,
					status: props.status ?? node.status,
					parent: parent
				}
			).then(() => {
				return { message: i18n.t('http.UPDATE_SUCCESS') }
			})
		})
	}

	/**接口规则信息**/
	public async httpBasicRule(props: http.RequestBasicRule) {
		return await this.RunCatch(async i18n => {
			return await this.validator({
				model: this.entity.ruleModel,
				name: i18n.t('rule.name'),
				empty: { value: true },
				delete: { value: true },
				options: {
					where: { id: props.id },
					relations: ['parent']
				}
			})
		})
	}

	/**编辑接口规则状态**/
	public async httpRuleTransfer(props: http.RequestTransferRule) {
		return await this.RunCatch(async i18n => {
			await this.validator({
				model: this.entity.ruleModel,
				name: i18n.t('rule.name'),
				empty: { value: true },
				options: { where: { id: props.id } }
			})
			return await this.entity.ruleModel.update({ id: props.id }, { status: props.status }).then(() => {
				return { message: i18n.t('http.UPDATE_SUCCESS') }
			})
		})
	}
}
