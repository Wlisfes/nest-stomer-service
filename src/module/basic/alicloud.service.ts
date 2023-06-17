import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { create } from 'svg-captcha'
import { CoreService } from '@/core/core.service'
import { COMMON_CAPTCHA, COMMON_MOBILE } from '@/config/redis-config'
import { RedisService } from './redis.service'
import * as AliCloud from '@alicloud/pop-core'
import * as ali from './alicloud.interface'

@Injectable()
export class AlicloudService extends CoreService {
	protected readonly aliCloud: AliCloud
	constructor(private readonly config: ConfigService, private readonly redisService: RedisService) {
		super()
		this.aliCloud = new AliCloud({
			accessKeyId: this.config.get('ALIYUN_ACCESSKEYID'),
			accessKeySecret: this.config.get('ALIYUN_ACCESSKEYSECRET'),
			endpoint: 'https://dysmsapi.aliyuncs.com',
			apiVersion: '2017-05-25'
		})
	}

	/**图形验证码**/
	public async httpCaptcha(props: ali.RequestCaptcha) {
		const session = this.createUIDNumber(32)
		const { data, text } = create({
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
		return await this.redisService.setStore(`${COMMON_CAPTCHA}:${session}`, text, 5 * 60).then(() => {
			return { session, data, text }
		})
	}

	/**发送手机验证码**/
	public async httpMobileCaptcha(props: ali.RequestMobileCaptcha, size?: number) {
		try {
			const code = await this.createUIDNumber(6)
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

			return await this.redisService.setStore(`${COMMON_MOBILE}:${props.mobile}`, code, 5 * 60).then(() => {
				return { message: '发送成功' }
			})
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
