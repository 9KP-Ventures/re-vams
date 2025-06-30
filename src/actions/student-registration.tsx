"use server";

import { signToken, StudentVerificationPayload } from "@/lib/jwt";
import { cookies } from "next/headers";

export type RegistrationFormData = {
  idNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  degreeProgram: string;
  yearLevel: string;
  major: string;
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
  if (!formData.degreeProgram) return "Degree program is required";
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
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock verification logic
    if (
      (id === "21-1-01040" && lastName === "Dela Cruz") ||
      (id === "21-1-01041" && lastName === "Dela Cruz")
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

export const RegisterStudent = async (
  formData: RegistrationFormData
): Promise<RegistrationResult> => {
  try {
    // Validate form data
    const validationError = validateRegistrationData(formData);
    if (validationError) {
      return { success: false, error: validationError };
    }

    // Simulate registration API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock registration logic (replace with actual database call)
    console.log("Registering student:", formData);

    // After successful registration, verify the student for cookie setting
    const verified = await verifyStudentIdByLastName(
      formData.idNumber,
      formData.lastName
    );

    return {
      success: true,
      verified,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "Registration failed. Please try again.",
    };
  }
};
