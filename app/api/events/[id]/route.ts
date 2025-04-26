import { NextRequest, NextResponse } from "next/server";
import { getEventById, updateEvent, deleteEvent } from "@/lib/db";
import { getUserFromRequest } from "@/lib/userDb";
import { getCalendarById } from "@/lib/calendarDb";
import { Event } from "@/models/Event";

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
    const { id } = await params;
    const authResponse = await authenticate(request, id);
    if (authResponse) {
      return authResponse; // Return the authentication error response
    }
    const updateData: Partial<Event> = await request.json();
    // Fetch the event to ensure it exists
    const existingEvent = await getEventById(id);
    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    const updatedEvent = await updateEvent(id, updateData);
    return NextResponse.json(updatedEvent);
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
    const authResponse = await authenticate(request, params.id);
    if (authResponse) {
      return authResponse; // Return the authentication error response
    }
    const { id } = await params;
    const success = await deleteEvent(id);
    if (!success) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function authenticate(request: NextRequest, id: string) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return NextResponse.json(
      { error: "Authentication failed: Invalid permissions" },
      { status: 403 }
    );
  }
  // Fetch event
  const event = await getEventById(id);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
  // Fetch calendar
  const calendar = await getCalendarById(event.calendarId.toString()); // Fetch the calendar object
  if (!calendar) {
    return NextResponse.json({ error: "Calendar not found" }, { status: 404 });
  }
  // Check if user is a member of the calendar with editor or owner role
  const userRole = calendar.members[user.uid];
  if (!userRole || !["editor", "owner"].includes(userRole)) {
    return NextResponse.json(
      {
        error: "You do not have permission to delete events in this calendar.",
      },
      { status: 403 }
    );
  }
}
