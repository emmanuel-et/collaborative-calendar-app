"use client";

import React from 'react';
import Link from 'next/link';
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from '@/utils/firebase/initializeApp';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

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
            onClick={handleSignOut}
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
