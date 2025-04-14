import { NextRequest, NextResponse } from "next/server";
import {
  createEvent,
  getEventsByUser,
  getEventsByCalendar,
  getEventsByUserInCalendar,
} from "@/lib/db";
import { EventInput } from "@/models/Event";

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
      console.log("Fetching events for calendarId:", calendarId);
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
