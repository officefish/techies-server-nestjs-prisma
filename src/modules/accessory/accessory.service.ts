import { Injectable } from '@nestjs/common'
import { Role } from '@prisma/client'
import { AppConfigService } from '@/modules/config/config.service'
import { CryptoService } from '@/modules/crypto/crypto.service'
import {
  RegenerateSessionInput,
  CreateCookieInput,
  CreateTokensInput,
} from './accessory.types'

@Injectable()
export class AccessoryService {
  constructor(
    private readonly env: AppConfigService,
    private readonly crypto: CryptoService,
  ) {}

  /* Expires */
  nowPlusMinutes(delay: number): Date {
    const expires = new Date()
    expires.setMinutes(expires.getMinutes() + delay)
    return expires
  }

  nowPlusDays(delay: number): Date {
    const expires = new Date()
    expires.setDate(expires.getDate() + delay)
    return expires
  }

  /* Cookies service */

  async createCookie(input: CreateCookieInput) {
    input.reply.cookies[input.name] = input.value
    input.reply.setCookie(input.name, input.value, input.options)
  }

  async createTokenCookies(input: CreateTokensInput) {
    const { userId, sessionToken, reply } = input
    const accessTokenMinutes = this.env.getAccessTokenMinutes()
    const refreshTokenDays = this.env.getRefreshTokenDays()
    const cookieOptions = input.request.server.cookieOptions

    const accessToken = await this.crypto.signAsync({ userId, sessionToken })
    const accessExpires = this.nowPlusMinutes(accessTokenMinutes)
    const accessOptions = { ...cookieOptions, expires: accessExpires }

    this.createCookie({
      reply,
      name: 'access-token',
      value: accessToken,
      options: accessOptions,
    })

    const refreshToken = await this.crypto.signAsync({ sessionToken })
    const refreshExpires = this.nowPlusDays(refreshTokenDays)
    const refreshOptions = { ...cookieOptions, expires: refreshExpires }
    this.createCookie({
      reply,
      name: 'refresh-token',
      value: refreshToken,
      options: refreshOptions,
    })
  }

  /* Session service */

  async regenerateSession(input: RegenerateSessionInput) {
    const maxAge = this.env.getSessionMaxAge()
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
