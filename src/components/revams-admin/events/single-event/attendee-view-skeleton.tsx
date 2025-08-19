"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Clock } from "lucide-react";
import Link from "next/link";
import AttendeesListViewSkeleton from "./attendees-list-view-skeleton";
import AttendeesListSearchFormSkeleton from "./attendees-list-search-form-skeleton";

export default function AttendeeViewSkeleton({ eventId }: { eventId: number }) {
  return (
    <div className="relative mt-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="#">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/events">Events</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/admin/events/${eventId}`}>{eventId}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Slot</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header with clock and info */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-4">
          <div className="dark:bg-secondary/40 bg-secondary/15 h-fit p-2 rounded-md flex self-center">
            <Clock className="w-4 h-4 md:w-7 md:h-7 text-muted-foreground/50" />
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-x-3">
              <Skeleton className="h-6 w-20 sm:h-7 sm:w-32" />
              <Skeleton className="ml-auto h-6 w-10 sm:h-7 sm:w-14" />
            </div>
            <Skeleton className="h-4 w-24 sm:h-5 sm:w-32 mt-1" />
          </div>
        </div>

        {/* Search form skeleton */}
        <AttendeesListSearchFormSkeleton />
      </div>

      {/* Attendees list view skeleton */}
      <AttendeesListViewSkeleton />
    </div>
  );
}
