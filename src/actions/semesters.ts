"use server";

import { getServerOrigin } from "@/app/utils/server";
import {
  GetSemestersDataError,
  GetSemestersDataSuccess,
} from "@/lib/requests/semesters/get-many";

export async function getSemesters(): Promise<
  GetSemestersDataSuccess | GetSemestersDataError
> {
  try {
    const origin = await getServerOrigin();
    const response: Response = await fetch(
      `${origin}/api/semesters?sortBy=name&sortOrder=asc`,
      {
        cache: "force-cache",
        method: "GET",
      }
    );

    if (!response.ok) {
      const error: GetSemestersDataError = await response.json();
      console.error(error);
      return error;
    }

    const data: GetSemestersDataSuccess = await response.json();
    return data;
  } catch (error) {
    const errorMessage: GetSemestersDataError = {
      error: {
        code: 500,
        message: `An unexpected error occurred while fetching the semesters: ${error}`,
      },
    };
    return errorMessage;
  }
}
