import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class CoreMiddleware implements NestMiddleware {
	getIp(request: Request | any) {
		let ip = request.headers['x-forwarded-for'] || request.headers['x-real-ip'] || request.headers['remoteaddress']
		// if (ip.split(',').length > 0) {
		// 	ip = ip.split(',')[0]
		// }
		// ip = ip.substr(ip.lastIndexOf(':') + 1, ip.length)
		return ip
	}

	use(request: Request, response: Response, next: NextFunction) {
		console.log('Request.....................................................')
		next()
	}
}
