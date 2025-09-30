// รายการบทความในพื้นที่ผู้เขียน — ต้องล็อกอิน (client redirect) และเรียก API admin
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet, apiJson, isLoggedIn } from '@/app/lib/api';

type Post = { id: string; title: string; slug: string; status: string };

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.replace('/admin/login');
      return;
    }
    (async () => {
      try {
        const res = await apiGet<{ items: Post[]; total: number }>(`/posts/admin`);
        setPosts(res.items);
      } catch (e: any) {
        setError(e?.message ?? 'โหลดข้อมูลไม่สำเร็จ');
      }
    })();
  }, []);

  async function onDelete(id: string) {
    if (!confirm('ยืนยันการลบบทความนี้?')) return;
    try {
      await apiJson(`/posts/${id}`, 'DELETE');
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      alert(e?.message ?? 'ลบไม่สำเร็จ');
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">บทความของฉัน</h1>
        <Link href="/admin/posts/new" className="bg-black text-white px-3 py-1.5 rounded">เขียนบทความ</Link>
      </div>
      {error ? <p className="text-red-600 text-sm mb-4">{error}</p> : null}
      <div className="divide-y">
        {posts.map((p) => (
          <div key={p.id} className="py-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-xs text-gray-500">{p.status}</div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link href={`/posts/${p.slug}`} className="hover:underline">ดู</Link>
              <Link href={`/admin/posts/id/${p.id}`} className="hover:underline">แก้ไข</Link>
              <button onClick={() => onDelete(p.id)} className="text-red-600 hover:underline">ลบ</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}


