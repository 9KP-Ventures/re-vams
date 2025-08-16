"use client";

import { CalendarIcon, Coins, UsersIcon, Clock } from "lucide-react";
import { GetEventDataSuccess } from "@/lib/requests/events/get+delete";
import StatCard from "../many-events/event-stat-card";

// Stats are easily based on existing data, no need to fetch
// TODO: Update actual data
export default function SingleEventStatsData({
  event,
}: {
  event: GetEventDataSuccess["event"];
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-6 sm:gap-4">
      <StatCard
        icon={<CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />}
        label="Event date"
        value={new Date(event.date).toLocaleString("en-US", {
          month: "long",
          day: "2-digit",
          year: "numeric",
        })}
      />
      <StatCard
        icon={<Clock className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />}
        label="Time Slots"
        value={4}
      />
      <StatCard
        icon={<Coins className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />}
        label="Absent Members"
        value={420}
      />
      <StatCard
        icon={<UsersIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />}
        label="Attended Members"
        value={69}
      />
    </div>
  );
}
