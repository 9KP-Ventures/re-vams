"use server";

import { ValidatedSearchParams } from "@/app/admin/events/page";
import { getServerOrigin } from "@/app/utils/server";
import {
  GetEventsDataSuccess,
  GetEventsDataError,
} from "@/lib/requests/events/get-many";

export async function getEvents(
  params?: ValidatedSearchParams
): Promise<GetEventsDataSuccess | null> {
  try {
    const origin = await getServerOrigin();

    // Build query string from params
    const queryParams = new URLSearchParams();

    if (params && params.page) queryParams.append("page", `${params.page}`);
    if (params && params.limit) queryParams.append("limit", `${params.limit}`);
    if (params && params.search) queryParams.append("search", params.search);
    if (params && params.status) queryParams.append("status", params.status);
    if (params && params.sort) queryParams.append("sort_by", params.sort);
    if (params && params.order) queryParams.append("sort_order", params.order);

    const queryString = queryParams.toString();
    const url = `${origin}/api/events${queryString ? `?${queryString}` : ""}`;

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
