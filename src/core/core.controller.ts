import { Controller, Post, Body } from '@nestjs/common'
import { ApiTags, PickType } from '@nestjs/swagger'
import { ApiCompute } from '@/decorator/compute.decorator'
import { AlicloudService } from './alicloud.service'
import { RCommon } from '@/interface/common.interface'
import * as Core from './core.interface'

@ApiTags('基础模块')
@Controller('core')
export class CoreController {
	constructor(private readonly alicloudService: AlicloudService) {}

	@Post('/fetch-mobile')
	@ApiCompute({
		operation: { summary: '发送手机验证码' },
		response: { status: 200, description: 'OK', type: PickType(RCommon, ['message']) }
	})
	public async fetchMobile(@Body() body: Core.IMobile) {
		return await this.alicloudService.fetchMobile(body, 6)
	}
}
