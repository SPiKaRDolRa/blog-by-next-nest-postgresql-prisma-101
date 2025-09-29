'use client';
// หน้าเข้าสู่ระบบ (admin) — เก็บ token ใน localStorage แบบง่ายสำหรับเดโม
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Passw0rd!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('เข้าสู่ระบบไม่สำเร็จ');
      const data = await res.json();
      localStorage.setItem('token', data.accessToken);
      router.push('/admin/posts/new');
    } catch (err: any) {
      setError(err?.message ?? 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-sm mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">เข้าสู่ระบบผู้ดูแล</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="อีเมล" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="w-full border p-2 rounded" placeholder="รหัสผ่าน" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error ? <p className="text-red-600 text-sm">{error}</p> : null}
        <button disabled={loading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">{loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}</button>
      </form>
    </main>
  );
}


