"use server";

import { getServerOrigin } from "@/app/utils/server";
import {
  GetProgramsDataError,
  GetProgramsDataSuccess,
} from "@/lib/requests/programs/get";

export async function getPrograms(): Promise<
  GetProgramsDataSuccess["programs"]
> {
  try {
    const origin = await getServerOrigin();
    const response: Response = await fetch(
      `${origin}/api/programs?sortBy=name&sortOrder=asc`,
      {
        cache: "force-cache", // Cache for performance
        next: { revalidate: 3600 }, // Revalidate every hour
        method: "GET",
      }
    );

    if (!response.ok) {
      const data: GetProgramsDataError = await response.json();
      const { error } = data;

      console.log(error);
      throw new Error(`Failed to fetch programs: ${error.message}`);
    }

    const data: GetProgramsDataSuccess = await response.json();
    const { programs } = data;
    return programs;
  } catch (error) {
    console.error("Error fetching programs:", error);
    return [];
  }
}
