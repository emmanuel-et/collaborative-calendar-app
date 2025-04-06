import { NextRequest, NextResponse } from 'next/server';
import { createEvent, getEventsByUser } from '@/lib/db';
import { EventInput } from '@/models/Event';

// GET /api/events?userId=123
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    const events = await getEventsByUser(userId);
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/events
export async function POST(request: NextRequest) {
  try {
    const eventData: EventInput = await request.json();
    
    // Validate required fields
    if (!eventData.title || !eventData.startTime || !eventData.endTime || !eventData.createdBy) {
      return NextResponse.json(
        { error: 'Missing required fields: title, startTime, endTime, createdBy' },
        { status: 400 }
      );
    }
    
    // Create new event
    const newEvent = await createEvent(eventData);
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 