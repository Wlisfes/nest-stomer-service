import { Injectable } from '@nestjs/common'
import { Brackets, In } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/module/basic/entity.service'
import { RedisService } from '@/module/basic/redis.service'
import * as http from './role.interface'

@Injectable()
export class RoleService extends CoreService {
	constructor(private readonly entity: EntityService, private readonly redisService: RedisService) {
		super()
	}

	/**新增角色**/
	public async httpCreateRole(props: http.RequestCreateRole) {
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
				options: { where: { id: In(props.rules), status: In(['disable', 'enable']) } }
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

	/**编辑角色**/
	public async httpUpdateRole(props: http.RequestUpdateRole) {
		return await this.RunCatch(async i18n => {
			const node = await this.validator({
				model: this.entity.roleModel,
				name: i18n.t('role.name'),
				empty: { value: true },
				options: { where: { id: props.id }, relations: ['rules'] }
			})
			const batch = await this.batchValidator({
				model: this.entity.ruleModel,
				name: i18n.t('rule.name'),
				ids: props.rules,
				options: { where: { id: In(props.rules), status: In(['disable', 'enable', 'delete']) } }
			})
			await this.entity.roleModel
				.createQueryBuilder()
				.relation('rules')
				.of(node)
				.addAndRemove(
					batch.list,
					node.rules.map(x => x.id)
				)

			//prettier-ignore
			return await this.entity.roleModel.update(
				{ id: props.id },
				{
					name: props.name,
					status: props.status,
					comment: props.comment
				}
			).then(() => {
				return { message: i18n.t('http.UPDATE_SUCCESS') }
			})
		})
	}

	/**角色信息**/
	public async httpBasicRole(props: http.RequestBasicRole) {
		return await this.RunCatch(async i18n => {
			const node = await this.entity.roleModel
				.createQueryBuilder('t')
				.leftJoinAndSelect('t.rules', 'rules', 'rules.status IN(:...status)', { status: ['enable', 'disable'] })
				.where(
					new Brackets(Q => {
						Q.where('t.id = :id', { id: props.id })
						Q.andWhere('t.status IN(:...status)', { status: ['enable', 'disable'] })
					})
				)
				.getOne()
			return await this.nodeValidator(
				{ node, i18n },
				{
					name: i18n.t('role.name'),
					empty: { value: true },
					delete: { value: true }
				}
			)
		})
	}

	/**角色列表**/
	public async httpColumnRole(props: http.RequestColumnRole) {
		return await this.RunCatch(async i18n => {
			const [list = [], total = 0] = await this.entity.roleModel
				.createQueryBuilder('t')
				.leftJoinAndSelect('t.rules', 'r', [`r.status = 'enable'`, `r.status = 'disable'`].join(' or '))
				.where(
					new Brackets(Q => {
						if (props.status) {
							Q.where('t.status = :status', { status: props.status })
						} else {
							Q.where('t.status IN(:...status)', { status: ['enable', 'disable'] })
						}
						if (props.name) {
							Q.andWhere('t.name LIKE :name', { name: `%${props.name}%` })
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

	/**编辑角色状态**/
	public async httpTransferRole(props: http.RequestTransferRole) {
		return await this.RunCatch(async i18n => {
			await this.validator({
				model: this.entity.roleModel,
				name: i18n.t('rule.name'),
				empty: { value: true },
				options: { where: { id: props.id } }
			})
			return await this.entity.roleModel.update({ id: props.id }, { status: props.status }).then(() => {
				return { message: i18n.t('http.UPDATE_SUCCESS') }
			})
		})
	}
}
