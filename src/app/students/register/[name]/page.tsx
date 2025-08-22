"use server";

import Copyright from "@/components/copyright";
import RegistrationCheck from "@/components/student-registration/check-registration";
import PrivacyNotice from "@/components/student-registration/data-privacy";
import { FormLoadingSkeleton } from "@/components/student-registration/form-loading-skeleton";
import { RegistrationFormWithData } from "@/components/student-registration/registration-form-wrapper";
import VerifyStudentIdentity from "@/components/student-registration/verify-registration";
import { redirect, RedirectType } from "next/navigation";
import { Suspense } from "react";
import z from "zod";

const studentRegistrationParamsSchema = z.object({
  student_id: z.string().optional(),
  first_name: z.string().optional(),
  middle_name: z.string().optional(),
  last_name: z.string().optional(),
  email_address: z.string().email().optional(),
  degree_id: z.coerce.number().optional(),
  program_id: z.coerce.number().optional(),
  major_id: z.coerce.number().optional(),
  year_level_id: z.coerce.number().optional(),
  accepted_policy: z.coerce.boolean().optional(),
});

export type ValidatedStudentRegistrationParamsSchema = z.infer<
  typeof studentRegistrationParamsSchema
>;

export default async function RegistrationPage({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { name } = await params;

  const result = studentRegistrationParamsSchema.safeParse(await searchParams);

  if (!result.success) {
    return redirect("/students/register");
  }

  const validatedParams: ValidatedStudentRegistrationParamsSchema = result.data;

  const studentId = validatedParams.student_id;
  const pattern = /^\d{2}-[1-9]-\d{5}$/;

  if (
    (name !== "data-privacy" && !validatedParams.accepted_policy) ||
    ((name === "verify" || name === "form") &&
      (studentId === undefined || studentId === "" || !pattern.test(studentId)))
  ) {
    return redirect("/students/register", RedirectType.replace);
  }

  return (
    <>
      {name === "data-privacy" && <PrivacyNotice />}
      {name === "check" && <RegistrationCheck />}
      {name === "form" && (
        <Suspense fallback={<FormLoadingSkeleton />}>
          <RegistrationFormWithData params={validatedParams} />
        </Suspense>
      )}
      {name === "verify" && <VerifyStudentIdentity id={studentId!} />}
      <Copyright />
    </>
  );
}
