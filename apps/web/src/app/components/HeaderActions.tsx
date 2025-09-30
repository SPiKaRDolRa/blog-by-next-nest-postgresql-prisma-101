'use client';
// ส่วนปุ่มบนแถบหัวเว็บ แสดงผลตามสถานะล็อกอิน
import { useEffect, useState } from 'react';
import { isLoggedIn } from '@/app/lib/api';

export default function HeaderActions() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  function logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      {!loggedIn ? (
        <a href="/admin/login" className="hover:underline">เข้าสู่ระบบ</a>
      ) : (
        <button onClick={logout} className="hover:underline">ออกจากระบบ</button>
      )}
      {loggedIn ? (
        <a href="/admin/posts/new" className="bg-black text-white px-3 py-1.5 rounded">เขียนบทความ</a>
      ) : null}
    </div>
  );
}


