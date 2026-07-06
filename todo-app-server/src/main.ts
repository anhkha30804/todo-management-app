import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './shared/filters/http-exception.filter'

async function bootstrap() {
   const app = await NestFactory.create(AppModule)

   app.setGlobalPrefix('api')
   app.enableCors()

   app.useGlobalPipes(
      new ValidationPipe({
         whitelist: true,
         forbidNonWhitelisted: true,
         transform: true
      })
   )

   app.useGlobalFilters(new GlobalExceptionFilter())

   const port = process.env.PORT ?? 8080
   await app.listen(port, '0.0.0.0')
}

bootstrap()
