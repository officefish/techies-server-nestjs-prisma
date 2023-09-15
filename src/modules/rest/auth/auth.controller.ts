import { Controller, Post, Body, Req } from '@nestjs/common'
import { Res } from '@nestjs/common'
import { AuthService } from './auth.service'
//import { User as UserModel } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'
import { SignInDto, SignInSuccessDto, FailDto } from './auth.schema'
import {
  ApiCreatedResponse,
  ApiResponse,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger'
import {
  SignInResponseDesc,
  SignInBodyDesc,
  SignInValidationFailedDesc,
} from './auth.constants'

import { User as UserModel } from '@prisma/client'
import { AccessoryService } from '@/modules/accessory/accessory.service'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly accessory: AccessoryService,
  ) {}

  @Post('sign-in')
  @ApiCreatedResponse({
    description: SignInResponseDesc,
    type: SignInSuccessDto,
  })
  @ApiResponse({
    status: 400,
    description: SignInValidationFailedDesc,
  })
  @ApiResponse({
    status: 403,
    description: 'UNAUTHORIZED',
    type: FailDto,
  })
  @ApiBody({
    description: SignInBodyDesc,
    type: SignInDto,
  })
  async signIn(
    @Body() credentials: SignInDto,
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ) {
    const { email, password } = credentials
    const user: UserModel = await this.service.signIn(email, password)

    if (!user) {
      return reply.code(401).send({ statusCode: 403, message: 'UNAUTHORIZED' })
    }

    // If the user has enabled two-factor authentication (2FA) ...
    // Don't login until a 2FA code is provided.
    if (user.secret) {
      return reply.code(403).send({ statusCode: 403, message: 'FORBIDDEN' })
    }

    // 2FA is not enabled for this account,
    // so create a new session for this user.
    //await updateSession(request, reply, user)
    const userId = user.id
    const userRole = user.role
    const { sessionToken } = await this.accessory.regenerateSession({
      request,
      reply,
      userId,
      userRole,
    })

    console.log('sessionToken: ', sessionToken)

    return { statusCode: 201, userId: user.id }
  }
}
