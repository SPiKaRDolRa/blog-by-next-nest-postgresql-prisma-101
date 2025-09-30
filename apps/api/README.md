# API (NestJS + Prisma)

บริการ API สำหรับ Mini Blog โครงสร้างแบบโมดูล ชัดเจน พร้อม Prisma ORM และสคริปต์ seed

## โครงสร้าง

```
src/
├─ auth/                     # JWT auth (controller/service/strategy)
├─ posts/                    # โมดูลบทความ (controller/service/dto)
├─ prisma/                   # Prisma service (Global)
├─ common/logging.interceptor.ts
├─ app.module.ts
└─ main.ts                   # bootstrap, ValidationPipe, CORS, Interceptor

prisma/
├─ schema.prisma             # User/Post/enum ต่าง ๆ
└─ migrations/               # migration files
```

## ข้อมูลและสิทธิ์

- `User { id, email, passwordHash, name, role }`
- `Post { id, title, slug, excerpt?, content, tags[], status, publishedAt?, authorId? }`
- อ่าน (GET) เป็น public, แก้ไข (POST/PATCH/DELETE) ต้อง JWT

## Endpoints หลัก

- GET `/posts` — ตัวกรอง: `status`, `tag`, `q` และ `skip/take`
- GET `/posts/:slug`
- GET `/posts/id/:id`
- GET `/posts/admin` (ต้อง JWT)
- POST `/posts` (ต้อง JWT)
- PATCH `/posts/:id` (ต้อง JWT)
- DELETE `/posts/:id` (ต้อง JWT)
- POST `/auth/login` — รับ `{ email, password }` คืน `accessToken`

## การรัน (Dev)

```bash
pnpm install
pnpm prisma:migrate
pnpm prisma:seed
pnpm start:dev  # http://localhost:4000
```

## ตัวแปรแวดล้อม

- `DATABASE_URL` — เชื่อมต่อ PostgreSQL
- `PORT` — พอร์ตของ API (ดีฟอลต์ 4000)
- `CORS_ORIGINS` — รายการ origin ที่อนุญาต (คั่นด้วย comma)
- `JWT_SECRET` — คีย์สำหรับลงนาม JWT
