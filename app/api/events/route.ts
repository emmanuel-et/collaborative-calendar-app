import { NextRequest, NextResponse } from "next/server";
import {
  createEvent,
  getEventsByUser,
  getEventsByCalendar,
  getEventsByUserInCalendar,
} from "@/lib/db";
import { EventInput } from "@/models/Event";
import { findConflictingEvents } from "@/lib/eventConflictCheck";

// GET /api/events?userId=123 or /api/events?calendarId=456 or both
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    const calendarId = request.nextUrl.searchParams.get("calendarId");

    if (userId && calendarId) {
      // Fetch events by userId and calendarId
      const events = await getEventsByUserInCalendar(userId, calendarId);
      return NextResponse.json(events);
    }

    if (userId) {
      const events = await getEventsByUser(userId);
      return NextResponse.json(events);
    }

    if (calendarId) {
      const events = await getEventsByCalendar(calendarId);
      return NextResponse.json(events);
    }

    return NextResponse.json(
      { error: "Either userId or calendarId is required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/events
export async function POST(request: NextRequest) {
  try {
    const eventData: EventInput = await request.json();

    // Validate required fields
    if (
      !eventData.title ||
      !eventData.startTime ||
      !eventData.endTime ||
      !eventData.createdBy
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, startTime, endTime, createdBy",
        },
        { status: 400 }
      );
    }

  
    // const existingEvents = await getEventsByCalendar(eventData.calendarId);
  
    // const tempEvent = {
    //   ...eventData,
    //   _id: undefined,
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    //   calendarId: eventData.calendarId,
    // };
    
    // const conflictingEvents = findConflictingEvents(
    //   tempEvent,
    //   existingEvents
    // );
    
    // if (conflictingEvents.length > 0) {
 
    //   const higherPriorityConflicts = conflictingEvents.filter(
    //     (event) => {
    
    //       const eventPriority = event.priority || 3; 
    //       const newEventPriority = eventData.priority || 3; // Default to medium priority if undefined
    //       return eventPriority > newEventPriority; // conflicts
    //     }
    //   );
      
    
    //   if (higherPriorityConflicts.length > 0) {
    //     return NextResponse.json(
    //       {
    //         error: "Cannot create event: conflicts with existing events of higher priority",
    //         conflicts: higherPriorityConflicts,
    //       },
    //       { status: 409 } 
    //     );
    //   }
    // 
    //  
    //   const newEvent = await createEvent(eventData);
    //   return NextResponse.json({
    //     ...newEvent,
    //     warning: "Event created with conflicts with lower or equal priority events",
    //     conflicts: conflictingEvents,
    //   }, { status: 201 });
    // }

    // Create new event
    const newEvent = await createEvent(eventData);
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
