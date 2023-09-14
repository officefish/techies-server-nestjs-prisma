import { NestFactory } from '@nestjs/core'
import { initializeSwagger } from './bootstrap'
import { AppModule } from './modules/app/app.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  initializeSwagger(app)

  //app.getHttpAdapter().

  await app.listen(3000)
}
bootstrap()
