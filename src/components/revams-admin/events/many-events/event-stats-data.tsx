"use client";

import { EventsStats, getEventsStats } from "@/actions/events";
import { CalendarCheck, CalendarIcon, Coins, UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import StatCard from "./event-stat-card";
import { StatSkeleton } from "./event-stat-skeleton";

// Create a component that fetches all stats at once
export function EventsStatsData() {
  const [stats, setStats] = useState<EventsStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEventsStats = async () => {
      setLoading(true);
      const stats = await getEventsStats();

      setStats(stats);
      setLoading(false);
    };

    fetchEventsStats();

    return () => {
      setStats(null);
    };
  }, []);

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-6 sm:gap-4">
        <StatSkeleton
          icon={
            <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
          }
          width="w-24 sm:w-28"
        />
        <StatSkeleton
          icon={
            <CalendarCheck className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
          }
          width="w-24 sm:w-28"
        />
        <StatSkeleton
          icon={<Coins className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />}
          width="w-32 sm:w-36"
        />
        <StatSkeleton
          icon={<UsersIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />}
          width="w-32 sm:w-36"
        />
      </div>
    );
  }

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
