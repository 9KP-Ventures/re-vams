import { createClient } from "@/app/utils/supabase/server";
import { GetSemestersRequest } from "@/lib/requests/semesters/get-many";
import { NextRequest, NextResponse } from "next/server";

// GET /api/Semesters - List Semesters with pagination and filtering
export async function GET(request: NextRequest) {
  const customRequest = new GetSemestersRequest(request);
  const validationError = await customRequest.validate();

  if (validationError) {
    return validationError;
  }

  try {
    const supabase = await createClient();

    // Build the query with relationships
    let query = supabase.from("semesters").select(
      `
        *
      `,
      { count: "exact" }
    );

    // Apply filters
    if (customRequest.getSearch()) {
      const search = customRequest.getSearch()!;
      query = query.or(`id.ilike.%${search}%,name.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(customRequest.getSortBy(), {
      ascending: customRequest.getSortOrder() === "asc",
    });

    // Apply pagination
    query = query.range(
      customRequest.getOffset(),
      customRequest.getOffset() + customRequest.getLimit() - 1
    );

    const { data, error, count } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        {
          error: {
            code: 400,
            message: error.message,
          },
        },
        { status: 400 }
      );
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil((count || 0) / customRequest.getLimit());
    const hasNextPage = customRequest.getPage() < totalPages;
    const hasPrevPage = customRequest.getPage() > 1;

    return NextResponse.json(
      {
        semesters:
          data?.map(semester =>
            Object.fromEntries(
              Object.entries(semester).sort(([keyA], [keyB]) =>
                keyA.localeCompare(keyB)
              )
            )
          ) || [],
        pagination: {
          page: customRequest.getPage(),
          limit: customRequest.getLimit(),
          total: count || 0,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
        filters: customRequest.getActiveFilters(),
        sort: {
          by: customRequest.getSortBy(),
          order: customRequest.getSortOrder(),
        },
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Route error:", e);
    return NextResponse.json(
      {
        error: {
          code: 500,
          message: (e as Error).message || "Unknown error",
        },
      },
      { status: 500 }
    );
  }
}
