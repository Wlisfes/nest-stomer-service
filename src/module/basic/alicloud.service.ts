import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { create } from 'svg-captcha'
import { RedisService } from './redis.service'
import * as Nanoid from 'nanoid'
import * as AliCloud from '@alicloud/pop-core'
import * as ali from './alicloud.interface'

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
	public async httpCaptcha(props: ali.RequestCaptcha) {
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
	public async httpMobileCaptcha(props: ali.RequestMobileCaptcha, size?: number) {
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
}