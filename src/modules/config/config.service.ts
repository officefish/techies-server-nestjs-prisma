import { Injectable } from '@nestjs/common'
import { ConfigService as NestConfigService } from '@nestjs/config'

@Injectable()
export class AppConfigService {
  constructor(private configService: NestConfigService) {}

  getSessionSecret(): string {
    return this.configService.get('SESSION_SECRET')
  }
}
