import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';
import { EventNotificationInput, InviteNotificationInput, Notification, NotificationInput, NotificationType } from '@/models/Notification';
import { getUserByEmail, getUserByUid } from './userDb';
import { addMemberToCalendar, getCalendarById, getEventById } from './db';
import { CalendarRole } from '@/models/Calendar';

export async function createNotification(notificationData: NotificationInput): Promise<Notification> {
  const client = await clientPromise;
  const db = client.db();

  // need to check if userId and calendarId exist in the database
  // if not, throw an error or handle it accordingly

  const newNotification: Notification = {
    ...notificationData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection('notifications').insertOne(newNotification);
  return { ...newNotification, _id: result.insertedId };
}

export async function sendEventNotification(eventData: EventNotificationInput) {
  const calendar = await getCalendarById(eventData.calendarId);

  if (!calendar) {
    throw new Error('Calendar with the provided ID does not exist.');
  }

  const sender = await getUserByUid(eventData.senderId);
  if (!sender) {
    throw new Error('Sender with the provided ID does not exist.');
  }

  const notificationPromises = Object.keys(calendar.members).map(async (userId) => {
    if (userId === sender.uid) {
      return;
    }

    const notificationData: NotificationInput = {
      userId: userId.toString(),
      calendarId: new ObjectId(eventData.calendarId),
      message: `The ${eventData.eventTitle} event in the ${calendar.name} calendar has been ${eventData.action} by ${sender.name}.`,
      type: NotificationType.EVENT,
    };

    return createNotification(notificationData);
  });

  await Promise.all(notificationPromises);
}

export async function sendInviteNotification(inviteData: InviteNotificationInput) {
  const user = await getUserByEmail(inviteData.email);
  
  if (!user) {
    // User not found, do not send the notification
    return;
  }

  const sender = await getUserByUid(inviteData.senderId);
  if (!sender) {
    throw new Error('Sender with the provided ID does not exist.');
  }

  // SENDER SHOULD NOT BE SAME AS USER
  if (user.uid === sender.uid) {
    return;
  }

  const calendar = await getCalendarById(inviteData.calendarId);

  const notificationData: NotificationInput = {
    userId: user.uid.toString(),
    calendarId: new ObjectId(inviteData.calendarId),
    message: `You have been invited to a calendar, ${calendar?.name}, by ${sender.name} with the role: ${inviteData.role}.`,
    type: NotificationType.INVITE,
  };

  return await createNotification(notificationData);
}

export async function getNotificationsByUser(userId: string): Promise<Notification[]> {
  const client = await clientPromise;
  const db = client.db();

  return db.collection('notifications')
    .find<Notification>({ userId })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function deleteNotification(notificationId: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection('notifications').deleteOne({ _id: new ObjectId(notificationId) });
  return result.deletedCount === 1;
}

export async function acceptCalendarInvite(notificationId: string, data: any): Promise<boolean> {
  const { calendarId, message, userId } = data;

  // Extract the role from the message
  const roleMatch = message.match(/role: (\w+)\./);
  const role = roleMatch ? roleMatch[1] : null;
  
  if (!role || !Object.values(CalendarRole).includes(role as CalendarRole)) {
    throw new Error('Invalid role in the notification message.');
  }

  await addMemberToCalendar(calendarId, userId, CalendarRole[role.toUpperCase() as keyof typeof CalendarRole]);

  const result = await deleteNotification(notificationId);
  return result;
}