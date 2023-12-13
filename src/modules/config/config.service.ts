import { Injectable } from '@nestjs/common'
import { ConfigService as NestConfigService } from '@nestjs/config'

@Injectable()
export class AppConfigService {
  constructor(private configService: NestConfigService) {}

  getJwtSignature(): string {
    return this.configService.get('JWT_SIGNATURE')
  }

  getSessionSecret(): string {
    return this.configService.get('SESSION_SECRET')
  }

  getSessionMaxAge(): number {
    return this.configService.get('SESSION_MAX_AGE')
  }

  getAccessTokenMinutes(): number {
    return this.configService.get('ACCESS_TOKEN_MINUTES')
  }

  getRefreshTokenDays(): number {
    return this.configService.get('REFRESH_TOKEN_DAYS')
  }

  getSaltLength(): number {
    return this.configService.get('JWT_SALT_LENGTH')
  }
}
