"use server";

import { Suspense } from "react";
import { EventsStatsSkeleton } from "./event-stats-skeleton";
import { EventsStatsData } from "./event-stats-data";

export default async function EventsStats() {
  return (
    <div
      className="bg-secondary/12 py-7 rounded-lg mb-11"
      aria-label="Events statistics"
    >
      <div className="grid grid-cols-4 gap-4">
        <Suspense fallback={<EventsStatsSkeleton />}>
          <EventsStatsData />
        </Suspense>
      </div>
    </div>
  );
}
