import { createClient } from "@/app/utils/supabase/server";
import { GetAttendanceSlotsRequest } from "@/lib/requests/events/attendance-slots/get-many";
import { CreateAttendanceSlotRequest } from "@/lib/requests/events/attendance-slots/create";
import { NextRequest, NextResponse } from "next/server";

// GET /api/events/[id]/attendance-slots - Get attendance slots for an event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const customRequest = new GetAttendanceSlotsRequest(request, eventId);
  const validationError = await customRequest.validate();

  if (validationError) {
    return validationError;
  }

  try {
    const supabase = await createClient();

    // Build query with filters and sorting
    let query = supabase
      .from("attendance_slots")
      .select("*")
      .eq("event_id", customRequest.getEventId())
      .range(
        customRequest.getOffset(),
        customRequest.getOffset() + customRequest.getLimit() - 1
      )
      .order(customRequest.getSortBy(), {
        ascending: customRequest.getSortOrder() === "asc",
      });

    // Apply type filter if provided
    const typeFilter = customRequest.getType();
    if (typeFilter) {
      query = query.eq("type", typeFilter);
    }

    // Apply date range filters if provided
    if (customRequest.getDateFrom()) {
      query = query.gte("trigger_time", customRequest.getDateFrom());
    }

    if (customRequest.getDateTo()) {
      query = query.lte("trigger_time", customRequest.getDateTo());
    }

    const { data, error } = await query;

    if (error) {
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

    // Get total count for pagination
    let countQuery = supabase
      .from("attendance_slots")
      .select("*", { count: "exact", head: true })
      .eq("event_id", customRequest.getEventId());

    // Apply same filters for count
    const typeFilterForCount = customRequest.getType();
    if (typeFilterForCount) {
      countQuery = countQuery.eq("type", typeFilterForCount);
    }

    if (customRequest.getDateFrom()) {
      countQuery = countQuery.gte("trigger_time", customRequest.getDateFrom());
    }

    if (customRequest.getDateTo()) {
      countQuery = countQuery.lte("trigger_time", customRequest.getDateTo());
    }

    const { count } = await countQuery;

    // Calculate pagination metadata
    const totalPages = Math.ceil((count || 0) / customRequest.getLimit());
    const hasNextPage = customRequest.getPage() < totalPages;
    const hasPrevPage = customRequest.getPage() > 1;

    return NextResponse.json(
      {
        attendance_slots:
          data?.map(slot =>
            Object.fromEntries(
              Object.entries(slot).sort(([keyA], [keyB]) =>
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

// POST /api/events/[id]/attendance/slots - Create a new attendance slot
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const customRequest = await new CreateAttendanceSlotRequest(request, eventId);
  const validationError = await customRequest.validate();

  if (validationError) {
    return validationError;
  }

  try {
    const slotData = customRequest.getSlotData();

    // Database operation
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("attendance_slots")
      .insert(slotData)
      .select()
      .single();

    if (error) {
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

    // Response formatting
    return NextResponse.json(
      {
        attendance_slot: Object.fromEntries(
          Object.entries(data).sort(([keyA], [keyB]) =>
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
