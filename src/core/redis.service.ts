import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRedis, Redis } from '@nestjs-modules/ioredis'
import { Observer } from './core.observer'
import * as IoRedis from 'ioredis'

export type RCommand = string | ((x: string) => boolean)
export type ICommand = { cmd: string; key: string }
export type IObserver = { message: ICommand }

@Injectable()
export class RedisService {
	private done: unknown | undefined
	private readonly observer: Observer<IObserver> = new Observer()
	private readonly trigger: Observer<IObserver> = new Observer()
	constructor(private readonly config: ConfigService, @InjectRedis() private readonly client: Redis) {
		this.initSubscribe().then(r => Logger.log(r))
	}

	/**初始化订阅消息**/
	private initSubscribe() {
		return new Promise(resilve => {
			try {
				const { client, config, trigger } = this
				const command = `__keyevent@${config.get('REDIS_DB')}__:expired`
				client.send_command('config', ['set', 'notify-keyspace-events', 'Ex'], () => {
					const instance = new IoRedis({
						host: config.get('REDIS_HOST'),
						port: Number(config.get('REDIS_PORT')),
						db: Number(config.get('REDIS_DB')),
						password: config.get('REDIS_PASSWORD'),
						keyPrefix: config.get('REDIS_KEYPREFIX')
					})
					instance.subscribe(command, () => {
						instance.on('message', (cmd, key) => trigger.emit('message', { cmd, key }))
					})
					resilve('Redis: 订阅成功')
				})
			} catch (e) {
				Logger.error('订阅失败: ', e)
			}
		})
	}

	/**条件筛查**/
	private isCommand(command: RCommand, key: string) {
		switch (typeof command) {
			case 'string':
				return key.startsWith(command)
			case 'function':
				return command(key)
			default:
				return false
		}
	}

	/**开启订阅回调**/
	public subscribe(command: RCommand, handler?: (e: ICommand) => void): Promise<Observer<IObserver>> {
		return new Promise(resolve => {
			const { trigger, observer } = this
			const onTrigger = (e: ICommand) => {
				if (this.isCommand(command, e.key)) {
					handler?.(e)
					observer.emit('message', e)
				}
			}
			if (!this.done) {
				/**订阅开启**/
				this.done = trigger.on('message', onTrigger)
			}
			resolve(observer)
		})
	}

	/**redis存储**/
	public async setStore(key: string, data: any, seconds?: number) {
		if (!seconds) {
			return await this.client.set(key, JSON.stringify(data))
		} else {
			return await this.client.set(key, JSON.stringify(data), 'EX', seconds)
		}
	}

	/**redis读取**/
	public async getStore(key: string) {
		const data = await this.client.get(key)
		return data ? JSON.parse(data) : undefined
	}
}
