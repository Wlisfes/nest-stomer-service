import { Module, Global } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Global()
@Module({
	imports: [JwtModule],
	controllers: [UserController],
	providers: [JwtService, UserService],
	exports: [JwtService, UserService]
})
export class UserModule {}
