import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { create } from 'svg-captcha'
import { RedisService } from '@/core/redis.service'
import * as AliCloud from '@alicloud/pop-core'
import * as Core from './core.interface'

@Injectable()
export class AlicloudService {
	protected aliCloud: AliCloud
	constructor(private readonly config: ConfigService, private readonly redis: RedisService) {
		this.aliCloud = new AliCloud({
			accessKeyId: this.config.get('ALIYUN_ACCESSKEYID'),
			accessKeySecret: this.config.get('ALIYUN_ACCESSKEYSECRET'),
			endpoint: 'https://dysmsapi.aliyuncs.com',
			apiVersion: '2017-05-25'
		})
	}

	/**创建验证码**/
	public async httpCaptcha(props?: Core.ICaptcha) {
		return create({
			size: props?.size ?? 4,
			fontSize: props?.fontSize ?? 38,
			color: true,
			noise: 2,
			width: props?.width ?? 100,
			height: props?.height ?? 34,
			inverse: true,
			charPreset: '123456789',
			background: '#E8F0FE'
		})
	}

	/**发送手机验证码**/
	public async fetchMobile(props: Core.IMobile, size?: number) {
		try {
			const { text } = await this.httpCaptcha({ size })
			await this.redis.setStore(props.mobile, text, 300)
			return await this.aliCloud
				.request(
					'SendSms',
					{
						PhoneNumbers: props.mobile,
						SignName: '妖雨录',
						TemplateCode: 'SMS_254570125',
						TemplateParam: JSON.stringify({ code: text })
					},
					{ method: 'POST' }
				)
				.then(
					response => ({ message: '发送成功' }),
					e => new HttpException(e.data?.Message ?? '发送失败', HttpStatus.BAD_REQUEST)
				)
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
