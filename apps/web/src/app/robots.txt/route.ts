// robots.txt อย่างง่าย
import { NextRequest } from 'next/server';

export async function GET(_req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_SITE_BASE || 'http://localhost:3000';
  const body = `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}


