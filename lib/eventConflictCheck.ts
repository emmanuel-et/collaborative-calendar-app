import { Event } from "@/models/Event";


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

const DEFAULT_PRIORITY = 3; // Default to medium priority if undefined

export function separateConflicts(events: Event[]) {
  console.log(events)
  
  const sortedEvents = events.sort((a: Event, b: Event) => {
    if (doEventsOverlap(a, b)) {
      const aPriority = a.priority || DEFAULT_PRIORITY; // Default to medium priority if undefined
      const bPriority = b.priority || DEFAULT_PRIORITY; // Default to medium priority if undefined
      return aPriority - bPriority; // Higher priority first
    } else {
      return a.startTime.getMilliseconds() - b.startTime.getMilliseconds(); // No overlap
    }
  });
  let greedyEvent = sortedEvents[0];

  const higherPriorityEvents: Event[] = [];
  const lowerPriorityEvents: Event[] = [];
  
  for (let i = 1; i < sortedEvents.length; i++) {
    const event = sortedEvents[i];    
    if (!greedyEvent) continue;
    else if (doEventsOverlap(greedyEvent, event)) {
      const greedyEventPriority = greedyEvent.priority || DEFAULT_PRIORITY; // Default to medium priority if undefined
      const eventPriority = event.priority || DEFAULT_PRIORITY; // Default to medium priority if undefined
      if (eventPriority < greedyEventPriority) {
        lowerPriorityEvents.push(event);
      } else if (eventPriority > greedyEventPriority) {
        higherPriorityEvents.push(event);
        lowerPriorityEvents.push(greedyEvent);
        greedyEvent = event;
      } else {
        higherPriorityEvents.push(greedyEvent, event);
        greedyEvent = greedyEvent.endTime > event.endTime ? greedyEvent : event;
      }
    }
  }

  if (greedyEvent && greedyEvent != lowerPriorityEvents.at(-1) && greedyEvent != higherPriorityEvents.at(-1)) higherPriorityEvents.push(greedyEvent);

  return {
    higherPriorityEvents,
    lowerPriorityEvents,
  };
}