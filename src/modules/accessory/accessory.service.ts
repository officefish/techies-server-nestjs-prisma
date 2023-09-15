import { AppConfigService } from '@/modules/config/config.service'
import { Injectable } from '@nestjs/common'
import { Role } from '@prisma/client'

import { RegenerateSessionInput, CreateCookieInput } from './accessory.types'

@Injectable()
export class AccessoryService {
  constructor(private config: AppConfigService) {}

  async createCookie(input: CreateCookieInput) {
    input.reply.cookies[input.name] = input.value
    input.reply.setCookie(input.name, input.value, input.options)
  }

  async regenerateSession(input: RegenerateSessionInput) {
    const maxAge = this.config.getSessionMaxAge()
    const sessionExpires = new Date(Date.now() + maxAge)
    const options = {
      ...input.request.server.cookieOptions,
      expires: sessionExpires,
    }
    await input.request.session.regenerate()

    this.createCookie({
      reply: input.reply,
      name: 'sessionId',
      value: input.request.session.id || '',
      options,
    })

    const sessionToken = input.request.session.id || ''
    input.request.session.userId = input.userId
    input.request.session.userRole = input.userRole || Role.GUEST

    return { sessionToken, options }
  }
}
