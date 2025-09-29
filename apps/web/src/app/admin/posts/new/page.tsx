// หน้าเพิ่มบทความใหม่ — ฟอร์มอย่างง่ายพร้อมคอมเมนต์ภาษาไทย
'use client';
import { useState } from 'react';
import { apiJson } from '@/app/lib/api';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await apiJson('/posts', 'POST', { title, slug, excerpt, content, status: 'PUBLISHED' });
      // แจ้งให้ระบบ revalidate หน้า Home (tag) และหน้ารายละเอียดโพสต์
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag: 'posts', slug }),
      });
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? 'เกิดข้อผิดพลาด');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">เพิ่มบทความใหม่</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="หัวข้อ" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        <textarea className="w-full border p-2 rounded h-48" placeholder="เนื้อหา" value={content} onChange={(e) => setContent(e.target.value)} />
        {error ? <p className="text-red-600 text-sm">{error}</p> : null}
        <button disabled={saving} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">{saving ? 'กำลังบันทึก...' : 'บันทึก'}</button>
      </form>
    </main>
  );
}


