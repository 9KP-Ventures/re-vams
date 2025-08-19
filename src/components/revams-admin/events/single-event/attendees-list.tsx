"use client";

import { useEffect, useState } from "react";
import { getAttendanceSlot } from "@/actions/attendance-slot";
import { getSlotAttendees } from "@/actions/attendees";
import { GetSlotAttendeesDataSuccess } from "@/lib/requests/events/attendance-slots/attendees/get-many";
import { GetAttendanceSlotDataSuccess } from "@/lib/requests/events/attendance-slots/get+delete";
import { formatAmount, formatTime } from "@/lib/utils";
import { Clock } from "lucide-react";
import AttendeesListSearchForm from "./attendees-list-search-form";
import AttendeesListView from "./attendees-list-view";
import { ValidatedSingleEventParams } from "@/app/admin/events/[id]/page";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

// Component is made client since this is pseudochild component of the event-view.tsx
export default function AttendeesList({
  eventId,
  slot,
  params,
}: {
  eventId: number;
  slot: number;
  params: ValidatedSingleEventParams;
}) {
  const [attendees, setAttendees] =
    useState<GetSlotAttendeesDataSuccess | null>(null);
  const [slotInfo, setSlotInfo] = useState<GetAttendanceSlotDataSuccess | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendees = async () => {
      const data = await getSlotAttendees(eventId, slot, params);
      setAttendees(data);
    };

    const fetchSlotInfo = async () => {
      const data = await getAttendanceSlot(eventId, slot);
      setSlotInfo(data);
      setLoading(false);
    };

    fetchAttendees();
    fetchSlotInfo();
  }, [eventId, slot, params]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!attendees) {
    return (
      <div className="mt-4 p-4 bg-muted rounded-md">
        Something went wrong when fetching the attendees.
      </div>
    );
  }

  if (!slotInfo) {
    return (
      <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md">
        Something went wrong when loading slot information.
      </div>
    );
  }

  return (
    <div className="relative mt-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="#">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/events">Events</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/admin/events/${eventId}`}>{eventId}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Slot</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-4">
          <div className="dark:bg-secondary/40 bg-secondary/15 h-fit p-2 rounded-md flex self-center">
            <Clock className="w-4 h-4 md:w-7 md:h-7" />
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-x-3">
              <span className="font-bold text-base sm:text-xl">
                {formatTime(slotInfo.attendance_slot.trigger_time)}
              </span>

              <span className="ml-auto text-lg sm:text-xl font-bold tracking-wide text-muted-foreground">
                #{slotInfo.attendance_slot.id}
              </span>
            </div>

            <span className="text-muted-foreground text-sm sm:text-base">
              {formatAmount(slotInfo.attendance_slot.fine_amount)}
            </span>
          </div>
        </div>

        <AttendeesListSearchForm />
      </div>

      {/* Attendees list view */}
      <AttendeesListView
        key={Math.random()}
        attendees={attendees.attendees}
        pagination={attendees.pagination}
        eventId={eventId}
        slotId={slot}
        params={params}
      />
    </div>
  );
}
