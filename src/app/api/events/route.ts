import { createClient } from "@/app/utils/supabase/server";
import { GetEventsRequest } from "@/lib/requests/events/get-many";
import { CreateEventRequest } from "@/lib/requests/events/create";
import { NextRequest, NextResponse } from "next/server";

// GET /api/events - List events with pagination and filtering
export async function GET(request: NextRequest) {
  const customRequest = new GetEventsRequest(request);
  const validationError = await customRequest.validate();

  if (validationError) {
    return validationError;
  }

  try {
    const supabase = await createClient();

    // Build the query with relationships
    let query = supabase.from("events").select(
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
      `,
      { count: "exact" }
    );

    // Apply filters
    if (customRequest.getSearch()) {
      const search = customRequest.getSearch()!;

      // Check if search is a number for ID search
      const searchAsNumber = parseInt(search);
      if (!isNaN(searchAsNumber)) {
        // If search is a number, search by exact ID match or text fields
        query = query.or(
          `id.eq.${searchAsNumber},name.ilike.%${search}%,custom_email_subject.ilike.%${search}%`
        );
      } else {
        // If search is not a number, only search text fields
        query = query.or(
          `name.ilike.%${search}%,custom_email_subject.ilike.%${search}%`
        );
      }
    }

    const organizationId = customRequest.getOrganizationId();
    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const semesterId = customRequest.getSemesterId();
    if (semesterId) {
      query = query.eq("semester_id", semesterId);
    }

    const status = customRequest.getStatus();
    if (
      status === "upcoming" ||
      status === "on_going" ||
      status === "completed"
    ) {
      query = query.eq("status", status);
    }

    const dateFrom = customRequest.getDateFrom();
    if (dateFrom) {
      query = query.gte("date", dateFrom);
    }

    const dateTo = customRequest.getDateTo();
    if (dateTo) {
      query = query.lte("date", dateTo);
    }

    // Apply sorting
    query = query.order(customRequest.getSortBy(), {
      ascending: customRequest.getSortOrder() === "asc",
    });

    // Apply pagination
    query = query.range(
      customRequest.getOffset(),
      customRequest.getOffset() + customRequest.getLimit() - 1
    );

    const { data, error, count } = await query;

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

    // Calculate pagination metadata
    const totalPages = Math.ceil((count || 0) / customRequest.getLimit());
    const hasNextPage = customRequest.getPage() < totalPages;
    const hasPrevPage = customRequest.getPage() > 1;

    return NextResponse.json(
      {
        events:
          data?.map(event =>
            Object.fromEntries(
              Object.entries(event).sort(([keyA], [keyB]) =>
                keyA.localeCompare(keyB)
              )
            )
          ) || [],
        pagination: {
          page: customRequest.getPage(),
          limit: customRequest.getLimit(),
          total: count || 0,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
        filters: customRequest.getActiveFilters(),
        sort: {
          by: customRequest.getSortBy(),
          order: customRequest.getSortOrder(),
        },
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

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  const customRequest = new CreateEventRequest(request);
  const validationError = await customRequest.validate();

  if (validationError) {
    return validationError;
  }

  try {
    const eventData = customRequest.getEventData();

    // Database operation
    const supabase = await createClient();

    // Verify that organization_id exists
    const { data: organization, error: orgError } = await supabase
      .from("organizations")
      .select("id")
      .eq("id", eventData.organization_id)
      .single();

    if (orgError || !organization) {
      return NextResponse.json(
        {
          error: {
            code: 404,
            message: `Organization with ID '${eventData.organization_id}' not found.`,
          },
        },
        { status: 404 }
      );
    }

    // Verify that organization_id exists
    const { data: semester, error: semError } = await supabase
      .from("semesters")
      .select("id")
      .eq("id", eventData.semester_id)
      .single();

    if (semError || !semester) {
      return NextResponse.json(
        {
          error: {
            code: 404,
            message: `Semester with ID '${eventData.semester_id}' not found.`,
          },
        },
        { status: 404 }
      );
    }

    // Create the event
    const { data: newEvent, error: createError } = await supabase
      .from("events")
      .insert(eventData)
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

    if (createError) {
      console.error("Database error:", createError);
      return NextResponse.json(
        {
          error: {
            code: 400,
            message: createError.message,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        event: Object.fromEntries(
          Object.entries(newEvent).sort(([keyA], [keyB]) =>
            keyA.localeCompare(keyB)
          )
        ),
      },
      { status: 201 }
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
