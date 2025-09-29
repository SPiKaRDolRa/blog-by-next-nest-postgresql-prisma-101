import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

@Module({
  // โมดูลโพสต์ รวม service และ controller
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}


