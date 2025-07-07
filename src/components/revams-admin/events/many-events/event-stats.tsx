"use client";

import { EventsStatsData } from "./event-stats-data";

export default function EventsStats() {
  return (
    <div
      className="bg-secondary/12 dark:bg-primary/40 py-4 sm:py-5 md:py-7 px-3 sm:px-4 md:px-6 rounded-lg mb-6 sm:mb-8 md:mb-11"
      aria-label="Events statistics"
    >
      <EventsStatsData />
    </div>
  );
}
