"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-purple-800">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <aside className="w-1/5 bg-purple-100 p-4">
          <Link
            href="/dashboard"
            className="block mb-4 text-purple-800 font-medium hover:underline"
          >
            Dashboard
          </Link>
          <button
            onClick={signOut}
            className="text-purple-800 font-medium hover:underline cursor-pointer"
          >
            Sign Out
          </button>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
