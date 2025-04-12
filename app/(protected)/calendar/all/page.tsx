"use client"

import MultiCalendarView from "@/components/calendar/MultiCalendarView";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

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
                console.log(data);
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
            <h1 className="text-2xl font-bold mb-4">Combined Calendar View</h1>
            <div className="grid flex-1">
                <MultiCalendarView calendars={calendars} />
            </div>
        </div>
    )
}