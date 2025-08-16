import { GetEventDataSuccess } from "@/lib/requests/events/get+delete";
import TimeSlots from "./time-slots";
import StudentLookup from "./student-lookup";

export default function MainEventViewPage({
  event,
}: {
  event: GetEventDataSuccess["event"];
}) {
  return (
    <>
      {/* Time slots and student look-up section */}
      <div className="flex gap-2 mt-4">
        {/* Time slots */}
        <div className="w-full lg:w-1/2 pr-0 lg:pr-5 2xl:pr-14 space-y-5">
          <TimeSlots
            eventId={event.id}
            eventIsActive={event.status === "active"}
          />
        </div>

        {/* Student look-up */}
        <div className="hidden lg:block w-1/2 h-full flex-grow">
          <StudentLookup
            eventId={event.id}
            eventIsActive={event.status === "active"}
          />
        </div>
      </div>
    </>
  );
}
