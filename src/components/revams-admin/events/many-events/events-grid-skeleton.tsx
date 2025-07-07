import EventCardSkeleton from "./event-card-skeleton";

export function EventsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-4 md:gap-6 xl:gap-12"
      aria-label="Event cards loading"
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`
            ${i >= 1 ? "hidden" : ""}
            ${i >= 1 && i < 3 ? "md:block" : ""}
            ${i >= 3 && i < 4 ? "md:hidden xl:block" : ""}
            ${i >= 4 ? "hidden" : ""}
          `}
        >
          <EventCardSkeleton />
        </div>
      ))}
    </ul>
  );
}
