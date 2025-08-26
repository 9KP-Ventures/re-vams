import { createClient } from "@/app/utils/supabase/server";
import { UpdateAttendanceSlotRequest } from "@/lib/requests/events/attendance-slots/update";
import { GetAttendanceSlotRequest } from "@/lib/requests/events/attendance-slots/get+delete";
import { NextRequest, NextResponse } from "next/server";

// GET /api/events/[eventId]/attendance-slots/[slotId] - Get a specific attendance slot
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; slotId: string }> }
) {
  const { eventId, slotId } = await params;

  const customRequest = new GetAttendanceSlotRequest(request, eventId, slotId);
    const validationError = await customRequest.validate();
  
    if (validationError) {
      return validationError;
    }

  try {
    const supabase = await createClient();

    // Get the attendance slot with event verification
    const { data: attendanceSlot, error } = await supabase
      .from("attendance_slots")
      .select(`
        *,
        events!event_id(
          id,
          name,
          date
        )
      `)
      .eq("id", customRequest.getSlotId())
      .eq("event_id", customRequest.getEventId())
      .single();

    if (error || !attendanceSlot) {
      return NextResponse.json(
        {
          error: {
            code: 404,
            message: `Attendance slot with ID '${slotId}' not found for event '${eventId}'.`,
          },
        },
        { status: 404 }
      );
    }

    // Get attendance statistics for this slot
    const { count: attendeeCount } = await supabase
      .from("attendance_records")
      .select("*", { count: "exact", head: true })
      .eq("event_id", parseInt(eventId))
      .eq("attendance_type", attendanceSlot.type);

    return NextResponse.json(
      {
        attendance_slot: Object.fromEntries(
          Object.entries(attendanceSlot).sort(([keyA], [keyB]) =>
            keyA.localeCompare(keyB)
          )
        ),
        statistics: {
          total_attendees: attendeeCount || 0,
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

// PATCH /api/events/[eventId]/attendance-slots/[slotId] - Update an attendance slot
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; slotId: string }> }
) {
  const { eventId, slotId } = await params;
  const customRequest = new UpdateAttendanceSlotRequest(request, eventId, slotId);
  const validationError = await customRequest.validate();

  if (validationError) {
    return validationError;
  }

  try {
    const supabase = await createClient();

    // Verify attendance slot exists and belongs to the event
    const { data: existingSlot, error: slotError } = await supabase
      .from("attendance_slots")
      .select(`
        id,
        event_id,
        trigger_time,
        type,
        fine_amount,
        events!event_id(name)
      `)
      .eq("id", customRequest.getSlotId())
      .eq("event_id", customRequest.getEventId())
      .single();

    if (slotError || !existingSlot) {
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

    // Check for conflicts if updating trigger_time or type
    const updateData = customRequest.getUpdateData();
    if (updateData.trigger_time || updateData.type) {
      const checkTriggerTime = updateData.trigger_time || existingSlot.trigger_time;
      const checkType = updateData.type || existingSlot.type;

      const { data: conflictingSlot } = await supabase
        .from("attendance_slots")
        .select("id")
        .eq("event_id", customRequest.getEventId())
        .eq("trigger_time", checkTriggerTime)
        .eq("type", checkType)
        .neq("id", customRequest.getSlotId())
        .single();

      if (conflictingSlot) {
        return NextResponse.json(
          {
            error: {
              code: 409,
              message: `Another attendance slot with trigger time '${checkTriggerTime}' and type '${checkType}' already exists for this event.`,
            },
          },
          { status: 409 }
        );
      }
    }

    // Update the attendance slot
    const { data: updatedSlot, error: updateError } = await supabase
      .from("attendance_slots")
      .update(updateData)
      .eq("id", customRequest.getSlotId())
      .eq("event_id", customRequest.getEventId())
      .select(`
        *,
        events!event_id(name)
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
        attendance_slot: Object.fromEntries(
          Object.entries(updatedSlot).sort(([keyA], [keyB]) =>
            keyA.localeCompare(keyB)
          )
        ),
        message: `Attendance slot updated successfully for event '${updatedSlot.events?.name}'.`,
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

// DELETE /api/events/[eventId]/attendance-slots/[slotId] - Delete an attendance slot
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; slotId: string }> }
) {
  const { eventId, slotId } = await params;
  const customRequest = new GetAttendanceSlotRequest(request, eventId, slotId);
  const validationError = await customRequest.validate();

  if (validationError) {
    return validationError;
  }

  try {
    const supabase = await createClient();

    // Verify attendance slot exists and get info for response message
    const { data: existingSlot, error: slotError } = await supabase
      .from("attendance_slots")
      .select(`
        id,
        event_id,
        trigger_time,
        type,
        events!event_id(name)
      `)
      .eq("id", customRequest.getSlotId())
      .eq("event_id", customRequest.getEventId())
      .single();

    if (slotError || !existingSlot) {
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

    // Check if there are existing attendance records for this slot
    const { count: attendanceCount } = await supabase
      .from("attendance_records")
      .select("*", { count: "exact", head: true })
      .eq("event_id", customRequest.getEventId())
      .eq("attendance_type", existingSlot.type);

    if (attendanceCount && attendanceCount > 0) {
      return NextResponse.json(
        {
          error: {
            code: 409,
            message: `Cannot delete attendance slot. There are ${attendanceCount} attendance record(s) associated with this slot. Please delete the attendance records first.`,
          },
        },
        { status: 409 }
      );
    }

    // Delete the attendance slot
    const { error: deleteError } = await supabase
      .from("attendance_slots")
      .delete()
      .eq("id", customRequest.getSlotId())
      .eq("event_id", customRequest.getEventId());

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
        message: `Attendance slot '${existingSlot.type}' at '${existingSlot.trigger_time}' deleted successfully from event '${existingSlot.events?.name}' (Slot ID: ${customRequest.getSlotId()}).`,
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