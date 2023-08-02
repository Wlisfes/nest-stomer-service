import type { ApiOperationOptions, ApiResponseOptions } from '@nestjs/swagger'
import { ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { applyDecorators } from '@nestjs/common'
import { ApiBearer } from '@/guard/auth.guard'
import { SwaggerOption } from '@/config/swagger-config'

interface Option {
	operation: ApiOperationOptions
	response: ApiResponseOptions
	authorize?: { login: boolean; error: boolean }
}

/**
 *
 * @param option
 * @returns
 */
export function ApiDecorator(option: Option) {
	const decorator: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [
		ApiOperation(option.operation),
		ApiConsumes('application/x-www-form-urlencoded', 'application/json'),
		ApiProduces('application/json', 'application/xml'),
		ApiResponse(option.response)
	]

	if (option.authorize && option.authorize.login) {
		/**开启登录验证**/
		decorator.push(
			ApiBearerAuth(SwaggerOption.APP_AUTH_TOKEN),
			ApiBearer({
				authorize: option.authorize.login,
				error: option.authorize.error
			})
		)
	}

	return applyDecorators(...decorator)
}
