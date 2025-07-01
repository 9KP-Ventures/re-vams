"use server";

import { Tables } from "@/app/utils/supabase/types";

export interface ProgramsResponse {
  programs: Tables<"programs">[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export async function getPrograms(): Promise<ProgramsResponse["programs"]> {
  try {
    const origin = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    const response = await fetch(
      `${origin}/api/programs?sortBy=name&sortOrder=asc`,
      {
        cache: "force-cache", // Cache for performance
        next: { revalidate: 3600 }, // Revalidate every hour
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch programs: ${response.status}`);
    }

    const data: ProgramsResponse = await response.json();
    return data.programs || [];
  } catch (error) {
    console.error("Error fetching programs:", error);
    return [];
  }
}
