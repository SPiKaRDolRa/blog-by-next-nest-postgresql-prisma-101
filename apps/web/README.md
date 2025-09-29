# Web (Next.js App Router)

ส่วนติดต่อผู้ใช้ของ Mini Blog สร้างด้วย Next.js (App Router) รองรับ SSR/ISR และ SEO พร้อมหน้าแอดมินสำหรับเพิ่ม/แก้ไข/ลบบทความ

## โครงสร้าง
```
src/app/
├─ page.tsx                       # หน้า Home — SSR, ติด tag 'posts'
├─ posts/[slug]/page.tsx          # หน้าโพสต์ (ISR) + JSON‑LD
├─ admin/posts/new/page.tsx       # เพิ่มบทความ
├─ admin/posts/[id]/page.tsx      # แก้ไข/ลบ
├─ api/revalidate/route.ts        # API สำหรับ revalidate tag/path
├─ sitemap.xml/route.ts           # sitemap เบื้องต้น
├─ robots.txt/route.ts            # robots.txt
└─ lib/api.ts                     # helper เรียก API
```

## การทำงานหลัก
- Home ดึงรายการผ่าน SSR และติดแท็ก cache `posts` → เมื่อ CRUD จะเรียก `/api/revalidate` เพื่อรีเฟรชหน้า
- หน้าโพสต์ใช้ ISR (`export const revalidate = 300`) และฝัง JSON‑LD เพื่อ SEO
- หน้าแอดมินเรียก API โดยตรง และแจ้ง revalidate หลัง create/update/delete

## ตัวแปรแวดล้อม
- `NEXT_PUBLIC_API_BASE` — URL ของ API ที่จะเรียก (เช่น Render)
- `NEXT_PUBLIC_SITE_BASE` — URL เว็บสำหรับสร้างลิงก์ใน JSON‑LD/sitemap

## การรัน (Dev)
```bash
pnpm install
pnpm dev  # http://localhost:3000
```

## ดีพลอย (Vercel)
- Root โปรเจกต์: `apps/web`
- ตั้ง Env: `NEXT_PUBLIC_API_BASE`, `NEXT_PUBLIC_SITE_BASE`
- กำหนดโดเมนเว็บใน `CORS_ORIGINS` ของฝั่ง API เพื่ออนุญาตข้ามโดเมน
