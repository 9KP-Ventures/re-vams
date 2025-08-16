"use server";

import { getAttendanceSlots } from "@/actions/attendance-slots";
import AddTimeSlot from "./add-time-slot";
import TimeSlot from "./time-slot";
import { GetAttendanceSlotsDataSuccess } from "@/lib/requests/events/attendance-slots/get-many";

export default async function TimeSlots({
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

  const hasTimePassed = (time: string): boolean => {
    // Parse the time string (expected format: "HH:MM:SS")
    const [hours, minutes, seconds] = time.split(":").map(Number);

    const now = new Date();
    const timeToCompare = new Date();
    timeToCompare.setHours(hours, minutes, seconds || 0);

    return now >= timeToCompare;
  };

  // Find the latest passed time slot
  const findLatestPassedTimeSlot = () => {
    // First, sort the slots by time
    const sortedSlots = [...timeSlotsData].sort((a, b) => {
      return a.trigger_time.localeCompare(b.trigger_time);
    });

    // Find the index of the latest passed time slot
    let latestPassedIndex = -1;
    for (let i = 0; i < sortedSlots.length; i++) {
      if (hasTimePassed(sortedSlots[i].trigger_time)) {
        latestPassedIndex = i;
      } else {
        break; // Stop once we find a future time slot
      }
    }

    if (latestPassedIndex !== -1) {
      return sortedSlots[latestPassedIndex].id;
    }

    return null;
  };

  const latestPassedTimeSlotId = findLatestPassedTimeSlot();
  const isLastTimeSlot = (slotId: number) => {
    return slotId === timeSlotsData[timeSlotsData.length - 1].id;
  };

  // Determine strip color for each time slot
  const getStripColor = (
    slot: GetAttendanceSlotsDataSuccess["attendance_slots"][0]
  ) => {
    // Default strip color for inactive event
    if (!eventIsActive) {
      return undefined;
    }

    const isPassed = hasTimePassed(slot.trigger_time);

    if (!isPassed) {
      return undefined; // Default for unreached time slots
    }

    if (slot.id === latestPassedTimeSlotId && !isLastTimeSlot(slot.id)) {
      return "bg-secondary"; // Latest passed time slot (but not the last one)
    }

    return "bg-primary"; // Other passed time slots or last time slot
  };

  return (
    <>
      {timeSlotsData.map(slot => {
        return (
          <TimeSlot
            key={slot.id}
            data={slot}
            stripColor={getStripColor(slot)}
          />
        );
      })}

      {timeSlotsData.length < maxTimeSlots && !eventIsActive && <AddTimeSlot />}
    </>
  );
}
