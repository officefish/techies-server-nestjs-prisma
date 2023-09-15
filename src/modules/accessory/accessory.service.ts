import { AppConfigService } from '@/modules/config/config.service'
import { Injectable } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'

import { Role } from '@prisma/client'

type RegenerateSessionInput = {
  request: FastifyRequest
  reply: FastifyReply
  userId?: string
  userRole?: Role
}

@Injectable()
export class AccessoryService {
  constructor(private config: AppConfigService) {}

  async regenerateSession(input: RegenerateSessionInput) {
    const maxAge = this.config.getSessionMaxAge()
    const sessionExpires = new Date(Date.now() + maxAge)
    const options = {
      ...input.request.server.cookieOptions,
      expires: sessionExpires,
    }
    await input.request.session.regenerate()

    const sessionToken = input.request.session.id || ''
    input.request.session.userId = input.userId
    input.request.session.userRole = input.userRole || Role.GUEST

    return { sessionToken, options }
  }
}
