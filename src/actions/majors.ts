"use server";

import { Tables } from "@/app/utils/supabase/types";

export interface ProgramMajorsResponse {
  program: Tables<"programs">;
  majors: Tables<"majors">[];
  count: number;
}

export async function getMajorsForProgram(
  programId: number
): Promise<ProgramMajorsResponse["majors"]> {
  try {
    const origin = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    const response = await fetch(`${origin}/api/programs/${programId}/majors`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch majors for program ${programId}: ${response.status}`
      );
    }

    const data: ProgramMajorsResponse = await response.json();
    return data.majors || [];
  } catch (error) {
    console.error(`Error fetching majors for program ${programId}:`, error);
    return [];
  }
}
