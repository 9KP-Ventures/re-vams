import { z, ZodError } from "zod";
import { NextResponse, NextRequest } from "next/server";
import { BaseRequest } from "../../base-request";
import { Tables } from "@/app/utils/supabase/types";

const createAttendanceSlotSchema = z.object({
  event_id: z.number().int().min(1),
  trigger_time: z.string().time(), // "08:00" format
  type: z.enum(["TIME_IN", "TIME_OUT"]),
  fine_amount: z.number().min(0),
});

export type CreateAttendanceSlotData = z.infer<
  typeof createAttendanceSlotSchema
>;
export type CreateAttendanceSlotDataSuccess = {
  attendance_slot: Omit<
    Tables<"attendance_slots">,
    "created_at" & "updated_at" & "event_id"
  >;
};
export type CreateAttendanceSlotDataError = {
  error: { code: number; message: string };
};

// -----------------------------
// CreateEventRequest Class
// -----------------------------

export class CreateAttendanceSlotRequest extends BaseRequest<CreateAttendanceSlotData> {
  private eventId: string;

  constructor(request: NextRequest, eventId: string) {
    super(request);
    this.eventId = eventId;
  }

  rules() {
    return createAttendanceSlotSchema;
  }

  async authorize(): Promise<boolean> {
    return true;
  }

  async validate(): Promise<NextResponse | null> {
    try {
      if (!(await this.authorize())) {
        return this.unauthorizedResponse();
      }

      // Parse request body
      const body = await this.request.json();

      // Add event_id from URL params to the body
      const bodyWithEventId = {
        ...body,
        event_id: parseInt(this.eventId),
      };

      // Validate against schema
      this.validatedData = this.rules().parse(bodyWithEventId);
      return null;
    } catch (error) {
      if (error instanceof ZodError) {
        return this.handleZodValidationError(error);
      }
      return this.invalidJsonResponse();
    }
  }

  private handleZodValidationError(error: ZodError): NextResponse {
    const firstError = error.errors[0];

    console.log("Attendance Slot Validation Error:", {
      message: firstError.message,
      path: firstError.path,
      code: firstError.code,
    });

    return NextResponse.json(
      {
        error: {
          code: 400,
          message: firstError.message,
        },
      },
      { status: 400 }
    );
  }

  // Utility methods
  getSlotData(): Omit<
    Tables<"attendance_slots">,
    "id" | "created_at" | "updated_at"
  > {
    const data = this.validated();
    return {
      event_id: data.event_id,
      trigger_time: data.trigger_time,
      type: data.type,
      fine_amount: data.fine_amount,
    };
  }

  getEventId(): number {
    return this.validated().event_id;
  }
}
