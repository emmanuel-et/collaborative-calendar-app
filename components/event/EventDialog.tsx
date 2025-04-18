"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, CalendarRole } from "@/models/Calendar";
import { Event } from "@/models/Event";
import { ClientEvent, ClientEventInput } from "@/models/ClientEvent";
import EventForm from "./EventForm";

interface EventDialogProps {
  event?: Event;
  calendarId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: ClientEventInput) => void;
  onDelete?: () => void;
}

const EventDialog: React.FC<EventDialogProps> = ({
  event,
  calendarId,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const { user } = useAuth();
  const [clientEvent, setClientEvent] = useState<ClientEvent | undefined>();
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (event) {
      // Convert server Event to client Event
      setClientEvent({
        _id: event._id?.toString() || "",
        calendarId: event.calendarId?.toString() || "",
        title: event.title,
        description: event.description || "",
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location || "",
        createdBy: event.createdBy,
        participants: event.participants,
        isAllDay: event.isAllDay,
        color: event.color,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      });
    } else {
      setClientEvent(undefined);
    }
  }, [event]);

  useEffect(() => {
    const fetchCalendar = async () => {
      if (!calendarId || !user) return;
      try {
        const response = await fetch(`/api/calendar/${calendarId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch calendar");
        }
        const data = await response.json();
        setCalendar(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchCalendar();
  }, [calendarId, user]);

  const handleUpdate = async (updatedEvent: ClientEventInput) => {
    setIsLoading(true);
    setError("");

    try {
      // Convert client Event to server Event format
      const serverEvent = {
        ...updatedEvent,
        calendarId: updatedEvent.calendarId,
      };

      onSave(serverEvent);
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const canEdit = calendar?.members[user?.uid || ""] !== CalendarRole.VIEWER;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {clientEvent ? "Edit Event" : "Create Event"}
          </DialogTitle>
        </DialogHeader>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <EventForm
          calendarId={calendarId}
          onSubmit={handleUpdate}
          initialData={clientEvent}
          isEdit={!!clientEvent}
        />

        {clientEvent && canEdit && onDelete && (
          <div className="mt-4">
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={isLoading}
              className="w-full"
            >
              Delete Event
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
