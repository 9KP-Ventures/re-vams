import { z, ZodError } from "zod";
import { NextResponse, NextRequest } from "next/server";
import { BaseRequest } from "../../../base-request";

const getAttendeeSchema = z.object({
  attendee_id: z.coerce.number().int().min(1),
  event_id: z.coerce.number().int().min(1),
  slot_id: z.coerce.number().int().min(1),
});

export type GetAttendeeData = z.infer<typeof getAttendeeSchema>;
export type GetAttendeeDataSuccess = {
  message: string;
};
export type GetAttendeeDataError = {
  error: { code: number; message: string };
};

export class GetAttendeeRequest extends BaseRequest<GetAttendeeData> {
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
    return getAttendeeSchema;
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
        attendee_id: this.attendeeId,
        event_id: this.eventId,
        slot_id: this.slotId,
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

  getAttendeeId(): number {
    return this.validated().attendee_id;
  }

  getEventId(): number {
    return this.validated().event_id;
  }

  getSlotId(): number {
    return this.validated().slot_id;
  }
}