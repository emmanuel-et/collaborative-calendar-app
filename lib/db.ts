import { ObjectId } from "mongodb";
import clientPromise from "@/utils/mongodb";
import { Event } from "@/models/Event";

export * from './userDb';
export * from './eventDb';
export * from './calendarDb';
export * from './notificationDb';

/**
 * Fetch events for a specific user within a specific calendar.
 * @param userId - The ID of the user.
 * @param calendarId - The ID of the calendar.
 * @returns A list of events matching the criteria.
 */
export async function getEventsByUserInCalendar(userId: string, calendarId: string): Promise<Event[]> {
  const client = await clientPromise;
  const db = client.db();

  return db.collection("events")
    .find<Event>({
      createdBy: userId,
      calendarId: new ObjectId(calendarId),
    })
    .toArray();
}