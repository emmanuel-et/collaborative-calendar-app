import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  uid: string; // Firebase Auth UID
  email: string;
  name: string;
  calendars?: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
  };
}

export interface UserInput {
  uid: string;
  email: string;
  name: string;
} 