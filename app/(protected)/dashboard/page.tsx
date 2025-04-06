"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-purple-800">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-purple-800">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
      <p>Welcome, {user?.email}</p>
    </div>
  );
}

export default Dashboard;