import { sendInviteNotification } from '@/lib/db';
import { InviteNotificationInput } from '@/models/Notification';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/notifications?type=invite
export async function POST(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type');

    if (type !== 'invite') {
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
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 