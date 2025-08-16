import { createClient } from "@/app/utils/supabase/server";
import { GetStudentFinesRequest } from "@/lib/requests/events/fines/get-student-fines";
import { NextRequest, NextResponse } from "next/server";

// GET /api/events/[eventId]/fines/[studentId] - Calculate total fines for a student based on missed time slots
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; studentId: string }> }
) {
  const { eventId, studentId } = await params;
  const customRequest = new GetStudentFinesRequest(request, eventId, studentId);
  const validationError = await customRequest.validate();

  if (validationError) {
    return validationError;
  }

  try {
    const supabase = await createClient();

    // First, verify that the event exists
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, name")
      .eq("id", customRequest.getEventId())
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        {
          error: {
            code: 404,
            message: `Event with ID '${customRequest.getEventId()}' not found.`,
          },
        },
        { status: 404 }
      );
    }

    // Verify that the student exists
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select(`
        id,
        first_name,
        last_name,
        middle_name,
        programs!program_id(id, name),
        majors!major_id(id, name),
        degrees!degree_id(id, name),
        year_levels!year_level_id(id, name)
      `)
      .eq("id", customRequest.getStudentId())
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        {
          error: {
            code: 404,
            message: `Student with ID '${customRequest.getStudentId()}' not found.`,
          },
        },
        { status: 404 }
      );
    }

    // Get all attendance slots for the event
    const { data: attendanceSlots, error: slotsError } = await supabase
      .from("attendance_slots")
      .select(`
        id,
        trigger_time,
        type,
        fine_amount
      `)
      .eq("event_id", customRequest.getEventId())
      .order("trigger_time", { ascending: true });

    if (slotsError) {
      console.error("Database error:", slotsError);
      return NextResponse.json(
        {
          error: {
            code: 400,
            message: slotsError.message,
          },
        },
        { status: 400 }
      );
    }

    // Get all attendance records for this student and event
    const { data: attendanceRecords, error: recordsError } = await supabase
      .from("attendance_records")
      .select(`
        id,
        slot_id,
        attendance_type,
        recorded_time,
        created_at
      `)
      .eq("student_id", student.id)
      .in("slot_id", attendanceSlots?.map(slot => slot.id) || []);

    if (recordsError) {
      console.error("Database error:", recordsError);
      return NextResponse.json(
        {
          error: {
            code: 400,
            message: recordsError.message,
          },
        },
        { status: 400 }
      );
    }

    // Create a set of attended slot IDs for quick lookup
    const attendedSlotIds = new Set(attendanceRecords?.map(record => record.slot_id) || []);

    // Calculate missed slots and total fines
    const missedSlots = attendanceSlots?.filter(slot => !attendedSlotIds.has(slot.id)) || [];
    const attendedSlots = attendanceSlots?.filter(slot => attendedSlotIds.has(slot.id)) || [];
    
    const totalFines = missedSlots.reduce((total, slot) => total + slot.fine_amount, 0);

    // Organize the response data
    const responseData = {
      student: {
        id: student.id,
        first_name: student.first_name,
        last_name: student.last_name,
        middle_name: student.middle_name,
        full_name: `${student.first_name} ${student.middle_name ? student.middle_name + ' ' : ''}${student.last_name}`,
        program: student.programs?.name || null,
        major: student.majors?.name || null,
        degree: student.degrees?.name || null,
        year_level: student.year_levels?.name || null,
      },
      event: {
        id: event.id,
        name: event.name,
      },
      attendance_summary: {
        total_slots: attendanceSlots?.length || 0,
        attended_count: attendedSlots.length,
        missed_count: missedSlots.length,
        attended_slots: attendedSlots.map(slot => ({
          id: slot.id,
          trigger_time: slot.trigger_time,
          type: slot.type,
          fine_amount: slot.fine_amount,
        })),
        missed_slots: missedSlots.map(slot => ({
          id: slot.id,
          trigger_time: slot.trigger_time,
          type: slot.type,
          fine_amount: slot.fine_amount,
        })),
      },
      fines: {
        total_amount: totalFines,
        breakdown: missedSlots.map(slot => ({
          slot_id: slot.id,
          trigger_time: slot.trigger_time,
          type: slot.type,
          fine_amount: slot.fine_amount,
          reason: `Missed ${slot.type.toLowerCase().replace('_', ' ')} at ${slot.trigger_time}`,
        })),
      },
    };

    return NextResponse.json(responseData, { status: 200 });

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