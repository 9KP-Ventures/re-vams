"use client";

export default function TimeSlotSkeleton() {
  return (
    <div className="py-4 sm:py-7 overflow-hidden relative bg-card rounded-lg border shadow-sm animate-pulse">
      {/* Notch strip skeleton */}
      <div className="absolute right-0 top-0 w-4 sm:w-8 h-full bg-muted rounded-r-md"></div>

      <div className="pl-3 pr-10 sm:pr-16 sm:pl-6 flex gap-4 md:gap-6">
        {/* Icon placeholder */}
        <div className="bg-muted w-8 h-8 md:h-10 md:w-10 rounded-md flex self-center p-2"></div>

        {/* Content container */}
        <div className="flex flex-col flex-1 gap-3">
          {/* Top row with time, badge and ID */}
          <div className="flex items-center gap-3">
            {/* Time placeholder */}
            <div className="h-5 sm:h-6 bg-muted rounded-md w-20 sm:w-24"></div>

            {/* Badge placeholder */}
            <div className="h-4 sm:h-5 bg-muted rounded-full w-12 sm:w-16"></div>

            {/* ID placeholder - positioned to match real component */}
            <div className="ml-auto h-5 sm:h-6 bg-muted rounded-md w-8 sm:w-10"></div>
          </div>

          {/* Amount placeholder */}
          <div className="h-4 bg-muted rounded-md w-14 sm:w-20"></div>
        </div>
      </div>
    </div>
  );
}
