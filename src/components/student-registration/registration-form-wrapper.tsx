"use server";

import { getRegistrationData } from "@/actions/student-registration";
import StudentRegistrationForm from "./registration-form";
import { ValidatedStudentRegistrationParamsSchema } from "@/app/students/register/[name]/page";

export async function RegistrationFormWithData({
  params,
}: {
  params: ValidatedStudentRegistrationParamsSchema;
}) {
  // Fetch all data in parallel
  const { programs: programsData, yearLevels: yearLevelsData } =
    await getRegistrationData();

  return (
    <StudentRegistrationForm
      params={params}
      programs={"error" in programsData ? [] : programsData}
      yearLevels={"error" in yearLevelsData ? [] : yearLevelsData}
    />
  );
}
