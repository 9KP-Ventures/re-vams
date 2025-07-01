import { createClient } from "@/app/utils/supabase/server";
import { GetEventRequest } from "@/lib/requests/events/get+delete";
import { UpdateEventRequest } from "@/lib/requests/events/update";
import { NextRequest, NextResponse } from "next/server";

// GET /api/events/[eventId] - Get a single event by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const customRequest = new GetEventRequest(request, eventId);
  const validationError = await customRequest.validate();

  if (validationError) {
    return validationError;
  }

  try {
    const eventIdNum = customRequest.getEventId();
    const supabase = await createClient();

    // Fetch event with related organization data
    const { data: event, error } = await supabase
      .from("events")
      .select(
        `
        *,
        organizations!organization_id(
          id,
          name
        ),
        semesters!semester_id(
          id,
          name
        )
      `
      )
      .eq("id", eventIdNum)
      .single();

    if (error || !event) {
      return NextResponse.json(
        {
          error: {
            code: 404,
            message: `Event with ID '${eventIdNum}' not found.`,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        event: Object.fromEntries(
          Object.entries(event).sort(([keyA], [keyB]) =>
            keyA.localeCompare(keyB)
          )
        ),
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Route error:", e);
    return NextResponse.json(
      {
        error: {
          code: 500,
          message: (e as Error).message || "Unknown error",
        },
      },
      { status: 500 }
    );
  }
}

// PATCH /api/events/[eventId] - Update an event
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const customRequest = new UpdateEventRequest(request, eventId);
  const validationError = await customRequest.validate();

  if (validationError) {
    return validationError;
  }

  try {
    const eventIdNum = customRequest.getEventId();
    const updateData = customRequest.getUpdateData();
    const supabase = await createClient();

    // Check if event exists
    const { data: existingEvent } = await supabase
      .from("events")
      .select("id, name")
      .eq("id", eventIdNum)
      .single();

    if (!existingEvent) {
      return NextResponse.json(
        {
          error: {
            code: 404,
            message: `Event with ID '${eventIdNum}' not found.`,
          },
        },
        { status: 404 }
      );
    }

    // If updating organization_id, verify it exists
    if (updateData.organization_id) {
      const { data: organization, error: orgError } = await supabase
        .from("organizations")
        .select("id")
        .eq("id", updateData.organization_id)
        .single();

      if (orgError || !organization) {
        return NextResponse.json(
          {
            error: {
              code: 400,
              message: `Organization with ID '${updateData.organization_id}' not found.`,
            },
          },
          { status: 400 }
        );
      }
    }

    // If updating semester_id, verify it exists
    if (updateData.semester_id) {
      const { data: semester, error: semError } = await supabase
        .from("semesters")
        .select("id")
        .eq("id", updateData.semester_id)
        .single();

      if (semError || !semester) {
        return NextResponse.json(
          {
            error: {
              code: 400,
              message: `Semester with ID '${updateData.semester_id}' not found.`,
            },
          },
          { status: 400 }
        );
      }
    }

    // Update the event
    const { data: updatedEvent, error: updateError } = await supabase
      .from("events")
      .update(updateData)
      .eq("id", eventIdNum)
      .select(
        `
        *,
        organizations!organization_id(
          id,
          name
        ),
        semesters!semester_id(
            id,
            name
          )

      `
      )
      .single();

    if (updateError) {
      console.error("Database error:", updateError);
      return NextResponse.json(
        {
          error: {
            code: 400,
            message: updateError.message,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        event: Object.fromEntries(
          Object.entries(updatedEvent).sort(([keyA], [keyB]) =>
            keyA.localeCompare(keyB)
          )
        ),
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Route error:", e);
    return NextResponse.json(
      {
        error: {
          code: 500,
          message: (e as Error).message || "Unknown error",
        },
      },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[eventId] - Delete an event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const customRequest = new GetEventRequest(request, eventId);
  const validationError = await customRequest.validate();

  if (validationError) {
    return validationError;
  }

  try {
    const eventIdNum = customRequest.getEventId();
    const supabase = await createClient();

    // Check if event exists
    const { data: existingEvent } = await supabase
      .from("events")
      .select("id, name")
      .eq("id", eventIdNum)
      .single();

    if (!existingEvent) {
      return NextResponse.json(
        {
          error: {
            code: 404,
            message: `Event with ID '${eventIdNum}' not found.`,
          },
        },
        { status: 404 }
      );
    }

    // Delete the event
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventIdNum);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        {
          error: {
            code: 400,
            message: error.message,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: `Event '${existingEvent.name}' (ID: ${eventIdNum}) deleted successfully.`,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Route error:", e);
    return NextResponse.json(
      {
        error: {
          code: 500,
          message: (e as Error).message || "Unknown error",
        },
      },
      { status: 500 }
    );
  }
}
