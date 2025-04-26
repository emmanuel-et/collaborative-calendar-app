import { ObjectId } from "mongodb";

export interface Event {
  _id?: ObjectId;
  calendarId: ObjectId;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  createdBy: string; // Firebase UID
  participants: string[]; // Firebase UIDs
  isAllDay: boolean;
  color?: string;
  priority?: number; // 1 to 5
  createdAt: Date;
  updatedAt: Date;
}

export interface EventInput {
  calendarId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  createdBy: string; // Firebase UID
  participants: string[]; // Firebase UIDs
  isAllDay: boolean;
  color?: string;
  priority?: number; // 1 to 5
}
