"use server";

import { getRegistrationData } from "@/actions/student-registration";
import StudentRegistrationForm from "./registration-form";

export async function RegistrationFormWithData({
  studentId,
}: {
  studentId: string;
}) {
  // Fetch all data in parallel
  const { programs, yearLevels } = await getRegistrationData();

  return (
    <StudentRegistrationForm
      id={studentId}
      programs={programs}
      yearLevels={yearLevels}
    />
  );
}
