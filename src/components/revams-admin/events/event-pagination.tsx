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
import { useEffect, useState } from "react";

export default function EventsPagination({
  pagination,
  params,
}: {
  pagination?: GetEventsDataSuccess["pagination"] | undefined;
  params: ValidatedSearchParams;
}) {
  const pathname = usePathname();
  
  // Use a client-side effect to detect window size
  const [isMounted, setIsMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024); // Default to desktop size

  // Only run this effect on the client
  useEffect(() => {
    setIsMounted(true);
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If less than 1 page, don't render pagination
  if (!pagination || pagination.totalPages <= 1) return null;

  // Calculate max pages to show based on screen width
  // This now only runs after mounting, preventing hydration mismatch
  const getShowMaxPages = () => {
    if (!isMounted) return 5; // Default for server rendering
    if (windowWidth < 480) return 1;
    if (windowWidth < 640) return 3;
    return 5;
  };

  const showMaxPages = getShowMaxPages();

  // Determine which page numbers to display
  const getVisiblePages = (currentPage: number, totalPages: number) => {
    // For very small screens, simplified view
    if (isMounted && showMaxPages === 1) {
      return [currentPage];
    }
    
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

  // Render the standard pagination layout for server and initial client render
  // Then let the client-side JS update it based on screen size
  return (
    <Pagination className="justify-between sm:justify-center">
      {/* Only show this after client-side hydration */}
      {isMounted && windowWidth < 480 && pagination.totalPages > 1 && (
        <div className="text-center text-sm text-muted-foreground mt-2">
          Page {pagination.page} of {pagination.totalPages}
        </div>
      )}
      <PaginationContent className="flex flex-wrap justify-between sm:justify-center gap-1">
        {pagination.hasPrevPage && (
          <>
            {/* Show this on larger screens or during server render */}
            <PaginationItem className={isMounted && windowWidth < 640 ? "hidden" : ""}>
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

            {/* Show this on small screens after client-side hydration */}
            {isMounted && windowWidth < 640 && (
              <PaginationItem>
                <PaginationLink
                  href={{
                    pathname,
                    query: {
                      ...params,
                      page: pagination.page > 1 ? pagination.page - 1 : 1,
                    },
                  }}
                  className="px-2"
                >
                  &lt;
                </PaginationLink>
              </PaginationItem>
            )}
          </>
        )}

        {visiblePages.map((page, index) => {
          // Handle ellipsis
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <PaginationItem key={`ellipsis-${index}`} className={isMounted && windowWidth < 480 ? "hidden" : ""}>
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
                className={isMounted && windowWidth < 480 ? "h-8 w-8 p-0" : ""}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {pagination.hasNextPage && (
          <>
            {/* Show this on larger screens or during server render */}
            <PaginationItem className={isMounted && windowWidth < 640 ? "hidden" : ""}>
              <PaginationNext
                href={{
                  pathname,
                  query: {
                    ...params,
                    page: pagination.page < pagination.totalPages
                      ? pagination.page + 1
                      : pagination.totalPages,
                  },
                }}
              />
            </PaginationItem>

            {/* Show this on small screens after client-side hydration */}
            {isMounted && windowWidth < 640 && (
              <PaginationItem>
                <PaginationLink
                  href={{
                    pathname,
                    query: {
                      ...params,
                      page: pagination.page < pagination.totalPages
                        ? pagination.page + 1
                        : pagination.totalPages,
                    },
                  }}
                  className="px-2"
                >
                  &gt;
                </PaginationLink>
              </PaginationItem>
            )}
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
}