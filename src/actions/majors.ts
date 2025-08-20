"use server";

import { getServerOrigin } from "@/app/utils/server";
import {
  GetProgramMajorsDataError,
  GetProgramMajorsDataSuccess,
} from "@/lib/requests/programs/majors/get";

export async function getMajorsForProgram(
  programId: number
): Promise<GetProgramMajorsDataSuccess | GetProgramMajorsDataError> {
  try {
    const origin = await getServerOrigin();
    const response: Response = await fetch(
      `${origin}/api/programs/${programId}/majors`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const error: GetProgramMajorsDataError = await response.json();
      console.error(error);
      return error;
    }

    const data: GetProgramMajorsDataSuccess = await response.json();
    return data;
  } catch (error) {
    const errorMessage: GetProgramMajorsDataError = {
      error: {
        code: 500,
        message: `An unexpected error occurred while fetching the program majors: ${error}`,
      },
    };
    return errorMessage;
  }
}
