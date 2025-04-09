import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';
import { Notification, NotificationInput } from '@/models/Notification';

export async function createNotification(notificationData: NotificationInput): Promise<Notification> {
  const client = await clientPromise;
  const db = client.db();

  // need to check if userId and calendarId exist in the database
  // if not, throw an error or handle it accordingly

  const newNotification: Notification = {
    ...notificationData,
    createdAt: new Date(),
    updatedAt: new Date(),
    read: false,
  };

  const result = await db.collection('notifications').insertOne(newNotification);
  return { ...newNotification, _id: result.insertedId };
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
