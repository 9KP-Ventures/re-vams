"use server";

import { getStudentCode, getStudentData } from "@/actions/student";
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
  const studentData = await getStudentData(studentId);

  if ("error" in studentData) {
    redirect(`/students/register/code/${studentId}?error=true`);
  }

  const studentCodeData = await getStudentCode(studentId);

  if ("error" in studentCodeData) {
    redirect(
      `/students/register/code/${studentId}?error=true&reason=generate_code`
    );
  }

  // Transform to component format
  const transformedData: StudentData = {
    id: studentData.student.id,
    firstName: studentData.student.first_name,
    lastName: studentData.student.last_name,
    code: studentCodeData.code,
  };

  return <StudentCodeDisplay studentData={transformedData} />;
}
