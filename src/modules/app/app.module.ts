import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PostService } from '../rest/post/post.service'

import { CoreModule } from '@/modules/core/core.module'
import { PrismaModule } from '@/modules/prisma/prisma.module'

import { UserModule } from '@/modules/rest/user/user.module'
import { PostModule } from '@/modules/rest/post/post.module'

@Module({
  imports: [CoreModule, PrismaModule, UserModule, PostModule],
  controllers: [AppController],
  providers: [AppService, PostService],
})
export class AppModule {}
