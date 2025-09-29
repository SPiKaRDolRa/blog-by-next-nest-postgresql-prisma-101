// สคริปต์ seed ข้อมูลตัวอย่าง — คอมเมนต์ภาษาไทยทั้งหมด
import { PrismaClient, PostStatus } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.post.deleteMany();
  const now = new Date();
  const posts = Array.from({ length: 8 }).map((_, i) => ({
    title: `บทความที่ ${i + 1}`,
    slug: `post-${i + 1}`,
    excerpt: `สรุปเนื้อหาของบทความที่ ${i + 1}`,
    content: `นี่คือเนื้อหาตัวอย่างสำหรับบทความที่ ${i + 1} เพื่อทดสอบการแสดงผลและการทำงานของระบบ`,
    tags: i % 2 === 0 ? ['nextjs', 'nestjs'] : ['prisma', 'postgresql'],
    status: PostStatus.PUBLISHED,
    publishedAt: now,
  }));
  await prisma.post.createMany({ data: posts });
  console.log('✔ ใส่ข้อมูลตัวอย่างเรียบร้อย');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


