"use client";

export default function TimeSlotSkeleton() {
  return (
    <div className="py-4 sm:py-7 overflow-hidden relative bg-card rounded-lg border shadow-sm animate-pulse">
      {/* Notch strip skeleton */}
      <div className="absolute right-0 top-0 w-4 sm:w-8 h-full bg-muted rounded-r-md"></div>

      <div className="pl-3 pr-6 sm:px-6 flex gap-4 md:gap-8">
        <div className="bg-muted w-8 h-8 md:h-12 md:w-12 rounded-md flex self-center"></div>
        <div className="flex flex-col w-full min-[400px]:w-[65%] sm:w-[70%] lg:w-[50%] xl:w-[60%] 2xl:w-[70%] space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between min-[400px]:justify-normal gap-4">
            <div className="h-5 sm:h-6 bg-muted rounded-md w-20 sm:w-24"></div>
            <div className="h-4 sm:h-5 bg-muted rounded-full w-12 sm:w-16 mr-2 min-[400px]:mr-0"></div>
          </div>
          <div className="h-4 bg-muted rounded-md w-14 sm:w-20"></div>
        </div>
        <div className="hidden min-[400px]:block self-center h-8 w-8 bg-muted rounded-md"></div>
      </div>
    </div>
  );
}
