"use server";

import { getServerOrigin } from "@/app/utils/server";
import {
  GetSemestersDataError,
  GetSemestersDataSuccess,
} from "@/lib/requests/semesters/get-many";

export async function getSemesters(): Promise<
  GetSemestersDataSuccess["semesters"]
> {
  try {
    const origin = await getServerOrigin();
    const response: Response = await fetch(
      `${origin}/api/semesters?sortBy=name&sortOrder=asc`,
      {
        cache: "force-cache",
        next: { revalidate: 3600 }, // Revalidate every hour
        method: "GET",
      }
    );

    if (!response.ok) {
      const data: GetSemestersDataError = await response.json();
      const { error } = data;

      console.log(error);
      throw new Error(`${error.message}`);
    }

    const data: GetSemestersDataSuccess = await response.json();
    const { semesters } = data;
    return semesters;
  } catch (error) {
    console.log("Error fetching semesters:", error);
    return [];
  }
}
