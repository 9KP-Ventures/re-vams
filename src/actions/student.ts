import { getServerOrigin } from "@/app/utils/server";
import { Tables } from "@/app/utils/supabase/types";
import { GenerateCodeData } from "@/lib/requests/code/generate/get";

interface StudentDataResponse {
  student: Tables<"students">;
}

interface CodeDataResponse {
  code: string;
}

interface StudentWithCode extends Tables<"students"> {
  code: string;
}

export async function fetchStudentData(
  id: string
): Promise<StudentWithCode | null> {
  try {
    const origin = await getServerOrigin();

    const response = await fetch(`${origin}/api/students/${id}`, {
      method: "GET",
      cache: "no-store", // Don't cache sensitive student data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch student data: ${response.status}`);
    }

    const data: StudentDataResponse = await response.json();
    const { student } = data;

    const codeResponse = await fetch(`${origin}/api/code/generate`, {
      method: "POST",
      body: JSON.stringify({
        student_id: id,
      } as GenerateCodeData),
    });

    if (!codeResponse.ok) {
      throw new Error(
        `Failed to fetch student code data: ${codeResponse.status}`
      );
    }

    const codeData: CodeDataResponse = await codeResponse.json();
    const { code } = codeData;

    return {
      ...student,
      code,
    };
  } catch {
    return null;
  }
}
