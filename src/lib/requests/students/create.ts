import { z, ZodError } from "zod";
import { NextResponse } from "next/server";
import { FormRequest } from "../base-request";
import { GetStudentDataSuccess } from "./get+delete";

// -----------------------------
// Schema Definitions
// -----------------------------

export const createStudentSchema = z
  .object({
    id: z
      .string({
        required_error: "Student ID is required",
      })
      .min(1, "Student ID cannot be empty"),

    program_id: z
      .number({
        required_error: "Program is required",
      })
      .int("Program ID must be an integer")
      .min(1, "Program ID must be positive"),

    major_id: z
      .number()
      .int("Major ID must be an integer")
      .optional()
      .nullable(),

    year_level_id: z
      .number({
        required_error: "Year level is required",
      })
      .int("Year level must be an integer")
      .min(1, "Year level must be positive"),

    degree_id: z
      .number({
        required_error: "Degree is required",
      })
      .int("Degree ID must be an integer")
      .min(1, "Degree ID must be positive"),

    email_address: z
      .string({
        required_error: "Email address is required",
      })
      .email("Invalid email address format"),

    first_name: z
      .string({
        required_error: "First name is required",
      })
      .min(1, "First name cannot be empty"),

    last_name: z
      .string({
        required_error: "Last name is required",
      })
      .min(1, "Last name cannot be empty"),

    middle_name: z.string().nullable().optional(),
  })
  .passthrough();

export type CreateStudentData = z.infer<typeof createStudentSchema>;
export type CreateStudentDataSuccess = {
  student: GetStudentDataSuccess["student"];
};
export type CreateStudentDataError = {
  error: { code: number; message: string };
};

// -----------------------------
// CreateStudentRequest Class
// -----------------------------

export class CreateStudentRequest extends FormRequest<CreateStudentData> {
  rules() {
    return createStudentSchema;
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
    if (field === "email_address" && this.isEmailError(firstError)) {
      return this.errorResponse("Invalid email address format.", 400);
    }

    if (field === "year_level_id") {
      return this.errorResponse(
        "Year ID is required and must be a valid positive integer.",
        400
      );
    }

    if (field === "degree_id") {
      return this.errorResponse(
        "Degree ID is required and must be a valid positive integer.",
        400
      );
    }

    if (field === "program_id") {
      return this.errorResponse(
        "Program ID is required and must be a valid positive integer.",
        400
      );
    }

    if (
      ["id", "first_name", "last_name"].includes(field as string) &&
      this.isMissingFieldError(firstError)
    ) {
      return this.errorResponse(
        `${field} is required and cannot be empty.`,
        400
      );
    }

    return this.errorResponse(`Invalid ${field}: ${firstError.message}`, 400);
  }

  private isEmailError(error: z.ZodIssue) {
    return error.code === "invalid_string" && error.message.includes("email");
  }

  private isMissingFieldError(error: z.ZodIssue) {
    return error.code === "too_small" || error.code === "invalid_type";
  }

  private errorResponse(message: string, status: number): NextResponse {
    return NextResponse.json({ error: { code: status, message } }, { status });
  }

  // Utility methods
  getStudentData() {
    return this.validated();
  }

  getStudentId() {
    return this.validated().id;
  }

  getProgramId() {
    return this.validated().program_id;
  }

  getMajorId() {
    return this.validated().major_id;
  }

  getDegreeId() {
    return this.validated().degree_id;
  }

  getYear() {
    return this.validated().year_level_id;
  }

  getEmail() {
    return this.validated().email_address;
  }

  getFirstName() {
    return this.validated().first_name;
  }

  getLastName() {
    return this.validated().last_name;
  }

  getMiddleName() {
    return this.validated().middle_name;
  }

  getFullName() {
    const { first_name, middle_name, last_name } = this.validated();
    return middle_name
      ? `${first_name} ${middle_name} ${last_name}`
      : `${first_name} ${last_name}`;
  }

  hasMiddleName() {
    return !!this.validated().middle_name;
  }
}
