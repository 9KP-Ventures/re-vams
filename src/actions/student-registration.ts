"use server";

import { signToken, StudentVerificationPayload } from "@/lib/jwt";
import { cookies } from "next/headers";
import { getPrograms } from "./programs";
import { getYearLevels } from "./year-levels";
import {
  CreateStudentData,
  CreateStudentDataError,
  CreateStudentDataSuccess,
} from "@/lib/requests/students/create";
import { getServerOrigin } from "@/app/utils/server";
import {
  GetStudentDataError,
  GetStudentDataSuccess,
} from "@/lib/requests/students/get+delete";
import {
  GetProgramsDataError,
  GetProgramsDataSuccess,
} from "@/lib/requests/programs/get";
import {
  GetYearLevelsDataError,
  GetYearLevelsDataSuccess,
} from "@/lib/requests/year-levels/get";

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
    const response: Response = await fetch(`${origin}/api/students/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      const error: GetStudentDataError = await response.json();
      console.error(error);
      return false;
    }

    const data: GetStudentDataSuccess = await response.json();
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

export const checkStudentIdIfExists = async (id: string): Promise<boolean> => {
  try {
    const origin = await getServerOrigin();
    const response: Response = await fetch(`${origin}/api/students/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      const error: GetStudentDataError = await response.json();
      console.error(error);
      return false;
    }

    const data: GetStudentDataSuccess = await response.json();
    const { student } = data;

    if (id === student["id"]) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Checking student error:", error);
    // Not really an error if no student exist, we will redirect the user to registration page
    return false;
  }
};

export const registerStudent = async (
  formData: CreateStudentData
): Promise<CreateStudentDataSuccess | CreateStudentDataError> => {
  try {
    const origin = await getServerOrigin();
    console.log(JSON.stringify(formData));
    const response: Response = await fetch(`${origin}/api/students`, {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error: CreateStudentDataError = await response.json();
      console.error(error);
      return error;
    }

    const data: CreateStudentDataSuccess = await response.json();
    const { student } = data;

    // After successful registration, verify the student for cookie setting
    await verifyStudentIdByLastName(student["id"], student["last_name"]);

    return data;
  } catch (error) {
    const errorMessage: CreateStudentDataError = {
      error: {
        code: 500,
        message: `An unexpected error occurred when creating student data: ${error}`,
      },
    };
    return errorMessage;
  }
};

// Helper function to get all registration data
export async function getRegistrationData(): Promise<{
  programs: GetProgramsDataSuccess["programs"] | GetProgramsDataError;
  yearLevels: GetYearLevelsDataSuccess["year_levels"] | GetYearLevelsDataError;
}> {
  const [programsData, yearLevelsData] = await Promise.all([
    getPrograms(),
    getYearLevels(),
  ]);

  return {
    programs: "error" in programsData ? programsData : programsData.programs,
    yearLevels:
      "error" in yearLevelsData ? yearLevelsData : yearLevelsData.year_levels,
  };
}
