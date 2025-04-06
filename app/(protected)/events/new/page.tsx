"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import EventForm from '@/components/EventForm';
import { EventInput } from '@/models/Event';
import Link from 'next/link';

export default function NewEventPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (eventData: EventInput) => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }

      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-purple-800">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-purple-50 text-purple-800">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Create New Event</h1>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
          >
            Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded shadow-md">
          <EventForm onSubmit={handleSubmit} />
          
          {isSubmitting && (
            <div className="mt-4 text-center text-purple-600">
              Creating event...
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 