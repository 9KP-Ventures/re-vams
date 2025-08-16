"use client";

import { Button } from "@/components/ui/button";
import { GetEventDataSuccess } from "@/lib/requests/events/get+delete";
import {
  Circle,
  CornerUpLeft,
  DownloadCloud,
  Edit,
  QrCode,
  Search,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import StudentLookupMobile from "./student-lookup-mobile";

export default function SingleEventHeader({
  event,
}: {
  event: GetEventDataSuccess["event"];
}) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="relative mt-8">
      {/* Back button */}
      <Button
        onClick={() => router.back()}
        variant="link"
        className="absolute -top-10 -left-3"
      >
        <CornerUpLeft />
        Back
      </Button>

      {/* Event status */}
      <Badge
        variant="outline"
        className="absolute -top-10 right-0 flex items-center gap-2 px-6 py-2 rounded-full"
      >
        {event.status === "active" && (
          <Circle className="w-2 h-2 fill-primary text-primary" />
        )}
        {event.status === "inactive" && (
          <Circle className="w-2 h-2 fill-gray-400 text-gray-400" />
        )}
        {`${event.status.charAt(0).toUpperCase()}${event.status.slice(1)}`}
      </Badge>

      {/* Title and action buttons */}
      <div className="flex flex-col gap-4 mb-1">
        <div className="w-full">
          <h1 className="text-4xl font-extrabold capitalize overflow-wrap-normal break-words">
            {event.name}
          </h1>
          <div aria-label="Event details" className="flex space-x-2">
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
          <div className="text-sm text-primary/50 dark:text-muted-foreground">
            Dashboard / Events / {event.id}
          </div>
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
                    event.status === "active"
                      ? "text-primary"
                      : "text-muted-foreground"
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
                  eventIsActive={event.status === "active"}
                />
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="lg">
            <Edit />
            Edit
          </Button>

          <Button
            variant="outline"
            size="lg"
            disabled={event.status === "inactive"}
          >
            <QrCode />
            Show QR
          </Button>

          <Button
            className="w-26"
            size="lg"
            disabled={event.status === "inactive"}
          >
            <DownloadCloud />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
