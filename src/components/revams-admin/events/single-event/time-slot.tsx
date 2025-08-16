"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSingleEventParams } from "@/lib/hooks/single-event-params";
import { GetAttendanceSlotsDataSuccess } from "@/lib/requests/events/attendance-slots/get-many";
import { cn, formatAmount, formatTime } from "@/lib/utils";
import { Clock } from "lucide-react";

export default function TimeSlot({
  index,
  data,
  stripColor,
}: {
  index: number;
  data: GetAttendanceSlotsDataSuccess["attendance_slots"][0];
  stripColor?: string;
}) {
  const { setTimeSlot } = useSingleEventParams();

  const slotType = data.type === "TIME_IN" ? "Time in" : "Time out";
  const slotColor = data.type === "TIME_IN" ? "bg-primary" : "bg-secondary/70";

  return (
    <Card
      className="py-3 overflow-hidden relative hover:scale-[1.02] cursor-pointer transition-transform duration-200"
      onClick={() => setTimeSlot(data.id)}
    >
      {/* Notch strip */}
      <div
        className={cn(
          "absolute right-0 top-0 w-8 h-full bg-muted rounded-r-md",
          stripColor
        )}
      ></div>

      <CardContent className="flex gap-8">
        <div className="dark:bg-secondary/40 bg-secondary/15 h-fit p-2 rounded-md flex self-center">
          <Clock className="w-8 h-8" />
        </div>
        <div className="flex flex-col w-[70%]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl">
              {formatTime(data.trigger_time)}
            </span>
            <Badge className={slotColor}>{slotType}</Badge>
          </div>
          <span className="text-muted-foreground">
            {formatAmount(data.fine_amount)}
          </span>
        </div>
        <span className="self-center text-2xl font-bold tracking-wide text-muted-foreground">
          # {index}
        </span>
      </CardContent>
    </Card>
  );
}
