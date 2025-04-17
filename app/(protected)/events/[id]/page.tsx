"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import EventForm from "@/components/event/EventForm";
import { EventInput } from "@/models/Event";
import Link from "next/link";

export default function EventPage() {
  const router = useRouter();
  const { loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [eventData, setEventData] = useState<EventInput | null>(null);

  const { id } = useParams();

  const isEditing = id !== "new"; // Determine if editing or creating a new event

  useEffect(() => {
    if (isEditing) {
      const fetchEvent = async () => {
        try {
          const response = await fetch(`/api/events/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch event details");
          }
          const data = await response.json();
          setEventData(data);
        } catch (err) {
          setError((err as Error).message);
        }
      };

      fetchEvent();
    }
  }, [id, isEditing]);

  const handleSubmit = async (eventData: EventInput) => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/events${isEditing ? `/${id}` : ""}`, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEditing ? "update" : "create"} event`);
      }

      // Redirect to dashboard on success
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message);
      setIsSubmitting(false);
    }
  };

  if (loading || (isEditing && !eventData)) {
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
          <h1 className="text-3xl font-semibold">{isEditing ? "Edit Event" : "Create New Event"}</h1>
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
          <EventForm
            calendarId={eventData?.calendarId || ""}
            initialData={eventData || undefined}
            onSubmit={handleSubmit}
          />

          {isSubmitting && (
            <div className="mt-4 text-center text-purple-600">
              {isEditing ? "Updating event..." : "Creating event..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
