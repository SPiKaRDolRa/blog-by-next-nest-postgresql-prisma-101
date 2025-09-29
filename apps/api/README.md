# API (NestJS + Prisma)

บริการ API สำหรับ Mini Blog โครงสร้างแบบโมดูล ชัดเจน อ่านง่าย พร้อม Prisma ORM และสคริปต์ seed

## โครงสร้าง
```
src/
├─ posts/                    # โมดูลบทความ (controller/service/dto)
│  ├─ posts.controller.ts
│  ├─ posts.service.ts
│  └─ dto/
├─ prisma/                   # Prisma service เป็น Global module
│  ├─ prisma.module.ts
│  └─ prisma.service.ts
├─ app.module.ts
└─ main.ts                   # bootstrap, ValidationPipe, CORS

prisma/
├─ schema.prisma             # โมเดล Post + enum PostStatus
└─ migrations/               # ไฟล์ migration
```

## โมเดลข้อมูล (ย่อ)
- `Post { id, title, slug(unique), excerpt?, content, tags[], status, publishedAt?, createdAt, updatedAt }`
- ดัชนี: `publishedAt`, `status` เพื่อการคัดกรอง/เรียงลำดับที่เร็วขึ้น

## Endpoint หลัก
- GET `/posts` — ตัวกรอง: `status`, `tag`, `q`, แบ่งหน้า: `skip`, `take`
- GET `/posts/:slug` — รายละเอียดสำหรับหน้า public (ISR ฝั่งเว็บ)
- GET `/posts/id/:id` — ใช้ในหน้าแก้ไข (admin)
- POST `/posts` — สร้างบทความ
- PATCH `/posts/:id` — แก้ไขบทความ
- DELETE `/posts/:id` — ลบบทความ

หมายเหตุ: ในโปรดักชันควรเพิ่ม Guard/Interceptors/Rate limit ตามมาตรฐานความปลอดภัย

## การรัน (Dev)
```bash
pnpm install
pnpm prisma:migrate
pnpm prisma:seed
pnpm start:dev  # http://localhost:4000
```

## ตัวแปรแวดล้อมสำคัญ
- `DATABASE_URL` — URL ของ PostgreSQL
- `PORT` — พอร์ตของ API (ดีฟอลต์ 4000)
- `CORS_ORIGINS` — รายการโดเมนที่อนุญาต (คั่นด้วย comma). ถ้าไม่ตั้ง จะอนุญาตทั้งหมด (สะดวกสำหรับเดโม)

## ดีพลอย
- Render: Root `apps/api`, Build `pnpm -C apps/api build`, Start `pnpm -C apps/api start:prod`
- มี `Dockerfile` สำหรับ build เป็นอิมเมจโดยตรง
