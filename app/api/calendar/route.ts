import { NextRequest, NextResponse } from 'next/server';
import { getCalendarsByUser, createCalendar } from '@/lib/calendarDb';

// GET /api/calendar?userId=123
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Filter calendars where the user is a member
    const userCalendars = await getCalendarsByUser(userId);
    if (!userCalendars) {
      return NextResponse.json({ error: 'No calendars found for this user' }, { status: 404 });
    }
    return NextResponse.json(userCalendars);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
    try {
        const calendarData = await request.json();
        console.log('Creating calendar:', calendarData);
        
        // Validate required fields
        if (!calendarData.name || !calendarData.members) {
        return NextResponse.json(
            { error: 'Missing required fields: name, members' },
            { status: 400 }
        );
        }
        
        // Create new calendar
        const newCalendar = await createCalendar(calendarData);
        return NextResponse.json(newCalendar, { status: 201 });
    } catch (error) {
        console.error('Error creating calendar:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

