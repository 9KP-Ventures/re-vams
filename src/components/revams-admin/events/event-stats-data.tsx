"use server";

import { getEventStats } from "@/actions/events";
import { CalendarIcon, Coins, UsersIcon } from "lucide-react";
import { cache } from "react";

// Cache the stats fetching
const getEventStatsCache = cache(getEventStats);

// Create a component that fetches all stats at once
export async function EventsStatsData() {
  const stats = await getEventStatsCache();

  return (
    <>
      <div className="flex flex-col items-center gap-4 text-primary">
        <CalendarIcon size={24} />
        <p>{stats.totalEvents} Total Events</p>
      </div>
      <div className="flex flex-col items-center gap-4 text-primary">
        <CalendarIcon size={24} />
        <p>{stats.activeEvents} Active Events</p>
      </div>
      <div className="flex flex-col items-center gap-4 text-primary">
        <Coins size={24} />
        <p>₱{stats.totalRevenue} Revenue Generated</p>
      </div>
      <div className="flex flex-col items-center gap-4 text-primary">
        <UsersIcon size={24} />
        <p>{stats.averageAttendees} Average Attendees</p>
      </div>
    </>
  );
}
