// สคริปต์ seed ข้อมูลตัวอย่าง — คอมเมนต์ภาษาไทยทั้งหมด
import { PrismaClient, PostStatus, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  // ลบข้อมูลเดิม (เพื่อให้ seed ใหม่ได้สะอาด)
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // สร้างผู้ใช้แอดมินพร้อมรหัสผ่านแฮช
  const passwordHash = await bcrypt.hash('Passw0rd!', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash,
      name: 'Administrator',
      role: Role.ADMIN,
    },
  });
  const now = new Date();
  const posts = Array.from({ length: 8 }).map((_, i) => ({
    title: `บทความที่ ${i + 1}`,
    slug: `post-${i + 1}`,
    excerpt: `สรุปเนื้อหาของบทความที่ ${i + 1}`,
    content: `นี่คือเนื้อหาตัวอย่างสำหรับบทความที่ ${i + 1} เพื่อทดสอบการแสดงผลและการทำงานของระบบ`,
    tags: i % 2 === 0 ? ['nextjs', 'nestjs'] : ['prisma', 'postgresql'],
    status: PostStatus.PUBLISHED,
    publishedAt: now,
    authorId: admin.id,
  }));
  await prisma.post.createMany({ data: posts });
  console.log('✔ ใส่ข้อมูลตัวอย่างเรียบร้อย (admin: admin@example.com / Passw0rd!)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


