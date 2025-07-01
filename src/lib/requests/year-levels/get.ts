import { z, ZodError } from "zod";
import { NextResponse } from "next/server";
import { BaseRequest } from "../base-request";
import { Tables } from "@/app/utils/supabase/types";

// -----------------------------
// Schema Definitions
// -----------------------------

const getYearLevelsSchema = z.object({
  page: z.coerce.number().int().min(1),
  limit: z.coerce.number().int().min(1).max(100),
  search: z.string().optional(),
  sort_by: z.enum(["id", "name", "created_at"]),
  sort_order: z.enum(["asc", "desc"]),
});

export type GetYearLevelsData = z.infer<typeof getYearLevelsSchema>;
export type GetYearLevelsDataSuccess = {
  year_levels: Tables<"year_levels">[];
};
export type GetYearLevelsDataError = {
  error: { code: number; message: string };
};

// -----------------------------
// GetProgramsRequest Class
// -----------------------------

export class GetYearLevelsRequest extends BaseRequest<GetYearLevelsData> {
  rules() {
    return getYearLevelsSchema;
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
        limit: 100,
        sort_by: "name" as const,
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

  getSortBy(): string {
    return this.validated().sort_by;
  }

  getSortOrder(): "asc" | "desc" {
    return this.validated().sort_order;
  }

  getActiveFilters() {
    const data = this.validated();
    const filters: Record<string, string | number> = {};

    if (data.search) filters.search = data.search;

    return filters;
  }
}
