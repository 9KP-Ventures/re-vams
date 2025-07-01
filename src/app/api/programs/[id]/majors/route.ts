import { createClient } from "@/app/utils/supabase/server";
import { GetProgramMajorsRequest } from "@/lib/requests/programs/majors/get";
import { NextRequest, NextResponse } from "next/server";

// GET /api/programs/[id]/majors - Get all majors for a specific program
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const customRequest = new GetProgramMajorsRequest(request, id);
  const validationError = await customRequest.validate();

  if (validationError) {
    return validationError;
  }

  try {
    const programId = customRequest.getProgramId();
    const supabase = await createClient();

    // First, verify that the program exists
    const { data: program, error: programError } = await supabase
      .from("programs")
      .select("id, name")
      .eq("id", programId)
      .single();

    if (programError || !program) {
      return NextResponse.json(
        {
          error: {
            code: 404,
            message: `Program with ID ${programId} not found.`,
          },
        },
        { status: 404 }
      );
    }

    // Get all majors that belong to this program
    const { data: majors, error: majorsError } = await supabase
      .from("majors")
      .select("*")
      .eq("program_id", programId)
      .order("name", { ascending: true });

    if (majorsError) {
      console.error("Database error:", majorsError);
      return NextResponse.json(
        {
          error: {
            code: 400,
            message: majorsError.message,
          },
        },
        { status: 400 }
      );
    }

    // Sort object keys alphabetically for consistent response format
    const sortedMajors =
      majors?.map(major =>
        Object.fromEntries(
          Object.entries(major).sort(([keyA], [keyB]) =>
            keyA.localeCompare(keyB)
          )
        )
      ) || [];

    return NextResponse.json(
      {
        program: Object.fromEntries(
          Object.entries(program).sort(([keyA], [keyB]) =>
            keyA.localeCompare(keyB)
          )
        ),
        majors: sortedMajors,
        count: majors?.length || 0,
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
