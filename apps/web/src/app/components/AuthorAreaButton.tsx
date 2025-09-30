'use client';
// ปุ่มพื้นที่ผู้เขียน — แสดงเมื่อเข้าสู่ระบบเท่านั้น
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { isLoggedIn } from '@/app/lib/api';

export default function AuthorAreaButton() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  if (!loggedIn) return null;
  return (
    <Link href="/admin/posts" className="text-sm underline">พื้นที่ผู้เขียน</Link>
  );
}


