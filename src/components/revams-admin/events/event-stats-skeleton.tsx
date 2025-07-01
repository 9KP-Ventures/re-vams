import { CalendarIcon, Coins, UsersIcon } from "lucide-react";

export function EventsStatsSkeleton() {
  return (
    <>
      <div className="flex flex-col items-center gap-4 text-primary">
        <CalendarIcon size={24} />
        <p className="h-6 animate-pulse bg-gray-200 rounded w-28"></p>
      </div>
      <div className="flex flex-col items-center gap-4 text-primary">
        <CalendarIcon size={24} />
        <p className="h-6 animate-pulse bg-gray-200 rounded w-28"></p>
      </div>
      <div className="flex flex-col items-center gap-4 text-primary">
        <Coins size={24} />
        <p className="h-6 animate-pulse bg-gray-200 rounded w-36"></p>
      </div>
      <div className="flex flex-col items-center gap-4 text-primary">
        <UsersIcon size={24} />
        <p className="h-6 animate-pulse bg-gray-200 rounded w-36"></p>
      </div>
    </>
  );
}
