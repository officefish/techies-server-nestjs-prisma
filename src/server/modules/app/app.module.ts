import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

import { AppConfigModule } from '@modules/config/config.module'

import { CoreModule } from '@modules/core/core.module'
import { PrismaModule } from '@modules/prisma/prisma.module'
import { CryptoModule } from '@modules/crypto/crypto.module'
import { AccessoryModule } from '@modules/accessory/accessory.module'

import { AuthModule } from '@modules/rest/auth/auth.module'
import { UserModule } from '@modules/rest/user/user.module'
import { PostModule } from '@modules/rest/post/post.module'

//import Next from 'next'
//import { RenderModule } from 'nest-next'

@Module({
  imports: [
    CoreModule,
    PrismaModule,
    AppConfigModule,
    CryptoModule,
    AccessoryModule,
    UserModule,
    AuthModule,
    PostModule,
    // RenderModule.forRootAsync(
    //   Next(
    //     Object.assign({}, { dev: process.env.NODE_ENV !== 'production' }, {}),
    //   ),
    // ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
