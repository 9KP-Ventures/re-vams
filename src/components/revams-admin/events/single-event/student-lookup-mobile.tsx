"use client";

import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Calendar,
  ClockAlert,
  ClockPlus,
  InfoIcon,
  Loader2,
  Search,
  User2,
  CheckCircle,
} from "lucide-react";
import SearchForm from "./student-lookup-search-form";
import { useEffect, useState } from "react";
import { useSingleEventParams } from "@/lib/hooks/single-event-params";
import { getStudentFines } from "@/actions/fines";
import { GetStudentFinesDataSuccess } from "@/lib/requests/events/fines/get-student-fines";
import { cn, formatAmount } from "@/lib/utils";

// Inactive state component
const InactiveState = () => (
  <div className="py-20 flex flex-col items-center justify-center space-y-6 text-center">
    <div className="bg-muted/50 rounded-full p-4">
      <AlertCircle className="w-12 h-12 text-muted-foreground" />
    </div>

    <div className="space-y-2 max-w-md">
      <h3 className="text-xl font-medium text-foreground">
        This Event is Currently Inactive
      </h3>
      <p className="text-muted-foreground">
        Student lookup is only available when the event is active.
      </p>
    </div>

    <Button variant="outline" className="mt-4" disabled={true}>
      <Calendar className="w-4 h-4 mr-2" />
      Event is Inactive
    </Button>
  </div>
);

// Student data display component
const StudentDataDisplay = ({
  studentFines,
}: {
  studentFines: GetStudentFinesDataSuccess;
}) => (
  <div>
    <SearchForm />

    <div aria-labelledby="search">
      <p className="sr-only" id="search">
        Search results for students
      </p>

      <div className="bg-muted w-full px-4 py-4 space-y-6 mb-6 rounded-md">
        {/* Student name */}
        <div className="flex gap-4">
          <div className="dark:bg-secondary/40 bg-secondary/30 h-fit p-2 rounded-full flex self-center">
            <User2 className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg">
              {studentFines.student.first_name}{" "}
              {studentFines.student.middle_name}{" "}
              {studentFines.student.last_name}
            </span>
            <span className="text-muted-foreground text-xs">
              {studentFines.student.id} | {studentFines.student.email_address}
            </span>
          </div>
        </div>

        {/* Student details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
          <div>
            <span aria-label="Degree" className="text-muted-foreground text-xs">
              Degree
            </span>
            <p className="text-sm font-bold">
              {studentFines.student.degrees?.name ?? "-"}
            </p>
          </div>
          <div>
            <span
              aria-label="Program"
              className="text-muted-foreground text-xs"
            >
              Program
            </span>
            <p className="text-sm font-bold">
              {studentFines.student.programs?.name ?? "-"}
            </p>
          </div>
          <div>
            <span aria-label="Major" className="text-muted-foreground text-xs">
              Major
            </span>
            <p className="text-sm font-bold">
              {studentFines.student.majors?.name ?? "-"}
            </p>
          </div>
          <div>
            <span
              aria-label="Year Level"
              className="text-muted-foreground text-xs"
            >
              Year Level
            </span>
            <p className="text-sm font-bold">
              {studentFines.student.year_levels?.name ?? "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Time slots attended and missed */}
      <div className="grid gap-x-2 gap-y-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="dark:bg-secondary/40 bg-secondary/15 h-fit p-1.5 rounded-md flex self-center">
              <ClockPlus className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Time Slots Attended</h3>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {studentFines.attendance_summary.attended_slots.length === 0 ? (
              <div className="w-full flex items-center justify-center py-2">
                <div className="bg-muted/50 rounded-md px-3 py-2 text-muted-foreground text-xs flex items-center">
                  <InfoIcon className="w-3.5 h-3.5 mr-1.5 opacity-60" />
                  <span>No time slots attended</span>
                </div>
              </div>
            ) : (
              studentFines.attendance_summary.attended_slots.map(slot => (
                <div
                  key={slot.id}
                  className="bg-primary/80 text-primary-foreground h-fit py-1.5 px-3 rounded-full flex self-center font-mono text-sm"
                >
                  #{slot.id}
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <div className="dark:bg-secondary/40 bg-secondary/15 h-fit p-1.5 rounded-md flex self-center">
              <ClockAlert className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Time Slots Missed</h3>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {studentFines.attendance_summary.missed_slots.length === 0 ? (
              <div className="w-full flex items-center justify-center py-2">
                <div className="bg-muted/50 rounded-md px-3 py-2 text-muted-foreground text-xs flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 mr-1.5 opacity-60" />
                  <span>No time slots missed</span>
                </div>
              </div>
            ) : (
              studentFines.attendance_summary.missed_slots.map(slot => (
                <div
                  key={slot.id}
                  className="bg-destructive text-white h-fit py-1.5 px-3 rounded-full flex self-center font-mono text-sm"
                >
                  #{slot.id}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Calculated fines */}
      <div
        className={cn(
          "border-1 px-4 py-3 flex items-center rounded-md",
          studentFines.fines.total_amount > 0
            ? "border-destructive bg-destructive/20"
            : "border-primary bg-primary/20"
        )}
      >
        <h3
          className={cn(
            "text-sm font-bold",
            studentFines.fines.total_amount > 0
              ? "text-destructive"
              : "text-primary"
          )}
        >
          Total Outstanding Fines
        </h3>
        <div className="ml-auto">
          <span
            className={cn(
              "text-base font-bold",
              studentFines.fines.total_amount > 0
                ? "text-destructive"
                : "text-primary"
            )}
          >
            {formatAmount(studentFines.fines.total_amount)}
          </span>
        </div>
      </div>
    </div>
  </div>
);

// No student data found state
const NoStudentFound = () => (
  <>
    <SearchForm />

    <div className="py-16 mt-2 flex flex-col items-center justify-center space-y-4 text-center">
      <div className="dark:bg-secondary bg-secondary/20 rounded-full p-3">
        <InfoIcon className="w-8 h-8 text-secondary-foreground" />
      </div>
      <div className="space-y-2 max-w-md">
        <h3 className="text-lg font-medium text-secondary/80">
          No Student Data Found
        </h3>
        <p className="text-muted-foreground text-sm">
          We couldn&apos;t find a student with that ID. <br /> Please check the
          ID and try again.
        </p>
      </div>
    </div>
  </>
);

// Initial search state
const InitialSearchState = () => (
  <>
    <SearchForm />

    <div className="py-16 mt-2 flex flex-col items-center justify-center space-y-4 text-center">
      <div className="bg-primary/20 rounded-full p-3">
        <Search className="w-8 h-8 text-primary" />
      </div>
      <div className="space-y-2 max-w-md">
        <h3 className="text-lg font-medium text-foreground">
          Search for a Student
        </h3>
        <p className="text-muted-foreground text-sm">
          Enter a student ID to view attendance records and fines.
        </p>
      </div>
    </div>
  </>
);

// Loading state
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-40 space-y-4">
    <div className="relative">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
    <p className="text-muted-foreground text-sm">Searching...</p>
  </div>
);

// Main component
export default function StudentLookupMobile({
  eventId,
  disabled,
}: {
  eventId: number;
  disabled: boolean;
}) {
  const { studentId } = useSingleEventParams();
  const [studentFinesData, setStudentFinesData] =
    useState<GetStudentFinesDataSuccess | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch student data
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!disabled && studentId && studentId.trim() !== "") {
        setLoading(true);
        const data = await getStudentFines(eventId, studentId);

        setStudentFinesData(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [disabled, eventId, studentId]);

  // Render the appropriate UI based on state
  if (disabled) {
    return <InactiveState />;
  }

  if (loading && studentId) {
    return <LoadingState />;
  }

  if (studentFinesData) {
    return <StudentDataDisplay studentFines={studentFinesData} />;
  }

  if (studentId) {
    return <NoStudentFound />;
  }

  return <InitialSearchState />;
}
