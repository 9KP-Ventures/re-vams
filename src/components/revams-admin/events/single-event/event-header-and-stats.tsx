"use client";

import { Button } from "@/components/ui/button";
import { GetEventDataSuccess } from "@/lib/requests/events/get+delete";
import { Circle, DownloadCloud, Edit, QrCode, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import StudentLookupMobile from "./student-lookup-mobile";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function SingleEventHeader({
  event,
}: {
  event: GetEventDataSuccess["event"];
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="relative mt-8">
      {/* Event status */}
      <Badge
        variant="outline"
        className="absolute -top-10 right-0 flex items-center gap-2 px-6 py-2 rounded-full capitalize"
      >
        {event.status === "upcoming" && (
          <Circle className="w-2 h-2 fill-secondary text-secondary" />
        )}
        {event.status === "on_going" && (
          <Circle className="w-2 h-2 fill-destructive text-destructive" />
        )}
        {event.status === "completed" && (
          <Circle className="w-2 h-2 fill-primary text-primary" />
        )}
        {event.status.split("_").join(" ")}
      </Badge>

      {/* Title and action buttons */}
      <div className="flex flex-col gap-4 mb-1">
        <div className="w-full">
          <h1 className="text-4xl font-extrabold capitalize overflow-wrap-normal break-words">
            {event.name}
          </h1>
          <div aria-label="Event details" className="mt-2 flex space-x-2">
            <p>
              {new Date(event.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-sm text-muted-foreground">&#124;</p>
            <p className="capitalize">{event.semesters.name}</p>
          </div>
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
              <BreadcrumbItem>{event.id}</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Search Popover for mobile */}
          <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="lg" className="flex lg:hidden">
                <Search />
                Search
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-screen p-0 -mt-8 max-w-[93vw] h-[75vh] overflow-auto lg:hidden"
              align="start"
              sideOffset={10}
            >
              <div className="sticky top-0 flex justify-between items-center p-4 bg-card border-b z-10">
                <h3
                  className={`font-bold text-lg ${
                    event.status === "upcoming"
                      ? "text-muted-foreground"
                      : "text-primary"
                  }`}
                >
                  Student Search
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X size={18} />
                </Button>
              </div>
              <div className="p-4">
                <StudentLookupMobile
                  eventId={event.id}
                  disabled={event.status === "upcoming"}
                />
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="lg"
            disabled={event.status !== "upcoming"}
          >
            <Edit />
            Edit
          </Button>

          <Button
            variant="outline"
            size="lg"
            disabled={
              event.status === "upcoming" || event.status === "completed"
            }
          >
            <QrCode />
            Show QR
          </Button>

          <Button
            className="w-26"
            size="lg"
            disabled={event.status === "upcoming"}
          >
            <DownloadCloud />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
