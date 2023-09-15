import { Module } from '@nestjs/common'
import { AccessoryService } from './accessory.service'
import { ConfigService } from '@nestjs/config'
import { AppConfigService } from '@/modules/config/config.service'

@Module({
  imports: [],
  controllers: [],
  providers: [AccessoryService, AppConfigService, ConfigService],
  exports: [AccessoryService, AppConfigService, ConfigService],
})
export class AccessoryModule {}
