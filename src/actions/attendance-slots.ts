"use server";

import { getServerOrigin } from "@/app/utils/server";
import {
  GetAttendanceSlotsDataError,
  GetAttendanceSlotsDataSuccess,
} from "@/lib/requests/events/attendance-slots/get-many";

export async function getAttendanceSlots(
  eventId: number
): Promise<GetAttendanceSlotsDataSuccess | GetAttendanceSlotsDataError> {
  try {
    const origin = await getServerOrigin();

    const url = `${origin}/api/events/${eventId}/attendance-slots?sort_by=trigger_time&sort_order=asc`;

    const response: Response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      const error: GetAttendanceSlotsDataError = await response.json();
      console.error(error);
      return error;
    }

    const data: GetAttendanceSlotsDataSuccess = await response.json();
    return data;
  } catch (error) {
    const errorMessage: GetAttendanceSlotsDataError = {
      error: {
        code: 500,
        message: `An unexpected error occurred while fetching the attendance slots: ${error}`,
      },
    };
    return errorMessage;
  }
}
