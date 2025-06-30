"use server";
import StudentCodeDisplay from "@/components/student-registration/code-display";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentCodePage({ params }: PageProps) {
  const { id } = await params;
  const cookieStore = await cookies();

  // Check for verification token on server
  const token = cookieStore.get(`student_verified_${id}`)?.value;

  if (!token) {
    redirect("/students/register");
  }

  const decoded = verifyToken(token);
  if (!decoded || decoded.student_id !== id) {
    redirect("/students/register");
  }

  // Mock student data (in real app, fetch from database)
  const studentData = {
    id,
    firstName: "Juan Carlos",
    lastName: "Dela Cruz",
  };

  return <StudentCodeDisplay studentData={studentData} />;
}
