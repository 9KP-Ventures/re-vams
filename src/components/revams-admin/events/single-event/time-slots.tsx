"use client";

import { useCallback, useEffect, useState } from "react";
import TimeSlot from "./time-slot";
import { GetAttendanceSlotsDataSuccess } from "@/lib/requests/events/attendance-slots/get-many";

export default function TimeSlotClient({
  slots,
  eventIsActive,
}: {
  slots: GetAttendanceSlotsDataSuccess["attendance_slots"];
  eventIsActive: boolean;
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stripColors, setStripColors] = useState<
    Record<number, string | undefined>
  >({});

  // Memoize the hasTimePassed function to avoid recreating it on each render
  const hasTimePassed = useCallback(
    (time: string): boolean => {
      // Parse the time string (expected format: "HH:MM:SS")
      const [hours, minutes, seconds] = time.split(":").map(Number);

      const timeToCompare = new Date();
      timeToCompare.setHours(hours, minutes, seconds || 0);

      return currentTime >= timeToCompare;
    },
    [currentTime]
  );

  // Memoize isLastTimeSlot function
  const isLastTimeSlot = useCallback(
    (slotId: number) => {
      return slotId === slots[slots.length - 1]?.id;
    },
    [slots]
  );

  // Memoize the findLatestPassedTimeSlot function
  const findLatestPassedTimeSlot = useCallback(() => {
    // First, sort the slots by time
    const sortedSlots = [...slots].sort((a, b) => {
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
  }, [slots, hasTimePassed]);

  // Memoize the updateStripColors function
  const updateStripColors = useCallback(() => {
    const latestPassedTimeSlotId = findLatestPassedTimeSlot();
    const newStripColors: Record<number, string | undefined> = {};

    slots.forEach(slot => {
      // Default strip color for inactive event
      if (!eventIsActive) {
        newStripColors[slot.id] = undefined;
        return;
      }

      const isPassed = hasTimePassed(slot.trigger_time);

      if (!isPassed) {
        newStripColors[slot.id] = undefined; // Default for unreached time slots
      } else if (
        slot.id === latestPassedTimeSlotId &&
        !isLastTimeSlot(slot.id)
      ) {
        newStripColors[slot.id] = "bg-secondary"; // Latest passed time slot (but not the last one)
      } else {
        newStripColors[slot.id] = "bg-primary"; // Other passed time slots or last time slot
      }
    });

    setStripColors(newStripColors);
  }, [
    slots,
    eventIsActive,
    hasTimePassed,
    findLatestPassedTimeSlot,
    isLastTimeSlot,
  ]);

  // Update the current time every minute
  useEffect(() => {
    // Calculate initial strip colors
    updateStripColors();

    // Set up interval to update the current time every minute
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 60000 milliseconds = 1 minute

    return () => clearInterval(intervalId);
  }, [updateStripColors]); // Add updateStripColors as a dependency

  // Recalculate strip colors when currentTime changes
  useEffect(() => {
    updateStripColors();
  }, [currentTime, updateStripColors]); // Add updateStripColors as a dependency

  return (
    <>
      {slots.map(slot => (
        <TimeSlot key={slot.id} data={slot} stripColor={stripColors[slot.id]} />
      ))}
    </>
  );
}
