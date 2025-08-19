"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FilterIcon, SortAscIcon } from "lucide-react";

export default function AttendeesListViewSkeleton() {
  const skeletonRows = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="mt-6">
      {/* Header with filters */}
      <div className="flex flex-wrap gap-2 mb-4 items-center justify-between">
        <h3 className="text-lg font-semibold">
          <Skeleton className="h-6 w-32" />
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-1.5"
            disabled
          >
            <FilterIcon className="h-4 w-4 text-muted-foreground/50" />
            Filter
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-1.5"
            disabled
          >
            <SortAscIcon className="h-4 w-4 text-muted-foreground/50" />
            Sort
          </Button>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border overflow-x-auto">
        <div className="min-w-[850px] lg:min-w-[1050px] xl:min-w-[1230px] 2xl:min-w-[1500px]">
          {/* Table headers */}
          <div className="grid grid-cols-[1fr_1fr_0.5fr] lg:grid-cols-[1fr_1fr_0.5fr_0.5fr] xl:grid-cols-[1fr_1fr_1fr_0.5fr_0.5fr] 2xl:grid-cols-[1fr_1fr_1fr_1fr_0.5fr_0.5fr] gap-3 bg-muted/40 p-3 font-medium text-muted-foreground">
            <div>Name</div>
            <div className="hidden 2xl:block">Degree</div>
            <div>Program</div>
            <div className="hidden xl:block">Major</div>
            <div className="hidden lg:block">Year</div>
            <div className="text-right">Time Attended</div>
          </div>

          {/* Table content - skeleton rows */}
          <div className="divide-y">
            <ul>
              {skeletonRows.map(index => (
                <li key={index}>
                  <div className="grid grid-cols-[1fr_1fr_0.5fr] lg:grid-cols-[1fr_1fr_0.5fr_0.5fr] xl:grid-cols-[1fr_1fr_1fr_0.5fr_0.5fr] 2xl:grid-cols-[1fr_1fr_1fr_1fr_0.5fr_0.5fr] gap-3 px-3 py-3 md:py-6 items-center">
                    {/* Name column with ID badge and email */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-3 w-40 mt-0.5" />
                    </div>

                    {/* Degree column */}
                    <div className="truncate hidden 2xl:block">
                      <Skeleton className="h-4 w-24" />
                    </div>

                    {/* Program column */}
                    <div className="truncate">
                      <Skeleton className="h-4 w-28" />
                    </div>

                    {/* Major column */}
                    <div className="truncate hidden xl:block">
                      <Skeleton className="h-4 w-20" />
                    </div>

                    {/* Year column */}
                    <div className="hidden lg:block">
                      <Skeleton className="h-4 w-16" />
                    </div>

                    {/* Time column */}
                    <div className="text-right">
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Skeleton loading indicator */}
        <div className="py-4 text-center">
          <div className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      {/* Pagination info skeleton */}
      <div className="my-8 text-center">
        <Skeleton className="h-4 w-40 mx-auto" />
      </div>
    </div>
  );
}
