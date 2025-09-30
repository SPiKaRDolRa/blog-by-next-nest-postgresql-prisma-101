// หน้าแสดงรายละเอียดบทความ — ใช้ ISR ด้วย revalidate 300 วินาที
import { apiGet } from '@/app/lib/api';
import type { Metadata } from 'next';

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
};

type PageProps = { params: { slug: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await apiGet<Post>(`/posts/${params.slug}`);
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: { title: post.title, description: post.excerpt ?? undefined },
  };
}

export const revalidate = 300; // ISR 5 นาที

export default async function PostPage({ params }: PageProps) {
  const post = await apiGet<Post>(`/posts/${params.slug}`);
  return (
    <article className="prose max-w-3xl mx-auto px-6 py-10">
      <script
        type="application/ld+json"
        // JSON-LD สำหรับบทความ (SEO)
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt ?? undefined,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${process.env.NEXT_PUBLIC_SITE_BASE || 'http://localhost:3000'}/posts/${post.slug}`,
            },
          }),
        }}
      />
      <h1 className="mb-2 text-3xl font-bold tracking-tight">{post.title}</h1>
      {post.excerpt ? <p className="text-gray-600 text-base">{post.excerpt}</p> : null}
      <div className="mt-8 whitespace-pre-wrap text-[1.05rem] leading-8">{post.content}</div>
      <div className="mt-10 text-sm text-gray-500">
        <a href={`/admin/posts/${post.id}`} className="hover:underline">แก้ไขบทความนี้</a>
      </div>
    </article>
  );
}


