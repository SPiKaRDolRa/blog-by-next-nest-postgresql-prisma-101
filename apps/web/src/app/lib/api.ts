// ไลบรารีเรียก API จากฝั่ง Next.js — คอมเมนต์ภาษาไทย
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000';

export async function apiGet<T>(path: string, init?: RequestInit & { next?: { revalidate?: number; tags?: string[] } }): Promise<T> {
  // รองรับการกำหนด revalidate และ tags สำหรับ ISR/Tag revalidation
  const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: 60, ...(init?.next ?? {}) }, ...init });
  if (!res.ok) throw new Error(`GET ${path} ล้มเหลว: ${res.status}`);
  return (await res.json()) as T;
}

export async function apiJson<T>(path: string, method: 'POST' | 'PATCH' | 'DELETE', body?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path} ล้มเหลว: ${res.status}`);
  return (await res.json()) as T;
}
