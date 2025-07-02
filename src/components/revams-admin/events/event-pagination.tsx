"use client";

import { usePathname } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { GetEventsDataSuccess } from "@/lib/requests/events/get-many";
import { ValidatedSearchParams } from "@/app/admin/events/page";

export default function EventsPagination({
  pagination,
  params,
}: {
  pagination?: GetEventsDataSuccess["pagination"] | undefined;
  params: ValidatedSearchParams;
}) {
  const pathname = usePathname();

  // If less than 1 page, don't render pagination
  if (!pagination || pagination.totalPages <= 1) return null;

  const showMaxPages = 5; // Maximum number of page buttons to show

  // Determine which page numbers to display
  const getVisiblePages = (currentPage: number, totalPages: number) => {
    // Always show first and last page
    const firstPage = 1;
    const lastPage = totalPages;

    // Calculate the range of visible pages
    let startPage = Math.max(
      firstPage,
      currentPage - Math.floor(showMaxPages / 2)
    );
    const endPage = Math.min(lastPage, startPage + showMaxPages - 1);

    // Adjust if we're near the end
    if (endPage - startPage + 1 < showMaxPages) {
      startPage = Math.max(firstPage, endPage - showMaxPages + 1);
    }

    // Create the array of pages to display
    const pages = [];

    // Always add first page
    if (startPage > firstPage) {
      pages.push(firstPage);
      // Add ellipsis if there's a gap
      if (startPage > firstPage + 1) {
        pages.push("ellipsis-start");
      }
    }

    // Add the visible page range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Always add last page
    if (endPage < lastPage) {
      // Add ellipsis if there's a gap
      if (endPage < lastPage - 1) {
        pages.push("ellipsis-end");
      }
      pages.push(lastPage);
    }

    return pages;
  };

  const visiblePages = getVisiblePages(pagination.page, pagination.totalPages);

  return (
    <Pagination>
      <PaginationContent>
        {pagination.hasPrevPage && (
          <PaginationItem>
            <PaginationPrevious
              href={{
                pathname,
                query: {
                  ...params,
                  page: pagination.page > 1 ? pagination.page - 1 : 1,
                },
              }}
            />
          </PaginationItem>
        )}

        {visiblePages.map((page, index) => {
          // Handle ellipsis
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          // Handle regular page number
          return (
            <PaginationItem key={index}>
              <PaginationLink
                href={{
                  pathname,
                  query: {
                    ...params,
                    page: page,
                  },
                }}
                isActive={pagination.page === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {pagination.hasNextPage && (
          <PaginationItem>
            <PaginationNext
              href={{
                pathname,
                query: {
                  ...params,
                  page:
                    pagination.page < pagination.totalPages
                      ? pagination.page + 1
                      : pagination.totalPages,
                },
              }}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
