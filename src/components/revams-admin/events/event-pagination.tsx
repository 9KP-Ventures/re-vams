"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { GetEventsDataSuccess } from "@/lib/requests/events/get-many";

export default function EventsPagination({
  pagination,
}: {
  pagination?: GetEventsDataSuccess["pagination"] | undefined;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = useCallback(
    (pageNumber: number) => {
      // Create a new URLSearchParams instance from the current params
      const params = new URLSearchParams(searchParams.toString());

      // Update the page parameter
      params.set("page", pageNumber.toString());

      // Return the new URL
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams]
  );

  // If less than 1 page, don't render pagination
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        {pagination.hasPrevPage && (
          <PaginationItem>
            <PaginationPrevious href={createPageURL(pagination.page - 1)} />
          </PaginationItem>
        )}

        {Array.from({ length: pagination.totalPages }, (_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              href={createPageURL(i + 1)}
              isActive={pagination.page === i + 1}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {pagination.hasNextPage && (
          <PaginationItem>
            <PaginationNext href={createPageURL(pagination.page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
