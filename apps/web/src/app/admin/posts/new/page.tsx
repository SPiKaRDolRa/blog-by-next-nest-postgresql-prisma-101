// หน้าเพิ่มบทความใหม่ — ฟอร์มอย่างง่ายพร้อมคอมเมนต์ภาษาไทย
'use client';
import { useEffect, useState } from 'react';
import { apiJson, isLoggedIn } from '@/app/lib/api';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ถ้าไม่ได้ล็อกอิน ให้พาไปหน้าเข้าสู่ระบบ
  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/admin/login');
    }
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      // บังคับต้องล็อกอินก่อน
      if (!isLoggedIn()) {
        setError('โปรดเข้าสู่ระบบก่อนเขียนบทความ');
        setSaving(false);
        return;
      }
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
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-5">
      <h1 className="text-2xl font-semibold tracking-tight">เขียนบทความใหม่</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="หัวข้อ" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="w-full border border-gray-300 p-3 rounded" placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <input className="w-full border border-gray-300 p-3 rounded" placeholder="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        <textarea className="w-full border border-gray-300 p-3 rounded h-64" placeholder="เนื้อหา" value={content} onChange={(e) => setContent(e.target.value)} />
        {error ? <p className="text-red-600 text-sm">{error}</p> : null}
        <div className="flex gap-2">
          <button disabled={saving} className="bg-[#1a8917] text-white px-5 py-2 rounded disabled:opacity-50">{saving ? 'กำลังบันทึก...' : 'เผยแพร่'}</button>
          <a href="/" className="text-sm underline">ยกเลิก</a>
        </div>
      </form>
    </main>
  );
}


