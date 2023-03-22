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
	public readonly customSession = Nanoid.customAlphabet('123456789')
	constructor(private readonly config: ConfigService, private readonly redis: RedisService) {
		this.aliCloud = new AliCloud({
			accessKeyId: this.config.get('ALIYUN_ACCESSKEYID'),
			accessKeySecret: this.config.get('ALIYUN_ACCESSKEYSECRET'),
			endpoint: 'https://dysmsapi.aliyuncs.com',
			apiVersion: '2017-05-25'
		})
	}

	/**图形验证码**/
	public async fetchCaptcha(props: Core.ICaptcha) {
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

	/**验证图形验证码**/
	public async isCtrCaptcha(props: { session: string; code: string }) {
		try {
			const code = await this.redis.getStore(props.session)
			return {
				compare: code === props.code,
				done: () => this.redis.delStore(props.session)
			}
		} catch (e) {
			throw new HttpException('验证码失效', HttpStatus.BAD_REQUEST)
		}
	}

	/**发送手机验证码**/
	public async fetchMobile(props: Core.IMobile, size?: number) {
		try {
			const code = await this.customSession(6)
			//prettier-ignore
			await this.aliCloud.request('SendSms',{
					PhoneNumbers: props.mobile,
					SignName: '妖雨录',
					TemplateCode: 'SMS_254570125',
					TemplateParam: JSON.stringify({ code })
				},
				{ method: 'POST' }
			).catch(e => {
				throw new HttpException(e.data?.Message ?? '发送失败', HttpStatus.BAD_REQUEST)
			})

			return await this.redis.setStore(props.mobile, code, 300).then(() => {
				return { message: '发送成功' }
			})
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**验证手机验证码**/
	public async isCtrMobile(props: { mobile: string; code: string }) {
		try {
			const code = await this.redis.getStore(props.mobile)
			return {
				compare: code === props.code,
				done: () => this.redis.delStore(props.mobile)
			}
		} catch (e) {
			throw new HttpException('验证码失效', HttpStatus.BAD_REQUEST)
		}
	}
}
