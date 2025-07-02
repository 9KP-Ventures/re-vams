"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import EventsError from "@/components/revams-admin/events/events-error";
import EventsHeader from "@/components/revams-admin/events/events-header";
import EventsFilters from "@/components/revams-admin/events/event-filters";
import { Suspense } from "react";
import { EventsGridSkeleton } from "@/components/revams-admin/events/events-grid-skeleton";
import EventsGridWrapper from "@/components/revams-admin/events/events-grid-wrapper";

// Define a schema for your search params
const eventSearchParamsSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().catch(undefined),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .optional()
    .catch(undefined),
  search: z.string().optional(),
  status: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional().catch(undefined),
  error: z.string().optional(),
});

// Type for validated search params
export type ValidatedSearchParams = z.infer<typeof eventSearchParamsSchema>;

export default async function EventsViewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Parse and validate search params
  const result = eventSearchParamsSchema.safeParse(await searchParams);

  // If validation fails, redirect to error page
  if (!result.success) {
    console.error("Invalid search params:", result.error.format());
    return redirect("/admin/events?error=invalid_params");
  }

  // Extract validated params using the defined type
  const validatedParams: ValidatedSearchParams = result.data;

  // Handle explicit error param
  if (validatedParams.error) {
    return (
      <div className="px-20 py-16 min-h-dvh flex flex-col justify-between">
        <div>
          <EventsHeader />
          <EventsError errorType={validatedParams.error} className="mt-32" />
        </div>
      </div>
    );
  }

  return (
    <div key={Math.random()}>
      <EventsFilters params={validatedParams} />
      <Suspense
        fallback={<EventsGridSkeleton count={validatedParams.limit ?? 6} />}
      >
        <EventsGridWrapper params={validatedParams} />
      </Suspense>
    </div>
  );
}
