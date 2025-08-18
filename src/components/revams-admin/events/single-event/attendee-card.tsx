import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GetSlotAttendeesDataSuccess } from "@/lib/requests/events/attendance-slots/attendees/get-many";
import { formatTime } from "@/lib/utils";
import { CheckCircle2, Clock, User2 } from "lucide-react";

export default function AttendeeCard({
  attendee,
}: {
  attendee: GetSlotAttendeesDataSuccess["attendees"][0];
}) {
  return (
    <Card className="hover:bg-muted/10 transition-colors">
      <CardContent className="p-4 flex items-center gap-4">
        {/* Attendee avatar/icon */}
        <div className="bg-secondary/20 h-10 w-10 rounded-full flex items-center justify-center">
          <User2 className="h-5 w-5 text-secondary-foreground/70" />
        </div>

        {/* Attendee info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">
              {attendee.student.first_name} {attendee.student.last_name}
            </h4>
            <Badge variant="outline" className="text-xs">
              {attendee.student.id}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {attendee.student.programs?.name || "No Program"} |{" "}
            {attendee.student.year_levels?.name || "No Year Level"}
          </div>
        </div>

        {/* Recorded time */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatTime(attendee.attendance_record.recorded_time)}</span>
        </div>

        {/* Status indicator */}
        <div className="flex items-center">
          <CheckCircle2 className="h-5 w-5 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}
