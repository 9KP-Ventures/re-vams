import { z, ZodError } from "zod";
import { NextResponse, NextRequest } from "next/server";
import { BaseRequest } from "../../base-request";
import { Tables } from "@/app/utils/supabase/types";

// -----------------------------
// Schema Definitions
// -----------------------------

const getAttendanceSlotsSchema = z.object({
  event_id: z.coerce.number().int().min(1),
  page: z.coerce.number().int().min(1),
  limit: z.coerce.number().int().min(1).max(100),
  type: z.enum(["TIME_IN", "TIME_OUT"]).optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  sort_by: z.enum(["id", "trigger_time", "type", "fine_amount", "created_at"]),
  sort_order: z.enum(["asc", "desc"]),
});

export type GetAttendanceSlotsData = z.infer<typeof getAttendanceSlotsSchema>;
export type GetAttendanceSlotsDataSuccess = {
  attendance_slots: Array<
    Omit<Tables<"attendance_slots">, "created_at" & "updated_at" & "event_id">
  >;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    type?: string;
    date_from?: string;
    date_to?: string;
  };
  sort: {
    by: string;
    order: string;
  };
};
export type GetAttendanceSlotsDataError = {
  error: { code: number; message: string };
};

// -----------------------------
// GetAttendanceSlotsRequest Class
// -----------------------------

export class GetAttendanceSlotsRequest extends BaseRequest<GetAttendanceSlotsData> {
  private eventId: string;

  constructor(request: NextRequest, eventId: string) {
    super(request);
    this.eventId = eventId;
  }

  rules() {
    return getAttendanceSlotsSchema;
  }

  async authorize(): Promise<boolean> {
    return true;
  }

  async validate(): Promise<NextResponse | null> {
    try {
      if (!(await this.authorize())) {
        return this.unauthorizedResponse();
      }

      const url = new URL(this.request.url);
      const queryParams = Object.fromEntries(url.searchParams.entries());

      // Apply defaults manually
      const paramsWithDefaults = {
        event_id: this.eventId,
        page: 1,
        limit: 10,
        sort_by: "trigger_time" as const,
        sort_order: "asc" as const,
        ...queryParams,
      };

      this.validatedData = this.rules().parse(paramsWithDefaults);
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

    console.log("Query Validation Error:", {
      message: firstError.message,
      path: firstError.path,
      code: firstError.code,
    });

    return NextResponse.json(
      {
        error: {
          code: 400,
          message: `Invalid query parameter '${firstError.path.join(".")}': ${
            firstError.message
          }`,
        },
      },
      { status: 400 }
    );
  }

  // Utility methods
  getEventId(): number {
    return this.validated().event_id;
  }

  getPage(): number {
    return this.validated().page;
  }

  getLimit(): number {
    return this.validated().limit;
  }

  getOffset(): number {
    return (this.getPage() - 1) * this.getLimit();
  }

  getType(): "TIME_IN" | "TIME_OUT" | undefined {
    return this.validated().type;
  }

  getDateFrom(): string | undefined {
    return this.validated().date_from;
  }

  getDateTo(): string | undefined {
    return this.validated().date_to;
  }

  getSortBy(): string {
    return this.validated().sort_by;
  }

  getSortOrder(): "asc" | "desc" {
    return this.validated().sort_order;
  }

  hasFilters(): boolean {
    const data = this.validated();
    return !!(data.type || data.date_from || data.date_to);
  }

  getActiveFilters() {
    const data = this.validated();
    const filters: Record<string, string> = {};

    if (data.type) filters.type = data.type;
    if (data.date_from) filters.date_from = data.date_from;
    if (data.date_to) filters.date_to = data.date_to;

    return filters;
  }
}
