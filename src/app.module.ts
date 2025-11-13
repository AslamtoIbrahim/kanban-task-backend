import { Module } from '@nestjs/common';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { auth } from './auth/auth.js';
import { UserModule } from './user/user.module.js';
import { TagModule } from './tag/tag.module.js';
import { StatusModule } from './status/status.module.js';
import { TaskModule } from './task/task.module.js';
import { SubtaskModule } from './subtask/subtask.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule.forRoot({ auth }),
    UserModule,
    TagModule,
    StatusModule,
    TaskModule,
    SubtaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
