# Mini Blog (Next.js + NestJS + Prisma + PostgreSQL)

โปรเจกต์สาธิตฟีเจอร์บล็อกครบ CRUD สำหรับ Portfolio สาย Full‑Stack — โชว์ Next.js SSR/ISR, NestJS API, Prisma/PostgreSQL, SEO, และ CI พร้อมใช้งาน

## เดโม่ภายในเครื่อง

- Web: <http://localhost:3000>
- API: <http://localhost:4000>

## วิธีเริ่มต้น (dev)

1) สตาร์ทฐานข้อมูล

```bash
docker compose up -d db
```

2) ติดตั้งแพ็กเกจและรัน Prisma

```bash
pnpm install
pnpm -C apps/api prisma:migrate
pnpm -C apps/api prisma:seed
```

3) รันเว็บและ API

```bash
pnpm -C apps/api start:dev
pnpm -C apps/web dev
```

## ฟีเจอร์หลัก

- เพิ่ม/แก้ไข/ลบบทความ (admin) และอ่านบทความ (public)
- SSR รายการ, ISR รายบทความ + on‑demand revalidation
- DTO validation, error handling, Prisma schema ชัดเจน
- SEO: meta, OG, JSON‑LD, sitemap, robots
- CI: GitHub Actions (lint/build/test ขั้นพื้นฐาน)

## โครงสร้างสำคัญ

- apps/web: Next.js App Router
- apps/api: NestJS + Prisma client
- apps/api/prisma/schema.prisma: โมเดล `Post`

## สคริปต์ทดสอบโหลด

- autocannon (เร็ว ใช้ง่าย)

```bash
npx autocannon -c 30 -d 20 http://localhost:4000/posts
```

- k6 (ไฟล์ `k6.js`)

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
export const options = { vus: 30, duration: '20s' };
export default function () {
  const res = http.get('http://localhost:4000/posts');
  check(res, { 'status 200': r => r.status === 200 });
  sleep(1);
}
```

รัน: `k6 run k6.js`

## หมายเหตุ

- ค่าเริ่มต้น API/WEB base อยู่ในโค้ดและ .env (แก้ไขได้ตามสภาพแวดล้อม)
- โปรดเพิ่ม auth guard หากจะเปิดใช้งานในโปรดักชัน
