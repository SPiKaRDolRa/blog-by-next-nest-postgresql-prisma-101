// หน้าแก้ไข/ลบบทความ — คอมเมนต์ภาษาไทยทั้งหมด
'use client';
import { useEffect, useState } from 'react';
import { apiGet, apiJson } from '@/app/lib/api';
import { useRouter, useParams } from 'next/navigation';

type Post = { id: string; title: string; slug: string; excerpt?: string | null; content: string };

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id);
  const [post, setPost] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet<Post>(`/posts/id/${id}`);
        setPost(data);
      } catch (e: any) {
        setError(e?.message ?? 'โหลดข้อมูลไม่สำเร็จ');
      }
    })();
  }, [id]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!post) return;
    setSaving(true);
    setError(null);
    try {
      await apiJson(`/posts/${post.id}`, 'PATCH', {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
      });
      // revalidate หน้า Home และหน้ารายละเอียดโพสต์ที่แก้ไข
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag: 'posts', slug: post.slug }),
      });
      router.push(`/posts/${post.slug}`);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? 'บันทึกไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!post) return;
    if (!confirm('ยืนยันการลบ?')) return;
    setSaving(true);
    setError(null);
    try {
      await apiJson(`/posts/${post.id}`, 'DELETE');
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag: 'posts' }),
      });
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? 'ลบไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  }

  if (!post) return <main className="max-w-2xl mx-auto p-6">กำลังโหลด...</main>;

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">แก้ไขบทความ</h1>
      <form onSubmit={onSave} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="หัวข้อ" value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} />
        <input className="w-full border p-2 rounded" placeholder="slug" value={post.slug} onChange={(e) => setPost({ ...post, slug: e.target.value })} />
        <input className="w-full border p-2 rounded" placeholder="excerpt" value={post.excerpt ?? ''} onChange={(e) => setPost({ ...post, excerpt: e.target.value })} />
        <textarea className="w-full border p-2 rounded h-48" placeholder="เนื้อหา" value={post.content} onChange={(e) => setPost({ ...post, content: e.target.value })} />
        {error ? <p className="text-red-600 text-sm">{error}</p> : null}
        <div className="flex gap-2">
          <button disabled={saving} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">{saving ? 'กำลังบันทึก...' : 'บันทึก'}</button>
          <button type="button" onClick={onDelete} className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50">ลบ</button>
        </div>
      </form>
    </main>
  );
}


