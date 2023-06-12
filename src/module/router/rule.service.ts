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
}
