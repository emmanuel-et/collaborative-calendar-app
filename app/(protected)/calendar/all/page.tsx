"use client"

import MultiCalendarView from "@/components/calendar/MultiCalendarView";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function CombinedCalendarPage() {
    const { user } = useAuth();
    const [calendars, setCalendars  ] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCalendars = async () => {

            if (!user) return;
            try {
                setLoading(true);
                const res = await fetch("/api/calendar?userId=" + user.uid);
                if (!res.ok) {
                    throw new Error("Failed to fetch calendars.");
                }
                const data = await res.json();
                setCalendars(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchCalendars();
    }, [user]);

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
    if (!calendars || calendars.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-purple-800">
                <p className="text-gray-500">No calendars found.</p>
            </div>
        );
    }
    return (
        <div className="min-h-screen p-6 bg-purple-50 text-purple-800 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-6">Combined Calendar View</h1>
                <div className="flex gap-4 mb-6">
                    <Link
                        href='/events/new'
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        Create Event
                    </Link>
                    <Link
                        href="/calendar/create"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Create Calendar
                    </Link>
                </div>
            </div>
            
            <div className="grid flex-1">
                <MultiCalendarView
                    calendars={calendars}
                    events={events}
                    handleDeleteEvent={handleDeleteEvent}
                    handleUpdateEvent={handleUpdateEvent}
                />
            </div>
        </div>
    )
}