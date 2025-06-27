import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "../constants/texts/api";

export function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json(
    {
      error: {
        code: status,
        message,
      },
    },
    { status }
  );
}

export function createSuccessResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}

export function getPaginationParams(request: NextRequest) {
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

export function createPaginationResponse(
  data: any[],
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

  return {
    [dataKey]: data.map(item =>
      Object.fromEntries(
        Object.entries(item).sort(([keyA], [keyB]) =>
          keyA.localeCompare(keyB)
        )
      )
    ),
    meta: {
      total: count,
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