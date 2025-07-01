"use server";

import { fetchStudentData } from "@/actions/student";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import StudentCodeDisplay, { StudentData } from "./code-display";

interface CodePageWithDataProps {
  studentId: string;
}

export default async function CodePageWithData({
  studentId,
}: CodePageWithDataProps) {
  const cookieStore = await cookies();

  // Check for verification token on server
  const token = cookieStore.get(`student_verified_${studentId}`)?.value;

  if (!token) {
    redirect("/students/register");
  }

  const decoded = verifyToken(token);
  if (!decoded || decoded.student_id !== studentId) {
    redirect("/students/register");
  }

  // Fetch student data
  const studentData = await fetchStudentData(studentId);

  if (studentData === null) {
    redirect(`/students/register/code/${studentId}?error=true`);
    return;
  }

  // Transform to component format
  const transformedData: StudentData = {
    id: studentData.id,
    firstName: studentData.first_name,
    lastName: studentData.last_name,
    code: studentData.code,
  };

  return <StudentCodeDisplay studentData={transformedData} />;
}
