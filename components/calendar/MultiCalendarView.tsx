"use client";

import {
  Calendar as BigCalendar,
  momentLocalizer,
  View,
} from "react-big-calendar";
import { Calendar } from "@/models/Calendar";
import moment from "moment";
import { useEffect, useState, useMemo } from "react";
import { Event } from "@/models/Event";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventDialog from "@/components/event/EventDialog";
import { separateConflicts } from "@/lib/eventConflictCheck";

interface MultiCalendarViewProps {
  calendars: Calendar[];
  events: Event[];
  handleUpdateEvent: (event: Event) => void;
  handleDeleteEvent: (eventId: string) => void;
}

export default function MultiCalendarView({
  calendars,
  events,
  handleUpdateEvent,
  handleDeleteEvent,
}: MultiCalendarViewProps) {

  const { higherPriorityEvents, lowerPriorityEvents } = useMemo(() => separateConflicts(events), [events]);
  console.log("Higher Priority Events:", higherPriorityEvents);
  console.log("Lower Priority Events:", lowerPriorityEvents);
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
  const [selectedCalendar, setSelectedCalendar] = useState<Calendar | null>(
    null
  );
  const calendarStringIds = calendars
    .map((calendar) => calendar._id?.toString())
    .filter((id) => id !== undefined);

  const localizer = momentLocalizer(moment);
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [visibleCalendars, setVisibleCalendars] = useState<
    Record<string, boolean>
  >(
    calendarStringIds.reduce((acc: Record<string, boolean>, id: string) => {
      acc[id] = true;
      return acc;
    }, {})
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const toggleCalendarVisibility = (calendarId: string) => {
    setVisibleCalendars((prev) => ({
      ...prev,
      [calendarId]: !prev[calendarId],
    }));
  };

  const toggleAllCalendars = (isVisible: boolean) => {
    setVisibleCalendars(
      calendarStringIds.reduce((acc: Record<string, boolean>, id: string) => {
        acc[id] = isVisible;
        return acc;
      }, {})
    );
  };

  useEffect(() => {
    toggleAllCalendars(true);
  }, [calendars]);

  const getVisibleEvents = (eventsArr: Event[]) => {
    return eventsArr.filter((event: any) => visibleCalendars[event.calendarId]);
  };

  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     let events = (
  //       await Promise.all(
  //         calendarStringIds.map((id) =>
  //           fetch("/api/events?calendarId=" + id).then((res) => res.json())
  //         )
  //       )
  //     ).flat();
  //     events = events.map((event) => ({
  //       ...event,
  //       startTime: new Date(event.startTime),
  //       endTime: new Date(event.endTime),
  //     }));

  //     setEvents(events);
  //   };

  //   fetchEvents();
  // }, []);

  return (
    <div
      className="p-6 bg-purple-50 text-purple-800 h-full"
      style={{
        display: "grid",
        gridTemplateColumns: "7fr min-content",
        gap: "20px",
      }}
    >
      <div>
        <BigCalendar
          localizer={localizer}
          events={getVisibleEvents(events)}
          startAccessor="startTime"
          endAccessor="endTime"
          view={view}
          date={date}
          onNavigate={(newDate: Date) => setDate(newDate)}
          onView={(newView: View) => setView(newView)}
          onSelectEvent={(event: Event) => setSelectedEvent(event)}
          eventPropGetter={(event) => {
            const isBackgroundEvent = lowerPriorityEvents.some(
              (bgEvent) => bgEvent._id === event._id
            );
            return {
              style: {
                filter: isBackgroundEvent ? "grayscale(0.7)" : "none", // Blur effect for background events
                opacity: isBackgroundEvent ? 0.4 : 1, // Additional transparency for background events
                backgroundColor: event.color || "#3174ad",
                color: "white",
                borderRadius: "2px",
                paddingTop: "2px",
                paddingBottom: "2px",
                display: "block",
              },
            };
          }}
          onSelectSlot={(slotInfo: Object) => setHoveredEvent(slotInfo)}
          components={{
            event: ({ event }) => (
              <div
                className="relative group"
                onClick={() => setSelectedEvent(event)}
              >
                <span>
                  {(event.title?.trim() && event.title.trim()) || "[No name]"}
                </span>
              </div>
            ),
          }}
        />
        {selectedEvent && (
          <EventDialog
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onUpdate={(newEvent) => {
              setSelectedEvent(newEvent);
              handleUpdateEvent(newEvent);
            }}
            onDelete={handleDeleteEvent}
          />
        )}
      </div>
      {calendars.length > 1 && (
        <div
          className={`transition-all duration-300 ${
            isCollapsed ? "w-12 overflow-hidden" : "max-w-xs"
          } bg-white shadow-md rounded`}
        >
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full bg-purple-600 text-white py-2 rounded-t hover:bg-purple-700"
          >
            {isCollapsed ? ">" : "<"}
          </button>
          {calendars.length > 1 && !isCollapsed && (
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">Toggle Calendars</h2>
              <button
                onClick={() => toggleAllCalendars(true)}
                className="mb-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-nowrap"
              >
                Show All
              </button>
              <button
                onClick={() => toggleAllCalendars(false)}
                className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-nowrap"
              >
                Hide All
              </button>
              <ul>
                {calendars.map((calendar) => (
                  <li
                    key={calendar._id?.toString() || ""}
                    className="flex items-center mb-2"
                  >
                    <label className="flex items-center text-nowrap">
                      <input
                        type="checkbox"
                        className="mr-2 text-nowrap"
                        checked={
                          !!visibleCalendars[calendar._id?.toString() || ""]
                        }
                        onChange={() =>
                          toggleCalendarVisibility(
                            calendar._id?.toString() || ""
                          )
                        }
                      />
                      {calendar.name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
