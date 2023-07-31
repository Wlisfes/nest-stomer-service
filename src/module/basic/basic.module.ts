import { Module, Global } from '@nestjs/common'
import { BasicController } from './basic.controller'
import { AlicloudService } from './alicloud.service'

@Global()
@Module({
	imports: [],
	controllers: [BasicController],
	providers: [AlicloudService],
	exports: [AlicloudService]
})
export class BasicModule {}
