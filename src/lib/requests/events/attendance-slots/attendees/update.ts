import { z, ZodError } from "zod";
import { NextResponse, NextRequest } from "next/server";
import { FormRequest } from "../../../base-request";
import { Tables } from "@/app/utils/supabase/types";

const updateAttendeeSchema = z.object({
  attendee_id: z.coerce.number().int().min(1),
  recorded_time: z
    .string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, "Invalid time format (expected HH:MM:SS)").optional(),
}).refine(data => data.recorded_time, {
  message: "At least one field must be provided for update",
});

export type UpdateAttendeeData = z.infer<typeof updateAttendeeSchema>;
export type UpdateAttendeeDataSuccess = {
  attendance_record: Tables<"attendance_records">;
  message: string;
};
export type UpdateAttendeeDataError = {
  error: { code: number; message: string };
};

export class UpdateAttendeeRequest extends FormRequest<UpdateAttendeeData> {
  private eventId: string;
  private slotId: string;
  private attendeeId: string;

  constructor(request: NextRequest, eventId: string, slotId: string, attendeeId: string) {
    super(request);
    this.eventId = eventId;
    this.slotId = slotId;
    this.attendeeId = attendeeId;
  }

  rules() {
    return updateAttendeeSchema;
  }

  async authorize(): Promise<boolean> {
    return true;
  }

  async validate(): Promise<NextResponse | null> {
    try {
      const body = await this.request.json();

      if (!body || typeof body !== "object") {
        return this.errorResponse(
          "Request body must be a valid JSON object.",
          400
        );
      }

      if (!(await this.authorize())) {
        return this.errorResponse("This action is unauthorized.", 403);
      }

      const bodyWithId = {
        ...body,
        attendee_id: parseInt(this.attendeeId),
      };

      this.validatedData = this.rules().parse(bodyWithId);
      return null;
    } catch (error) {
      if (error instanceof ZodError) {
        return this.handleZodValidationError(error);
      }
      return this.errorResponse("Invalid JSON in request body.", 400);
    }
  }

  private handleZodValidationError(error: ZodError): NextResponse {
    const firstError = error.errors[0];
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

  private errorResponse(message: string, status: number): NextResponse {
    return NextResponse.json(
      {
        error: {
          code: status,
          message,
        },
      },
      { status }
    );
  }

  getUpdateData(): Partial<Tables<"attendance_records">> {
    const data = this.validated();
    const updateData: Partial<Tables<"attendance_records">> = {};
    
    if (data.recorded_time) updateData.recorded_time = data.recorded_time;
    
    return updateData;
  }

  getAttendeeId(): number {
    return this.validated().attendee_id;
  }

  getEventId(): number {
    return parseInt(this.eventId);
  }

  getSlotId(): number {
    return parseInt(this.slotId);
  }
}