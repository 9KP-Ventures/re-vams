"use server";

import { getEventData } from "@/actions/event";
import SingleEventHeader from "@/components/revams-admin/events/single-event/event-header-and-stats";
import StudentLookup from "@/components/revams-admin/events/single-event/student-lookup";
import TimeSlots from "@/components/revams-admin/events/single-event/time-slots";
import { notFound, redirect } from "next/navigation";
import z from "zod";

const singleEventSearchParamsSchema = z.object({
  student_id: z.string().optional(),
  time_slot: z.coerce.number().optional(),
  error: z.string().optional(),
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
      <SingleEventHeader event={event} />

      {!validatedParams.time_slot && (
        <>
          {/* Time slots and student look-up section */}
          <div className="flex gap-2 mt-12">
            {/* Time slots */}
            <div className="w-1/2 pr-16 space-y-5">
              <TimeSlots
                eventId={Number(id)}
                eventIsActive={event.status === "active"}
              />
            </div>

            {/* Student look-up */}
            <div className="hidden sm:block w-1/2 h-full flex-grow">
              <StudentLookup
                eventIsActive={event.status === "active"}
                studentId={validatedParams.student_id}
              />
            </div>
          </div>
        </>
      )}

      {/* For the time slot contents */}
    </>
  );
}
