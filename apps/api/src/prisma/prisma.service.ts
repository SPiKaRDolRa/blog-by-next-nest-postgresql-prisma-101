// บริการ Prisma — เชื่อมต่อฐานข้อมูล PostgreSQL
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  // ปิดการเชื่อมต่อฐานข้อมูลเมื่อโมดูลถูกทำลาย
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}


