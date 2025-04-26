"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MultiCalendarView from "@/components/calendar/MultiCalendarView";
import { Calendar } from "@/models/Calendar";
import { Event } from "@/models/Event";
import { useAuth } from "@/hooks/useAuth";
import { CalendarRole } from "@/models/Calendar";
import Link from "next/link";

export default function CalendarDashboardPage() {
  const { user } = useAuth();
  const { id } = useParams(); // Get the calendar ID from the URL
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        // Fetch calendar detailss
        setLoading(true);
        const res = await fetch(`/api/calendar/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch calendar details.");
        }
        const calendarData = await res.json();
        setCalendar(calendarData);

        // Fetch events for the calendar - new
        const eventsRes = await fetch(`/api/events?calendarId=${id}`);
        if (!eventsRes.ok) {
          throw new Error("Failed to fetch events.");
        }
        const rawData = (await eventsRes.json()) as any[];
        const data: Event[] = rawData.map((e: any) => ({
          ...e,
          startTime: new Date(e.startTime),
          endTime: new Date(e.endTime),
          createdAt: new Date(e.createdAt),
          updatedAt: new Date(e.updatedAt),
          calendarId: e.calendarId, // Assuming calendarId is already in the correct format
        }));
        setEvents(data);

        
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [id]);

  const handleUpdateEvent = async (updatedEvent: Event) => {
      setEvents((prev) =>
        prev.map((event) =>
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );
  
      const { _id, ...eventWithoutId } = updatedEvent;
      const response = await fetch(`/api/events/${_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          user: user.uid || "",
        },
        body: JSON.stringify(eventWithoutId),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update event`);
      }
      setSelectedEvent(null);
    };
  
    const handleDeleteEvent = async (eventId: string) => {
      try {
        const response = await fetch(`/api/events/${eventId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            user: user.uid || "",
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete event");
        }
  
        // Update the frontend state to remove the deleted event
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event._id?.toString() !== eventId)
        );
      } catch (error) {
        console.error("Error deleting event:", error);
        throw error; // Re-throw the error so EventDialog can handle it
      }
    };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-purple-800">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-purple-800">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!calendar) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-purple-800">
        <p className="text-gray-500">No calendar found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-purple-50 text-purple-800 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">{calendar.name}</h1>
        {calendar && calendar.members[user.uid] !== CalendarRole.VIEWER && (
          <div className="flex gap-4">
            <Link
              href={`/events/new`}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create Event
            </Link>

            <Link
              href={`/calendar/${id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit Calendar
            </Link>
          </div>
        )}
      </div>
      <div className="mt-6 flex-1 grid">
      <MultiCalendarView
        calendars={[calendar]}
        events={events}
        handleDeleteEvent={handleDeleteEvent}
        handleUpdateEvent={handleUpdateEvent}
/>
      </div>
    </div>
  );
}
