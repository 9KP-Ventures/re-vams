import { getServerOrigin } from "@/app/utils/server";
import {
  GenerateCodeData,
  GenerateCodeError,
  GenerateCodeSuccess,
} from "@/lib/requests/code/generate/get";
import {
  GetStudentDataError,
  GetStudentDataSuccess,
} from "@/lib/requests/students/get+delete";

type StudentWithCode = GetStudentDataSuccess["student"] & { code: string };

export async function fetchStudentData(
  id: string
): Promise<StudentWithCode | null> {
  try {
    const origin = await getServerOrigin();

    const response: Response = await fetch(`${origin}/api/students/${id}`, {
      method: "GET",
      cache: "no-store", // Don't cache sensitive student data
    });

    if (!response.ok) {
      const data: GetStudentDataError = await response.json();
      const { error } = data;

      console.log(error);
      throw new Error(`${error.message}`);
    }

    const data: GetStudentDataSuccess = await response.json();
    const { student } = data;

    const codeResponse: Response = await fetch(`${origin}/api/code/generate`, {
      method: "POST",
      body: JSON.stringify({
        student_id: id,
      } as GenerateCodeData),
    });

    if (!codeResponse.ok) {
      const codeData: GenerateCodeError = await codeResponse.json();
      const { error } = codeData;

      console.log(error);
      throw new Error(`${error.message}`);
    }

    const codeData: GenerateCodeSuccess = await codeResponse.json();
    const { code } = codeData;

    return {
      ...student,
      code,
    };
  } catch (error) {
    console.log("Fetching student data error:", error);
    return null;
  }
}
