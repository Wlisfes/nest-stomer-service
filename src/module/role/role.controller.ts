import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('角色模块')
@Controller('role')
export class RoleController {}
