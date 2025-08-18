import { createClient } from "@/app/utils/supabase/server";
import { GetSlotAttendeesRequest } from "@/lib/requests/events/attendance-slots/attendees/get-many";
import { CreateAttendeeRequest } from "@/lib/requests/events/attendance-slots/attendees/create";
import { NextRequest, NextResponse } from "next/server";

// GET /api/events/[eventId]/attendance-slots/[slotId]/attendees - Get attendees for a specific attendance slot
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; slotId: string }> }
) {
  const { eventId, slotId } = await params;
  const customRequest = new GetSlotAttendeesRequest(request, eventId, slotId);
  const validationError = await customRequest.validate();

  if (validationError) {
    return validationError;
  }

  try {
    const supabase = await createClient();
    // First, verify that the attendance slot exists and belongs to the event
    const { data: attendanceSlot, error: slotError } = await supabase
      .from("attendance_slots")
      .select("id, event_id, type, trigger_time")
      .eq("id", customRequest.getSlotId())
      .eq("event_id", customRequest.getEventId())
      .single();

    if (slotError || !attendanceSlot) {
      return NextResponse.json(
        {
          error: {
            code: 404,
            message: `Attendance slot with ID '${customRequest.getSlotId()}' not found for event '${customRequest.getEventId()}'.`,
          },
        },
        { status: 404 }
      );
    }

    // Build query to get attendance records for this slot with student information
    let query = supabase
      .from("attendance_records")
      .select(
        `
        id,
        recorded_time,
        attendance_type,
        created_at,
        students!attendance_records_student_id_fkey(
          *,
          degrees!degree_id(id, name),
          programs!program_id(
            id,
            name
          ),
          majors!major_id(
            id,
            name
          ),
          year_levels!year_level_id(id, name)
        )
      `
      )
      .eq("slot_id", customRequest.getSlotId())
      .eq("attendance_type", attendanceSlot.type)
      .range(
        customRequest.getOffset(),
        customRequest.getOffset() + customRequest.getLimit() - 1
      );

    // Apply search filter if provided
    if (customRequest.getSearch()) {
      const search = customRequest.getSearch();
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email_address.ilike.%${search}%,id.ilike.%${search}%`,
        { foreignTable: 'students' }
      );
    }

    // Apply program filter if provided
    const programId = customRequest.getProgramId();
    if (programId !== undefined) {
      query = query.eq('students.program_id', programId);
    }

    // Apply year level filter if provided  
    const yearLevelId = customRequest.getYearLevelId();
    if (yearLevelId !== undefined) {
      query = query.eq('students.year_level_id', yearLevelId);
    }

    //Apply sorting
    const sortBy = customRequest.getSortBy();
    const sortOrder = customRequest.getSortOrder();

    if (sortBy === "recorded_time" || sortBy === "created_at") {
      query = query.order(sortBy, { ascending: sortOrder === "asc" });
    } else {
      query = query.order(`students(${sortBy})`, { ascending: sortOrder === "asc" });
    }

    const { data: attendanceRecords, error } = await query;

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

    // Get total count for pagination (with same filters)
    let countQuery = supabase
      .from("attendance_records")
      .select("students!attendance_records_student_id_fkey(id)", { count: "exact", head: true })
      .eq("slot_id", customRequest.getSlotId())
      .eq("attendance_type", attendanceSlot.type);

    // Apply same search filter for count
    if (customRequest.getSearch()) {
      const search = customRequest.getSearch();
      countQuery = countQuery.or(
        `students.first_name.ilike.%${search}%,students.last_name.ilike.%${search}%,students.id.ilike.%${search}%,students.email_address.ilike.%${search}%`
      );
    }

    const { count } = await countQuery;

    // Transform the data to match our expected format
    const attendees = (attendanceRecords || [])
      .filter(record => record.students) // Filter out records without student data
      .map(record => {
        const student = record.students!; // Now we know it's not null
        const attendanceRecord = {
          id: record.id,
          recorded_time: record.recorded_time,
          attendance_type: record.attendance_type,
          created_at: record.created_at,
        };

        return {
          student,
          attendance_record: attendanceRecord,
        };
      });

    // Calculate pagination metadata
    const totalPages = Math.ceil((count || 0) / customRequest.getLimit());
    const hasNextPage = customRequest.getPage() < totalPages;
    const hasPrevPage = customRequest.getPage() > 1;

    return NextResponse.json(
      {
        attendees: attendees.map(attendee =>
          Object.fromEntries(
            Object.entries(attendee).sort(([keyA], [keyB]) =>
              keyA.localeCompare(keyB)
            )
          )
        ),
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
        slot_info: {
          slot_id: attendanceSlot.id,
          event_id: attendanceSlot.event_id,
          attendance_type: attendanceSlot.type,
          trigger_time: attendanceSlot.trigger_time,
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; slotId: string }> }
) {
  const { eventId, slotId } = await params;
  const customRequest = new CreateAttendeeRequest(request, eventId, slotId);
  const validationError = await customRequest.validate();

  if (validationError) {
    return validationError;
  }

  try {
    const supabase = await createClient();

    // Verify attendance slot exists and belongs to the event
    const { data: attendanceSlot, error: slotError } = await supabase
      .from("attendance_slots")
      .select("id, event_id, type")
      .eq("id", customRequest.getSlotId())
      .eq("event_id", customRequest.getEventId())
      .single();

    if (slotError || !attendanceSlot) {
      return NextResponse.json(
        {
          error: {
            code: 404,
            message: `Attendance slot with ID '${customRequest.getSlotId()}' not found for event '${customRequest.getEventId()}'.`,
          },
        },
        { status: 404 }
      );
    }

    // Verify student exists
    const attendanceData = customRequest.getAttendanceRecordData();
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("id, first_name, last_name")
      .eq("id", attendanceData.student_id)
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        {
          error: {
            code: 404,
            message: `Student with ID '${attendanceData.student_id}' not found.`,
          },
        },
        { status: 404 }
      );
    }

    // Check if attendance record already exists for this student, event, and type
    const { data: existingRecord } = await supabase
      .from("attendance_records")
      .select("id")
      .eq("student_id", attendanceData.student_id)
      .eq("slot_id", attendanceData.slot_id)
      .eq("attendance_type", attendanceData.attendance_type)
      .single();

    if (existingRecord) {
      return NextResponse.json(
        {
          error: {
            code: 409,
            message: `Attendance record already exists for student '${student.first_name} ${student.last_name}' for this event and attendance type.`,
          },
        },
        { status: 409 }
      );
    }

    // Create the attendance record
    const { data: attendanceRecord, error: createError } = await supabase
      .from("attendance_records")
      .insert(attendanceData)
      .select()
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
        attendance_record: Object.fromEntries(
          Object.entries(attendanceRecord).sort(([keyA], [keyB]) =>
            keyA.localeCompare(keyB)
          )
        ),
        message: `Attendance record created successfully for student '${student.first_name} ${student.last_name}'.`,
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