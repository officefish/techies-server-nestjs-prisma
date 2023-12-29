import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '@/modules/app/app.module'
import { ConfigModule } from '@nestjs/config'
//import { Prisma } from '@prisma/client'
//import { PrismaModule } from '@/modules/prisma/prisma.module'

//import { User } from '@prisma/client'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { UserService } from '@/modules/rest/user/user.service'
import { CryptoService } from '@/modules/crypto/crypto.service'
import { AppConfigService } from '@/modules/config/config.service'
import { JwtService } from '@nestjs/jwt'

import { describe, test, beforeAll, afterAll, expect } from 'vitest'

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'

import {
  generateNewUser,
  checkUserNotExist,
  makeUserInputData,
  generateBasicInfo,
  IncludeAllBasicInfo,
  destroyUser,
  // generateRandomQuote,
  // generateRandomDomain,
} from './user.generator'

const jsonType = 'application/json; charset=utf-8'

describe('User Profile Service', () => {
  let app: INestApplication
  let userService: UserService
  let prisma: PrismaService
  let env: AppConfigService
  let crypto: CryptoService

  //let userData: FakeNewUser
  //let user: User
  //let prismaUser: User

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ConfigModule],
      providers: [
        PrismaService,
        UserService,
        CryptoService,
        AppConfigService,
        JwtService,
      ],
    }).compile()

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    )
    await app.init()
    await app.getHttpAdapter().getInstance().ready()

    prisma = await moduleFixture.get<PrismaService>(PrismaService)
    env = await moduleFixture.get<AppConfigService>(AppConfigService)
    crypto = await moduleFixture.get<CryptoService>(CryptoService)
    userService = await moduleFixture.get<UserService>(UserService)
  })

  /*
  test('Fail SignIn request with invalid request data', async () => {
    const fakeUser = {
      invalid: true,
    }
    const response = await app
      .getHttpAdapter()
      .getInstance()
      .inject()
      .post('auth/sign-in')
      .payload(fakeUser)

    expect(response.statusCode).toBe(400)
    expect(response.headers['content-type']).toBe(jsonType)
    const json = response.json()
    expect(json).haveOwnProperty('statusCode')
    expect(json).haveOwnProperty('message')
    expect(json).haveOwnProperty('errors')
  })
  */

  test('Fail Create User BasicInfo with (POST) :: UserProfile without JWT', async () => {
    const userData = generateNewUser()

    /* Sure user not exist in db */
    await checkUserNotExist(prisma, userData.email)

    const userDataForDb = await makeUserInputData({ env, crypto, userData })
    const user = await userService.createUser(userDataForDb)
    expect(user).instanceOf(Object)

    const basicInfo = generateBasicInfo(IncludeAllBasicInfo)

    const response = await app
      .getHttpAdapter()
      .getInstance()
      .inject()
      .post('user/profile')
      .payload({ basicInfo: basicInfo })

    expect(response.statusCode).toBe(401)
    expect(response.headers['content-type']).toBe(jsonType)
    const json = response.json()
    expect(json).haveOwnProperty('statusCode')
    expect(json).haveOwnProperty('message')
    expect(json['statusCode'] == 401).toBe(true)
    expect(json['message'] == 'Unauthorized').toBe(true)

    await destroyUser(userService, prisma, userData.email)
  })

  test('Success Create User BasicInfo with (POST) :: UserProfile without JWT', async () => {
    const userData = generateNewUser()

    /* Sure user not exist in db */
    await checkUserNotExist(prisma, userData.email)

    const registerResponse = await app
      .getHttpAdapter()
      .getInstance()
      .inject()
      .post('auth/sign-up')
      .payload(userData)

    expect(registerResponse.statusCode).toBe(201)
    expect(registerResponse.headers['content-type']).toBe(jsonType)
    let json = registerResponse.json()
    expect(json).haveOwnProperty('payload')
    expect(json.payload).haveOwnProperty('accessToken')

    const token = json?.payload?.accessToken || undefined
    expect(token).toBeDefined()

    const basicInfo = generateBasicInfo(IncludeAllBasicInfo)
    //console.log(basicInfo)

    const response = await app
      .getHttpAdapter()
      .getInstance()
      .inject()
      .post('user/profile')
      //.set('Authorization', token)
      .headers({ authorization: `Bearer ${token}` })
      .payload({ basicInfo: basicInfo })

    //console.log(response)

    expect(response.statusCode).toBe(201)
    expect(response.headers['content-type']).toBe(jsonType)
    json = response.json()
    expect(json).haveOwnProperty('statusCode')
    expect(json.statusCode).toBe(201)
    // expect(json).haveOwnProperty('message')
    // expect(json['statusCode'] == 401).toBe(true)
    // expect(json['message'] == 'Unauthorized').toBe(true)

    await destroyUser(userService, prisma, userData.email)
  })

  afterAll(async () => {
    await app.getHttpServer().close()
  })
})
