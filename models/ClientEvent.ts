import { ObjectId } from "@/utils/objectId";

export interface ClientEvent {
  _id?: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientEventInput {
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
} 