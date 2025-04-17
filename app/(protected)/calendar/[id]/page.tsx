"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MultiCalendarView from "@/components/calendar/MultiCalendarView";
import { Calendar } from "@/models/Calendar";
import { useAuth } from "@/hooks/useAuth";
import { CalendarRole } from "@/models/Calendar";
import Link from "next/link";

export default function CalendarDashboardPage() {
  const { user } = useAuth();
  const { id } = useParams(); // Get the calendar ID from the URL
  const router = useRouter();
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/calendar/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch calendar details.");
        }
        const calendarData = await res.json();
        setCalendar(calendarData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [id]);

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
        <MultiCalendarView calendars={[calendar]} />
      </div>
    </div>
  );
}
