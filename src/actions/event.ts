"use server";

import { getServerOrigin } from "@/app/utils/server";
import {
  GetEventDataError,
  GetEventDataSuccess,
} from "@/lib/requests/events/get+delete";

export async function getEventData(
  id: number
): Promise<GetEventDataSuccess["event"] | null> {
  try {
    const origin = await getServerOrigin();

    const response: Response = await fetch(`${origin}/api/events/${id}`, {
      method: "GET",
      cache: "no-cache",
    });

    if (!response.ok) {
      const data: GetEventDataError = await response.json();
      const { error } = data;

      console.log(error);
      throw new Error(`${error.message}`);
    }

    const data: GetEventDataSuccess = await response.json();
    const { event } = data;
    return event;
  } catch (error) {
    console.log("Fetching event data error:", error);
    return null;
  }
}
