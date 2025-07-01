import { z, ZodError } from "zod";
import { NextResponse, NextRequest } from "next/server";
import { FormRequest } from "../base-request";
import { GetStudentDataSuccess } from "./get+delete";

// -----------------------------
// Schema Definitions
// -----------------------------

const updateStudentSchema = z
  .object({
    id: z.string().min(1, "Student ID is required and cannot be empty"),
    program_id: z
      .number()
      .int("Program ID must be an integer")
      .min(1, "Program ID must be a positive integer")
      .optional(),
    major_id: z
      .number()
      .int("Major ID must be an integer")
      .min(1, "Major ID must be a positive integer")
      .optional()
      .nullable(),
    year_level_id: z
      .number()
      .int("Year level ID must be an integer")
      .min(1, "Year level ID must be a positive integer")
      .optional(),
    degree_id: z
      .number()
      .int("Degree ID must be an integer")
      .min(1, "Degree ID must be a positive integer")
      .optional(),
    email_address: z.string().email("Invalid email address format").optional(),
    first_name: z.string().min(1, "First name cannot be empty").optional(),
    last_name: z.string().min(1, "Last name cannot be empty").optional(),
    middle_name: z.string().nullable().optional(),
  })
  .passthrough();

export type UpdateStudentData = z.infer<typeof updateStudentSchema>;
export type UpdateStudentSuccess = {
  student: GetStudentDataSuccess["student"];
  message: string;
};
export type UpdateStudentError = {
  error: { code: number; message: string };
};

// -----------------------------
// UpdateStudentRequest Class
// -----------------------------

export class UpdateStudentRequest extends FormRequest<UpdateStudentData> {
  private studentId: string;

  constructor(request: NextRequest, studentId: string) {
    super(request);
    this.studentId = studentId;
  }

  rules() {
    return updateStudentSchema;
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

      // Add the student ID from the URL parameter to the body data
      const dataWithId = { ...body, id: this.studentId };

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

    console.log("Update Validation Error:", {
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
        "Year level ID must be a valid positive integer.",
        400
      );
    }

    if (field === "program_id") {
      return this.errorResponse(
        "Program ID must be a valid positive integer.",
        400
      );
    }

    if (field === "major_id") {
      return this.errorResponse(
        "Major ID must be a valid positive integer.",
        400
      );
    }

    if (field === "degree_id") {
      return this.errorResponse(
        "Degree ID must be a valid positive integer.",
        400
      );
    }

    if (
      ["first_name", "last_name"].includes(field as string) &&
      this.isMissingFieldError(firstError)
    ) {
      return this.errorResponse(`${field} cannot be empty.`, 400);
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
  getStudentId(): string {
    return this.validated().id;
  }

  getUpdateData() {
    const data = this.validated();
    // Remove the id field from update data since it's used for identification
    const { id, ...updateData } = data;
    console.log(id);
    return updateData;
  }

  getProgramId(): number | undefined {
    return this.validated().program_id;
  }

  getMajorId(): number | undefined | null {
    return this.validated().major_id;
  }

  getDegreeId(): number | undefined {
    return this.validated().degree_id;
  }

  getYearLevelId(): number | undefined {
    return this.validated().year_level_id;
  }

  // Keep the getYear() method for backward compatibility, but now it returns year_level_id
  getYear(): number | undefined {
    return this.validated().year_level_id;
  }

  getEmail(): string | undefined {
    return this.validated().email_address;
  }

  getFirstName(): string | undefined {
    return this.validated().first_name;
  }

  getLastName(): string | undefined {
    return this.validated().last_name;
  }

  getMiddleName(): string | null | undefined {
    return this.validated().middle_name;
  }

  hasFieldUpdate(field: keyof Omit<UpdateStudentData, "id">): boolean {
    const data = this.validated();
    return data[field] !== undefined;
  }

  getUpdatedFields(): string[] {
    const data = this.validated();
    return Object.keys(data).filter(
      key => key !== "id" && data[key as keyof UpdateStudentData] !== undefined
    );
  }
}
