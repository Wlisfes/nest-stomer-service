import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common'
import * as day from 'dayjs'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse()
		const request = ctx.getRequest()
		const { statusCode, message, error } = exception.response

		Logger.error({
			referer: request.headers.referer,
			ip: request.ip,
			path: request.url,
			method: request.method,
			body: request.body,
			query: request.query,
			params: request.params,
			code: statusCode,
			message: message,
			error
		})

		const errorResponse = {
			data: exception.response ?? null,
			message: Array.isArray(message) ? message[0] : message,
			code: statusCode,
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
