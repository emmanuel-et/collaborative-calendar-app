"use client";

import React, { useState, useEffect } from "react";
import { Event } from "@/models/Event";
import { useAuth } from "@/hooks/useAuth";
import { GET } from "@/app/api/events/route";
import { NextRequest } from "next/server";

interface UpcomingEventsProps {
  onEventClick?: (event: Event) => void;
  events: Event[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  onEventClick,
  events,
}) => {
  console.log("UpcomingEvents component rendered");
  console.log("Events:", events);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const now = new Date();
  const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const sortedEvents = events.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
  const filteredEvents = sortedEvents.filter((event) => {
    const eventTime = new Date(event.startTime);
    return eventTime >= now && eventTime <= oneDayFromNow;
  });

  const handleEventClick = (event: Event) => {
    if (onEventClick) {
      onEventClick(event);
    }
  };

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div>
        <h4 className="text-xl font-medium mb-2">Upcoming Events</h4>
        {filteredEvents.length > 0 ? (
          <ul className="space-y-2">
            {filteredEvents.map((event) => (
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
        ) : (
          <p className="text-gray-500 text-sm">No upcoming events.</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;
