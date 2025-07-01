import { z, ZodError } from "zod";
import { NextResponse, NextRequest } from "next/server";
import { FormRequest } from "../base-request";
import { Tables } from "@/app/utils/supabase/types";

// -----------------------------
// Schema Definitions
// -----------------------------

const updateEventSchema = z
  .object({
    id: z.coerce.number().int().min(1, "Event ID must be a positive integer"),
    name: z.string().min(1, "Event name cannot be empty").optional(),
    date: z
      .string()
      .date("Event date must be a valid date (YYYY-MM-DD)")
      .optional(),
    custom_email_subject: z
      .string()
      .min(1, "Email subject cannot be empty")
      .optional(),
    custom_email_message: z
      .string()
      .min(1, "Email message cannot be empty")
      .optional(),
    semester_id: z.coerce
      .number()
      .int("Semester ID must be an integer")
      .min(1, "Semester ID must be an integer")
      .optional(),
    active: z.boolean().optional(),
    organization_id: z.coerce
      .number()
      .int("Organization ID must be an integer")
      .min(1, "Organization ID must be a positive integer")
      .optional(),
  })
  .passthrough();

export type UpdateEventData = z.infer<typeof updateEventSchema>;
export type UpdateEventDataSuccess = {
  event: Omit<Tables<"events">, "organization_id" & "semester_id"> & {
    organization: Tables<"organizations">;
  } & {
    semester: Tables<"semesters">;
  };
};
export type UpdateEventDataError = { error: { code: number; message: string } };

// -----------------------------
// UpdateEventRequest Class
// -----------------------------

export class UpdateEventRequest extends FormRequest<UpdateEventData> {
  private eventId: string;

  constructor(request: NextRequest, eventId: string) {
    super(request);
    this.eventId = eventId;
  }

  rules() {
    return updateEventSchema;
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

      // Add the event ID from the URL parameter to the body data
      const dataWithId = { ...body, id: this.eventId };

      // Validate that at least one field is being updated
      const updateFields = Object.keys(body);
      if (updateFields.length === 0) {
        return this.errorResponse(
          "At least one field must be provided for update.",
          400
        );
      }

      this.validatedData = this.rules().parse(dataWithId);
      return null;
    } catch (error) {
      if (error instanceof ZodError) {
        return this.handleZodValidationError(error);
      }
      return this.errorResponse("Invalid JSON in request body.", 400);
    }
  }

  // -----------------------------
  // Zod Error Handler
  // -----------------------------

  private handleZodValidationError(error: ZodError): NextResponse {
    const firstError = error.errors[0];
    const field = firstError.path[0];

    console.log("Event Update Validation Error:", {
      message: firstError.message,
      path: firstError.path,
      field,
      code: firstError.code,
    });

    return this.getFieldErrorResponse(firstError, field);
  }

  private getFieldErrorResponse(
    firstError: z.ZodIssue,
    field: string | number
  ): NextResponse {
    if (field === "date" && this.isDateError(firstError)) {
      return this.errorResponse(
        "Event date must be a valid date in YYYY-MM-DD format.",
        400
      );
    }

    if (field === "organization_id") {
      return this.errorResponse(
        "Organization ID must be a valid positive integer.",
        400
      );
    }

    if (field === "semester_id") {
      return this.errorResponse(
        "Semester ID must be a valid positive integer.",
        400
      );
    }

    if (
      ["name", "custom_email_subject", "custom_email_message"].includes(
        field as string
      ) &&
      this.isMissingFieldError(firstError)
    ) {
      return this.errorResponse(
        `${this.getFieldDisplayName(field as string)} cannot be empty.`,
        400
      );
    }

    return this.errorResponse(`Invalid ${field}: ${firstError.message}`, 400);
  }

  private isDateError(error: z.ZodIssue) {
    return error.code === "invalid_string" && error.message.includes("date");
  }

  private isMissingFieldError(error: z.ZodIssue) {
    return error.code === "too_small" || error.code === "invalid_type";
  }

  private getFieldDisplayName(field: string): string {
    const fieldNames: Record<string, string> = {
      name: "Event name",
      custom_email_subject: "Email subject",
      custom_email_message: "Email message",
    };
    return fieldNames[field] || field;
  }

  private errorResponse(message: string, status: number): NextResponse {
    return NextResponse.json({ error: { code: status, message } }, { status });
  }

  // Utility methods
  getEventId(): number {
    return this.validated().id;
  }

  getUpdateData() {
    const data = this.validated();
    // Remove the id field from update data since it's used for identification
    const { id, ...updateData } = data;
    console.log(id + 1212);
    return updateData;
  }

  getName(): string | undefined {
    return this.validated().name;
  }

  getDate(): string | undefined {
    return this.validated().date;
  }

  getCustomEmailSubject(): string | undefined {
    return this.validated().custom_email_subject;
  }

  getCustomEmailMessage(): string | undefined {
    return this.validated().custom_email_message;
  }

  getOrganizationId(): number | undefined {
    return this.validated().organization_id;
  }

  getSemesterId(): number | undefined {
    return this.validated().semester_id;
  }

  hasFieldUpdate(field: keyof Omit<UpdateEventData, "id">): boolean {
    const data = this.validated();
    return data[field] !== undefined;
  }

  getUpdatedFields(): string[] {
    const data = this.validated();
    return Object.keys(data).filter(
      key => key !== "id" && data[key as keyof UpdateEventData] !== undefined
    );
  }
}
