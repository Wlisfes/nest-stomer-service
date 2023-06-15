import { Module, Global } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'
import { CoreService } from './core.service'
//module
import { BasicModule } from '@/module/basic/basic.module'
import { QueueModule } from '@/module/queue/queue.module'
import { DispatchModule } from '@/module/dispatch/dispatch.module'
import { WeChatModule } from '@/module/we-chat/we-chat.module'
import { UserModule } from '@/module/user/user.module'
import { RouteModule } from '@/module/route/route.module'
import { RoleModule } from '@/module/role/role.module'
import { ChacterModule } from '@/module/chacter/chacter.module'
const modules = [
	BasicModule,
	QueueModule,
	DispatchModule,
	WeChatModule,
	UserModule,
	RouteModule,
	RoleModule,
	ChacterModule
]
const routes = modules.map(module => ({ path: 'api', module: module }))

@Global()
@Module({
	imports: [RouterModule.register(routes), ...modules],
	providers: [CoreService],
	exports: [CoreService]
})
export class CoreModule {}
