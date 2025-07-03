"use client";

import { GetEventsDataSuccess } from "@/lib/requests/events/get-many";
import { CalendarIcon, ClockIcon, MoreHorizontal, School } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function EventCard({
  event,
}: {
  event: GetEventsDataSuccess["events"][0];
}) {
  return (
    <li role="button">
      <Card className="cursor-pointer p-0 overflow-hidden shadow-lg hover:shadow-sm transition-shadow">
        <CardContent className="p-8">
          <div className="flex gap-2 justify-between items-start mb-4">
            <h3 className="font-semibold text-primary dark:text-foreground truncate">
              {event.name}
            </h3>
            <div className="flex items-center gap-4">
              <Badge
                className={cn(
                  "capitalize text-xs rounded-full",
                  event.status === "active"
                    ? "text-accent-foreground bg-accent"
                    : event.status === "inactive"
                    ? "text-muted-foreground bg-muted"
                    : ""
                )}
              >
                {event.status}
              </Badge>
              <button className="cursor-pointer text-foreground/60 hover:text-foreground/80">
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
