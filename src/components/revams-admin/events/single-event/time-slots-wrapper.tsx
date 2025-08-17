"use server";

import { getAttendanceSlots } from "@/actions/attendance-slots";
import AddTimeSlot from "./add-time-slot";
import TimeSlots from "./time-slots";
import { GetEventDataSuccess } from "@/lib/requests/events/get+delete";

export default async function TimeSlotsWrapper({
  event,
}: {
  event: GetEventDataSuccess["event"];
}) {
  const disabled = event.status === "upcoming";
  const timeSlotsData = await getAttendanceSlots(event.id);
  const maxTimeSlots = 6;

  if (!timeSlotsData) {
    return <>Error fetching time slots</>;
  }

  return (
    <>
      <TimeSlots slots={timeSlotsData} event={event} />

      {timeSlotsData.length < maxTimeSlots && disabled && <AddTimeSlot />}
    </>
  );
}
