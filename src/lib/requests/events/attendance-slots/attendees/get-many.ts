import { z, ZodError } from "zod";
import { NextResponse, NextRequest } from "next/server";
import { BaseRequest } from "../../../base-request";
import { Tables } from "@/app/utils/supabase/types";

// -----------------------------
// Schema Definitions
// -----------------------------
export const GET_SLOT_ATTENDEES_SORT_OPTIONS = [
  "id",
  "first_name", 
  "last_name",
  "recorded_time",
  "created_at",
] as const;
export const GET_SLOT_ATTENDEES_SORT_ORDERS = ["asc", "desc"] as const;

const getSlotAttendeesSchema = z.object({
  event_id: z.coerce.number().int().min(1),
  slot_id: z.coerce.number().int().min(1),
  page: z.coerce.number().int().min(1),
  limit: z.coerce.number().int().min(1).max(100),
  search: z.string().optional(),
  sort_by: z.enum(GET_SLOT_ATTENDEES_SORT_OPTIONS),
  sort_order: z.enum(GET_SLOT_ATTENDEES_SORT_ORDERS),
});

export type GetSlotAttendeesData = z.infer<typeof getSlotAttendeesSchema>;

// Attendee type combining student and attendance record info
export type SlotAttendee = Omit<Tables<"students">, "organization_id"> & {
  attendance_record: {
    id: number;
    recorded_time: string;
    attendance_type: Tables<"attendance_records">["attendance_type"];
    created_at: string;
  };
};

export type GetSlotAttendeesDataSuccess = {
  attendees: SlotAttendee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    search?: string;
  };
  sort: {
    by: string;
    order: string;
  };
  slot_info: {
    slot_id: number;
    event_id: number;
    attendance_type: Tables<"attendance_slots">["type"];
    trigger_time: string;
  };
};

export type GetSlotAttendeesDataError = {
  error: { code: number; message: string };
};

// Non-api response types
export type GetSlotAttendeesSortType = (typeof GET_SLOT_ATTENDEES_SORT_OPTIONS)[number];
export type GetSlotAttendeesOrderType = (typeof GET_SLOT_ATTENDEES_SORT_ORDERS)[number];

// -----------------------------
// GetSlotAttendeesRequest Class
// -----------------------------

export class GetSlotAttendeesRequest extends BaseRequest<GetSlotAttendeesData> {
  private eventId: string;
  private slotId: string;

  constructor(request: NextRequest, eventId: string, slotId: string) {
    super(request);
    this.eventId = eventId;
    this.slotId = slotId;
  }

  rules() {
    return getSlotAttendeesSchema;
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
        slot_id: this.slotId,
        page: 1,
        limit: 10,
        sort_by: "recorded_time" as const,
        sort_order: "desc" as const,
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

    console.log("Slot Attendees Validation Error:", {
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

  getSlotId(): number {
    return this.validated().slot_id;
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

  getSearch(): string | undefined {
    return this.validated().search;
  }

  getSortBy(): GetSlotAttendeesSortType {
    return this.validated().sort_by;
  }

  getSortOrder(): GetSlotAttendeesOrderType {
    return this.validated().sort_order;
  }

  hasFilters(): boolean {
    const data = this.validated();
    return !!(data.search);
  }

  getActiveFilters() {
    const data = this.validated();
    const filters: Record<string, string> = {};

    if (data.search) filters.search = data.search;

    return filters;
  }
}