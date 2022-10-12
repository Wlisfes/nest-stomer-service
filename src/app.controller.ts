import { Controller, Get, Session } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(@Session() session): string {
		console.log(session.code)
		return this.appService.getHello()
	}
}
