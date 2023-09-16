import { Injectable } from '@nestjs/common'
//import bcrypt from 'bcryptjs'
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt/dist'
import { JwtSignOptions } from '@nestjs/jwt/dist'

@Injectable()
export class CryptoService {
  constructor(private readonly jwt: JwtService) {}

  async compare(requestPassword: string, databasePassword: string) {
    //console.log(requestPassword, databasePassword)
    //console.log(this.bcrypt)

    return await bcrypt.compare(requestPassword, databasePassword)
  }

  genSalt(length: number) {
    return bcrypt.genSalt(length)
  }

  hash(payload: string, salt: string) {
    return bcrypt.hash(payload, salt)
  }

  /* Jwt */
  async signAsync(payload: object | Buffer, options?: JwtSignOptions) {
    return await this.jwt.signAsync(payload, options)
  }
}
