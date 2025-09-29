import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  // สร้างโพสต์ใหม่
  async create(data: CreatePostDto) {
    return this.prisma.post.create({ data });
  }

  // ดึงรายการโพสต์แบบมีตัวกรองและแบ่งหน้าอย่างง่าย
  async findMany(params: { skip?: number; take?: number; tag?: string; q?: string; status?: string }) {
    const { skip = 0, take = 10, tag, q, status } = params;
    const where: Prisma.PostWhereInput = {
      AND: [
        status ? { status: status as any } : {},
        tag ? { tags: { has: tag } } : {},
        q
          ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { excerpt: { contains: q, mode: 'insensitive' } },
                { content: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {},
      ],
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({ where, skip, take, orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }] }),
      this.prisma.post.count({ where }),
    ]);
    return { items, total };
  }

  // ดึงโพสต์ด้วย slug (สำหรับหน้า public)
  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({ where: { slug } });
    if (!post) throw new NotFoundException('ไม่พบบทความ');
    return post;
  }

  // ดึงโพสต์ด้วย id (ใช้ในหน้า admin)
  async findById(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('ไม่พบบทความ');
    return post;
  }

  // อัปเดตโพสต์
  async update(id: string, data: UpdatePostDto) {
    try {
      return await this.prisma.post.update({ where: { id }, data });
    } catch (e) {
      throw new NotFoundException('ไม่พบบทความที่ต้องการอัปเดต');
    }
  }

  // ลบโพสต์
  async remove(id: string) {
    try {
      await this.prisma.post.delete({ where: { id } });
      return { success: true };
    } catch (e) {
      throw new NotFoundException('ไม่พบบทความที่ต้องการลบ');
    }
  }
}


