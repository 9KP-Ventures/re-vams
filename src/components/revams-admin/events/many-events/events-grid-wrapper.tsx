"use server";

import { getEvents } from "@/actions/events";
import EventsGrid from "./events-grid";
import NoEvents from "./no-events";
import { ValidatedEventsParams } from "@/app/admin/events/page";
import EventsPagination from "./event-pagination";
import { redirect } from "next/navigation";

export default async function EventsGridWrapper({
  params,
}: {
  params: ValidatedEventsParams;
}) {
  const data = await getEvents(params);

  if ("error" in data) {
    return redirect("/admin/events?error=true");
  }

  if (!data.events.length) {
    return <NoEvents fromParams={!!params} />;
  }

  return (
    <div className="flex flex-col justify-between gap-6">
      <EventsGrid events={data.events} />
      <EventsPagination pagination={data.pagination} />
    </div>
  );
}
