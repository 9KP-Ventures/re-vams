import { createClient } from "@/app/utils/supabase/server";
import { GenerateCodeRequest } from "@/lib/requests/code/generate/get";
import { NextRequest, NextResponse } from "next/server";

// POST /api/code/generate - Generate a code containing the student ID
export async function POST(request: NextRequest) {
  const customRequest = new GenerateCodeRequest(request);
  const validationError = await customRequest.validate();

  if (validationError) {
    return validationError;
  }

  try {
    const studentId = customRequest.getStudentId();

    // Database operation
    const supabase = await createClient();

    // Check if student exists
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("id, first_name, last_name")
      .eq("id", studentId)
      .single();

    if (studentError || !student) {
      return NextResponse.json(
        {
          error: {
            code: 404,
            message: `Student with ID '${studentId}' not found.`,
          },
        },
        { status: 404 }
      );
    }

    // Return the student_id as the code itself
    return NextResponse.json(
      {
        code: studentId,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Route error:", e);
    return NextResponse.json(
      {
        error: {
          code: 500,
          message: (e as Error).message || "Unknown error",
        },
      },
      { status: 500 }
    );
  }
}
