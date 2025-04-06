"use client";

import React from 'react';
import withAuth from '../../utils/withAuth';

function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-purple-800">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
    </div>
  );
}

export default withAuth(Dashboard);