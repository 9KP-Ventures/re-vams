"use server";

import { getServerOrigin } from "@/app/utils/server";
import {
  GetYearLevelsDataError,
  GetYearLevelsDataSuccess,
} from "@/lib/requests/year-levels/get";

export async function getYearLevels(): Promise<
  GetYearLevelsDataSuccess | GetYearLevelsDataError
> {
  try {
    const origin = await getServerOrigin();
    const response: Response = await fetch(`${origin}/api/year-levels`, {
      method: "GET",
    });

    if (!response.ok) {
      const error: GetYearLevelsDataError = await response.json();
      console.error(error);
      return error;
    }

    const data: GetYearLevelsDataSuccess = await response.json();
    return data;
  } catch (error) {
    const errorMesage: GetYearLevelsDataError = {
      error: {
        code: 500,
        message: `An unexpected error occurred while fetching the year levels: ${error}`,
      },
    };
    return errorMesage;
  }
}
