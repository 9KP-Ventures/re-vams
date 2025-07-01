import { getServerOrigin } from "@/app/utils/server";
import { Tables } from "@/app/utils/supabase/types";

export interface YearLevelsResponse {
  ["year_levels"]: Tables<"year_levels">[];
}

export async function getYearLevels(): Promise<
  YearLevelsResponse["year_levels"]
> {
  try {
    const origin = await getServerOrigin();
    const response = await fetch(`${origin}/api/year-levels`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch year levels: ${response.status}`);
    }

    const data: YearLevelsResponse = await response.json();
    return data["year_levels"] || [];
  } catch (error) {
    console.error("Error fetching year levels:", error);
    // Fallback to mock data if endpoint doesn't exist yet
    return [
      { id: 1, name: "1st Year" },
      { id: 2, name: "2nd Year" },
      { id: 3, name: "3rd Year" },
      { id: 4, name: "4th Year" },
    ] as YearLevelsResponse["year_levels"];
  }
}
