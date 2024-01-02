import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

//import { JwtService } from '@nestjs/jwt'
import { AccessoryService } from '@modules/accessory/accessory.service'
import { UserService } from '@modules/rest/user/user.service'
import { FastifyRequest } from 'fastify'

//import { jwtConstants } from './constants'
//import { Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private accessory: AccessoryService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const sessionAccessToken = this.extractAccessTokenFromSession(request)
    if (sessionAccessToken !== undefined) {
      const userId = await this.accessory.verifyAsync(sessionAccessToken)
      if (userId) {
        request.userId = userId
        return true
      }
    }

    /* If access token is invalid, but refresh is valid than regenegate session */
    const sessionRefreshToken = this.extractRefreshTokenFromSession(request)
    if (sessionRefreshToken !== undefined) {
      const userId = await this.accessory.verifyAsync(sessionRefreshToken)
      if (userId) {
        request.userId = userId
        const user = await this.userService.user({ id: request.userId })
        const userRole = user.role
        const reply = context.switchToHttp().getResponse()

        const { sessionId, options } = await this.accessory.regenerateSession({
          request,
          reply,
          userId,
          userRole,
        })

        if (sessionId) {
          await this.accessory.createTokenCookies({
            userId,
            sessionId,
            reply,
            options,
          })
        }
        return true
      }
    }

    const bearerAccessToken = this.extractTokenFromBearer(request)
    if (bearerAccessToken !== undefined) {
      const userId = await this.accessory.verifyAsync(bearerAccessToken)
      if (userId) {
        request.userId = userId
        return true
      }
    }

    //console.log('UnauthorizedException')
    throw new UnauthorizedException()
  }

  private extractAccessTokenFromSession(
    request: FastifyRequest,
  ): string | undefined {
    const accessToken =
      request.cookies && request.cookies['access-token']
        ? request.cookies['access-token']
        : undefined
    return accessToken
  }

  private extractRefreshTokenFromSession(
    request: FastifyRequest,
  ): string | undefined {
    const accessToken =
      request.cookies && request.cookies['refresh-token']
        ? request.cookies['refresh-token']
        : undefined
    return accessToken
  }

  private extractTokenFromBearer(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
