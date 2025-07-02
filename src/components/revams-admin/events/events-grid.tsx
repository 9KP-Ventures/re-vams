"use client";

import { GetEventsDataSuccess } from "@/lib/requests/events/get-many";
import EventCard from "./event-card";

export default function EventsGrid({
  events,
}: {
  events: GetEventsDataSuccess["events"];
}) {
  return (
    <ul
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
      aria-label="Event cards list"
    >
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </ul>
  );
}
