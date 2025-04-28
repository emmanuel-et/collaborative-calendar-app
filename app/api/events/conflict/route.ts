import { NextResponse } from "next/server";
import { getConflictingEvents } from "@/lib/eventDb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const startTime = searchParams.get("startTime");
  const endTime = searchParams.get("endTime");
  const calendarIds = searchParams.getAll("calendarIds");

  if (!startTime || !endTime || calendarIds.length === 0) {
    return NextResponse.json(
      { error: "Missing required query parameters: startTime, endTime, or calendarIds" },
      { status: 400 }
    );
  }

  try {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format for startTime or endTime" },
        { status: 400 }
      );
    }

    const conflicts = await getConflictingEvents(start, end, calendarIds);
    return NextResponse.json(conflicts);
  } catch (error) {
    console.error("Error fetching conflicting events:", error);
    return NextResponse.json(
      { error: "Failed to fetch conflicting events" },
      { status: 500 }
    );
  }
}
