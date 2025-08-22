"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Edit, DownloadCloud, Search } from "lucide-react";

export default function SingleEventHeaderSkeleton() {
  return (
    <div className="relative mt-8">
      {/* Event status skeleton */}
      <Badge
        variant="outline"
        className="absolute -top-10 right-0 flex items-center gap-2 px-6 py-2 rounded-full capitalize"
      >
        <Skeleton className="w-2 h-2 rounded-full" />
        <Skeleton className="w-16 h-4" />
      </Badge>

      {/* Title and action buttons */}
      <div className="flex flex-col gap-4 mb-1">
        <div className="w-full">
          {/* Title skeleton */}
          <Skeleton className="h-11 w-3/4 mb-2" />

          {/* Event details skeleton */}
          <div aria-label="Event details" className="mt-2 flex space-x-2">
            <Skeleton className="h-5 w-32" />
            <p className="text-sm text-muted-foreground">&#124;</p>
            <Skeleton className="h-5 w-24" />
          </div>

          {/* Breadcrumb skeleton */}
          <Breadcrumb className="mt-4 mb-2">
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
                <Skeleton className="h-4 w-8 inline-block" />
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Action buttons skeleton */}
        <div className="w-full sm:w-fit grid grid-cols-2 grid-rows-2 sm:grid-rows-1 sm:grid-cols-3 gap-2">
          {/* Search button skeleton */}
          <Button
            variant="outline"
            size="lg"
            className="flex lg:hidden order-3 sm:order-1 col-span-2 sm:col-span-1"
            disabled
          >
            <Search />
            Search
          </Button>

          {/* Edit button skeleton */}
          <Button variant="outline" size="lg" disabled>
            <Edit />
            Edit
          </Button>

          {/* Export button skeleton */}
          <Button className="order-1 sm:order-3" size="lg" disabled>
            <DownloadCloud />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
