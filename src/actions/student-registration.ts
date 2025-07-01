"use server";

import { signToken, StudentVerificationPayload } from "@/lib/jwt";
import { cookies } from "next/headers";
import { getPrograms, ProgramsResponse } from "./programs";
import { getYearLevels, YearLevelsResponse } from "./year-levels";
import { Tables } from "@/app/utils/supabase/types";
import { CreateStudentData } from "@/lib/requests/students/create";
import { getServerOrigin } from "@/app/utils/server";

export type RegistrationFormData = {
  idNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  program: Tables<"programs"> | null;
  yearLevel: Tables<"year_levels"> | null;
  major: Tables<"majors"> | null;
};

type RegistrationResult = {
  success: boolean;
  error?: string;
  verified?: boolean;
};

const validateRegistrationData = (
  formData: RegistrationFormData
): string | null => {
  if (!formData.firstName.trim()) return "First name is required";
  if (!formData.lastName.trim()) return "Last name is required";
  if (!formData.program) return "Degree program is required";
  if (!formData.yearLevel) return "Year level is required";
  if (!formData.idNumber.trim()) return "Student ID is required";
  return null;
};

const setVerificationCookie = async (
  id: string,
  lastName: string
): Promise<void> => {
  const payload: StudentVerificationPayload = {
    student_id: id,
    verified_at: Date.now(),
    last_name: lastName,
  };

  const token = signToken(payload);
  const cookieStore = await cookies();

  cookieStore.set(`student_verified_${id}`, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 300, // 5 minutes
  });
};

export const verifyStudentIdByLastName = async (
  id: string,
  lastName: string
): Promise<boolean> => {
  try {
    const origin = await getServerOrigin();
    const response = await fetch(`${origin}/api/students/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch student data: ${response.status}`);
    }
    const data = await response.json();
    const { student } = data;

    if (
      id === student["id"] &&
      lastName.toUpperCase() === `${student["last_name"]}`.toUpperCase()
    ) {
      await setVerificationCookie(id, lastName);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Verification error:", error);
    return false;
  }
};

export const checkStudentIdIfExists = async (id: string) => {
  try {
    const origin = await getServerOrigin();
    const response = await fetch(`${origin}/api/students/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch student data: ${response.status}`);
    }
    const data = await response.json();
    const { student } = data;
    console.log(student);

    if (id === student["id"]) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Checking student error:", error);
    return false;
  }
};

export const registerStudent = async (
  formData: RegistrationFormData
): Promise<RegistrationResult> => {
  try {
    // Validate form data
    const validationError = validateRegistrationData(formData);
    if (validationError) {
      return { success: false, error: validationError };
    }

    const origin = await getServerOrigin();
    const response = await fetch(`${origin}/api/students`, {
      method: "POST",
      body: JSON.stringify({
        id: formData.idNumber,
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        email_address: formData.email,
        program_id: formData.program!.id,
        year_level_id: formData.yearLevel!.id,
        major_id: formData.major?.id,
        degree_id: 1,
      } as CreateStudentData),
    });

    if (!response.ok) {
      const data = await response.json();
      const {
        error: { message },
      } = data;
      throw new Error(`${message}`);
    }

    const data = await response.json();
    const { student } = data;

    // After successful registration, verify the student for cookie setting
    const verified = await verifyStudentIdByLastName(
      student["id"],
      student["last_name"]
    );

    return {
      success: true,
      verified,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: `${error}`,
    };
  }
};

// Helper function to get all registration data
export async function getRegistrationData(): Promise<{
  programs: ProgramsResponse["programs"];
  yearLevels: YearLevelsResponse["year_levels"];
}> {
  const [programs, yearLevels] = await Promise.all([
    getPrograms(),
    getYearLevels(),
  ]);

  return { programs, yearLevels };
}
