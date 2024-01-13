//import { FastifyInstance } from 'fastify'
import { INestApplication, Logger } from '@nestjs/common'

//import { FastifyRequest } from 'fastify'
//import { FastifyReply } from 'fastify'
//import { NextServer } from "next/dist/server/next"

// not working way
//import { IncomingMessage } from "http"
// declare module 'http' {
//     interface IncomingMessage {
//         server?: FastifyInstance
//     }
// }

export async function nextRoutes(app: INestApplication) {
  const server = app.getHttpAdapter().getInstance()
  await server.after()
  server.next('/')
  server.next('/me')

  //server.next(`/auth/log-in`, async (app:NextServer, req:FastifyRequest, reply:FastifyReply) => {
  // here we potentialy can forward fastify instance to req.raw
  //req.raw.server = req.server
  //await app.render(req.raw, reply.raw, '/log-in', {})
  //reply.hijack()
  //})
  server.next(`/auth/sign-in`)
  server.next(`/auth/sign-up`)
  server.next('/auth/forgot-password')
  server.next('/auth/password-reset/*')
  Logger.log('NEST endpoints register', 'Render')
}

//export { routes as NextRoutes }
