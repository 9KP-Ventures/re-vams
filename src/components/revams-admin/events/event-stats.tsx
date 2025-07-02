"use server";

import { Suspense } from "react";
import { EventsStatsSkeleton } from "./event-stats-skeleton";
import { EventsStatsData } from "./event-stats-data";

export default async function EventsStats() {
  return (
    <div
      className="bg-secondary/12 dark:bg-primary/40 py-4 sm:py-5 md:py-7 px-3 sm:px-4 md:px-6 rounded-lg mb-6 sm:mb-8 md:mb-11"
      aria-label="Events statistics"
    >
      <Suspense fallback={<EventsStatsSkeleton />}>
        <EventsStatsData />
      </Suspense>
    </div>
  );
}
