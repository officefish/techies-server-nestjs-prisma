import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { faker } from '@faker-js/faker'
import { AppModule } from '@/modules/app/app.module'

import { describe, test, beforeAll, afterAll, expect } from 'vitest'

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'

//const url = '/healthcheck'
const jsonType = 'application/json; charset=utf-8'

describe('Authorization api', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    )
    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  test('SignIn request with unautorized user', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: `${faker.internet.password()}Aa1$`,
    }
    const response = await app
      .getHttpAdapter()
      .getInstance()
      .inject()
      .post('auth/sign-in')
      .payload(fakeUser)

    expect(response.statusCode).toBe(401)
    expect(response.headers['content-type']).toBe(jsonType)
    const json = response.json()
    expect(json).haveOwnProperty('statusCode')
    expect(json).haveOwnProperty('message')
  })

  test('SignIn request with invalid email', async () => {
    const fakeUser = {
      email: 'invalid email',
      password: `${faker.internet.password()}Aa1$`,
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

  test('SignIn request with invalid password', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: 'invalidPassword',
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

  test('SignIn request with invalid request data', async () => {
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

  afterAll(async () => {
    await app.getHttpServer().close()
  })
})
