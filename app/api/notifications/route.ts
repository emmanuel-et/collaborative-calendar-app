import { sendEventNotification, sendInviteNotification } from '@/lib/db';
import { EventNotificationInput, InviteNotificationInput } from '@/models/Notification';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/notifications?type="invite|event"
export async function POST(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type');

    if (type !== 'invite' && type !== 'event') {
      return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
    }

    if (type === 'invite') {
        const inviteData: InviteNotificationInput = await request.json();
        
        if (!inviteData.email || !inviteData.role || !inviteData.calendarId || !inviteData.senderId) {
          return NextResponse.json(
            { error: 'Missing required fields: email, role, calendarId, senderId' },
            { status: 400 }
          );
        }
        
        const sendNotification = await sendInviteNotification(inviteData);
        return NextResponse.json(sendNotification, { status: 201 });
    }

    if (type === 'event') {
      const eventData: EventNotificationInput = await request.json();

      if (!eventData.eventTitle || !eventData.calendarId || !eventData.senderId || !eventData.action) {
        return NextResponse.json(
          { error: 'Missing required fields: eventTitle, calendarId, senderId, action' },
          { status: 400 }
        );
      }

      await sendEventNotification(eventData);
      return NextResponse.json({ message: 'Event notifications sent successfully' }, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}