import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { CryptoService } from '@modules/crypto/crypto.service'
import { JwtService } from '@nestjs/jwt'
import { AccessoryService } from '@modules/accessory/accessory.service'
import { AccessoryModule } from '@modules/accessory/accessory.module'

@Module({
  imports: [AccessoryModule],
  controllers: [UserController],
  providers: [UserService, CryptoService, JwtService, AccessoryService],
})
export class UserModule {}
