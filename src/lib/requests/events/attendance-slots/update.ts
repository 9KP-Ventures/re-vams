import { z, ZodError } from "zod";
import { NextResponse, NextRequest } from "next/server";
import { FormRequest } from "../../base-request";
import { Tables } from "@/app/utils/supabase/types";

const updateAttendanceSlotSchema = z.object({
  id: z.coerce.number().int().min(1),
  trigger_time: z.string().time().optional(),
  type: z.enum(["TIME_IN", "TIME_OUT"]).optional(),
  fine_amount: z.number().min(0).optional(),
  attendance_code_expiration: z.string().time().optional(),
}).refine(data => 
  data.trigger_time || data.type || data.fine_amount !== undefined || data.attendance_code_expiration, {
  message: "At least one field must be provided for update",
});

export type UpdateAttendanceSlotData = z.infer<typeof updateAttendanceSlotSchema>;
export type UpdateAttendanceSlotDataSuccess = {
  attendance_slot: Tables<"attendance_slots">;
  message: string;
};
export type UpdateAttendanceSlotDataError = {
  error: { code: number; message: string };
};

export class UpdateAttendanceSlotRequest extends FormRequest<UpdateAttendanceSlotData> {
  private eventId: string;
  private slotId: string;

  constructor(request: NextRequest, eventId: string, slotId: string) {
    super(request);
    this.eventId = eventId;
    this.slotId = slotId;
  }

  rules() {
    return updateAttendanceSlotSchema;
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
        id: parseInt(this.slotId),
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

  getUpdateData(): Partial<Tables<"attendance_slots">> {
    const data = this.validated();
    const updateData: Partial<Tables<"attendance_slots">> = {};
    
    if (data.trigger_time) updateData.trigger_time = data.trigger_time;
    if (data.type) updateData.type = data.type;
    if (data.fine_amount !== undefined) updateData.fine_amount = data.fine_amount;
    if (data.attendance_code_expiration) updateData.attendance_code_expiration = data.attendance_code_expiration;
    
    return updateData;
  }

  getSlotId(): number {
    return this.validated().id;
  }

  getEventId(): number {
    return parseInt(this.eventId);
  }
}