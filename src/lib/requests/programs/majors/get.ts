import { z, ZodError } from "zod";
import { NextResponse, NextRequest } from "next/server";
import { BaseRequest } from "../../base-request";

// -----------------------------
// Schema Definitions
// -----------------------------

const getProgramMajorsSchema = z.object({
  id: z.coerce.number().int().min(1, "Program ID must be a positive integer"),
});

export type GetProgramMajorsData = z.infer<typeof getProgramMajorsSchema>;

// -----------------------------
// GetProgramMajorsRequest Class
// -----------------------------

export class GetProgramMajorsRequest extends BaseRequest<GetProgramMajorsData> {
  private programId: string;

  constructor(request: NextRequest, programId: string) {
    super(request);
    this.programId = programId;
  }

  rules() {
    return getProgramMajorsSchema;
  }

  async authorize(): Promise<boolean> {
    return true;
  }

  async validate(): Promise<NextResponse | null> {
    try {
      if (!(await this.authorize())) {
        return this.unauthorizedResponse();
      }

      // Validate the program ID parameter
      this.validatedData = this.rules().parse({ id: this.programId });
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

    console.log("Program ID Validation Error:", {
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
  getProgramId(): number {
    return this.validated().id;
  }
}
