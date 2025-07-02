"use server";

import { ValidatedSearchParams } from "@/app/admin/events/page";
import { getServerOrigin } from "@/app/utils/server";
import {
  GetEventsDataSuccess,
  GetEventsDataError,
} from "@/lib/requests/events/get-many";

type ParamValue = string | number | boolean;
type TransformFunction = (value: ParamValue) => string;
interface ParamConfig {
  apiKey: string;
  default?: ParamValue;
  transform?: TransformFunction;
}

export async function getEvents(
  params?: ValidatedSearchParams
): Promise<GetEventsDataSuccess | null> {
  try {
    const origin = await getServerOrigin();

    // Build query string from defaulted params with proper typing
    const paramConfig: Record<string, ParamConfig> = {
      page: { apiKey: "page", default: 1, transform: String },
      limit: { apiKey: "limit", default: 6, transform: String },
      search: {
        apiKey: "search",
        transform: (v: ParamValue) => encodeURIComponent(String(v)),
      },
      sort: { apiKey: "sort_by", default: "date" },
      order: { apiKey: "sort_order", default: "desc" },
      status: { apiKey: "status" },
      semester_id: { apiKey: "semester_id" },
    };

    // Build query params using a functional approach
    const queryParams = Object.entries(paramConfig).reduce(
      (urlParams, [key, config]) => {
        // Use explicit typing for the key to ensure type safety
        const typedKey = key as keyof ValidatedSearchParams;
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
      const data: GetEventsDataError = await response.json();
      const { error } = data;

      console.log(error);
      throw new Error(`${error.message}`);
    }

    const data: GetEventsDataSuccess = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching events:`, error);
    return null;
  }
}
export interface EventStats {
  totalEvents: number;
  activeEvents: number;
  totalRevenue: number;
  averageAttendees: number;
}

export async function getEventStats(): Promise<EventStats> {
  // Simulate API call
  await new Promise(r => setTimeout(r, 5000));

  // TODO, fetch stats via function in Supabase
  return {
    totalEvents: 5,
    activeEvents: 0,
    totalRevenue: 0,
    averageAttendees: 0,
  } as EventStats;
}
