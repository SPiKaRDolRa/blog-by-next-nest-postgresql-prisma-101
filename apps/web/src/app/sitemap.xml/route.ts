// สร้าง sitemap อย่างง่าย — ในโปรดักชันควรดึง slug จาก API เพื่อรวมทุกบทความ
import { NextRequest } from 'next/server';

export async function GET(_req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_SITE_BASE || 'http://localhost:3000';
  const urls = ['/', '/admin/posts/new'];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `<url><loc>${base}${u}</loc></url>`) 
    .join('\n')}\n</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}


