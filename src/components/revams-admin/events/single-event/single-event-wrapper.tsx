"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getEventData } from "@/actions/event";
import { getAttendanceSlots } from "@/actions/attendance-slots";
import { getSlotAttendees } from "@/actions/attendees";
import { getAttendanceSlot } from "@/actions/attendance-slot";
import { formatTime, formatAmount } from "@/lib/utils";
import {
  GetEventDataError,
  GetEventDataSuccess,
} from "@/lib/requests/events/get+delete";
import { GetAttendanceSlotsDataSuccess } from "@/lib/requests/events/attendance-slots/get-many";
import {
  GetSlotAttendeesDataError,
  GetSlotAttendeesDataSuccess,
} from "@/lib/requests/events/attendance-slots/attendees/get-many";
import { GetAttendanceSlotDataSuccess } from "@/lib/requests/events/attendance-slots/get+delete";
import { ValidatedSingleEventParams } from "@/app/admin/events/[id]/page";
import SingleEventHeader from "./event-header-and-stats";
import MainEventViewPageSkeleton from "./event-view-skeleton";
import AttendeesListSearchForm from "./attendees-list-search-form";
import AttendeesListView from "./attendees-list-view";
import TimeSlots from "./time-slots";
import StudentLookup from "./student-lookup";
import AddTimeSlot from "./add-time-slot";
import AttendeeViewSkeleton from "./attendee-view-skeleton";
import AttendeesDataError from "@/app/admin/events/[id]/attendees-error";
import TimeSlotDataError from "@/app/admin/events/[id]/time-slot-error";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const MAX_TIME_SLOTS = 5; // Define your constant

export default function SingleEventWrapper({
  eventId,
  validatedParams,
}: {
  eventId: number;
  validatedParams: ValidatedSingleEventParams;
}) {
  // State for event data
  const [event, setEvent] = useState<GetEventDataSuccess["event"] | null>(null);
  const [eventError, setEventError] = useState<
    GetEventDataError["error"] | null
  >(null);

  const [slots, setSlots] = useState<
    GetAttendanceSlotsDataSuccess["attendance_slots"]
  >([]);

  const [loading, setLoading] = useState(true);

  // State for attendee view
  const [attendeeViewData, setAttendeeViewData] = useState<{
    attendees: GetSlotAttendeesDataSuccess | null;
    slotInfo: GetAttendanceSlotDataSuccess | null;
    loading: boolean;
  }>({
    attendees: null,
    slotInfo: null,
    loading: true,
  });
  const [attendeesError, setAttendeesError] = useState<
    GetSlotAttendeesDataError["error"] | null
  >(null);

  // Determine if we're in attendee list mode
  const isAttendeeView = Boolean(validatedParams.time_slot);

  // Fetch main event data
  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);

      // Fetch event data
      const eventData = await getEventData(eventId);

      if ("error" in eventData) {
        setEventError(eventData.error);
        setEvent(null);
        setLoading(false);
        return;
      }

      setEvent(eventData.event);

      // Only fetch slots if not in attendee view
      if (!isAttendeeView) {
        const slotsData = await getAttendanceSlots(eventId);

        if ("error" in slotsData) {
          setSlots([]);
          toast.error(`Event slots data error: ${slotsData.error.code}`, {
            description: slotsData.error.message,
          });
          setLoading(false);
          return;
        }

        setSlots(slotsData.attendance_slots);
      }
      setLoading(false);
    };

    fetchEventData();
  }, [eventId, isAttendeeView]);

  // Fetch attendee data if in attendee view
  useEffect(() => {
    const fetchAttendeeViewData = async () => {
      if (!isAttendeeView || !event) return;

      setAttendeeViewData(prev => ({ ...prev, loading: true }));

      const [attendeesData, slotData] = await Promise.all([
        getSlotAttendees(eventId, validatedParams.time_slot!, validatedParams),
        getAttendanceSlot(eventId, validatedParams.time_slot!),
      ]);

      if ("error" in slotData) {
        setAttendeeViewData({
          attendees: null,
          slotInfo: null,
          loading: false,
        });
        toast.error(`Time slot data error: ${slotData.error.code}`, {
          description: slotData.error.message,
        });
        return;
      }

      if ("error" in attendeesData) {
        setAttendeeViewData({
          attendees: null,
          slotInfo: null,
          loading: false,
        });
        setAttendeesError(attendeesData.error);
        return;
      }

      setAttendeeViewData({
        attendees: attendeesData,
        slotInfo: slotData,
        loading: false,
      });
    };

    fetchAttendeeViewData();
  }, [eventId, isAttendeeView, event, validatedParams]);

  // Show loading state while fetching initial data
  if (loading) {
    return <MainEventViewPageSkeleton />;
  }

  // Show not found if event doesn't exist
  if ((eventError && eventError.code === 404) || !event) {
    return notFound();
  }

  // Render the attendee view or main event view
  if (isAttendeeView) {
    // Loading state for attendee view
    if (attendeeViewData.loading) {
      return <AttendeeViewSkeleton eventId={event.id} />;
    }

    // Error states for attendee view
    if (!attendeeViewData.slotInfo) {
      return (
        <TimeSlotDataError
          eventId={event.id}
          slotId={validatedParams.time_slot}
        />
      );
    }

    if (
      (attendeesError && attendeesError.code === 404) ||
      !attendeeViewData.attendees
    ) {
      return <AttendeesDataError eventId={event.id} />;
    }

    // Render attendee view
    return (
      <div className="relative mt-8">
        {/* Event status */}
        <Badge
          variant={
            attendeeViewData.slotInfo.attendance_slot.type === "TIME_IN"
              ? "default"
              : attendeeViewData.slotInfo.attendance_slot.type === "TIME_OUT"
              ? "secondary"
              : "outline"
          }
          className="absolute -top-10 right-0 flex items-center gap-2 px-6 py-2 rounded-full capitalize"
        >
          {attendeeViewData.slotInfo.attendance_slot.type
            .split("_")
            .join(" ")
            .toLowerCase()}
        </Badge>
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
                  {formatTime(
                    attendeeViewData.slotInfo.attendance_slot.trigger_time
                  )}
                </span>
                <span className="ml-auto text-lg sm:text-xl font-bold tracking-wide text-muted-foreground">
                  #{attendeeViewData.slotInfo.attendance_slot.id}
                </span>
              </div>
              <span className="text-muted-foreground text-sm sm:text-base">
                {formatAmount(
                  attendeeViewData.slotInfo.attendance_slot.fine_amount
                )}
              </span>
            </div>
          </div>

          <AttendeesListSearchForm />
        </div>

        <AttendeesListView
          key={Math.random()}
          attendees={attendeeViewData.attendees.attendees}
          pagination={attendeeViewData.attendees.pagination}
          eventId={event.id}
          slotId={validatedParams.time_slot!}
          params={validatedParams}
        />
      </div>
    );
  }

  // Render main event view
  return (
    <>
      <SingleEventHeader event={event} />
      <div aria-label="Event time slots and student look-up">
        <div className="flex gap-2 mt-4">
          {/* Time slots */}
          <div className="w-full lg:w-1/2 pr-0 lg:pr-5 2xl:pr-14 space-y-5">
            <>
              <TimeSlots slots={slots} event={event} />
              {slots.length < MAX_TIME_SLOTS && event.status === "upcoming" && (
                <AddTimeSlot />
              )}
            </>
          </div>

          {/* Student look-up */}
          <div className="hidden lg:block w-1/2 h-full flex-grow">
            <StudentLookup event={event} />
          </div>
        </div>
      </div>
    </>
  );
}
