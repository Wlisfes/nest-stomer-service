import { Injectable } from '@nestjs/common'
import { In } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { RedisService } from '@/core/redis.service'
import * as http from './role.interface'

@Injectable()
export class RoleService extends CoreService {
	constructor(private readonly entity: EntityService, private readonly redisService: RedisService) {
		super()
	}

	/**新增角色**/
	public async httpRoleCreate(props: http.RequestCreateRole) {
		return await this.RunCatch(async i18n => {
			await this.haveCreate({
				model: this.entity.roleModel,
				name: i18n.t('role.name'),
				options: { where: { bucket: props.bucket, status: In(['disable', 'enable']) } }
			})
			const batch = await this.batchValidator({
				model: this.entity.ruleModel,
				name: i18n.t('rule.name'),
				ids: props.rules,
				options: { where: { id: In(props.rules) } }
			})
			const node = await this.entity.roleModel.create({
				bucket: props.bucket,
				name: props.name,
				status: props.status,
				comment: props.comment,
				rules: batch.list
			})
			return await this.entity.roleModel.save(node).then(() => {
				return { message: i18n.t('http.CREATE_SUCCESS') }
			})
		})
	}
}
