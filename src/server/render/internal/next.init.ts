import { INestApplication, Logger } from '@nestjs/common'

import fastifyNextJS from '@fastify/nextjs'

export function initializeNext(app: INestApplication) {
  const server = app.getHttpAdapter().getInstance()
  const HTTP_PORT = 8001
  server
    .register(fastifyNextJS, {
      dev: true,
      noServeAssets: true,
      port: HTTP_PORT,
    })
    .after(() => {
      // get all _next response as usual
      server.next(
        `${process.env.BASE_PATH || ''}/_next/*`,
        async (app, req, reply) => {
          return app
            .getRequestHandler()(req.raw, reply.raw)
            .then(() => {
              reply.hijack()
            })
        },
      )
    })
  // block hotreloading (used only for dev)
  server.get(
    `${process.env.BASE_PATH || ''}/_next/webpack-hmr`,
    async (req, reply) => {
      reply.status(200).send('ok')
    },
  )
  Logger.log('Fastify/Next module installed', 'Render')
}
