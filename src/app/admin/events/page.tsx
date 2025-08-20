"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import EventsError from "@/components/revams-admin/events/many-events/events-error";
import EventsHeader from "@/components/revams-admin/events/many-events/events-header";
import EventsFilters from "@/components/revams-admin/events/many-events/event-filters";
import { Suspense } from "react";
import EventsGridWrapper from "@/components/revams-admin/events/many-events/events-grid-wrapper";
import EventsContentFallback from "@/components/revams-admin/events/many-events/events-content-fallback";
import EventsStats from "@/components/revams-admin/events/many-events/event-stats";
import { Constants } from "@/app/utils/supabase/types";
import {
  GET_EVENTS_SORT_ORDERS,
  GET_EVENTS_SORT_OPTIONS,
} from "@/lib/requests/events/get-many";

// Define a schema for your search params
const eventSearchParamsSchema = z.object({
  page: z.coerce.number().optional().default(1),
  search: z.string().optional(),
  sort: z.enum(GET_EVENTS_SORT_OPTIONS).optional().default("date"),
  order: z.enum(GET_EVENTS_SORT_ORDERS).optional().default("desc"),
  error: z.string().optional(),
  status: z
    .enum([...Constants.public.Enums.Status, ""] as const)
    .optional()
    .default(""),
  semester_id: z.coerce.number().optional(),
});

// Type for validated search params
export type ValidatedEventsParams = z.infer<typeof eventSearchParamsSchema>;

export default async function EventsViewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Parse and validate search params
  const result = eventSearchParamsSchema.safeParse(await searchParams);

  // If validation fails, redirect to events
  if (!result.success) {
    return redirect("/admin/events?");
  }

  // Extract validated params using the defined type
  const validatedParams: ValidatedEventsParams = result.data;

  // Handle explicit error param
  if (validatedParams.error) {
    return (
      <div className="px-20 py-16 min-h-dvh flex flex-col justify-between">
        <EventsError />
      </div>
    );
  }

  return (
    <>
      <EventsHeader />
      <EventsStats />
      <div className="flex flex-col flex-grow" key={Math.random()}>
        <EventsFilters />
        <Suspense fallback={<EventsContentFallback />}>
          <EventsGridWrapper params={validatedParams} />
        </Suspense>
      </div>
    </>
  );
}
