import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, PaginationParams } from "../app/constants/texts/api";

export function createErrorResponse(message: string, status: number = 400) {
  const errorResponse: ApiResponse<never> = {
    error: {
      code: status,
      message,
    },
  };

  return NextResponse.json(errorResponse, { status });
}

export function createSuccessResponse<T>(data: T, status: number = 200) {
  const successResponse: ApiResponse<T> = {
    data,
  };

  return NextResponse.json(successResponse, { status });
}

export function getPaginationParams(request: NextRequest): PaginationParams | null {
  const { searchParams } = new URL(request.url);
  const pageSize = Math.min(
    parseInt(searchParams.get("page[size]") || "") || DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE
  );
  const page = parseInt(searchParams.get("page[number]") || "") || 1;

  if (pageSize <= 0 || page <= 0) {
    return null;
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  return { pageSize, page, from, to };
}

export function createPaginationResponse<T extends Record<string, unknown>>(
  data: T[],
  count: number | null,
  page: number,
  pageSize: number,
  request: NextRequest,
  dataKey: string = "data"
) {
  const totalPages = count ? Math.ceil(count / pageSize) : 1;
  const hasMore = page < totalPages;

  const baseUrl = `${request.nextUrl.origin}${request.nextUrl.pathname}`;
  const nextLink = hasMore
    ? `${baseUrl}?page[number]=${page + 1}&page[size]=${pageSize}`
    : null;
  const prevLink =
    page > 1
      ? `${baseUrl}?page[number]=${page - 1}&page[size]=${pageSize}`
      : null;

  const sortedData = data.map(item =>
    Object.fromEntries(
      Object.entries(item).sort(([keyA], [keyB]) =>
        keyA.localeCompare(keyB)
      )
    ) as T
  );

  return {
    [dataKey]: sortedData,
    data: sortedData,
    meta: {
      total: count || 0,
      page,
      page_size: pageSize,
      total_pages: totalPages,
      has_more: hasMore,
    },
    links: {
      next: nextLink,
      prev: prevLink,
    },
  };
}
