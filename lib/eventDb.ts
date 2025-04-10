import clientPromise from '@/utils/mongodb';
import { Event, EventInput } from '@/models/Event';
import { ObjectId } from 'mongodb';

export async function createEvent(eventData: EventInput): Promise<Event> {
  const client = await clientPromise;
  const db = client.db();
  
  const newEvent: Event = {
    ...eventData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const result = await db.collection('events').insertOne(newEvent);
  return { ...newEvent, _id: result.insertedId };
}

export async function getEventsByUser(userId: string): Promise<Event[]> {
  const client = await clientPromise;
  const db = client.db();
  
  return db.collection('events')
    .find<Event>({ 
      $or: [
        { createdBy: userId },
        { participants: userId }
      ]
    })
    .toArray();
}

export async function getEventById(eventId: string): Promise<Event | null> {
  const client = await clientPromise;
  const db = client.db();
  
  return db.collection('events').findOne<Event>({ _id: new ObjectId(eventId) });
}

export async function getEventsByCalendar(calendarId: string): Promise<Event[]> {
  const client = await clientPromise;
  const db = client.db();

  return db.collection('events').find<Event>({ calendarId: new ObjectId(calendarId) }).toArray();
}

export async function getEventsByCalendarIds(calendarIds: string[]): Promise<Event[]> {
  const client = await clientPromise;
  const db = client.db();

  const objectIds = calendarIds.map(id => new ObjectId(id));
  return db.collection('events').find<Event>({ calendarId: { $in: objectIds } }).toArray();
}

export async function updateEvent(eventId: string, eventData: Partial<Event>): Promise<Event | null> {
  const client = await clientPromise;
  const db = client.db();
  
  const updateData = {
    ...eventData,
    updatedAt: new Date(),
  };
  
  const result = await db.collection('events').findOneAndUpdate(
    { _id: new ObjectId(eventId) },
    { $set: updateData },
    { returnDocument: 'after' }
  );
  
  return result?.value || null;
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db();
  
  const result = await db.collection('events').deleteOne({ _id: new ObjectId(eventId) });
  return result.deletedCount === 1;
}
