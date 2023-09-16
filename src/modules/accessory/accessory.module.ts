import { Module } from '@nestjs/common'
import { AccessoryService } from './accessory.service'
import { ConfigService } from '@nestjs/config'
import { CryptoService } from '../crypto/crypto.service'
import { AppConfigService } from '@/modules/config/config.service'
import { CryptoModule } from '../crypto/crypto.module'
@Module({
  imports: [CryptoModule],
  controllers: [],
  providers: [AccessoryService, AppConfigService, ConfigService, CryptoService],
  exports: [AccessoryService, AppConfigService, ConfigService, CryptoService],
})
export class AccessoryModule {}
