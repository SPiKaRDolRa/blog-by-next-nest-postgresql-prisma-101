// หน้าแรก: แสดงลิสต์บทความแบบ SSR โดยเรียก API จาก NestJS
import Link from 'next/link';
import { apiGet } from './lib/api';
import AuthorAreaButton from './components/AuthorAreaButton';

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
    <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">บทความล่าสุด</h1>
        <AuthorAreaButton />
      </div>
      <div className="divide-y divide-gray-200">
        {posts.map((p) => (
          <article key={p.id} className="py-6">
            <Link href={`/posts/${p.slug}`} className="text-2xl font-semibold hover:underline">
              {p.title}
            </Link>
            {p.excerpt ? <p className="text-base text-gray-600 mt-1 max-w-2xl">{p.excerpt}</p> : null}
          </article>
        ))}
      </div>
    </main>
  );
}
