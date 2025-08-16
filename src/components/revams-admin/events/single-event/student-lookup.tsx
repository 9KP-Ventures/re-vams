"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Calendar,
  ClockAlert,
  ClockPlus,
  InfoIcon,
  Loader2,
  Search,
  User2,
} from "lucide-react";
import SearchForm from "./student-lookup-search-form";
import { useEffect, useState } from "react";
import { useSingleEventParams } from "@/lib/hooks/single-event-params";
import { getStudentFines } from "@/actions/fines";
import { GetStudentFinesDataSuccess } from "@/lib/requests/events/fines/get-student-fines";
import { cn, formatAmount } from "@/lib/utils";

// Inactive state component
const InactiveState = () => (
  <div className="py-43 flex flex-col items-center justify-center space-y-6 text-center">
    <div className="bg-muted/50 rounded-full p-4">
      <AlertCircle className="w-12 h-12 text-muted-foreground" />
    </div>

    <div className="space-y-2 max-w-md">
      <h3 className="text-xl font-medium text-foreground">
        This Event is Currently Inactive
      </h3>
      <p className="text-muted-foreground">
        Student lookup is only available when the event is active. Check back
        later when the event is active to search for students.
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

      <div className="bg-muted w-full px-8 md:pt-7 xl:pt-15 pb-8 space-y-10 mb-9 rounded-md">
        {/* Student name */}
        <div className="flex gap-4">
          <div className="dark:bg-secondary/40 bg-secondary/30 h-fit p-2 rounded-full flex self-center">
            <User2 className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold xl:text-xl 2xl:text-2xl">
              {studentFines.student.first_name}{" "}
              {studentFines.student.middle_name}{" "}
              {studentFines.student.last_name}
            </span>
            <span className="text-muted-foreground text-sm">
              {studentFines.student.id} | {studentFines.student.email_address}
            </span>
          </div>
        </div>

        {/* Student details */}
        <div className="grid md:grid-cols-1 xl:grid-cols-2 xl:grid-rows-2 gap-y-6">
          <div>
            <span aria-label="Degree" className="text-muted-foreground text-sm">
              Degree
            </span>
            <p className="xl:text-base 2xl:text-xl font-bold">
              {studentFines.student.degrees?.name ?? "-"}
            </p>
          </div>
          <div>
            <span
              aria-label="Program"
              className="text-muted-foreground text-sm"
            >
              Program
            </span>
            <p className="xl:text-base 2xl:text-xl font-bold">
              {studentFines.student.programs?.name ?? "-"}
            </p>
          </div>
          <div>
            <span aria-label="Major" className="text-muted-foreground text-sm">
              Major
            </span>
            <p className="xl:text-base 2xl:text-xl font-bold">
              {studentFines.student.majors?.name ?? "-"}
            </p>
          </div>
          <div>
            <span
              aria-label="Year Level"
              className="text-muted-foreground text-sm"
            >
              Year Level
            </span>
            <p className="xl:text-base 2xl:text-xl font-bold">
              {studentFines.student.year_levels?.name ?? "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Time slots attended and missed */}
      <div className="grid gap-x-2 gap-y-6 md:grid-cols-1 xl:grid-cols-2 mb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="dark:bg-secondary/40 bg-secondary/15 h-fit p-2 rounded-md flex self-center">
              <ClockPlus className="w-6 h-6" />
            </div>
            <h3 className="font-bold xl:text-lg 2xl:text-2xl">
              Time Slots Attended
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {studentFines.attendance_summary.attended_slots.length === 0 && (
              <>&ndash;</>
            )}
            {studentFines.attendance_summary.attended_slots.map(slot => {
              return (
                <div
                  key={slot.id}
                  className="bg-primary/80 text-primary-foreground h-fit py-2 px-3 rounded-full flex self-center font-mono"
                >
                  #{slot.id}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="dark:bg-secondary/40 bg-secondary/15 h-fit p-2 rounded-md flex self-center">
              <ClockAlert className="w-6 h-6" />
            </div>
            <h3 className="font-bold xl:text-lg 2xl:text-2xl">
              Time Slots Missed
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {studentFines.attendance_summary.missed_slots.length === 0 && (
              <>&ndash;</>
            )}
            {studentFines.attendance_summary.missed_slots.map(slot => {
              return (
                <div
                  key={slot.id}
                  className="bg-destructive text-white h-fit py-2 px-3 rounded-full flex self-center font-mono"
                >
                  #{slot.id}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Calculated fines */}
      <div
        className={cn(
          "border-1 px-8 py-5 flex items-center rounded-md",
          studentFines.fines.total_amount > 0
            ? "border-destructive bg-destructive/20"
            : "border-primary bg-primary/20"
        )}
      >
        <h3
          className={cn(
            "text-base xl:text-xl font-bold",
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
              "text-base xl:text-2xl font-bold",
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

// No student data found state - keeps search visible
const NoStudentFound = () => (
  <>
    <SearchForm />

    <div className="py-46 mt-2 flex flex-col items-center justify-center space-y-6 text-center">
      <div className="dark:bg-secondary bg-secondary/20 rounded-full p-4">
        <InfoIcon className="w-10 h-10 text-secondary-foreground" />
      </div>
      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-medium text-secondary/80">
          No Student Data Found
        </h3>
        <p className="text-muted-foreground">
          We couldn&apos;t find a student with that ID. Please check the ID and
          try again.
        </p>
      </div>
    </div>
  </>
);

// Initial search state - when no search has been performed yet
const InitialSearchState = () => (
  <>
    <SearchForm />

    <div className="py-46 mt-2 flex flex-col items-center justify-center space-y-6 text-center">
      <div className="bg-primary/20 rounded-full p-4">
        <Search className="w-10 h-10 text-primary" />
      </div>
      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-medium text-foreground">
          Search for a Student
        </h3>
        <p className="text-muted-foreground">
          Enter a student ID to view their attendance records and outstanding
          fines.
        </p>
      </div>
    </div>
  </>
);

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-[253px] space-y-4">
    <div className="relative">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
    <p className="text-muted-foreground">Searching student data...</p>
  </div>
);

// Main component with condition handling
export default function StudentLookup({
  eventId,
  eventIsActive,
}: {
  eventId: number;
  eventIsActive: boolean;
}) {
  const { studentId } = useSingleEventParams();
  const [studentFinesData, setStudentFinesData] =
    useState<GetStudentFinesDataSuccess | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Only fetch student data if event is active and we have a student ID
  useEffect(() => {
    const fetchStudentData = async () => {
      if (eventIsActive && studentId && studentId.trim() !== "") {
        setLoading(true);
        const data = await getStudentFines(eventId, studentId);

        setStudentFinesData(data);
        setLoading(false);
      } else {
        setLoading(false); // Make sure loading is set to false when not fetching
      }
    };
    fetchStudentData();
  }, [eventIsActive, eventId, studentId]);

  return (
    <Card className={eventIsActive ? "" : "opacity-90 bg-muted/30"}>
      <CardHeader className="border-b-1 relative">
        <CardTitle
          className={`text-2xl pb-4 ${
            eventIsActive ? "text-primary" : "text-muted-foreground"
          }`}
        >
          Search Student
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Content logic based on state */}
        {!eventIsActive ? (
          // Event inactive state
          <InactiveState />
        ) : loading && studentId ? (
          // Loading state with spinner
          <LoadingState />
        ) : studentFinesData ? (
          // Student found state
          <StudentDataDisplay studentFines={studentFinesData} />
        ) : studentId ? (
          // Student not found state - with search form still visible
          <NoStudentFound />
        ) : (
          // Initial state - no search performed yet
          <InitialSearchState />
        )}
      </CardContent>
    </Card>
  );
}
