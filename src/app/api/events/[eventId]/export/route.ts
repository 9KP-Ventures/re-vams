import { createClient } from "@/app/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

// supabase function return types only
type AttendanceRecord = {
    event_id: number;
    event_name: string;
    event_date: string;
    event_custom_email_message: string;
    event_custom_email_subject: string;
    slot_id: number;
    slot_type: string;
    slot_trigger_time: string;
    slot_fine_amount: number;
    record_id: number;
    recorded_time: string;
    student_id: string;
    student_first_name: string;
    student_last_name: string;
    student_middle_name: string;
    student_email: string;
};

type TransformedRecord = {
    name: string;
    student_id: string;
    student_email: string;
    [key: string]: string | number; // dynamic slots and total_fines
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ eventId: number }> }
) {
    const { eventId } = await params;

    try {
        const supabase = await createClient();

        //
        const { data, error } = await supabase.rpc("get_event_attendance_table2", {
            p_event_id: eventId,
        });

        if (error) {
            return NextResponse.json(error, { status: 400 });
        }

        if (!data || data.length === 0) {
            return NextResponse.json({ message: "No attendance records found" });
        }

        // Transform data
        const { transformed, slotKeys } = transformAttendanceData(data);

        // Reorder columns: student_id, name, email, slots..., total_fines
        const headers = ["student_id", "name", "student_email", ...slotKeys, "total_fines"];
        const reorderedData = transformed.map((row) => {
            const newRow: Record<string, string | number> = {};
            headers.forEach((key) => {
                newRow[key] = row[key] ?? "";
            });
            return newRow;
        });

        // Build Excel file
        const worksheet = XLSX.utils.json_to_sheet(reorderedData, { header: headers });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

        // Generate buffer
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

        // Set for file download
        const headersResp = new Headers();
        headersResp.append("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        headersResp.append("Content-Disposition", `attachment; filename="${data[0].event_name}.xlsx"`);

        return new NextResponse(excelBuffer, {
            status: 200,
            headers: headersResp,
        });
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

function transformAttendanceData(records: AttendanceRecord[]): { transformed: TransformedRecord[]; slotKeys: string[] } {
    const grouped: Record<string, TransformedRecord> = {};
    const slotKeysSet = new Set<string>();

    records.forEach((record) => {
        const studentKey = record.student_id;

        if (!grouped[studentKey]) {
            grouped[studentKey] = {
                name: `${record.student_last_name}, ${record.student_first_name} ${record.student_middle_name || ""}`.trim(),
                student_id: record.student_id,
                student_email: record.student_email,
                total_fines: 0,
            };
        }

        const student = grouped[studentKey];
        const slotKey = record.slot_trigger_time;

        if (slotKey && !slotKeysSet.has(slotKey)) {
            slotKeysSet.add(slotKey);
        }

        // Mark attendance: "Yes" if recorded_time exists, otherwise "No"
        student[slotKey] = record.recorded_time ? "Yes" : "No";

        // If absent (no recorded_time), add fine
        if (!record.recorded_time) {
            student.total_fines = (student.total_fines as number) + (record.slot_fine_amount || 0);
        }
    });

    // Sort slot keys in chronological order
    const slotKeys = Array.from(slotKeysSet).sort();

    return { transformed: Object.values(grouped), slotKeys };
}
