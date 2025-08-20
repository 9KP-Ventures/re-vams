"use server";

import { getRegistrationData } from "@/actions/student-registration";
import StudentRegistrationForm from "./registration-form";

export async function RegistrationFormWithData({
  studentId,
  firstName,
  middleName,
  lastName,
  email,
}: {
  studentId: string;
  firstName?: string | undefined;
  middleName?: string | undefined;
  lastName?: string | undefined;
  email?: string | undefined;
}) {
  // Fetch all data in parallel
  const { programs: programsData, yearLevels: yearLevelsData } =
    await getRegistrationData();

  return (
    <StudentRegistrationForm
      id={studentId}
      firstName={firstName}
      middleName={middleName}
      lastName={lastName}
      email={email}
      programs={"error" in programsData ? [] : programsData}
      yearLevels={"error" in yearLevelsData ? [] : yearLevelsData}
    />
  );
}
