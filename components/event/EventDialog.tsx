"use client";

import React, { useState } from "react";
import EventForm from "@/components/event/EventForm";
import { Event } from "@/models/Event";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface EventDialogProps {
  event: Event | null;
  onClose: () => void;
  onUpdate: (updatedEvent: Event) => void;
  onDelete: (eventId: string) => void;
}

const EventDialog: React.FC<EventDialogProps> = ({
  event,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  if (!event) return null;

  const handleUpdate = (updatedEventData: Partial<Event>) => {
    const updatedEvent = { ...event, ...updatedEventData };
    onUpdate(updatedEvent);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this event?")) {
      onDelete(event._id?.toString() || "");
      onClose();
    }
  };

  const handleExpand = () => {
    router.push(`/events/${event._id}`);
  };

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Event" : "Event Details"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of your event and click 'Save Changes' to apply."
              : "View the details of your event. You can edit or delete it if needed."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isEditing ? (
            <EventForm
              calendarId={event.calendarId}
              initialData={event}
              onSubmit={handleUpdate}
              isEdit={true}
            />
          ) : (
            <>
              <div>
                <strong>Title:</strong> {event.title}
              </div>
              <div>
                <strong>Description:</strong>{" "}
                {event.description || "No description"}
              </div>
              <div>
                <strong>Start:</strong>{" "}
                {new Date(event.startTime).toLocaleString()}
              </div>
              <div>
                <strong>End:</strong> {new Date(event.endTime).toLocaleString()}
              </div>
              <div>
                <strong>Location:</strong> {event.location || "No location"}
              </div>
              <div>
                <strong>All Day:</strong> {event.isAllDay ? "Yes" : "No"}
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          {isEditing ? (
            <Button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 text-gray-800 hover:bg-gray-400"
            >
              Cancel
            </Button>
          ) : (
            <>
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Edit
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </Button>
            </>
          )}
          {/* <Button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
            Close
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
