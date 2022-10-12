import { PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm'
import * as day from 'dayjs'

export class NEntity {
	@PrimaryGeneratedColumn({ comment: '自增长主键' })
	id: number

	@CreateDateColumn({
		comment: '创建时间',
		readonly: true,
		update: false,
		transformer: {
			from: value => day(value).format('YYYY-MM-DD HH:mm:ss'),
			to: value => new Date(value).getTime()
		}
	})
	createTime: number

	@UpdateDateColumn({
		comment: '修改时间',
		transformer: {
			from: value => day(value).format('YYYY-MM-DD HH:mm:ss'),
			to: value => new Date(value).getTime()
		}
	})
	updateTime: number
}
