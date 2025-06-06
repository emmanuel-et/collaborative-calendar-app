import clientPromise from "@/utils/mongodb";
import { Event, EventInput } from "@/models/Event";
import { ObjectId } from "mongodb";

export async function createEvent(eventData: EventInput): Promise<Event> {
  const client = await clientPromise;
  const db = client.db();

  const newEvent: Event = {
    ...eventData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("events").insertOne(newEvent);
  return { ...newEvent, _id: result.insertedId };
}

export async function getEventsByUser(userId: string): Promise<Event[]> {
  const client = await clientPromise;
  const db = client.db();
  // Fetch calendars where the user is a member

  const calendars = await db
    .collection("calendar")
    .find({ [`members.${userId}`]: { $exists: true } })
    .toArray();
  const calendarIds = calendars.map((calendar) => calendar._id.toString());

  // Fetch events from those calendars
  const events = await db
    .collection("events")
    .find({ calendarId: { $in: calendarIds } })
    .toArray();

  return events as Event[];
}

export async function getEventById(eventId: string): Promise<Event | null> {
  const client = await clientPromise;
  const db = client.db();

  return db.collection("events").findOne<Event>({ _id: new ObjectId(eventId) });
}

export async function getEventsByCalendar(
  calendarId: string
): Promise<Event[]> {
  const client = await clientPromise;
  const db = client.db();

  return db.collection("events").find<Event>({ calendarId }).toArray();
}

export async function getEventsByCalendarIds(
  calendarIds: string[]
): Promise<Event[]> {
  const client = await clientPromise;
  const db = client.db();

  const objectIds = calendarIds.map((id) => new ObjectId(id));
  return db
    .collection("events")
    .find<Event>({ calendarId: { $in: objectIds } })
    .toArray();
}

export async function getConflictingEvents(startTime: Date, endTime: Date, calendarIds: string[]): Promise<Event[]> {
  const client = await clientPromise;
  const db = client.db();

  const startString = startTime.toISOString();
  const endString = endTime.toISOString();

  return db
    .collection("events")
    .find<Event>({
      calendarId: { $in: calendarIds },
      $or: [
        { startTime: { $gte: startString, $lt: endString } },
        { endTime: { $gt: startString, $lte: endString } },
        { $and: [{ startString: { $lt: startString } }, { endString: { $gt: endString } }] },
      ],
    })
    .toArray();

}

export async function updateEvent(
  eventId: string,
  updateData: Partial<Event>
): Promise<Event | null> {
  const client = await clientPromise;
  const db = client.db();

  const result = await db
    .collection("events")
    .findOneAndUpdate(
      { _id: new ObjectId(eventId) },
      { $set: updateData },
      { returnDocument: "after" }
    );

  return result?.value || null;
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db();

  const result = await db
    .collection("events")
    .deleteOne({ _id: new ObjectId(eventId) });
  return result.deletedCount === 1;
}
