"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { auth } from '@/utils/firebase/initializeApp';
import { useAuth } from '@/hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The useAuth hook will handle setting the token and redirecting
    } catch (err) {
      setError((err as Error).message || 'An error occurred during login.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-purple-800">
      <Link href="/" className="absolute top-4 left-4 text-purple-600 hover:underline">
        Back
      </Link>
      <h1 className="text-3xl font-semibold mb-6">Login</h1>
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <Button variant="outline" disabled={!email || !password} className="w-full bg-purple-600 text-white hover:bg-purple-700">
          Login
        </Button>
      </form>
      <p className="mt-4 text-sm">
        Don't have an account? <Link href="/signup" className="text-purple-600 hover:underline">Sign up here</Link>.
      </p>
    </div>
  );
};

export default LoginPage;


