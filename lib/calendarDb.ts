import clientPromise from '@/utils/mongodb';
import { Calendar, CalendarInput } from '@/models/Calendar';
import { ObjectId } from 'mongodb';

export async function createCalendar(calendarData: CalendarInput): Promise<Calendar> {
  const client = await clientPromise;
  const db = client.db();
  
  const newCalendar: Calendar = {
    ...calendarData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const result = await db.collection('calendar').insertOne(newCalendar);
  return { ...newCalendar, _id: result.insertedId };
}

export async function getCalendarsByUser(userId: string): Promise<Calendar[]> {
  const client = await clientPromise;
  const db = client.db();
  
  return db.collection('calendar')
    .find<Calendar>({ [`members.${userId}`]: { $exists: true } })
    .toArray();
}


export async function getCalendarById(calendarId: string): Promise<Calendar | null> {
  const client = await clientPromise;
  const db = client.db();
  
  return db.collection('calendar').findOne<Calendar>({ _id: new ObjectId(calendarId) });
}

export async function updateCalendar(calendarId: string, calendarData: Partial<Calendar>): Promise<Calendar | null> {
  const client = await clientPromise;
  const db = client.db();
  
  const updateData = {
    ...calendarData,
    updatedAt: new Date(),
  };
  
  const result = await db.collection('calendar').findOneAndUpdate(
    { _id: new ObjectId(calendarId) },
    { $set: updateData },
    { returnDocument: 'after' }
  );

  return result as Calendar || null;
}

export async function addMemberToCalendar(calendarId: string, userId: string, role: string): Promise<Calendar | null> {
  const client = await clientPromise;
  const db = client.db();

  const updateData = {
    [`members.${userId}`]: role,
    updatedAt: new Date(),
  };

  const result = await db.collection('calendar').findOneAndUpdate(
    { _id: new ObjectId(calendarId) },
    { $set: updateData },
    { returnDocument: 'after' }
  );

  return result?.value as Calendar || null;
}

export async function deleteCalendar(calendarId: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db();

  // still need to handle deleting events and notifications related to this calendar
  
  const result = await db.collection('calendar').deleteOne({ _id: new ObjectId(calendarId) });
  return result.deletedCount === 1;
}