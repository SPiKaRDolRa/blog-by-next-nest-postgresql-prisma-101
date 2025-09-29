// หน้าแรก: แสดงลิสต์บทความแบบ SSR โดยเรียก API จาก NestJS
import Link from 'next/link';
import { apiGet } from './lib/api';

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt?: string | null;
};

async function fetchPosts() {
  const res = await apiGet<{ items: Post[]; total: number }>(`/posts?status=PUBLISHED&take=20`, { next: { tags: ['posts'] } });
  return res.items;
}

export default async function Home() {
  const posts = await fetchPosts();
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">บทความล่าสุด</h1>
        <Link href="/admin/posts/new" className="text-sm underline">+ เพิ่มบทความ</Link>
      </div>
      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.id} className="border p-4 rounded-md hover:bg-gray-50">
            <Link href={`/posts/${p.slug}`} className="text-lg font-medium">
              {p.title}
            </Link>
            {p.excerpt ? <p className="text-sm text-gray-600 mt-1">{p.excerpt}</p> : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
