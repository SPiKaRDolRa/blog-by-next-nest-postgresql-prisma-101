// API สำหรับสั่ง revalidate แบบ on-demand — ใช้ร่วมกับ tag ของหน้า Home และ path รายบทความ
import { NextRequest } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  const { slug, tag } = await req.json();
  if (tag) revalidateTag(tag);
  if (slug) revalidatePath(`/posts/${slug}`);
  return Response.json({ revalidated: true });
}


