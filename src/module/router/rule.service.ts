import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import * as http from './rule.interface'

@Injectable()
export class RuleService extends CoreService {
	constructor(private readonly entity: EntityService) {
		super()
	}

	/**新增接口规则**/
	public async httpRuleCreate(props: http.RuleCreate) {
		const i18n = await this.usuCurrent()
		try {
			return props
		} catch (e) {
			throw new HttpException(e.message || i18n.t('http.HTTP_SERVICE_ERROR'), HttpStatus.BAD_REQUEST)
		}
	}
}
