"use server";

import { getEventData } from "@/actions/event";
import AttendeesList from "@/components/revams-admin/events/single-event/attendees-list";
import SingleEventHeader from "@/components/revams-admin/events/single-event/event-header-and-stats";
import MainEventViewPage from "@/components/revams-admin/events/single-event/event-view";
import MainEventViewPageSkeleton from "@/components/revams-admin/events/single-event/event-view-skeleton";
import {
  GET_SLOT_ATTENDEES_SORT_OPTIONS,
  GET_SLOT_ATTENDEES_SORT_ORDERS,
} from "@/lib/requests/events/attendance-slots/attendees/get-many";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import z from "zod";

const singleEventSearchParamsSchema = z.object({
  student_id: z.string().optional(),
  time_slot: z.coerce.number().optional(),
  error: z.string().optional(),
  search: z.string().optional(),
  sort: z
    .enum(GET_SLOT_ATTENDEES_SORT_OPTIONS)
    .optional()
    .default("recorded_time"),
  order: z.enum(GET_SLOT_ATTENDEES_SORT_ORDERS).optional().default("asc"),
  program_id: z.coerce.number().optional(),
  year_level_id: z.coerce.number().optional(),
});

export type ValidatedSingleEventParams = z.infer<
  typeof singleEventSearchParamsSchema
>;

export default async function SingleEventViewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const event = await getEventData(id);

  if (!event) {
    return notFound();
  }

  // Parse and validate params
  const result = singleEventSearchParamsSchema.safeParse(await searchParams);

  if (!result.success) {
    return redirect(`/admin/events/${id}`);
  }

  // Extract validated params
  const validatedParams: ValidatedSingleEventParams = result.data;

  if (validatedParams.error) {
    return <>Error</>;
  }

  return (
    <>
      <div>
        {validatedParams.time_slot ? (
          <AttendeesList
            eventId={event.id}
            slot={validatedParams.time_slot}
            params={validatedParams}
          />
        ) : (
          <>
            <SingleEventHeader event={event} />
            <Suspense fallback={<MainEventViewPageSkeleton />}>
              <MainEventViewPage event={event} />
            </Suspense>
          </>
        )}
      </div>
    </>
  );
}
