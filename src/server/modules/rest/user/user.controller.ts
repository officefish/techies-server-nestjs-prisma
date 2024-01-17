import {
  Controller,
  Get,
  Post,
  Res,
  Req,
  Body,
  UseGuards,
  //UploadedFile,
  //Query,
  Param,
} from '@nestjs/common'

import { UpsetProfileDto, GetDomainDto } from './user.schema'

import {
  //ApiCreatedResponse,
  ApiResponse,
  //ApiBody,
  ApiTags,
} from '@nestjs/swagger'

import { FastifyRequest, FastifyReply } from 'fastify'

import { UserService } from './user.service'
import { UploadService } from '../upload/upload.service'
import { AppConfigService } from '../../config/config.service'
import { AuthGuard } from '@modules/rest/auth/auth.guard'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly imageProccesing: UploadService,
    private readonly env: AppConfigService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('profile')
  async upsetProfile(
    @Body() credentials: UpsetProfileDto,
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
    //@UploadedFile() avatar: File,
  ) {
    const { basicInfo, quote, domain, avatar } = credentials

    // because of AuthGuard we have userId in FastifyRequest
    const id = request['userId']
    const user = await this.service.user({ id })

    if (!user) {
      return reply
        .code(401)
        .send({ statusCode: 401, message: 'User not found' })
    }

    // Upload avatar and disk storage final file as webp
    if (avatar && avatar.imageUrl) {
      const buffer = await this.imageProccesing.bufferFromURI(avatar.imageUrl)
      const url = await this.imageProccesing.convertToWebp(buffer)

      await this.service.upsetAvatar({
        user: { id: user.id },
        data: { url },
      })
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

    let avatarUrl = this.env.getAvatarUrl()
    const avatar = await this.service.avatar({ userId: id })
    if (avatar) {
      avatarUrl = avatar.url
    }

    const payload = {
      id: user?.id,
      email: user?.email,
      name: user?.name,
      verified: user?.verified,
      authenticated: true,
      role: user?.role,
      avatar: avatarUrl,
    }
    reply.code(201).send(payload)
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 201,
    description: 'SUCCESS',
    type: UpsetProfileDto,
  })
  // // @ApiResponse({
  // //   status: 401,
  // //   description: 'User not found.',
  // //   //type: UpsetProfileDto,
  // // })
  @Get('profile')
  async getCurrentUserProfile(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ) {
    const id = request['userId']
    const user = await this.service.user({ id })

    if (!user) {
      return reply
        .code(401)
        .send({ statusCode: 401, message: 'User not found' })
    }

    const basicInfo = await this.service.basicInfo({ userId: id })
    if (!basicInfo) {
      return reply
        .code(201)
        .send({ basicInfo: null, quote: null, domain: null })
    }

    const basicInfoJson = await this.service.basicInfoJson(basicInfo.id)
    const quote = await this.service.quote({ userId: id })
    const domain = await this.service.domain({ userId: id })
    let avatarData = { imageUrl: this.env.getAvatarUrl(), id: null }
    const avatar = await this.service.avatar({ userId: id })
    if (avatar) {
      avatarData = { imageUrl: avatar.url, id: avatar.id }
    }

    const payload = {
      basicInfo: basicInfoJson,
      quote: { content: quote.content },
      domain: { value: domain.value },
      avatar: avatarData,
    }
    reply.code(201).send(payload)
  }

  @Get('domain/:value')
  async getUserProfileByDomain(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
    @Param('value') value: string,
  ) {
    const domain = await this.service.domain({ value })
    if (!domain) {
      return reply
        .code(401)
        .send({ statusCode: 401, message: 'User not found' })
    }

    const basicInfo = await this.service.basicInfo({ userId: domain.userId })
    const quote = await this.service.quote({ userId: domain.userId })
    const basicInfoJson = await this.service.basicInfoJson(basicInfo.id)
    const payload = {
      basicInfo: basicInfoJson,
    }
    if (quote) {
      payload['quote'] = { content: quote.content }
    }
    reply.code(201).send(payload)
  }
}
