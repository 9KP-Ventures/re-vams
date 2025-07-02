"use client";

import { usePathname } from "next/navigation";
import {
  Pagination,
  PaginationContent,
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
                  page: pagination.page - 1,
                },
              }}
            />
          </PaginationItem>
        )}

        {Array.from({ length: pagination.totalPages }, (_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              href={{
                pathname,
                query: {
                  ...params,
                  page: pagination.page + 1,
                },
              }}
              isActive={pagination.page === i + 1}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {pagination.hasNextPage && (
          <PaginationItem>
            <PaginationNext
              href={{
                pathname,
                query: {
                  ...params,
                  page: pagination.page + 1,
                },
              }}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
