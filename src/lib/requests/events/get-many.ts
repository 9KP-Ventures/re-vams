import { z, ZodError } from "zod";
import { NextResponse } from "next/server";
import { BaseRequest } from "../base-request";
import { GetEventDataSuccess } from "./get+delete";
import { Constants } from "@/app/utils/supabase/types";

// -----------------------------
// Schema Definitions
// -----------------------------
export const GET_EVENTS_SORT_OPTIONS = [
  "id",
  "name",
  "date",
  "created_at",
  "organization_id",
] as const;
export const GET_EVENTS_SORT_ORDERS = ["asc", "desc"] as const;

const getEventsSchema = z.object({
  page: z.coerce.number().int().min(1),
  limit: z.coerce.number().int().min(1).max(100),
  search: z.string().optional(),
  status: z.enum([...Constants.public.Enums.Status, ""] as const).optional(),
  semester_id: z.coerce.number().int().min(1).optional(),
  organization_id: z.coerce.number().int().min(1).optional(),
  date_from: z.string().date().optional(),
  date_to: z.string().date().optional(),
  sort_by: z.enum(GET_EVENTS_SORT_OPTIONS),
  sort_order: z.enum(GET_EVENTS_SORT_ORDERS),
});

export type GetEventsData = z.infer<typeof getEventsSchema>;
export type GetEventsDataSuccess = {
  events: GetEventDataSuccess["event"][];
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
    organization_id?: number;
    date_from?: string;
    date_to?: string;
    status?: string;
    semester_id?: number;
  };
  sort: {
    by: string;
    order: string;
  };
};
export type GetEventsDataError = { error: { code: number; message: string } };

// Note: For non-api response type variable names, do not use "Data" name, ex: GetEventsData{success | error | request}
// The types below are non-api response types, variable names will omit "Data"
export type GetEventsStatusType =
  (typeof Constants.public.Enums.Status)[number];
export type GetEventsSortType = (typeof GET_EVENTS_SORT_OPTIONS)[number];
export type GetEventsOrderType = (typeof GET_EVENTS_SORT_ORDERS)[number];

// -----------------------------
// GetEventsRequest Class
// -----------------------------

export class GetEventsRequest extends BaseRequest<GetEventsData> {
  rules() {
    return getEventsSchema;
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
        page: 1,
        limit: 10,
        sort_by: "created_at" as const,
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

  getOrganizationId(): number | undefined {
    return this.validated().organization_id;
  }

  getSemesterId(): number | undefined {
    return this.validated().semester_id;
  }

  getStatus(): GetEventsStatusType | "" | undefined {
    return this.validated().status;
  }

  getDateFrom(): string | undefined {
    return this.validated().date_from;
  }

  getDateTo(): string | undefined {
    return this.validated().date_to;
  }

  getSortBy(): GetEventsSortType {
    return this.validated().sort_by;
  }

  getSortOrder(): GetEventsOrderType {
    return this.validated().sort_order;
  }

  hasFilters(): boolean {
    const data = this.validated();
    return !!(
      data.search ||
      data.organization_id ||
      data.date_from ||
      data.date_to ||
      data.status ||
      data.semester_id
    );
  }

  getActiveFilters() {
    const data = this.validated();
    const filters: Record<string, string | number | boolean> = {};

    if (data.search) filters.search = data.search;
    if (data.organization_id) filters.organization_id = data.organization_id;
    if (data.date_from) filters.date_from = data.date_from;
    if (data.date_to) filters.date_to = data.date_to;
    if (data.status) filters.status = data.status;
    if (data.semester_id) filters.semester_id = data.semester_id;

    return filters;
  }
}
