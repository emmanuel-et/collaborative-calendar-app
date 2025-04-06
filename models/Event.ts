import { ObjectId } from 'mongodb';

export interface Event {
  _id?: ObjectId;
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

export interface EventInput {
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