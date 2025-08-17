"use client";

import { GetEventsDataSuccess } from "@/lib/requests/events/get-many";
import { CalendarIcon, ClockIcon, MoreHorizontal, School } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function EventCard({
  event,
}: {
  event: GetEventsDataSuccess["events"][0];
}) {
  const router = useRouter();

  return (
    <li role="button" onClick={() => router.push(`/admin/events/${event.id}`)}>
      <Card className="cursor-pointer p-0 overflow-hidden shadow-lg hover:shadow-sm dark:hover:border-primary transition-[shadow,border]">
        <CardContent className="p-8">
          <div className="flex gap-2 justify-between items-start mb-4">
            <h3 className="font-semibold text-primary dark:text-foreground truncate">
              {event.name}
            </h3>
            <div className="flex items-center gap-4">
              <Badge
                className={cn(
                  "capitalize text-xs rounded-full",
                  event.status === "on_going"
                    ? "text-white bg-destructive"
                    : event.status === "completed"
                    ? "text-primary-foreground bg-primary"
                    : event.status === "upcoming"
                    ? "text-secondary-foreground bg-secondary"
                    : ""
                )}
              >
                {event.status.split("_").join(" ")}
              </Badge>
              <button
                className="cursor-pointer text-foreground/60 hover:text-foreground/80"
                aria-label="More options"
                onClick={e => e.stopPropagation()}
              >
                <MoreHorizontal size={24} />
              </button>
            </div>
          </div>

          <div className="space-y-2 pb-7 text-sm text-green-950 dark:text-muted-foreground">
            <div className="space-x-2 flex items-center">
              <CalendarIcon size={14} />
              <span>
                {new Date(event.date).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="space-x-2 flex items-center">
              <ClockIcon size={14} />
              <span>&mdash; to &mdash;</span>
            </div>
            <div className="space-x-2 flex items-center">
              <School size={14} />
              <span className="capitalize">{event.semesters.name ?? ""}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </li>
  );
}
