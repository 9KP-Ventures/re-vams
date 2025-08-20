"use server";

import { getServerOrigin } from "@/app/utils/server";
import {
  GetAttendanceSlotDataError,
  GetAttendanceSlotDataSuccess,
} from "@/lib/requests/events/attendance-slots/get+delete";

export async function getAttendanceSlot(
  eventId: number,
  slotId: number
): Promise<GetAttendanceSlotDataSuccess | GetAttendanceSlotDataError> {
  try {
    const origin = await getServerOrigin();

    const url = `${origin}/api/events/${eventId}/attendance-slots/${slotId}`;

    const response: Response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      const error: GetAttendanceSlotDataError = await response.json();
      console.error(error);
      return error;
    }

    const data: GetAttendanceSlotDataSuccess = await response.json();
    return data;
  } catch (error) {
    const errorMessage: GetAttendanceSlotDataError = {
      error: {
        code: 500,
        message: `An unexpected error occurred while fetching the time slot data: ${error}`,
      },
    };
    return errorMessage;
  }
}
