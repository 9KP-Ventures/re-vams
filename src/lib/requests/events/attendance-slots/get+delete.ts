import { z, ZodError } from "zod";
import { NextResponse, NextRequest } from "next/server";
import { BaseRequest } from "../../base-request";

const getAttendanceSlotSchema = z.object({
  id: z.coerce.number().int().min(1),
  event_id: z.coerce.number().int().min(1),
});

export type GetAttendanceSlotData = z.infer<typeof getAttendanceSlotSchema>;
export type GetAttendanceSlotDataSuccess = {
  message: string;
};
export type GetAttendanceSlotDataError = {
  error: { code: number; message: string };
};

export class GetAttendanceSlotRequest extends BaseRequest<GetAttendanceSlotData> {
  private eventId: string;
  private slotId: string;

  constructor(request: NextRequest, eventId: string, slotId: string) {
    super(request);
    this.eventId = eventId;
    this.slotId = slotId;
  }

  rules() {
    return getAttendanceSlotSchema;
  }

  async authorize(): Promise<boolean> {
    return true;
  }

  async validate(): Promise<NextResponse | null> {
    try {
      if (!(await this.authorize())) {
        return this.unauthorizedResponse();
      }

      this.validatedData = this.rules().parse({
        id: this.slotId,
        event_id: this.eventId,
      });
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

  getSlotId(): number {
    return this.validated().id;
  }

  getEventId(): number {
    return this.validated().event_id;
  }
}