import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { faker } from '@faker-js/faker'
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

//const url = '/healthcheck'
//const jsonType = 'application/json; charset=utf-8'

const destroyUser = async (
  userService: UserService,
  prisma: PrismaService,
  email: string,
) => {
  await userService.deleteUser({ email })
  return await checkUserNotExist(prisma, email)
}

// const getExistUser = async (prisma: PrismaService, email: string) => {
//   return await prisma.user.findUnique({
//     where: { email },
//   })
// }

const checkUserNotExist = async (prisma: PrismaService, email: string) => {
  const prismaUser = await prisma.user.findUnique({
    where: { email },
  })
  return expect(prismaUser).toBe(null)
}

interface FakeNewUser {
  email: string
  name?: string
  password: string
}

interface MakeUserDataParams {
  env: AppConfigService
  crypto: CryptoService
  userData: FakeNewUser
}

interface UserDataForDB {
  email: string
  password: string
  salt: string
  verified: boolean
  name?: string
}

const makeUserInputData = async (
  params: MakeUserDataParams,
): Promise<UserDataForDB> => {
  const { env, crypto, userData } = params
  const saltLength = env.getSaltLength()
  const salt = await crypto.generateSalt(saltLength)
  const hashedPassword = await crypto.hash(userData.password, salt)

  return {
    email: userData.email,
    password: hashedPassword,
    salt,
    verified: false,
  }
}

const generateNewUser = () => {
  return {
    email: faker.internet.email(),
    password: `${faker.internet.password()}Aa1$`,
    name: faker.person.fullName(),
  }
}

interface BasicInfoGeneratorParams {
  includeFullname: boolean
  includeCareer: boolean
  includeEducation: boolean
  includeLocation: boolean
}

const IncludeAllBasicInfo: BasicInfoGeneratorParams = {
  includeFullname: true,
  includeCareer: true,
  includeEducation: true,
  includeLocation: true,
}

interface FullNameInput {
  firstName: string
  lastName: string
}

interface CareerInput {
  company?: string
  role?: string
}

interface EducationInput {
  university?: string
  faculty?: string
}

interface LocationInput {
  country?: string
  region?: string
  timeZone?: string
}

interface BasicInfoInput {
  fullName?: FullNameInput
  career?: CareerInput
  education?: EducationInput
  location?: LocationInput
}

const generateBasicInfo = (params: BasicInfoGeneratorParams) => {
  const { includeFullname, includeCareer, includeEducation, includeLocation } =
    params

  const result: BasicInfoInput = {}
  /* include FullName if need */
  if (includeFullname) {
    result.fullName = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    }
  }
  /* include Career if need */
  if (includeCareer) {
    result.career = {
      company: faker.company.name(),
      role: faker.person.jobTitle(),
    }
  }
  /* include Education if need*/
  if (includeEducation) {
    result.education = {
      university: 'University of culture and Art',
      faculty: 'Multimedia producer',
    }
  }
  if (includeLocation) {
    result.location = {
      country: faker.location.country(),
      region: faker.location.city(),
      timeZone: faker.location.timeZone().toString(),
    }
  }
  return result
}

describe('UserService', () => {
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

  test('Create basicInfo', async () => {
    const userData = generateNewUser()

    /* Sure user not exist in db */
    await checkUserNotExist(prisma, userData.email)

    const userDataForDb = await makeUserInputData({ env, crypto, userData })
    const user = await userService.createUser(userDataForDb)

    expect(user).instanceOf(Object)

    const basicInfo = generateBasicInfo(IncludeAllBasicInfo)

    const prismaBasicInfo = await userService.upsetBasicInfo({
      user: { id: user.id },
      data: basicInfo,
    })

    const fullNameData = await prisma.fullName.findUnique({
      where: { basicInfoId: prismaBasicInfo.id },
    })
    expect(fullNameData).instanceOf(Object)
    expect(fullNameData.basicInfoId == prismaBasicInfo.id).toBe(true)

    const careerData = await prisma.career.findUnique({
      where: { basicInfoId: prismaBasicInfo.id },
    })
    expect(careerData).instanceOf(Object)
    expect(careerData.basicInfoId == prismaBasicInfo.id).toBe(true)

    const educationData = await prisma.education.findUnique({
      where: { basicInfoId: prismaBasicInfo.id },
    })
    expect(educationData).instanceOf(Object)
    expect(educationData.basicInfoId == prismaBasicInfo.id).toBe(true)

    const locationData = await prisma.location.findUnique({
      where: { basicInfoId: prismaBasicInfo.id },
    })
    expect(locationData).instanceOf(Object)
    expect(locationData.basicInfoId == prismaBasicInfo.id).toBe(true)

    await destroyUser(userService, prisma, userData.email)
  })

  test('Update basicInfo', async () => {
    const userData = generateNewUser()

    /* Sure user not exist in db */
    await checkUserNotExist(prisma, userData.email)

    const userDataForDb = await makeUserInputData({ env, crypto, userData })
    const user = await userService.createUser(userDataForDb)

    expect(user).instanceOf(Object)

    let basicInfo = generateBasicInfo(IncludeAllBasicInfo)

    let prismaBasicInfo = await userService.upsetBasicInfo({
      user: { id: user.id },
      data: basicInfo,
    })
    expect(prismaBasicInfo).instanceOf(Object)

    /* second time generation then update */
    basicInfo = generateBasicInfo(IncludeAllBasicInfo)
    prismaBasicInfo = await userService.upsetBasicInfo({
      user: { id: user.id },
      data: basicInfo,
    })

    const fullNameData = await prisma.fullName.findUnique({
      where: { basicInfoId: prismaBasicInfo.id },
    })
    expect(fullNameData).instanceOf(Object)
    expect(fullNameData.basicInfoId == prismaBasicInfo.id).toBe(true)

    const careerData = await prisma.career.findUnique({
      where: { basicInfoId: prismaBasicInfo.id },
    })
    expect(careerData).instanceOf(Object)
    expect(careerData.basicInfoId == prismaBasicInfo.id).toBe(true)

    const educationData = await prisma.education.findUnique({
      where: { basicInfoId: prismaBasicInfo.id },
    })
    expect(educationData).instanceOf(Object)
    expect(educationData.basicInfoId == prismaBasicInfo.id).toBe(true)

    const locationData = await prisma.location.findUnique({
      where: { basicInfoId: prismaBasicInfo.id },
    })
    expect(locationData).instanceOf(Object)
    expect(locationData.basicInfoId == prismaBasicInfo.id).toBe(true)

    await destroyUser(userService, prisma, userData.email)
  })

  afterAll(async () => {
    await app.getHttpServer().close()
  })
})
