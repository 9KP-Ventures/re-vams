"use server";

import { getEventStats } from "@/actions/events";
import { CalendarCheck, CalendarIcon, Coins, UsersIcon } from "lucide-react";
import { cache } from "react";
import StatCard from "./event-stat-card";

// Cache the stats fetching
const getEventStatsCache = cache(getEventStats);

// Create a component that fetches all stats at once
export async function EventsStatsData() {
  const stats = await getEventStatsCache();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-6 sm:gap-4">
      <StatCard
        icon={<CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />}
        label="Total Events"
        value={stats.totalEvents}
      />
      <StatCard
        icon={<CalendarCheck className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />}
        label="Active Events"
        value={stats.activeEvents}
      />
      <StatCard
        icon={<Coins className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />}
        label="Revenue Generated"
        value={`₱${stats.totalRevenue}`}
      />
      <StatCard
        icon={<UsersIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />}
        label="Average Attendees"
        value={stats.averageAttendees}
      />
    </div>
  );
}
