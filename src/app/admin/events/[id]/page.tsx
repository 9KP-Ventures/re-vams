"use server";

import { getEventData } from "@/actions/event";
import SingleEventHeader from "@/components/revams-admin/events/single-event/event-header-and-stats";
import MainEventViewPage from "@/components/revams-admin/events/single-event/event-view";
import MainEventViewPageSkeleton from "@/components/revams-admin/events/single-event/event-view-skeleton";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
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
        <Suspense fallback={<MainEventViewPageSkeleton />}>
          <MainEventViewPage event={event} />
        </Suspense>
      )}

      {/* For the time slot contents */}
    </>
  );
}
