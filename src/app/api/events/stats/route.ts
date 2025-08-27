import { createClient } from "@/app/utils/supabase/server";
import { NextResponse } from "next/server";

// GET /api/events/stats - Get count statistics for events
export async function GET() {
  try {
    const supabase = await createClient();


    // Get total events count
    const { count: totalEvents, error: totalError } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true });

    if (totalError) {
      return NextResponse.json(
        {
          error: {
            code: 400,
            message: totalError.message,
          },
        },
        { status: 400 }
      );
    }

    // upcoming
    const { count: upcomingEvents, error: upcomingError } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("status", "upcoming");

    if (upcomingError) {
      return NextResponse.json(
        {
          error: {
            code: 400,
            message: upcomingError.message,
          },
        },
        { status: 400 }
      );
    }

    //completed
    const { count: completedEvents, error: completedError } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed");
    if (completedError) {
      return NextResponse.json(
        {
          error: {
            code: 400,
            message: completedError.message,
          },
        },
        { status: 400 }
      );
    }

    // Get ongoing events count (events with date = today)
    const { count: ongoingEvents, error: ongoingError } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("status", "on_going");
    if (ongoingError) {
      return NextResponse.json(
        {
          error: {
            code: 400,
            message: ongoingError.message,
          },
        },
        { status: 400 }
      );
    }

    // Return formatted response
    return NextResponse.json(
      {
        stats: {
          total_events: totalEvents || 0,
          upcoming: upcomingEvents || 0,
          ongoing: ongoingEvents || 0,
          completed: completedEvents || 0,
        },
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