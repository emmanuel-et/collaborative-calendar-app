import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';
import { InviteNotificationInput, Notification, NotificationInput, NotificationType } from '@/models/Notification';
import { getUserByEmail, getUserByUid } from './userDb';

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

  const notificationData: NotificationInput = {
    userId: user.uid.toString(),
    calendarId: new ObjectId(), // TODO: replace with actual calendarId
    message: `You have been invited to a calendar by ${sender.name} with the role: ${inviteData.role}.`,
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

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection('notifications').updateOne(
    { _id: new ObjectId(notificationId) },
    { $set: { read: true } }
  );

  return result.modifiedCount === 1;
}

export async function deleteNotification(notificationId: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection('notifications').deleteOne({ _id: new ObjectId(notificationId) });
  return result.deletedCount === 1;
}
