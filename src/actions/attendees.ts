"use server";

import { ValidatedSingleEventParams } from "@/app/admin/events/[id]/page";
import { getServerOrigin } from "@/app/utils/server";
import {
  GetSlotAttendeesDataError,
  GetSlotAttendeesDataSuccess,
} from "@/lib/requests/events/attendance-slots/attendees/get-many";
import { ParamConfig, ParamValue, TransformFunction } from "./types";
import { revalidateTag } from "next/cache";

export async function getSlotAttendees(
  eventId: number,
  slotId: number,
  params?: ValidatedSingleEventParams,
  page?: number
): Promise<GetSlotAttendeesDataSuccess | null> {
  try {
    const origin = await getServerOrigin();

    // Build query string from params with proper typing
    const paramConfig: Record<string, ParamConfig> = {
      search: {
        apiKey: "search",
        transform: (v: ParamValue) => encodeURIComponent(String(v)),
      },
      sort: {
        apiKey: "sort_by",
      },
      order: { apiKey: "sort_order" },
      program_id: { apiKey: "program_id" },
      year_level_id: { apiKey: "year_level_id" },
    };

    const queryParams = Object.entries(paramConfig).reduce(
      (urlParams, [key, config]) => {
        // Use explicit typing for the key to ensure type safety
        const typedKey = key as keyof ValidatedSingleEventParams;
        const rawValue = params?.[typedKey] ?? config.default;

        if (rawValue !== undefined) {
          // Apply optional transformation function or convert to string
          const transformFn: TransformFunction = config.transform || String;
          urlParams.append(config.apiKey, transformFn(rawValue as ParamValue));
        }

        return urlParams;
      },
      new URLSearchParams()
    );

    // Append the page manually since it is not part of the search params
    if (page) {
      queryParams.append("page", String(page));
    }

    const url = `${origin}/api/events/${eventId}/attendance-slots/${slotId}/attendees${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    // Create tag for this specific data
    const tag = `attendees-${eventId}-${slotId}`;

    const response: Response = await fetch(url, {
      method: "GET",
      // Use next.js cache with tag instead of no-cache
      next: {
        tags: [tag],
        revalidate: 60,
      },
    });

    if (!response.ok) {
      const data: GetSlotAttendeesDataError = await response.json();
      const { error } = data;

      console.log(error);
      throw new Error(`${error.message}`);
    }

    const data: GetSlotAttendeesDataSuccess = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching slot attendees", error);
    return null;
  }
}

// Add a revalidation function
export async function invalidateAttendeesCache(
  eventId: number,
  slotId: number
): Promise<void> {
  const tag = `attendees-${eventId}-${slotId}`;
  revalidateTag(tag);
}
