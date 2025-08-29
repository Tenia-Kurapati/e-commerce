// frontend/src/app/page.jsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Login from '@/components/auth/Login';
import Logo from '@/components/Logo';

export default function GatekeeperPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard/Home');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  return (
    // 1. Set this container to 'relative' to act as the positioning parent.
    // The flex properties will center the <Login /> component.
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 p-4">

      {/* 2. Position the Logo absolutely within the parent div. */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2">
        <Logo />
      </div>

      {/* 3. The Login component remains the only item in the flex flow, so it stays centered. */}
      <Login />
    </div>
  );
}