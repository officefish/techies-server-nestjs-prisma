import { NestFactory } from '@nestjs/core'
import {
  initializeSwagger,
  initializeCookies,
  initializeSession,
} from './bootstrap'
import { initializeNext, nextRoutes } from './render'
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
  // should be initialized before session
  initializeCookies(app)
  initializeSwagger(app)
  initializeSession(app)
  //app.getHttpAdapter().

  initializeNext(app)
  await nextRoutes(app)

  await app.listen(8001)
}
bootstrap()
