"use server";

import { getServerOrigin } from "@/app/utils/server";
import {
  CreateEventData,
  CreateEventDataError,
  CreateEventDataSuccess,
} from "@/lib/requests/events/create";
import {
  GetEventDataError,
  GetEventDataSuccess,
} from "@/lib/requests/events/get+delete";

export async function getEventData(
  id: number
): Promise<GetEventDataSuccess | GetEventDataError> {
  try {
    const origin = await getServerOrigin();

    const response: Response = await fetch(`${origin}/api/events/${id}`, {
      method: "GET",
      cache: "no-cache",
    });

    if (!response.ok) {
      const error: GetEventDataError = await response.json();
      console.log(error);
      return error;
    }

    const data: GetEventDataSuccess = await response.json();
    return data;
  } catch (error) {
    const errorMessage: GetEventDataError = {
      error: {
        code: 500,
        message: `An unexpected error occurred while fetching the event data: ${error}`,
      },
    };
    return errorMessage;
  }
}

export async function createEvent(
  newEventData: CreateEventData
): Promise<CreateEventDataSuccess | CreateEventDataError> {
  try {
    const origin = await getServerOrigin();

    const response: Response = await fetch(`${origin}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEventData),
      cache: "no-cache",
    });

    if (!response.ok) {
      const error: CreateEventDataError = await response.json();
      console.error(error);
      return error;
    }

    const data: CreateEventDataSuccess = await response.json();
    return data;
  } catch (error) {
    const errorMessage: CreateEventDataError = {
      error: {
        code: 500,
        message: `An unexpected error occurred while creating the event: ${error}`,
      },
    };
    return errorMessage;
  }
}

export async function deleteEventById(
  eventId: number
): Promise<GetEventDataSuccess | GetEventDataError> {
  try {
    const origin = await getServerOrigin();

    const response: Response = await fetch(`${origin}/api/events/${eventId}`, {
      method: "DELETE",
      cache: "no-cache",
    });

    if (!response.ok) {
      const error: GetEventDataError = await response.json();
      console.error(error);
      return error;
    }

    const data: GetEventDataSuccess = await response.json();
    return data;
  } catch (error) {
    const errorMessage: GetEventDataError = {
      error: {
        code: 500,
        message: `An unexpected error occurred while deleting the event: ${error}`,
      },
    };
    return errorMessage;
  }
}
