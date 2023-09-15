import { Injectable } from '@nestjs/common'
//import bcrypt from 'bcryptjs'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class CryptoService {
  constructor() {}

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
}
