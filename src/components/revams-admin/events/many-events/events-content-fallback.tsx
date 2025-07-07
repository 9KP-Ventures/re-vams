import EventsPaginationSkeleton from "./event-pagination-skeleton";
import { EventsGridSkeleton } from "./events-grid-skeleton";

export default function EventsContentFallback() {
  return (
    <div className="flex-grow flex flex-col justify-between gap-8">
      <EventsGridSkeleton count={4} />
      <EventsPaginationSkeleton />
    </div>
  );
}
