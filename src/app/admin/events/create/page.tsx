"use server";

import { getSemesters } from "@/actions/semesters";
import CreateEventView from "@/components/revams-admin/events/create-event/create-event-view";
import { Suspense } from "react";

export default async function CreateEventPage() {
  const semesters = await getSemesters();

  return (
    <Suspense fallback={"Loading..."}>
      <CreateEventView
        semesters={"error" in semesters ? [] : semesters.semesters}
      />
    </Suspense>
  );
}
