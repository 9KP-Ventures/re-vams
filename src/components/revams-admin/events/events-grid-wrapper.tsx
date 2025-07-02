"use server";

import { getEvents } from "@/actions/events";
import EventsGrid from "./events-grid";
import NoEvents from "./no-events";
import { ValidatedSearchParams } from "@/app/admin/events/page";
import EventsPagination from "./event-pagination";

export default async function EventsGridWrapper({
  params,
}: {
  params: ValidatedSearchParams;
}) {
  const eventsData = await getEvents({
    page: params.page ?? 1,
    limit: params.limit ?? 6,
    search: params.search,
    status: params.status,
    sort: params.sort || "date",
    order: params.order || "desc",
  });

  if (!eventsData || eventsData.events.length === 0) {
    return <NoEvents isSearching={!!params.search} />;
  }

  return (
    <div className="flex-grow flex flex-col justify-between gap-8">
      <EventsGrid events={eventsData.events} />
      <EventsPagination pagination={eventsData.pagination} params={params}/>
    </div>
  );
}
