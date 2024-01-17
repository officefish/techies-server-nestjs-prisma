import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { CryptoService } from '@modules/crypto/crypto.service'
import { JwtService } from '@nestjs/jwt'
import { AccessoryService } from '@modules/accessory/accessory.service'
import { AccessoryModule } from '@modules/accessory/accessory.module'
import { UploadModule } from '../upload/upload.module'
import { UploadService } from '../upload/upload.service'
import { SharpModule, SharpService } from 'nestjs-sharp'
import { AppConfigService } from '../../config/config.service'

@Module({
  imports: [AccessoryModule, UploadModule, SharpModule],
  controllers: [UserController],
  providers: [
    UserService,
    CryptoService,
    JwtService,
    AccessoryService,
    UploadService,
    SharpService,
    AppConfigService,
  ],
})
export class UserModule {}
