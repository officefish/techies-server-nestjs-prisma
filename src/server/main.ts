import { NestFactory } from '@nestjs/core'
import {
  initializeSwagger,
  initializeCookies,
  initializeSession,
  initializeCors,
  initializeStaticAssets,
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
  // Set global prefix for api
  app.setGlobalPrefix('/api/v1')

  //const bodyLimit = 10_485_760 // 10MiB
  //app.useBodyParser('application/json', { bodyLimit })
  // should be initialized before session
  initializeCookies(app)
  initializeCors(app)
  initializeSwagger(app)
  initializeSession(app)
  initializeStaticAssets(app)

  //app.getHttpAdapter().
  initializeNext(app)
  await nextRoutes(app)

  //

  await app.listen(8001)
}
bootstrap()
