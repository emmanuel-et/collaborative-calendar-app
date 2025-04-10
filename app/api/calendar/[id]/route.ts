import { getCalendarById, updateCalendar } from "@/lib/calendarDb";
import { NextResponse } from "next/server";

// GET: Fetch calendar details by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } =  await params;

  if (!id) {
    return NextResponse.json({ error: "Calendar ID is required" }, { status: 400 });
  }

  const calendar = await getCalendarById(id);

  if (!calendar) {
    return NextResponse.json({ error: "Calendar not found" }, { status: 404 });
  }

  return NextResponse.json(calendar);
}

// PUT: Update calendar details by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } =  await params;

  if (!id) {
    return NextResponse.json({ error: "Calendar ID is required" }, { status: 400 });
  }

  try {
      const updatedCalendar = await req.json();
      const result = await updateCalendar(id, updatedCalendar);

      if (!result) {
        return NextResponse.json({ error: "Failed to update calendar" }, { status: 500 });
      }
      return NextResponse.json({ message: "Calendar updated successfully" });
  } catch (error) {
      return NextResponse.json({ error: "Failed to update calendar" }, { status: 500 });
  }
  
}
