"use client";

import { GetEventsDataSuccess } from "@/lib/requests/events/get-many";
import {
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  MoreHorizontal,
  PhilippinePeso,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function EventCard({
  event,
}: {
  event: GetEventsDataSuccess["events"][0];
}) {
  return (
    <li role="button">
      <Card className="cursor-pointer p-0 overflow-hidden shadow-lg hover:shadow-sm transition-shadow">
        <CardContent className="p-8">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-primary">{event.name}</h3>
            <div className="flex items-center gap-8">
              <span
                className={cn(
                  "capitalize px-10 py-1 text-xs font-medium rounded-full bg-accent text-accent-foreground",
                  event.status === "active"
                    ? "text-accent-foreground bg-accent"
                    : event.status === "inactive"
                    ? "text-muted-foreground bg-muted"
                    : ""
                )}
              >
                {event.status}
              </span>
              <button className="cursor-pointer text-foreground/60 hover:text-foreground/80">
                <MoreHorizontal size={24} />
              </button>
            </div>
          </div>

          <div className="space-y-2 text-sm text-green-950">
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
              <span>8:00 to 12:00</span>
            </div>

            <div className="space-x-2 flex items-center">
              <UsersIcon size={14} />
              <span>1,908 Attendees</span>
            </div>

            <div className="space-x-2 flex items-center">
              <PhilippinePeso size={14} />
              <span>50 Revenue Generated</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </li>
  );
}
