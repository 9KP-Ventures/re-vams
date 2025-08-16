"use client";

import { Button } from "@/components/ui/button";
import { GetEventDataSuccess } from "@/lib/requests/events/get+delete";
import { Circle, CornerUpLeft, DownloadCloud, Edit, QrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import SingleEventStatsData from "./event-stats-data";
import { Badge } from "@/components/ui/badge";

export default function SingleEventHeader({
  event,
}: {
  event: GetEventDataSuccess["event"];
}) {
  const router = useRouter();

  return (
    <div className="relative">
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
        className="absolute -top-8 right-0 flex items-center gap-2 px-6 py-2 rounded-full"
      >
        {event.status === 'active' && (
          <Circle className="w-2 h-2 fill-primary text-primary" />
        )}
        {event.status === 'inactive' && (
          <Circle className="w-2 h-2 fill-gray-400 text-gray-400" />
        )}
        {`${event.status.charAt(0).toUpperCase()}${event.status.slice(1)}`}
      </Badge>

      {/* Title and action buttons */}
      <div className="flex justify-between gap-4 items-center mb-1">
        <div>
          <h1 className="text-4xl font-extrabold capitalize truncate">
            {event.name}
          </h1>
          <div className="text-sm text-primary/50 dark:text-muted-foreground mb-4">
            Dashboard / Events / {event.id}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="lg">
            <Edit />
            Edit
          </Button>

          <Button variant="outline" size="lg" disabled={event.status === "inactive"}>
            <QrCode />
            Show QR
          </Button>

          <Button size="lg" disabled={event.status === "inactive"}>
            <DownloadCloud />
            Export
          </Button>
        </div>
      </div>

      {/* Info card */}
      <div
        className="bg-secondary/12 dark:bg-primary/40 py-4 sm:py-5 md:py-7 px-3 sm:px-4 md:px-6 rounded-lg"
        aria-label="Events statistics"
      >
        <SingleEventStatsData event={event} />
      </div>
    </div>
  );
}
