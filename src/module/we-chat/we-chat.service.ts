import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { CoreService } from '@/core/core.service'
import { firstValueFrom, map } from 'rxjs'
import * as DTO from './we-chat.interface'

@Injectable()
export class WeChatService extends CoreService {
	constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {
		super()
	}

	/**获取小程序凭证**/
	public async httpAccessToken() {
		try {
			// const token = await this.redis.getStore<any>('access-token')
			// if (!token) {
			// 	//prettier-ignore
			// 	const data = await firstValueFrom(
			// 		this.httpService.request({
			// 			url: `/cgi-bin/token`,
			// 			method: 'GET',
			// 			params: {
			// 				grant_type: 'client_credential',
			// 				appid: this.configService.get('APP_ID'),
			// 				secret: this.configService.get('APP_SECRET')
			// 			}
			// 		}).pipe(map(response => response.data))
			// 	)
			// return
			// }
			return
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
