import { Module } from '@nestjs/common'
import { ConfigModule as NestConficModule } from '@nestjs/config'
import { AppConfigService } from './config.service'
import { validate } from './env.validation'
@Module({
  imports: [NestConficModule.forRoot({ validate })],
  controllers: [],
  providers: [AppConfigService],
})
export class AppConfigModule {}
