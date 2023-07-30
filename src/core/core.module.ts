import { Module, Global } from '@nestjs/common'
import { CoreService } from './core.service'
//module
import { BasicModule } from '@/module/basic/basic.module'
import { DispatchModule } from '@/module/dispatch/dispatch.module'
import { WeChatModule } from '@/module/we-chat/we-chat.module'
import { UserModule } from '@/module/user/user.module'
import { RouteModule } from '@/module/route/route.module'
import { ChacterModule } from '@/module/chacter/chacter.module'

@Global()
@Module({
	imports: [BasicModule, DispatchModule, WeChatModule, UserModule, RouteModule, ChacterModule],
	providers: [CoreService],
	exports: [CoreService]
})
export class CoreModule {}
