"use server";

import Copyright from "@/components/copyright";
import RegistrationCheck from "@/components/student-registration/check-registration";
import PrivacyNotice from "@/components/student-registration/data-privacy";
import { FormLoadingSkeleton } from "@/components/student-registration/form-loading-skeleton";
import { RegistrationFormWithData } from "@/components/student-registration/registration-form-wrapper";
import VerifyStudentIdentity from "@/components/student-registration/verify-registration";
import { redirect, RedirectType } from "next/navigation";
import { Suspense } from "react";

export default async function RegistrationPage({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { name } = await params;

  const acceptedPrivacyNotice = (await searchParams)["accepted-policy"];
  const accepted: boolean =
    acceptedPrivacyNotice !== undefined && acceptedPrivacyNotice === "true";

  const studentId = (await searchParams)["student-id"];
  const pattern = /^\d{2}-[1-9]-\d{5}$/;

  const firstName = (await searchParams)["first-name"];
  const middleName = (await searchParams)["middle-name"];
  const lastName = (await searchParams)["last-name"];
  const email = (await searchParams)["email"];

  if (
    (name !== "data-privacy" && !accepted) ||
    ((name === "verify" || name === "form") &&
      (studentId === undefined || studentId === "" || !pattern.test(studentId)))
  ) {
    redirect("/students/register", RedirectType.replace);
    return <></>;
  }

  return (
    <>
      {name === "data-privacy" && <PrivacyNotice />}
      {name === "check" && <RegistrationCheck />}
      {name === "form" && (
        <Suspense fallback={<FormLoadingSkeleton />}>
          <RegistrationFormWithData
            studentId={studentId!}
            firstName={firstName}
            middleName={middleName}
            lastName={lastName}
            email={email}
          />
        </Suspense>
      )}
      {name === "verify" && <VerifyStudentIdentity id={studentId!} />}
      <Copyright />
    </>
  );
}
