"use client";

import { getSlotAttendees } from "@/actions/attendees";
import { ValidatedSingleEventParams } from "@/app/admin/events/[id]/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GetSlotAttendeesDataSuccess } from "@/lib/requests/events/attendance-slots/attendees/get-many";
import { formatTime } from "@/lib/utils";
import { FilterIcon, Loader2, SortAscIcon, User2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function AttendeesListView({
  attendees: initialAttendees,
  pagination,
  eventId,
  slotId,
  params,
}: {
  attendees: GetSlotAttendeesDataSuccess["attendees"];
  pagination: GetSlotAttendeesDataSuccess["pagination"];
  eventId: number;
  slotId: number;
  params: ValidatedSingleEventParams;
}) {
  const [ref, inView] = useInView();
  const [attendees, setAttendees] =
    useState<GetSlotAttendeesDataSuccess["attendees"]>(initialAttendees);
  const [page, setPage] = useState(1);

  const loadMoreAttendees = useCallback(async () => {
    const next = page + 1;
    const newAttendees = await getSlotAttendees(eventId, slotId, params, next);

    if (newAttendees?.attendees.length) {
      setPage(next);
      setAttendees((prev: GetSlotAttendeesDataSuccess["attendees"]) => [
        ...(prev?.length ? prev : []),
        ...newAttendees.attendees,
      ]);
    }
  }, [eventId, slotId, params, page]);

  useEffect(() => {
    if (inView) {
      // Load more attendees when the loader comes into view
      loadMoreAttendees();
    }
  }, [inView, loadMoreAttendees]);

  return (
    <div className="mt-6">
      {/* Filter and sorting controls */}
      <div className="flex flex-wrap gap-2 mb-4 items-center justify-between">
        <h3 className="text-lg font-semibold">
          Attendees ({pagination.total || 0})
        </h3>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-1.5"
          >
            <FilterIcon className="h-4 w-4" />
            Filter
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-1.5"
          >
            <SortAscIcon className="h-4 w-4" />
            Sort
          </Button>
        </div>
      </div>

      {/* Table-style list with headers */}
      {attendees.length > 0 ? (
        <div className="rounded-md border overflow-x-auto">
          <div className="min-w-[850px] lg:min-w-[1050px] xl:min-w-[1230px] 2xl:min-w-[1500px]">
            {/* Set minimum width to ensure content doesn't compress */}
            {/* Table headers */}
            <div className="grid grid-cols-[1fr_1fr_0.5fr] lg:grid-cols-[1fr_1fr_0.5fr_0.5fr] xl:grid-cols-[1fr_1fr_1fr_0.5fr_0.5fr] 2xl:grid-cols-[1fr_1fr_1fr_1fr_0.5fr_0.5fr] gap-3 bg-muted/40 p-3 font-medium text-muted-foreground">
              <div>Name</div>
              <div className="hidden 2xl:block">Degree</div>
              <div className="">Program</div>
              <div className="hidden xl:block">Major</div>
              <div className="hidden lg:block">Year</div>
              <div className="text-right">Time Attended</div>
            </div>
            {/* Table content */}
            <div className="divide-y">
              <ul>
                {attendees.map(attendee => (
                  <li key={attendee.student.id}>
                    <div className="grid grid-cols-[1fr_1fr_0.5fr] lg:grid-cols-[1fr_1fr_0.5fr_0.5fr] xl:grid-cols-[1fr_1fr_1fr_0.5fr_0.5fr] 2xl:grid-cols-[1fr_1fr_1fr_1fr_0.5fr_0.5fr] gap-3 px-3 py-3 md:py-6 items-center hover:bg-muted/10 transition-colors">
                      {/* Name column with ID badge and email */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {attendee.student.last_name}
                            {", "}
                            {attendee.student.first_name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {attendee.student.id}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground mt-0.5">
                          {attendee.student.email_address}
                        </span>
                      </div>

                      {/* Degree column */}
                      <div className="truncate hidden 2xl:block">
                        {attendee.student.degrees?.name || "-"}
                      </div>

                      {/* Program column */}
                      <div className="truncate">
                        {attendee.student.programs?.name || "-"}
                      </div>

                      {/* Major column */}
                      <div className="truncate hidden xl:block">
                        {attendee.student.majors?.name || "-"}
                      </div>

                      {/* Year column */}
                      <div className="hidden lg:block">
                        {attendee.student.year_levels?.name || "-"}
                      </div>

                      {/* Time column */}
                      <div className="text-right text-sm text-muted-foreground">
                        {formatTime(attendee.attendance_record.recorded_time)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Infinite scroll loading indicator */}
          {attendees.length < pagination.total && (
            <div className="py-4 text-center" ref={ref}>
              <div className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading more...</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card className="bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-muted p-3 mb-3">
              <User2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-center">
              No attendees recorded for this time slot.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Show current page info (will be replaced by infinite scroll) */}
      {attendees.length > 0 && (
        <div className="my-8 text-sm text-center text-muted-foreground">
          Showing {Math.min(pagination.total, attendees.length)} of{" "}
          {pagination.total} attendees
        </div>
      )}
    </div>
  );
}
