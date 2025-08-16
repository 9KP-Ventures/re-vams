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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function SingleEventHeader({
  event,
}: {
  event: GetEventDataSuccess["event"];
}) {
  const router = useRouter();

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
          <div className="text-sm text-primary/50 dark:text-muted-foreground">
            Dashboard / Events / {event.id}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="lg" className="flex lg:hidden">
            <Search />
            Search
          </Button>

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
