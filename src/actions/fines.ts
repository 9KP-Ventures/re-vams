"use server";

import { getServerOrigin } from "@/app/utils/server";
import {
  GetStudentFinesDataError,
  GetStudentFinesDataSuccess,
} from "@/lib/requests/events/fines/get-student-fines";

export async function getStudentFines(
  eventId: number,
  studentId: string
): Promise<GetStudentFinesDataSuccess | GetStudentFinesDataError> {
  try {
    const origin = await getServerOrigin();

    const url = `${origin}/api/events/${eventId}/fines/${studentId}`;

    const response: Response = await fetch(url, {
      method: "GET",
      cache: "no-cache",
    });

    if (!response.ok) {
      const error: GetStudentFinesDataError = await response.json();
      console.error(error);
      return error;
    }

    const data: GetStudentFinesDataSuccess = await response.json();
    return data;
  } catch (error) {
    const errorMessage: GetStudentFinesDataError = {
      error: {
        code: 500,
        message: `An unexpected error occurred while fetching student fines data: ${error}`,
      },
    };
    return errorMessage;
  }
}
