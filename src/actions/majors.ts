"use server";

import { getServerOrigin } from "@/app/utils/server";
import {
  GetProgramMajorsDataError,
  GetProgramMajorsDataSuccess,
} from "@/lib/requests/programs/majors/get";

export async function getMajorsForProgram(
  programId: number
): Promise<GetProgramMajorsDataSuccess["majors"]> {
  try {
    const origin = await getServerOrigin();
    const response: Response = await fetch(
      `${origin}/api/programs/${programId}/majors`,
      {
        cache: "force-cache",
        next: { revalidate: 3600 },
        method: "GET",
      }
    );

    if (!response.ok) {
      const data: GetProgramMajorsDataError = await response.json();
      const { error } = data;

      console.log(error);
      throw new Error(
        `Failed to fetch majors for program ${programId}: ${error.message}`
      );
    }

    const data: GetProgramMajorsDataSuccess = await response.json();
    const { majors } = data;

    return majors;
  } catch (error) {
    console.error(`Error fetching majors`, error);
    return [];
  }
}
