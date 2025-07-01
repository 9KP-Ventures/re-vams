import { z, ZodError } from "zod";
import { NextResponse } from "next/server";
import { FormRequest } from "../base-request";
import { Tables } from "@/app/utils/supabase/types";

// -----------------------------
// Schema Definitions
// -----------------------------

const createEventSchema = z
  .object({
    name: z.string().min(1, "Event name is required and cannot be empty"),
    date: z.string().date("Event date must be a valid date (YYYY-MM-DD)"),
    custom_email_subject: z.string().min(1, "Email subject is required"),
    custom_email_message: z.string().min(1, "Email message is required"),
    organization_id: z
      .number()
      .int("Organization ID must be an integer")
      .min(1, "Organization ID is required"),
    semester_id: z
      .number()
      .int("Semester ID must be an integer")
      .min(1, "Semester ID is required"),
    active: z.boolean(),
  })
  .passthrough();

export type CreateEventData = z.infer<typeof createEventSchema>;
export type CreateEventDataSuccess = {
  event: Omit<Tables<"events">, "organization_id" & "semester_id"> & {
    organization: Tables<"organizations">;
  } & {
    semester: Tables<"semesters">;
  };
};
export type CreateEventDataError = { error: { code: number; message: string } };

// -----------------------------
// CreateEventRequest Class
// -----------------------------

export class CreateEventRequest extends FormRequest<CreateEventData> {
  rules() {
    return createEventSchema;
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

      this.validatedData = this.rules().parse(body);
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

    console.log("Zod Error Details:", {
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
        "Organization ID is required and must be a valid positive integer.",
        400
      );
    }

    if (field === "semester_id") {
      return this.errorResponse(
        "Semester ID is required and must be a valid positive integer.",
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
        `${this.getFieldDisplayName(
          field as string
        )} is required and cannot be empty.`,
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
  getEventData(): CreateEventData {
    return this.validated();
  }

  getName(): string {
    return this.validated().name;
  }

  getDate(): string {
    return this.validated().date;
  }

  getSemester(): number {
    return this.validated().semester_id;
  }

  getActive(): boolean {
    return this.validated().active;
  }

  getCustomEmailSubject(): string {
    return this.validated().custom_email_subject;
  }

  getCustomEmailMessage(): string {
    return this.validated().custom_email_message;
  }

  getOrganizationId(): number {
    return this.validated().organization_id;
  }
}
