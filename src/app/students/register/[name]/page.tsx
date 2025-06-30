"use server";
import Copyright from "@/components/copyright";
import RegistrationCheck from "@/components/student-registration/check-registration";
import PrivacyNotice from "@/components/student-registration/data-privacy";
import StudentRegistrationForm from "@/components/student-registration/registration-form";
import VerifyStudentIdentity from "@/components/student-registration/verify-registration";
import { redirect, RedirectType } from "next/navigation";

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
      {name === "form" && <StudentRegistrationForm id={studentId!} />}
      {name === "verify" && <VerifyStudentIdentity id={studentId!} />}
      <Copyright />
    </>
  );
}
