import { Module, Global } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { HttpModule } from '@nestjs/axios'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Global()
@Module({
	imports: [HttpModule, JwtModule],
	controllers: [UserController],
	providers: [JwtService, UserService],
	exports: [JwtService, UserService]
})
export class UserModule {}
