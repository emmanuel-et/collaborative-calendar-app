"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/models/User";
import { Event } from "@/models/Event";
import UpcomingEvents from "@/components/event/UpcomingEvents";
import Link from "next/link";
import MultiCalendarView from "@/components/calendar/MultiCalendarView";

function Dashboard() {
  const { user, loading } = useAuth();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [calendars, setCalendars] = useState([]);
  const [loadingCalendar, setLoadingCalendar] = useState(false);

  useEffect(() => {
    const fetchCalendars = async () => {
      if (!user) return;
      try {
        setLoadingCalendar(true);
        const res = await fetch("/api/calendar?userId=" + user.uid);
        if (!res.ok) {
          throw new Error("Failed to fetch calendars.");
        }
        const data = await res.json();
        setCalendars(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoadingCalendar(false);
      }
    };

    fetchCalendars();
  }, [user]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.uid) return;

      try {
        const response = await fetch(`/api/users?uid=${user.uid}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
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

  if (loading || loadingProfile || loadingCalendar) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-purple-800">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-purple-50 text-purple-800 flex flex-col">
      <div className="flex flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Dashboard</h1>

        <Link
          href="/events/new"
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Create Event
        </Link>
      </div>
      <div className="flex flex-1 gap-4">
        <div className="flex-grow-[2] flex flex-col">
          <div className="flex-1">
            <UpcomingEvents onEventClick={handleEventClick} />
          </div>
        </div>
        <div className="flex-grow-[1] flex flex-col">
          <div className="flex-1">
            <MultiCalendarView calendars={calendars} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

// return (
//   <div className="min-h-screen p-6 bg-purple-50 text-purple-800 flex flex-col">
//     <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

//     <div className="grid flex-1">
//       <MultiCalendarView calendars={calendars} />
//     </div>

//     <div>
//       {/* Calendar Section */}
//       <div className="md:col-span-2">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-medium">Calendar</h2>
//           <Link
//             href="/events/new"
//             className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
//           >
//             Add Event
//           </Link>
//         </div>

//         <div className="flex gap-4 items-stretch">
//           <div className="flex-grow-[1]">
//             <UpcomingEvents onEventClick={handleEventClick} />
//           </div>
//           <div className="flex-grow-[5]">
//             <MultiCalendarView calendars={calendars} />
//           </div>
//         </div>

//         {/* Event Details */}
//         {selectedEvent && (
//           <div className="mt-6 bg-white p-6 rounded shadow-md">
//             <h2 className="text-xl font-medium mb-4">Event Details</h2>
//             <div className="mb-2">
//               <span className="font-medium">Title:</span>{" "}
//               {selectedEvent.title}
//             </div>
//             {selectedEvent.description && (
//               <div className="mb-2">
//                 <span className="font-medium">Description:</span>{" "}
//                 {selectedEvent.description}
//               </div>
//             )}
//             <div className="mb-2">
//               <span className="font-medium">Start:</span>{" "}
//               {new Date(selectedEvent.startTime).toLocaleString()}
//             </div>
//             <div className="mb-2">
//               <span className="font-medium">End:</span>{" "}
//               {new Date(selectedEvent.endTime).toLocaleString()}
//             </div>
//             {selectedEvent.location && (
//               <div className="mb-2">
//                 <span className="font-medium">Location:</span>{" "}
//                 {selectedEvent.location}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// );
