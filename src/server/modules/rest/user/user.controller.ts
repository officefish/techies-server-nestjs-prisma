import {
  Controller,
  Get,
  Post,
  Res,
  Req,
  Body,
  UseGuards,
} from '@nestjs/common'
import { UpsetProfileDto, GetDomainDto } from './user.schema'

import {
  //ApiCreatedResponse,
  //ApiResponse,
  //ApiBody,
  ApiTags,
} from '@nestjs/swagger'

import { FastifyRequest, FastifyReply } from 'fastify'

import { UserService } from './user.service'
import { AuthGuard } from '@modules/rest/auth/auth.guard'
//import { User as UserModel } from '@prisma/client'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  //@Post('user')
  //async signupUser(
  //  @Body() userData: { name?: string; email: string },
  //): Promise<UserModel> {
  //  return this.service.createUser(userData)
  //}
  @UseGuards(AuthGuard)
  @Post('profile')
  async upsetProfile(
    @Body() credentials: UpsetProfileDto,
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ) {
    const { basicInfo, quote, domain } = credentials

    // because of AuthGuard we have userId in FastifyRequest
    const id = request['userId']
    const user = await this.service.user({ id })

    if (!user) {
      return reply
        .code(400)
        .send({ statusCode: 401, message: 'User not found' })
    }

    /* Update basicInfo */
    if (basicInfo) {
      const prismaBasicInfo = await this.service.upsetBasicInfo({
        user: { id: user.id },
        data: basicInfo,
      })

      if (!prismaBasicInfo) {
        return reply
          .code(403)
          .send({ statusCode: 403, message: 'BasicInfo bad upset' })
      }
    }
    /* Update quote */
    if (quote) {
      const prismaQuote = await this.service.upsetQuote({
        user: { id: user.id },
        data: quote,
      })

      if (!prismaQuote) {
        return reply
          .code(403)
          .send({ statusCode: 403, message: 'Quote bad upset' })
      }
    }
    /* Update domain */
    if (domain) {
      const prismaDomain = await this.service.upsetDomain({
        user: { id: user.id },
        data: domain,
      })

      if (!prismaDomain) {
        return reply
          .code(403)
          .send({ statusCode: 403, message: 'Domain bad upset' })
      }
    }

    return reply.code(201).send({ statusCode: 201 })
  }

  @Post('valid-domain')
  async isValidDomain(
    @Body() credentials: GetDomainDto,
    //@Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ) {
    const { value } = credentials
    const domain = await this.service.domain({ value })
    const isValid = domain ? false : true
    return reply.code(201).send({ statusCode: 201, isValid })
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getCurrentUser(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ) {
    const id = request['userId']
    const user = await this.service.user({ id })

    if (!user) {
      return reply
        .code(400)
        .send({ statusCode: 401, message: 'User not found' })
    }

    const payload = {
      id: user?.id,
      email: user?.email,
      name: user?.name,
      verified: user?.verified,
      authenticated: true,
      role: user?.role,
    }
    reply.code(201).send(payload)
  }
}
