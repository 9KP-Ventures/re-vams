import { createClient } from "@/app/utils/supabase/server";
import { UpdateAttendeeRequest } from "@/lib/requests/events/attendance-slots/attendees/update";
import { GetAttendeeRequest } from "@/lib/requests/events/attendance-slots/attendees/get+delete";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/events/[eventId]/attendance-slots/[slotId]/attendees/[attendeeId] - Update an attendance record
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; slotId: string; attendeeId: string }> }
) {
  const { eventId, slotId, attendeeId } = await params;
  const customRequest = new UpdateAttendeeRequest(request, eventId, slotId, attendeeId);
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

    // Verify attendance record exists
    const { data: existingRecord, error: recordError } = await supabase
      .from("attendance_records")
      .select(`
        id,
        student_id,
        slot_id,
        recorded_time,
        created_at,
        students!attendance_records_student_id_fkey(first_name, last_name)
      `)
      .eq("id", customRequest.getAttendeeId())
      .eq("slot_id", customRequest.getSlotId())
      .single();

    if (recordError || !existingRecord) {
      return NextResponse.json(
        {
          error: {
            code: 404,
            message: `Attendance record with ID '${customRequest.getAttendeeId()}' not found for this attendance slot.`,
          },
        },
        { status: 404 }
      );
    }

    // Update the attendance record
    const updateData = customRequest.getUpdateData();
    const { data: updatedRecord, error: updateError } = await supabase
      .from("attendance_records")
      .update(updateData)
      .eq("id", customRequest.getAttendeeId())
      .select(`
        id,
        student_id,
        slot_id,
        recorded_time,
        created_at,
        students!attendance_records_student_id_fkey(first_name, last_name)
      `)
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
        attendance_record: Object.fromEntries(
          Object.entries(updatedRecord).sort(([keyA], [keyB]) =>
            keyA.localeCompare(keyB)
          )
        ),
        message: `Attendance record updated successfully for student '${updatedRecord.students?.first_name} ${updatedRecord.students?.last_name}'.`,
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


// GET /api/events/[eventId]/attendance-slots/[slotId]/attendees/[attendeeId] - Get an attendance record
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ eventId: string; slotId: string; attendeeId: string }> }
  ) {
    const { eventId, slotId, attendeeId } = await params;
    const customRequest = new GetAttendeeRequest(request, eventId, slotId, attendeeId);
    const validationError = await customRequest.validate();
  
    if (validationError) {
      return validationError;
    }
  
    try {
      const supabase = await createClient();
  
      const { data: attendanceSlot, error: slotError } = await supabase
        .from("attendance_slots")
        .select("id, event_id")
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
  
      const { data: existingRecord, error: recordError } = await supabase
        .from("attendance_records")
        .select(`
          id,
          student_id,
          slot_id,
          recorded_time,
          students!attendance_records_student_id_fkey(
            first_name,
            last_name,
            middle_name,
            email_address
          )
        `)
        .eq("id", customRequest.getAttendeeId())
        .eq("slot_id", customRequest.getSlotId()) 
        .single();
  
      if (recordError || !existingRecord) {
        return NextResponse.json(
          {
            error: {
              code: 404,
              message: `Attendance record with ID '${customRequest.getAttendeeId()}' not found for this attendance slot.`,
            },
          },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        {
          data: existingRecord,
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

// DELETE /api/events/[eventId]/attendance-slots/[slotId]/attendees/[attendeeId] - Delete an attendance record
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; slotId: string; attendeeId: string }> }
) {
  const { eventId, slotId, attendeeId } = await params;
  const customRequest = new GetAttendeeRequest(request, eventId, slotId, attendeeId);
  const validationError = await customRequest.validate();

  if (validationError) {
    return validationError;
  }

  try {
    const supabase = await createClient();

    // Verify attendance slot exists and belongs to the event
    const { data: attendanceSlot, error: slotError } = await supabase
      .from("attendance_slots")
      .select("id, event_id")
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

    // Verify attendance record exists and get student info for response message
    const { data: existingRecord, error: recordError } = await supabase
      .from("attendance_records")
      .select(`
        id,
        student_id,
        slot_id,
        students!attendance_records_student_id_fkey(first_name, last_name)
      `)
      .eq("id", customRequest.getAttendeeId())
      .eq("slot_id", customRequest.getSlotId())
      .single();

    if (recordError || !existingRecord) {
      return NextResponse.json(
        {
          error: {
            code: 404,
            message: `Attendance record with ID '${customRequest.getAttendeeId()}' not found for this attendace slot.`,
          },
        },
        { status: 404 }
      );
    }

    // Delete the attendance record
    const { error: deleteError } = await supabase
      .from("attendance_records")
      .delete()
      .eq("id", customRequest.getAttendeeId())
      .eq("slot_id", customRequest.getSlotId());

    if (deleteError) {
      console.error("Database error:", deleteError);
      return NextResponse.json(
        {
          error: {
            code: 400,
            message: deleteError.message,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: `Attendance record deleted successfully for student '${existingRecord.students?.first_name} ${existingRecord.students?.last_name}' (Record ID: ${customRequest.getAttendeeId()}).`,
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