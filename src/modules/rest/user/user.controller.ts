import {
  Controller,
  //Post,
  //Body
} from '@nestjs/common'
import { UserService } from './user.service'
//import { User as UserModel } from '@prisma/client'

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  //@Post('user')
  //async signupUser(
  //  @Body() userData: { name?: string; email: string },
  //): Promise<UserModel> {
  //  return this.service.createUser(userData)
  //}
}
