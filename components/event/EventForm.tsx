"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { EventInput, Event } from "@/models/Event";
import { Calendar, CalendarRole } from "@/models/Calendar";
import { findConflictingEvents } from "@/lib/eventConflictCheck";

// Define a type that can handle both string and ObjectId
type IdType = string | { toString: () => string };

interface EventFormProps {
  calendarId?: string;
  onSubmit: (event: EventInput) => void;
  initialData?: Partial<EventInput & { _id?: IdType }>;
  isEdit?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
  calendarId,
  onSubmit,
  initialData = {},
  isEdit = false,
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [startTime, setStartTime] = useState(
    initialData.startTime
      ? new Date(initialData.startTime).toISOString().slice(0, 16)
      : ""
  );
  const [endTime, setEndTime] = useState(
    initialData.endTime
      ? new Date(initialData.endTime).toISOString().slice(0, 16)
      : ""
  );
  const [location, setLocation] = useState(initialData.location || "");
  const [isAllDay, setIsAllDay] = useState(initialData.isAllDay || false);
  const [color, setColor] = useState(initialData.color || "#9333ea"); // Default purple
  const [priority, setPriority] = useState(initialData.priority || 3);  
  const [selectedCalendarIdx, setSelectedCalendarIdx] = useState(-1);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [error, setError] = useState("");
  const [conflicts, setConflicts] = useState<Event[]>([]);
  const [existingEvents, setExistingEvents] = useState<Event[]>([]);
  const [isCheckingConflicts, setIsCheckingConflicts] = useState(false);

  useEffect(() => {
    const fetchCalendars = async () => {
      if (!user) return;
      try {
        const response = await fetch(`/api/calendar?userId=${user.uid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch calendars.");
        }
        const data = await response.json();
        setCalendars(data);
        if (!calendarId && data.length > 0) {
          setSelectedCalendarIdx(0); // Default to the first calendar if none is provided
        } else {
          const calendarIndex = data.findIndex(
            (calendar: Calendar) => calendar._id?.toString() === calendarId
          );

          if (calendarIndex !== -1) {
            if (data[calendarIndex].members[user.uid] === CalendarRole.VIEWER) {
              setError(
                "You do not have permission to modify events in this calendar."
              );
              return;
            }
            setSelectedCalendarIdx(calendarIndex);
          } else {
            setError("Calendar not found");
          }
        }
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchCalendars();
  }, [user, calendarId]);

  // Fetch existing events for the selected calendar
  useEffect(() => {
    const fetchExistingEvents = async () => {
      if (selectedCalendarIdx < 0 || !calendars[selectedCalendarIdx]?._id) return;
      
      try {
        const response = await fetch(`/api/events?calendarId=${calendars[selectedCalendarIdx]._id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch existing events");
        }
        const data = await response.json();
        setExistingEvents(data);
      } catch (err) {
        console.error("Error fetching existing events:", err);
      }
    };

    fetchExistingEvents();
  }, [selectedCalendarIdx, calendars]);

  // Check for conflicts when relevant fields change
  useEffect(() => {
    const checkConflicts = () => {
      if (!startTime || !endTime || selectedCalendarIdx < 0 || !calendars[selectedCalendarIdx]?._id) {
        setConflicts([]);
        return;
      }

      setIsCheckingConflicts(true);
      
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);
      
      if (endDate <= startDate) {
        setConflicts([]);
        setIsCheckingConflicts(false);
        return;
      }

      // Handle both string and ObjectId types for _id
      const eventId = initialData._id 
        ? (typeof initialData._id === 'string' 
            ? initialData._id 
            : initialData._id.toString())
        : undefined;

      const newEvent = {
        _id: isEdit && eventId ? eventId : undefined,
        calendarId: calendars[selectedCalendarIdx]._id.toString(),
        title: title || "New Event",
        description: description,
        startTime: startDate,
        endTime: endDate,
        location: location,
        createdBy: user?.uid || "",
        participants: [user?.uid || ""],
        isAllDay: isAllDay,
        color: color,
        priority: priority,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const conflictingEvents = findConflictingEvents(newEvent, existingEvents);
      setConflicts(conflictingEvents);
      setIsCheckingConflicts(false);
    };

    // Debounce the conflict check to avoid too many checks while typing
    const timeoutId = setTimeout(checkConflicts, 500);
    return () => clearTimeout(timeoutId);
  }, [startTime, endTime, selectedCalendarIdx, calendars, title, description, location, isAllDay, color, priority, isEdit, initialData, user?.uid, existingEvents]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      calendars[selectedCalendarIdx]?.members?.[user?.uid] ===
      CalendarRole.VIEWER
    ) {
      setError("You do not have permission to modify events in this calendar.");
      return;
    }

    // Validate form
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!startTime) {
      setError("Start time is required");
      return;
    }

    if (!endTime) {
      setError("End time is required");
      return;
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (endDate < startDate) {
      setError("End time must be after start time");
      return;
    }

    if (
      selectedCalendarIdx < 0 ||
      selectedCalendarIdx >= calendars.length ||
      !calendars[selectedCalendarIdx] ||
      !calendars[selectedCalendarIdx]._id?.toString()
    ) {
      setError("Please select a calendar");
      return;
    }

    // Create event data
    const eventData: EventInput = {
      calendarId: calendars[selectedCalendarIdx]._id?.toString(),
      title,
      description,
      startTime: startDate,
      endTime: endDate,
      location,
      isAllDay,
      color,
      priority,
      createdBy: user?.uid || "",
      participants: [user?.uid || ""],
    };

    onSubmit(eventData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      
      
      {conflicts.length > 0 && (
        <div className="p-3 bg-yellow-100 text-yellow-800 rounded-md">
          <p className="font-medium">Warning: This event conflicts with {conflicts.length} existing event(s).</p>
          <p className="text-sm mt-1">
            {conflicts.some(event => (event.priority || 3) > (priority || 3)) 
              ? "Events with lower priority cannot be scheduled at overlapping times."
              : "Events with higher or equal priority can be scheduled, but higher priority events will take precedence."}
          </p>
          <ul className="mt-2 text-sm list-disc pl-4">
            {conflicts.slice(0, 3).map((event, index) => (
              <li key={index}>
                {event.title} ({new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()})
                {event.priority === priority 
                  ? " (Same Priority)" 
                  : (event.priority || 3) > (priority || 3) 
                    ? " (Higher Priority)" 
                    : " (Lower Priority)"}
              </li>
            ))}
            {conflicts.length > 3 && <li>...and {conflicts.length - 3} more</li>}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor="calendar" className="block text-sm font-medium mb-1">
          Calendar *
        </label>
        <select
          id="calendar"
          value={selectedCalendarIdx}
          onChange={(e) => setSelectedCalendarIdx(parseInt(e.target.value))}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        >
          {calendars.map((calendar, i) => (
            <option key={calendar._id?.toString()} value={i}>
              {calendar.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium mb-1">
          Priority
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            id="priority"
            min="1"
            max="5"
            value={priority}
            onChange={(e) => setPriority(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm font-medium">
            {priority === 1 ? "Lowest" : 
             priority === 2 ? "Low" : 
             priority === 3 ? "Medium" : 
             priority === 4 ? "High" : "Highest"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium mb-1">
            Start Time *
          </label>
          <input
            type="datetime-local"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium mb-1">
            End Time *
          </label>
          <input
            type="datetime-local"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium mb-1">
          Location
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isAllDay"
          checked={isAllDay}
          onChange={(e) => setIsAllDay(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="isAllDay" className="text-sm font-medium">
          All Day Event
        </label>
      </div>

      <div>
        <label htmlFor="color" className="block text-sm font-medium mb-1">
          Color
        </label>
        <input
          type="color"
          id="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full h-10 p-1 border rounded"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-purple-600 text-white hover:bg-purple-700"
      >
        {isEdit ? "Update Event" : "Create Event"}
      </Button>
    </form>
  );
};

export default EventForm;
