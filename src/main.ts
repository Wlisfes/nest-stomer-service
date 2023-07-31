import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { I18nValidationPipe } from 'nestjs-i18n'
import { knife4jSetup } from 'nest-knife4j'
import { AppModule } from '@/app.module'
import { SwaggerOption } from '@/config/swagger-config'
import { join } from 'path'
import * as express from 'express'
import * as cookieParser from 'cookie-parser'

async function useSwagger(app: NestExpressApplication) {
	const options = new DocumentBuilder()
		.setTitle(SwaggerOption.title)
		.setDescription(SwaggerOption.document)
		.setVersion(SwaggerOption.version)
		.addBearerAuth(
			{ type: 'apiKey', name: SwaggerOption.APP_AUTH_TOKEN, in: 'header' },
			SwaggerOption.APP_AUTH_TOKEN
		)
		.build()
	const document = SwaggerModule.createDocument(app, options)
	SwaggerModule.setup('api-doc', app, document, {
		customSiteTitle: SwaggerOption.customSiteTitle,
		swaggerOptions: {
			defaultModelsExpandDepth: SwaggerOption.defaultModelsExpandDepth,
			defaultModelExpandDepth: SwaggerOption.defaultModelExpandDepth,
			filter: SwaggerOption.filter,
			docExpansion: SwaggerOption.docExpansion
		}
	})
	knife4jSetup(app, [
		{
			name: '2.X版本',
			url: `/api-doc-json`,
			swaggerVersion: '2.0',
			location: `/api-doc-json`
		}
	])
	return app
}

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		logger: ['debug']
	})

	//允许跨域
	app.enableCors()
	app.use(cookieParser())
	app.setGlobalPrefix('/api-stomer')

	//解析body参数
	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))

	//静态资源
	app.useStaticAssets(join(__dirname, '..', 'public'))
	app.setBaseViewsDir(join(__dirname, '..', 'public/views'))
	app.setViewEngine('hbs')

	//全局注册验证管道
	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
	//全局注册i18n管道
	app.useGlobalPipes(new I18nValidationPipe())

	//文档挂载
	await useSwagger(app)

	const port = process.env.PORT || 5001
	await app.listen(port)
	console.log(`http://localhost:${port}`)
	console.log(`http://localhost:${port}/doc.html`)
	console.log(`http://localhost:${port}/api-doc`)
}
bootstrap()
