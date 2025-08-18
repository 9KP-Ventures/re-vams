"use server";

import { getServerOrigin } from "@/app/utils/server";
import {
  GetAttendanceSlotDataError,
  GetAttendanceSlotDataSuccess,
} from "@/lib/requests/events/attendance-slots/get+delete";

export async function getAttendanceSlot(
  eventId: number,
  slotId: number
): Promise<GetAttendanceSlotDataSuccess | null> {
  try {
    const origin = await getServerOrigin();

    const url = `${origin}/api/events/${eventId}/attendance-slots/${slotId}`;

    const response: Response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      const data: GetAttendanceSlotDataError = await response.json();
      const { error } = data;

      console.log(error);
      throw new Error(`${error.message}`);
    }

    const data: GetAttendanceSlotDataSuccess = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetch time slot data:", error);
    return null;
  }
}
