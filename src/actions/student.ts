"use server";

import { getServerOrigin } from "@/app/utils/server";
import {
  GenerateCodeData,
  GenerateCodeDataError,
  GenerateCodeDataSuccess,
} from "@/lib/requests/code/generate/get";
import {
  GetStudentDataError,
  GetStudentDataSuccess,
} from "@/lib/requests/students/get+delete";

export async function getStudentData(
  id: string
): Promise<GetStudentDataSuccess | GetStudentDataError> {
  try {
    const origin = await getServerOrigin();

    const response: Response = await fetch(`${origin}/api/students/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      const error: GetStudentDataError = await response.json();
      console.error(error);
      return error;
    }

    const data: GetStudentDataSuccess = await response.json();
    return data;
  } catch (error) {
    const errorMessage: GetStudentDataError = {
      error: {
        code: 500,
        message: `An unexpected error occurred while fetching student data: ${error}`,
      },
    };
    return errorMessage;
  }
}

export async function getStudentCode(
  id: string
): Promise<GenerateCodeDataSuccess | GenerateCodeDataError> {
  try {
    const origin = await getServerOrigin();

    const response: Response = await fetch(`${origin}/api/code/generate`, {
      method: "POST",
      body: JSON.stringify({
        student_id: id,
      } as GenerateCodeData),
    });

    if (!response.ok) {
      const error: GenerateCodeDataError = await response.json();
      console.error(error);
      return error;
    }

    const data: GenerateCodeDataSuccess = await response.json();
    return data;
  } catch (error) {
    const errorMessage: GenerateCodeDataError = {
      error: {
        code: 500,
        message: `An unexpected error occurred while generating student code: ${error}`,
      },
    };
    return errorMessage;
  }
}
