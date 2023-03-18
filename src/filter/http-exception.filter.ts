import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import * as day from 'dayjs'

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
	catch(exception: T, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse()
		const request = ctx.getRequest()

		const { error, message } = (exception => {
			let useError = (exception as any).response
			let message
			if (typeof useError === 'object') {
				message = Array.isArray(useError.message) ? useError.message[0] : useError.message
			} else {
				message = useError
			}
			return {
				error: useError,
				message
			}
		})(exception)

		Logger.error(
			'错误提示',
			JSON.stringify({
				referer: request.headers.referer,
				ip: request.ip,
				path: request.url,
				method: request.method,
				body: request.body,
				query: request.query,
				params: request.params,
				code: (exception as any).response.statusCode || (exception as any).status,
				message: message,
				error
			})
		)

		const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
		const errorResponse = {
			data: (exception as any)?.response ?? null,
			message,
			code: status,
			timestamp: day().format('YYYY-MM-DD HH:mm:ss'),
			url: request.url,
			method: request.method
		}

		// 设置返回的状态码、请求头、发送错误信息
		response.status(HttpStatus.OK)
		response.header('Content-Type', 'application/json; charset=utf-8')
		response.send(errorResponse)
	}
}
