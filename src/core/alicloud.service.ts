import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { create } from 'svg-captcha'
import { RedisService } from '@/core/redis.service'
import * as Nanoid from 'nanoid'
import * as AliCloud from '@alicloud/pop-core'
import * as Core from './core.interface'

@Injectable()
export class AlicloudService {
	protected readonly aliCloud: AliCloud
	protected readonly session = Nanoid.customAlphabet('123456789', 10)
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
		const { text, data } = create({
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
		return { text, data, session: this.session(10) }
	}

	/**图形验证码**/
	public async fetchCaptcha() {
		const { text, data, session } = await this.httpCaptcha({ size: 6 })
		await this.redis.setStore(session, text, 180)
		return { data, text, session }
	}

	/**发送手机验证码**/
	public async fetchMobile(props: Core.IMobile, size?: number) {
		try {
			const code = this.session(size ?? 6)
			await this.redis.setStore(props.mobile, code, 300)
			return await this.aliCloud
				.request(
					'SendSms',
					{
						PhoneNumbers: props.mobile,
						SignName: '妖雨录',
						TemplateCode: 'SMS_254570125',
						TemplateParam: JSON.stringify({ code })
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

	/**验证手机验证码**/
	public async isCtrMobile(props: { mobile: string; code: string }) {
		const code = await this.redis.getStore(props.mobile)
		return {
			compare: code === props.code,
			done: () => this.redis.delStore(props.mobile)
		}
	}
}
