"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, CalendarRole } from "@/models/Calendar";
import { useRouter } from "next/navigation";
import { CalendarScrollArea } from "@/components/calendar/CalendarScrollArea";
import Link from "next/link";

export default function CalendarPage() {
  const { user, loading } = useAuth();

  const [calendars, setCalendars] = useState<Record<CalendarRole, Calendar[]>>({
    [CalendarRole.OWNER]: [],
    [CalendarRole.EDITOR]: [],
    [CalendarRole.VIEWER]: [],
  } as Record<CalendarRole, Calendar[]>);
  const [loadingPage, setLoadingPage] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // const onSelectCalendar = (calendar: Calendar) => {
  //   router.push(`/calendar/${calendar._id}`);
  // };

  // const onCreateCalendar = () => {
  //   router.push("/calendar/create");
  // };

  // const onEditCalendar = (calendar: Calendar) => {
  //   router.push(`/calendar/${calendar._id}/edit`);
  // };

  // const onDeleteCalendar = async (calendar: Calendar) => {
  //   if (confirm("Are you sure you want to delete this calendar?")) {
  //     try {
  //       const id = calendar._id?.toString();
  //       if (id) {
  //         await deleteCalendar(id);
  //       } else {
  //         setError("Calendar ID is missing");
  //       }
  //     } catch (err) {
  //       setError((err as Error).message);
  //     }
  //   }
  // };

  useEffect(() => {
    const fetchCalendars = async () => {
      if (!user) return;
      const calendars = await fetch("/api/calendar?userId=" + user.uid);
      if (!calendars.ok) {
        setError("Failed to fetch calendars.");
        return;
      }
      const data = await calendars.json();
      setCalendars({
        [CalendarRole.OWNER]: data.filter(
          (calendar: Calendar) =>
            calendar.members[user.uid] === CalendarRole.OWNER
        ),
        [CalendarRole.EDITOR]: data.filter(
          (calendar: Calendar) =>
            calendar.members[user.uid] === CalendarRole.EDITOR
        ),
        [CalendarRole.VIEWER]: data.filter(
          (calendar: Calendar) =>
            calendar.members[user.uid] === CalendarRole.VIEWER
        ),
      });
      setLoadingPage(false);
    };

    fetchCalendars();
  }, [user]);


  if (loading || loadingPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-purple-800">
        <p>LoadingPage...</p>
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
  return (
    <div className="min-h-screen p-6 bg-purple-50 text-purple-800">
      <h1 className="text-3xl font-semibold mb-6">Calendars</h1>
      <div className="flex gap-4 mb-6">
        <Link
          href="/calendar/create"
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Create Calendar
        </Link>
      </div>
      <ul className="pl-6 mb-6 space-y-4">
        <li>
          <h3 className="text-xl font-semibold mb-2">My Calendars</h3>
          <CalendarScrollArea
            calendars={calendars[CalendarRole.OWNER]}
            onSelectCalendar={(calendar) =>
              router.push(`/calendar/${calendar._id}`)
            }
          />
        </li>
        <li>
          <h3 className="text-xl font-semibold mb-2">Shared Calendars</h3>
          <CalendarScrollArea
            calendars={calendars[CalendarRole.EDITOR]}
            onSelectCalendar={(calendar) =>
              router.push(`/calendar/${calendar._id}`)
            }
          />
        </li>
        <li>
          <h3 className="text-xl font-semibold mb-2">Subscribed Calendars</h3>
          <CalendarScrollArea
            calendars={calendars[CalendarRole.VIEWER]}
            onSelectCalendar={(calendar) =>
              router.push(`/calendar/${calendar._id}`)
            }
          />
        </li>
      </ul>
    </div>
  );
}
