"use client";
import { CalendarCheck, CalendarIcon, Coins, UsersIcon } from "lucide-react";

export function EventsStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-6 sm:gap-4">
      <StatSkeleton
        icon={<CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />}
        width="w-24 sm:w-28"
      />
      <StatSkeleton
        icon={<CalendarCheck className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />}
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

export function StatSkeleton({
  icon,
  width,
}: {
  icon: React.ReactNode;
  width: string;
}) {
  return (
    <div className="flex flex-col items-center text-center text-muted-foreground">
      <div className="bg-secondary/20 p-2 sm:p-3 md:p-4 rounded-full mb-2 md:mb-3">
        <div className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7">{icon}</div>
      </div>
      <div
        className={`h-5 sm:h-6 animate-pulse bg-muted rounded ${width}`}
      ></div>
      <div className="h-4 animate-pulse bg-muted/70 rounded w-16 sm:w-20 mt-1"></div>
    </div>
  );
}
