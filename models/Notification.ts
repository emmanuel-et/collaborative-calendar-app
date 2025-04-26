import { ObjectId } from 'mongodb';

export enum NotificationType {
  INVITE = 'invite',
  EVENT = 'event',
}

export interface NotificationInput {
  userId: string;
  calendarId: ObjectId;
  message: string;
  type: NotificationType;
}

export interface Notification extends NotificationInput {
    _id?: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface InviteNotificationInput {
  email: string;
  role: string;
  calendarId: string;
  senderId: string;
}

export interface EventNotificationInput {
  calendarId: string;
  eventTitle: string;
  senderId: string;
  action: string; // e.g., "created", "updated", "deleted"
}
