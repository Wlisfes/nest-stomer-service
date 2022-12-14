import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import * as express from 'express'
import * as cookieParser from 'cookie-parser'

async function useSwagger(app: NestExpressApplication) {
	const options = new DocumentBuilder()
		.setTitle('Nest-Stomer-Service')
		.setDescription('Nest-Stomer-Service Api Documentation')
		.setVersion('1.0')
		// .addBearerAuth({ type: 'apiKey', name: APP_AUTH_TOKEN, in: 'header' }, APP_AUTH_TOKEN)
		.build()
	const document = SwaggerModule.createDocument(app, options)
	SwaggerModule.setup('api-doc', app, document, {
		customSiteTitle: '服务端API文档',
		swaggerOptions: {
			defaultModelsExpandDepth: -1,
			defaultModelExpandDepth: 5,
			filter: true
		}
	})
	return app
}

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)

	//允许跨域
	app.enableCors()
	app.use(cookieParser())

	//解析body参数
	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))

	//接口前缀
	app.setGlobalPrefix('/api')

	//静态资源
	app.useStaticAssets('public')

	//全局注册验证管道
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true
		})
	)

	//文档挂载
	await useSwagger(app)

	const port = process.env.PORT || 5001
	await app.listen(port)
	console.log(`http://localhost:${port}`)
	console.log(`http://localhost:${port}/api-doc`)
}
bootstrap()
