import { ObjectId } from 'mongodb';

export interface NotificationInput {
  userId: string;
  calendarId: ObjectId;
  message: string;
  read: boolean;
}

export interface Notification extends NotificationInput {
    _id?: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}