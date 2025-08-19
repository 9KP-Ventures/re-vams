"use client";

import SingleEventHeaderSkeleton from "./event-header-and-stats-skeleton";
import StudentLookupSkeleton from "./student-lookup-skeleton";
import TimeSlotSkeleton from "./time-slot-skeleton";

export default function MainEventViewPageSkeleton() {
  return (
    <>
      {/* Event header skeleton */}
      <SingleEventHeaderSkeleton />
      {/* Time slots and student look-up section */}
      <div className="flex gap-2 mt-4">
        {/* Time slots skeleton */}
        <div className="w-full lg:w-1/2 pr-0 lg:pr-5 2xl:pr-14 space-y-5">
          <TimeSlotSkeleton />
          <TimeSlotSkeleton />
        </div>

        {/* Student look-up skeleton */}
        <div className="hidden lg:block w-1/2 h-full flex-grow">
          <StudentLookupSkeleton />
        </div>
      </div>
    </>
  );
}
