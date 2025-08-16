"use server";

import { getAttendanceSlots } from "@/actions/attendance-slots";
import AddTimeSlot from "./add-time-slot";
import TimeSlots from "./time-slots";

export default async function TimeSlotsWrapper({
  eventId,
  eventIsActive,
}: {
  eventId: number;
  eventIsActive: boolean;
}) {
  const timeSlotsData = await getAttendanceSlots(eventId);
  const maxTimeSlots = 6;

  if (!timeSlotsData) {
    return <>Error fetching time slots</>;
  }

  return (
    <>
      <TimeSlots slots={timeSlotsData} eventIsActive={eventIsActive} />

      {timeSlotsData.length < maxTimeSlots && !eventIsActive && <AddTimeSlot />}
    </>
  );
}
