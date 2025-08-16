"use server";

import { getEvents } from "@/actions/events";
import EventsGrid from "./events-grid";
import NoEvents from "./no-events";
import { ValidatedEventsParams } from "@/app/admin/events/page";
import EventsPagination from "./event-pagination";

export default async function EventsGridWrapper({
  params,
}: {
  params: ValidatedEventsParams;
}) {
  const eventsData = await getEvents(params);

  if (!eventsData || eventsData.events.length === 0) {
    return <NoEvents fromParams={!!params} />;
  }

  return (
    <div className="flex flex-col justify-between gap-6">
      <EventsGrid events={eventsData.events} />
      <EventsPagination pagination={eventsData.pagination} />
    </div>
  );
}
