import { Module } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	imports: [JwtModule],
	controllers: [UserController],
	providers: [JwtService, UserService]
})
export class UserModule {}
