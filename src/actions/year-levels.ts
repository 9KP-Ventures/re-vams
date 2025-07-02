import { getServerOrigin } from "@/app/utils/server";
import {
  GetYearLevelsDataError,
  GetYearLevelsDataSuccess,
} from "@/lib/requests/year-levels/get";

export async function getYearLevels(): Promise<
  GetYearLevelsDataSuccess["year_levels"]
> {
  try {
    const origin = await getServerOrigin();
    const response: Response = await fetch(`${origin}/api/year-levels`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
      method: "GET",
    });

    if (!response.ok) {
      const data: GetYearLevelsDataError = await response.json();
      const { error } = data;

      console.log(error);
      throw new Error(`${error.message}`);
    }

    const data: GetYearLevelsDataSuccess = await response.json();
    return data["year_levels"];
  } catch (error) {
    console.error("Error fetching year levels:", error);
    // Fallback to mock data if endpoint doesn't exist yet
    return [{ id: -1, name: error }] as GetYearLevelsDataSuccess["year_levels"];
  }
}
