# Web (Next.js App Router)

ส่วนติดต่อผู้ใช้ของ Mini Blog รองรับ SSR/ISR และ SEO พร้อมพื้นที่ผู้เขียนสำหรับจัดการบทความ

## โครงสร้าง

```
src/app/
├─ page.tsx                       # Home — SSR, tag 'posts'
├─ posts/[slug]/page.tsx          # รายละเอียดบทความ (ISR + JSON‑LD)
├─ admin/login/page.tsx           # หน้าเข้าสู่ระบบ (JWT)
├─ admin/posts/page.tsx           # พื้นที่ผู้เขียน: ลิสต์/ลิงก์แก้ไข/ลบ
├─ admin/posts/new/page.tsx       # เพิ่มบทความใหม่ (client)
├─ admin/posts/[id]/page.tsx      # แก้ไข/ลบ (client)
├─ api/revalidate/route.ts        # on‑demand revalidate (tag/path)
├─ sitemap.xml/route.ts           # sitemap เบื้องต้น
├─ robots.txt/route.ts            # robots.txt
└─ lib/api.ts                     # helper เรียก API + auth header
```

## พฤติกรรมสำคัญ

- ผู้ที่ไม่ได้เข้าสู่ระบบ: อ่านบทความ, หน้า Home/Detail โหลดเร็วด้วย SSR/ISR
- ผู้เขียน (ล็อกอินแล้ว): เขียน/แก้ไข/ลบ, มี redirect ไปหน้า login หากเข้าหน้า admin โดยไม่ล็อกอิน
- Revalidate: เรียก `/api/revalidate` หลัง CRUD เพื่ออัปเดต cache ของ Home/Detail

## ตัวแปรแวดล้อม

- `NEXT_PUBLIC_API_BASE` — URL ของ API
- `NEXT_PUBLIC_SITE_BASE` — base URL ของเว็บ (สำหรับ JSON‑LD/sitemap)

## การรัน (Dev)

```bash
pnpm install
pnpm dev  # http://localhost:3000
```
