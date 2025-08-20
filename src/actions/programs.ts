"use server";

import { getServerOrigin } from "@/app/utils/server";
import {
  GetProgramsDataError,
  GetProgramsDataSuccess,
} from "@/lib/requests/programs/get";

export async function getPrograms(): Promise<
  GetProgramsDataSuccess | GetProgramsDataError
> {
  try {
    const origin = await getServerOrigin();
    const response: Response = await fetch(
      `${origin}/api/programs?sortBy=name&sortOrder=asc`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const error: GetProgramsDataError = await response.json();
      console.error(error);
      return error;
    }

    const data: GetProgramsDataSuccess = await response.json();
    return data;
  } catch (error) {
    const errorMessage: GetProgramsDataError = {
      error: {
        code: 500,
        message: `An unexpected error occurred while fetching the programs: ${error}`,
      },
    };
    return errorMessage;
  }
}
