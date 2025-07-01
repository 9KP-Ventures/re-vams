import { z, ZodError } from "zod";
import { NextResponse, NextRequest } from "next/server";
import { BaseRequest } from "../base-request";
import { Tables } from "@/app/utils/supabase/types";

// -----------------------------
// Schema Definitions
// -----------------------------

const getEventSchema = z.object({
  id: z.coerce.number().int().min(1, "Event ID must be a positive integer"),
});

export type GetEventData = z.infer<typeof getEventSchema>;
export type GetEventDataSuccess = {
  event: Omit<Tables<"events">, "organization_id" & "semester_id"> & {
    organization: Tables<"organizations">;
  } & {
    semester: Tables<"semesters">;
  };
};
export type GetEventDataError = { error: { code: number; message: string } };

// -----------------------------
// GetEventRequest Class
// -----------------------------

export class GetEventRequest extends BaseRequest<GetEventData> {
  private eventId: string;

  constructor(request: NextRequest, eventId: string) {
    super(request);
    this.eventId = eventId;
  }

  rules() {
    return getEventSchema;
  }

  async authorize(): Promise<boolean> {
    return true;
  }

  async validate(): Promise<NextResponse | null> {
    try {
      if (!(await this.authorize())) {
        return this.unauthorizedResponse();
      }

      // Validate the event ID parameter
      this.validatedData = this.rules().parse({ id: this.eventId });
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

    console.log("Event ID Validation Error:", {
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
  getEventId(): number {
    return this.validated().id;
  }
}
