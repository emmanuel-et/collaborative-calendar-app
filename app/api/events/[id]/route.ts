import { NextRequest, NextResponse } from 'next/server';
import { getEventById, updateEvent, deleteEvent } from '@/lib/db';
import { Event } from '@/models/Event';

// GET /api/events/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const event = await getEventById(id);
    
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/events/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const updateData: Partial<Event> = await request.json();
    
    const updatedEvent = await updateEvent(id, updateData);
    
    if (!updatedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/events/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const success = await deleteEvent(id);
    
    if (!success) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 