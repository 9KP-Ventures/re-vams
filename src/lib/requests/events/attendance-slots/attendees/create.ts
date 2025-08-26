import { z, ZodError } from "zod";
import { NextResponse, NextRequest } from "next/server";
import { FormRequest } from "../../../base-request";
import { Tables } from "@/app/utils/supabase/types";

const createAttendeeSchema = z.object({
  slot_id: z.coerce.number().int().min(1),
  student_id: z.string().min(1, "Student ID is required"),
  recorded_time: z
    .string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, "Invalid time format (expected HH:MM:SS)"),
});

export type CreateAttendeeData = z.infer<typeof createAttendeeSchema>;
export type CreateAttendeeDataSuccess = {
  attendance_record: Tables<"attendance_records">;
  message: string;
};
export type CreateAttendeeDataError = {
  error: { code: number; message: string };
};

export class CreateAttendeeRequest extends FormRequest<CreateAttendeeData> {
  private eventId: string;
  private slotId: string;

  constructor(request: NextRequest, eventId: string, slotId: string) {
    super(request);
    this.eventId = eventId;
    this.slotId = slotId;
  }

  rules() {
    return createAttendeeSchema;
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

      const bodyWithIds = {
        ...body,
        event_id: parseInt(this.eventId),
        slot_id: parseInt(this.slotId),
      };

      this.validatedData = this.rules().parse(bodyWithIds);
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

  getAttendanceRecordData(): Omit<Tables<"attendance_records">, "id" | "created_at"> {
    const data = this.validated();
    return {
      student_id: data.student_id,
      slot_id: data.slot_id,
      recorded_time: data.recorded_time,
    };
  }

  getEventId(): number {
    return parseInt(this.eventId);
  }

  getSlotId(): number {
    return this.validated().slot_id;
  }
}