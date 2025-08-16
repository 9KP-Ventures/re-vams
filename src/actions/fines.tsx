import { getServerOrigin } from "@/app/utils/server";
import {
  GetStudentFinesDataError,
  GetStudentFinesDataSuccess,
} from "@/lib/requests/events/fines/get-student-fines";

export async function getStudentFines(
  eventId: number,
  studentId: string
): Promise<GetStudentFinesDataSuccess | null> {
  try {
    const origin = await getServerOrigin();

    const url = `${origin}/api/events/${eventId}/fines/${studentId}`;

    const response: Response = await fetch(url, {
      method: "GET",
      cache: "no-cache",
    });

    if (!response.ok) {
      const data: GetStudentFinesDataError = await response.json();
      const { error } = data;

      console.log(error);
      throw new Error(`${error.message}`);
    }

    const data: GetStudentFinesDataSuccess = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching student fines:", error);
    return null;
  }
}
