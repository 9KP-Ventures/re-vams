import { z, ZodError } from "zod";
import { NextResponse } from "next/server";
import { FormRequest } from "../../base-request";

// -----------------------------
// Schema Definitions
// -----------------------------

const generateCodeSchema = z.object({
  student_id: z.string().min(1, "Student ID is required and cannot be empty"),
});

export type GenerateCodeData = z.infer<typeof generateCodeSchema>;

// -----------------------------
// GenerateCodeRequest Class
// -----------------------------

export class GenerateCodeRequest extends FormRequest<GenerateCodeData> {
  rules() {
    return generateCodeSchema;
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

    if (field === "student_id") {
      return this.errorResponse(
        "Student ID is required and cannot be empty.",
        400
      );
    }

    return this.errorResponse(`Invalid ${field}: ${firstError.message}`, 400);
  }

  private errorResponse(message: string, status: number): NextResponse {
    return NextResponse.json({ error: { code: status, message } }, { status });
  }

  // Utility methods
  getStudentId(): string {
    return this.validated().student_id;
  }
}
