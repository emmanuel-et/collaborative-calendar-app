"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/models/User';
import { Event } from '@/models/Event';
import UpcomingEvents from '@/components/event/UpcomingEvents';
import Link from 'next/link';

function Dashboard() {
  const { user, loading } = useAuth();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.uid) return;
      
      try {
        const response = await fetch(`/api/users?uid=${user.uid}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        const data = await response.json();
        setUserProfile(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoadingProfile(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-purple-800">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-purple-50 text-purple-800">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Section */}
        <div className="md:col-span-1">
          {error ? (
            <p className="text-red-500 mb-4">{error}</p>
          ) : (
            <div className="bg-white p-6 rounded shadow-md">
              <h2 className="text-xl font-medium mb-4">User Profile</h2>
              <div className="mb-2">
                <span className="font-medium">Name:</span> {userProfile?.name || 'Not set'}
              </div>
              <div className="mb-2">
                <span className="font-medium">Email:</span> {userProfile?.email || user?.email}
              </div>
              <div className="mb-2">
                <span className="font-medium">Account Created:</span> {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
          )}
        </div>
        
        {/* Calendar Section */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Calendar</h2>
            <Link
              href="/events/new"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Add Event
            </Link>
          </div>
          
          <UpcomingEvents onEventClick={handleEventClick} />
          
          {/* Event Details */}
          {selectedEvent && (
            <div className="mt-6 bg-white p-6 rounded shadow-md">
              <h2 className="text-xl font-medium mb-4">Event Details</h2>
              <div className="mb-2">
                <span className="font-medium">Title:</span> {selectedEvent.title}
              </div>
              {selectedEvent.description && (
                <div className="mb-2">
                  <span className="font-medium">Description:</span> {selectedEvent.description}
                </div>
              )}
              <div className="mb-2">
                <span className="font-medium">Start:</span> {new Date(selectedEvent.startTime).toLocaleString()}
              </div>
              <div className="mb-2">
                <span className="font-medium">End:</span> {new Date(selectedEvent.endTime).toLocaleString()}
              </div>
              {selectedEvent.location && (
                <div className="mb-2">
                  <span className="font-medium">Location:</span> {selectedEvent.location}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;