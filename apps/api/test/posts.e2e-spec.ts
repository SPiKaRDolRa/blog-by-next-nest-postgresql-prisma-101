import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Posts (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    // login ด้วย seed admin
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'Passw0rd!' });
    token = res.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /posts — should return list', async () => {
    const res = await request(app.getHttpServer()).get('/posts').expect(200);
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it('POST /posts — should create with auth', async () => {
    const created = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'บทความทดสอบ e2e',
        slug: 'e2e-post',
        content: 'เนื้อหาทดสอบ',
        status: 'PUBLISHED',
      })
      .expect(201);
    expect(created.body.slug).toBe('e2e-post');
  });
});


