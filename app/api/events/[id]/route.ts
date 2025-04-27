import { NextRequest, NextResponse } from "next/server";
import { getEventById, updateEvent, deleteEvent } from "@/lib/db";
import { getUserFromRequest } from "@/lib/userDb";
import { getCalendarById } from "@/lib/calendarDb";
import { Event } from "@/models/Event";
import { findConflictingEvents } from "@/lib/eventConflictCheck";
import { getEventsByCalendar } from "@/lib/eventDb";

// GET /api/events/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const event = await getEventById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/events/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get the existing event
    const existingEvent = await getEventById(id);
    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Get the calendar to check permissions
    const calendar = await getCalendarById(existingEvent.calendarId.toString());
    if (!calendar) {
      return NextResponse.json({ error: "Calendar not found" }, { status: 404 });
    }

    // Check if user has permission to update the event
    const userRole = calendar.members[user.uid];
    if (!userRole || !["editor", "owner"].includes(userRole)) {
      return NextResponse.json(
        { error: "You don't have permission to update events in this calendar" },
        { status: 403 }
      );
    }

    const updatedData = await request.json();
  
    const calendarEvents = await getEventsByCalendar(existingEvent.calendarId.toString());
    
    
    const updatedEvent = {
      ...existingEvent,
      ...updatedData,
      _id: existingEvent._id,
      calendarId: existingEvent.calendarId,
      createdAt: existingEvent.createdAt,
      updatedAt: new Date(),
    };
 
    const conflictingEvents = findConflictingEvents(
      updatedEvent,
      calendarEvents
    );
    
   
    if (conflictingEvents.length > 0) {
     
      const higherPriorityConflicts = conflictingEvents.filter(
        (event) => {

          const eventPriority = event.priority || 3; // Default to medium priority if undefined
          const newEventPriority = updatedEvent.priority || 3; // Default to medium priority if undefined
          return eventPriority > newEventPriority; 
        }
      );
      
      if (higherPriorityConflicts.length > 0) {
        return NextResponse.json(
          {
            error: "Cannot update event: conflicts with existing events of higher priority",
            conflicts: higherPriorityConflicts,
          },
          { status: 409 } // 409 Conflict
        );
      }
      
      
      const updatedEventResult = await updateEvent(id, updatedData);
      return NextResponse.json({
        ...updatedEventResult,
        warning: "Event updated with conflicts with lower or equal priority events",
        conflicts: conflictingEvents,
      });
    }

    // Update the event
    const updatedEventResult = await updateEvent(id, updatedData);
    return NextResponse.json(updatedEventResult);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get the event to check permissions
    const event = await getEventById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Get the calendar to check permissions
    const calendar = await getCalendarById(event.calendarId.toString());
    if (!calendar) {
      return NextResponse.json({ error: "Calendar not found" }, { status: 404 });
    }

    // Check if user has permission to delete the event
    const userRole = calendar.members[user.uid];
    if (!userRole || !["editor", "owner"].includes(userRole)) {
      return NextResponse.json(
        { error: "You don't have permission to delete events in this calendar" },
        { status: 403 }
      );
    }

    // Delete the event
    await deleteEvent(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
