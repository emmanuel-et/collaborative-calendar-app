import { getCalendarById, updateCalendar } from "@/lib/calendarDb";
import { NextResponse } from "next/server";
import { CalendarRole } from "@/models/Calendar";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// Initialize Firebase Admin if it hasn't been initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

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
  try {
    const { id } = params;
    const { name, members } = await req.json();
    
  
    const token = req.headers.get('cookie')?.split(';')
      .find(c => c.trim().startsWith('auth-token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get the current calendar to check permissions
    const calendar = await getCalendarById(id);
    if (!calendar) {
      return NextResponse.json({ error: "Calendar not found" }, { status: 404 });
    }

    // Check if user has permission to edit
    const userRole = calendar.members[userId];
    if (userRole === CalendarRole.VIEWER) {
      return NextResponse.json({ error: "You don't have permission to edit this calendar" }, { status: 403 });
    }

    // Update the calendar
    const updatedCalendar = await updateCalendar(id, { name, members });
    return NextResponse.json(updatedCalendar);
  } catch (error) {
    
    return NextResponse.json({ error: "Failed to update calendar" }, { status: 500 });
  }
}
