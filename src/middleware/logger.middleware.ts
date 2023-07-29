import { Logger } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

/**函数式日志中间件**/
export function logger(request: Request, response: Response, next: NextFunction) {
	next()
	Logger.log({
		['Referer']: request.headers.referer,
		['Request URL']: request.originalUrl,
		['Method']: request.method,
		['IP']: request.ip,
		['Status code']: response.statusCode,
		['Parmas']: JSON.stringify(request.params),
		['Query']: JSON.stringify(request.query),
		['Body']: JSON.stringify(request.body)
	})
}
