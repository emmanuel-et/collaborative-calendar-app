import { Event } from "@/models/Event";

/**
 * 
 * @param event1 First event 
 * @param event2 Second event 
 * @returns true if events overlap
 */
export function doEventsOverlap(event1: any, event2: any): boolean {
  const start1 = new Date(event1.startTime).getTime();
  const end1 = new Date(event1.endTime).getTime();
  const start2 = new Date(event2.startTime).getTime();
  const end2 = new Date(event2.endTime).getTime();
  return (
    (start1 >= start2 && start1 < end2) || 
    (start2 >= start1 && start2 < end1) || 
    (start1 <= start2 && end1 >= end2) || 
    (start2 <= start1 && end2 >= end1) 
  );
}

export function findConflictingEvents(
  newEvent: any,
  existingEvents: any[]
): any[] {

  const otherEvents = existingEvents.filter(
    (event) => {
      
      const eventId = event._id?.toString ? event._id.toString() : event._id;
      const newEventId = newEvent._id?.toString ? newEvent._id.toString() : newEvent._id;
      return eventId !== newEventId;
    }
  );


  return otherEvents.filter((event) => doEventsOverlap(newEvent, event));
} 