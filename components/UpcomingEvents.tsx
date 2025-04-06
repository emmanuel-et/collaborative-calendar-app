"use client";

import React, { useState, useEffect } from 'react';
import { Event } from '@/models/Event';
import { useAuth } from '@/hooks/useAuth';
import { GET } from '@/app/api/events/route';
import { NextRequest } from 'next/server';

interface UpcomingEventsProps {
  onEventClick?: (event: Event) => void;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ onEventClick }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/events?userId=${user.uid}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  const handleEventClick = (event: Event) => {
    if (onEventClick) {
      onEventClick(event);
    }
  };

  
  if (loading) {
    return <div className="p-4 text-center">Loading calendar...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {events.length > 0 && (
        <div>
          <h4 className="text-xl font-medium mb-2">Upcoming Events</h4>
          <ul className="space-y-2">
            {events.map(event => (
              <li 
                key={event._id?.toString()} 
                className="p-2 rounded hover:bg-purple-50 cursor-pointer"
                onClick={() => handleEventClick(event)}
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-sm text-gray-600">
                  {new Date(event.startTime).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents; 