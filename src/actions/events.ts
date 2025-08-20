"use server";

import { ValidatedEventsParams } from "@/app/admin/events/page";
import { getServerOrigin } from "@/app/utils/server";
import {
  GetEventsDataSuccess,
  GetEventsDataError,
} from "@/lib/requests/events/get-many";
import { ParamConfig, ParamValue, TransformFunction } from "./types";

export async function getEvents(
  params?: ValidatedEventsParams
): Promise<GetEventsDataSuccess | GetEventsDataError> {
  try {
    const origin = await getServerOrigin();

    // Build query string from defaulted params with proper typing
    const paramConfig: Record<string, ParamConfig> = {
      page: { apiKey: "page" },
      limit: { apiKey: "limit", default: 6, transform: String },
      search: {
        apiKey: "search",
        transform: (v: ParamValue) => encodeURIComponent(String(v)),
      },
      sort: { apiKey: "sort_by" },
      order: { apiKey: "sort_order" },
      status: { apiKey: "status" },
      semester_id: { apiKey: "semester_id" },
    };

    // Build query params using a functional approach
    const queryParams = Object.entries(paramConfig).reduce(
      (urlParams, [key, config]) => {
        // Use explicit typing for the key to ensure type safety
        const typedKey = key as keyof ValidatedEventsParams;
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

    const url = `${origin}/api/events${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response: Response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      const error: GetEventsDataError = await response.json();
      console.error(error);
      return error;
    }

    const data: GetEventsDataSuccess = await response.json();
    return data;
  } catch (error) {
    const errorMessage: GetEventsDataError = {
      error: {
        code: 500,
        message: `An unexpected error occurred while fetching the events: ${error}`,
      },
    };
    return errorMessage;
  }
}
export interface EventsStats {
  totalEvents: number;
  activeEvents: number;
  totalRevenue: number;
  averageAttendees: number;
}

export async function getEventsStats(): Promise<EventsStats> {
  // Simulate API call
  await new Promise(r => setTimeout(r, 2000));

  // TODO, fetch stats via function in Supabase
  return {
    totalEvents: 5,
    activeEvents: 0,
    totalRevenue: 0,
    averageAttendees: 0,
  } as EventsStats;
}
