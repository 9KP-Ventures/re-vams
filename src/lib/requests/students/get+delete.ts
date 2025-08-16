import { z, ZodError } from "zod";
import { NextResponse, NextRequest } from "next/server";
import { BaseRequest } from "../base-request";
import { Tables } from "@/app/utils/supabase/types";

// -----------------------------
// Schema Definitions
// -----------------------------

const getStudentSchema = z.object({
  id: z.string().min(1, "Student ID is required and cannot be empty"),
});

export type GetStudentData = z.infer<typeof getStudentSchema>;
export type GetStudentDataSuccess = {
  student: Omit<
    Tables<"students">,
    "program_id" | "year_level_id" | "major_id" | "degree_id"
  > & {
    degrees: Tables<"degrees">;
    programs: Tables<"programs">;
    year_levels: Tables<"year_levels">;
    majors: Tables<"majors">;
  };
};
export type GetStudentDataError = {
  error: { code: number; message: string };
};
export type DeleteStudentDataSuccess = {
  message: string;
};
export type DeleteStudentDataError = {
  error: { code: number; message: string };
};

// -----------------------------
// GetStudentRequest Class
// -----------------------------

export class GetStudentRequest extends BaseRequest<GetStudentData> {
  private studentId: string;

  constructor(request: NextRequest, studentId: string) {
    super(request);
    this.studentId = studentId;
  }

  rules() {
    return getStudentSchema;
  }

  async authorize(): Promise<boolean> {
    return true;
  }

  async validate(): Promise<NextResponse | null> {
    try {
      if (!(await this.authorize())) {
        return this.unauthorizedResponse();
      }

      // Validate the student ID parameter
      this.validatedData = this.rules().parse({ id: this.studentId });
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

    console.log("Student ID Validation Error:", {
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
  getStudentId(): string {
    return this.validated().id;
  }
}
