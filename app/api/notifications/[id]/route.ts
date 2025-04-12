import { acceptCalendarInvite, deleteNotification, getNotificationsByUser } from '@/lib/notificationDb';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/notifications/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = (await params).id;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const notifications = await getNotificationsByUser(userId);

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error('Error retrieving notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


// DELETE /api/notifications/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const notificationId = (await params).id;

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }

    await deleteNotification(notificationId);

    return NextResponse.json({ message: 'Notification deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/notifications/[id]
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const notificationId = (await params).id;
    const data = await request.json();

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }

    await acceptCalendarInvite(notificationId, data);

    return NextResponse.json({ message: 'Notification accepted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error accepting notification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}