"use server";

import SingleEventWrapper from "@/components/revams-admin/events/single-event/single-event-wrapper";
import {
  GET_SLOT_ATTENDEES_SORT_OPTIONS,
  GET_SLOT_ATTENDEES_SORT_ORDERS,
} from "@/lib/requests/events/attendance-slots/attendees/get-many";
import { redirect } from "next/navigation";

import z from "zod";

const singleEventSearchParamsSchema = z.object({
  student_id: z.string().optional(),
  time_slot: z.coerce.number().optional(),
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

  // Parse and validate params
  const result = singleEventSearchParamsSchema.safeParse(await searchParams);

  if (!result.success) {
    return redirect(`/admin/events/${id}`);
  }

  // Extract validated params
  const validatedParams: ValidatedSingleEventParams = result.data;

  return (
    <SingleEventWrapper
      eventId={parseInt(id)}
      validatedParams={validatedParams}
    />
  );
}
