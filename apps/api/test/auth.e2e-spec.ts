import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();

  beforeAll(async () => {
    // เตรียมผู้ใช้ทดสอบ (upsert)
    const passwordHash = await bcrypt.hash('Passw0rd!', 10);
    await prisma.user.upsert({
      where: { email: 'admin-e2e@example.com' },
      create: {
        email: 'admin-e2e@example.com',
        passwordHash,
        name: 'E2E Admin',
        role: Role.ADMIN,
      },
      update: { passwordHash, role: Role.ADMIN },
    });

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('POST /auth/login — ควรคืน accessToken', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin-e2e@example.com', password: 'Passw0rd!' })
      .expect((r) => [200, 201].includes(r.status));
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe('admin-e2e@example.com');
  });
});


