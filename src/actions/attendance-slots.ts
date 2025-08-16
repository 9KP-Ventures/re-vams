import { getServerOrigin } from "@/app/utils/server";
import {
  GetAttendanceSlotsDataError,
  GetAttendanceSlotsDataSuccess,
} from "@/lib/requests/events/attendance-slots/get-many";

export async function getAttendanceSlots(
  eventId: number
): Promise<GetAttendanceSlotsDataSuccess["attendance_slots"] | null> {
  try {
    const origin = await getServerOrigin();

    const url = `${origin}/api/events/${eventId}/attendance-slots?sort_by=trigger_time&sort_order=asc`;

    const response: Response = await fetch(url, {
      method: "GET",
      cache: "no-cache",
    });

    if (!response.ok) {
      const data: GetAttendanceSlotsDataError = await response.json();
      const { error } = data;

      console.log(error);
      throw new Error(`${error.message}`);
    }

    const data: GetAttendanceSlotsDataSuccess = await response.json();
    return data["attendance_slots"];
  } catch (error) {
    console.error(`Error fetching attendance slots:`, error);
    return null;
  }
}
