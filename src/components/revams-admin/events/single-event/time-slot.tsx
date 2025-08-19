"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSingleEventParams } from "@/lib/hooks/single-event-params";
import { GetAttendanceSlotsDataSuccess } from "@/lib/requests/events/attendance-slots/get-many";
import { cn, formatAmount, formatTime } from "@/lib/utils";
import { Clock } from "lucide-react";

export default function TimeSlot({
  data,
  stripColor,
}: {
  data: GetAttendanceSlotsDataSuccess["attendance_slots"][0];
  stripColor?: string;
}) {
  const { setTimeSlot, setStudentId } = useSingleEventParams();

  const slotColor = data.type === "TIME_IN" ? "bg-primary" : "bg-secondary/70";

  return (
    <Card
      className="py-4 sm:py-7 overflow-hidden relative hover:scale-[1.02] cursor-pointer transition-transform duration-200"
      onClick={() => {
        setTimeSlot(data.id);
        setStudentId(null);
      }}
    >
      {/* Notch strip */}
      <div
        className={cn(
          "absolute right-0 top-0 w-4 sm:w-8 h-full bg-muted rounded-r-md",
          stripColor
        )}
      ></div>

      <CardContent className="pl-3 pr-10 sm:pr-16 sm:pl-6 flex gap-4 md:gap-6">
        <div className="dark:bg-secondary/40 bg-secondary/15 h-fit p-2 rounded-md flex self-center">
          <Clock className="w-4 h-4 md:w-7 md:h-7" />
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-x-3">
            <span className="font-bold text-sm sm:text-xl">
              {formatTime(data.trigger_time)}
            </span>
            <Badge className={cn(slotColor, "capitalize")}>
              {data.type.split("_").join(" ").toLowerCase()}
            </Badge>

            <span className="ml-auto text-lg sm:text-xl font-bold tracking-wide text-muted-foreground">
              #{data.id}
            </span>
          </div>

          <span className="text-muted-foreground text-sm sm:text-base">
            {formatAmount(data.fine_amount)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
