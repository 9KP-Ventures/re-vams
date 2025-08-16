// File: src/lib/requests/events/fines/get-student-fines.ts

import { z, ZodError } from "zod";
import { NextResponse, NextRequest } from "next/server";
import { BaseRequest } from "../../base-request";
import { Tables } from "@/app/utils/supabase/types";

// -----------------------------
// Schema Definitions
// -----------------------------
const getStudentFinesSchema = z.object({
  event_id: z.coerce.number().int().min(1),
  student_id: z.string().min(1),
});

export type GetStudentFinesData = z.infer<typeof getStudentFinesSchema>;

// Response types
export type AttendanceSlotSummary = {
  id: number;
  trigger_time: string;
  type: Tables<"attendance_slots">["type"];
  fine_amount: number;
};

export type FineBreakdown = {
  slot_id: number;
  trigger_time: string;
  type: Tables<"attendance_slots">["type"];
  fine_amount: number;
  reason: string;
};

export type GetStudentFinesDataSuccess = {
  student: Omit<
    Tables<"students">,
    "program_id" | "year_level_id" | "major_id" | "degree_id"
  > & {
    degrees: Tables<"degrees">;
    programs: Tables<"programs">;
    year_levels: Tables<"year_levels">;
    majors: Tables<"majors">;
  };
  event: Pick<Tables<"events">, "id" | "name">;
  attendance_summary: {
    total_slots: number;
    attended_count: number;
    missed_count: number;
    attended_slots: AttendanceSlotSummary[];
    missed_slots: AttendanceSlotSummary[];
  };
  fines: {
    total_amount: number;
    currency: string;
    breakdown: FineBreakdown[];
  };
};

export type GetStudentFinesDataError = {
  error: { code: number; message: string };
};

// -----------------------------
// GetStudentFinesRequest Class
// -----------------------------

export class GetStudentFinesRequest extends BaseRequest<GetStudentFinesData> {
  private eventId: string;
  private studentId: string;

  constructor(request: NextRequest, eventId: string, studentId: string) {
    super(request);
    this.eventId = eventId;
    this.studentId = studentId;
  }

  rules() {
    return getStudentFinesSchema;
  }

  async authorize(): Promise<boolean> {
    return true;
  }

  async validate(): Promise<NextResponse | null> {
    try {
      if (!(await this.authorize())) {
        return this.unauthorizedResponse();
      }

      // Create validation object from URL parameters
      const validationData = {
        event_id: this.eventId,
        student_id: this.studentId,
      };

      // Validate against schema
      this.validatedData = this.rules().parse(validationData);
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

    console.log("Student Fines Validation Error:", {
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
    return this.validated().event_id;
  }

  getStudentId(): string {
    return this.validated().student_id;
  }
}
