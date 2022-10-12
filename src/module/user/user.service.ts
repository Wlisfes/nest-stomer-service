import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { RedisService } from '@/core/redis.service'
import * as User from './user.interface'

@Injectable()
export class UserService extends CoreService {
	constructor(private readonly entityService: EntityService, private readonly redisService: RedisService) {
		super()
	}

	/**注册用户**/
	public async httpRegisterUser(props: User.IRegister) {
		try {
			const node = await this.entityService.userModel.create({ nickname: '猪头' })
			await this.entityService.userModel.save(node)
			return { message: '创建成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
