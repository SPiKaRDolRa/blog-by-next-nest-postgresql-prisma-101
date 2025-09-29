import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';

@Module({
  // โมดูลหลักของแอป: โหลดค่าคอนฟิก, Prisma, และ Posts API
  imports: [
    // โหลดตัวแปรแวดล้อมจากไฟล์ .env และระบบ
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
