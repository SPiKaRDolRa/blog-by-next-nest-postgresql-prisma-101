import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  // สร้างบทความใหม่ (ในโปรดักชันควรมี guard ป้องกันสิทธิ์)
  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() dto: CreatePostDto) {
    return this.posts.create(dto);
  }

  // อ่านรายการบทความ พร้อมตัวกรองพื้นฐาน (tag, q) และแบ่งหน้า (skip/take)
  @Get()
  list(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('tag') tag?: string,
    @Query('q') q?: string,
    @Query('status') status?: string,
  ) {
    return this.posts.findMany({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      tag,
      q,
      status,
    });
  }

  // อ่านบทความเดี่ยวด้วย slug (ใช้ในหน้า ISR)
  @Get(':slug')
  detail(@Param('slug') slug: string) {
    return this.posts.findBySlug(slug);
  }

  // อ่านบทความเดี่ยวด้วย id (ใช้ในหน้า admin)
  @Get('id/:id')
  detailById(@Param('id') id: string) {
    return this.posts.findById(id);
  }

  // แก้ไขบทความ
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.posts.update(id, dto);
  }

  // ลบบทความ
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.posts.remove(id);
  }
}


