"use server";

import { fetchStudentData, StudentWithCode } from "@/actions/student";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Calendar,
  ClockAlert,
  ClockPlus,
  InfoIcon,
  Search,
  User2,
} from "lucide-react";
import SearchForm from "./student-lookup-search-form";

// Inactive state component
const InactiveState = () => (
  <div className="py-[72px] flex flex-col items-center justify-center space-y-6 text-center">
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
const StudentDataDisplay = ({ student }: { student: StudentWithCode }) => (
  <div aria-labelledby="search">
    <p className="sr-only" id="search">
      Search results for students
    </p>

    <div className="bg-muted w-full px-8 py-6 space-y-4 mb-6">
      {/* Student name */}
      <div className="flex gap-4">
        <div className="dark:bg-secondary/40 bg-secondary/30 h-fit p-2 rounded-full flex self-center">
          <User2 className="w-7 h-7" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-2xl">
            {student.first_name} {student.middle_name} {student.last_name}
          </span>
          <span className="text-muted-foreground text-sm">
            {student.id} | {student.email_address}
          </span>
        </div>
      </div>

      {/* Student program and year level */}
      <div className="grid grid-cols-3">
        <div>
          <span aria-label="Program" className="text-muted-foreground text-sm">
            Program
          </span>
          <p className="text-xl font-bold">{student.programs?.name ?? "-"}</p>
        </div>
        <div>
          <span aria-label="Program" className="text-muted-foreground text-sm">
            Major
          </span>
          <p className="text-xl font-bold">{student.majors?.name ?? "-"}</p>
        </div>
        <div>
          <span
            aria-label="Year Level"
            className="text-muted-foreground text-sm"
          >
            Year Level
          </span>
          <p className="text-xl font-bold">
            {student.year_levels?.name ?? "-"}
          </p>
        </div>
      </div>
    </div>

    {/* Time slots attended and missed */}
    <div className="grid grid-cols-2 mb-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="dark:bg-secondary/40 bg-secondary/15 h-fit p-2 rounded-md flex self-center">
            <ClockPlus className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-2xl">Time Slots Attended</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="bg-primary/80 text-primary-foreground h-fit py-2 px-3 rounded-full flex self-center font-mono">
            #1
          </div>
          <div className="bg-primary/80 text-primary-foreground h-fit py-2 px-3 rounded-full flex self-center font-mono">
            #2
          </div>
          <div className="bg-primary/80 text-primary-foreground h-fit py-2 px-3 rounded-full flex self-center font-mono">
            #3
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="dark:bg-secondary/40 bg-secondary/15 h-fit p-2 rounded-md flex self-center">
            <ClockAlert className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-2xl">Time Slots Missed</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="bg-destructive text-white h-fit py-2 px-3 rounded-full flex self-center font-mono">
            #4
          </div>
          <div className="bg-destructive text-white h-fit py-2 px-3 rounded-full flex self-center font-mono">
            #5
          </div>
          <div className="bg-destructive text-white h-fit py-2 px-3 rounded-full flex self-center font-mono">
            #6
          </div>
        </div>
      </div>
    </div>

    {/* Calculated fines */}
    <div className="border-destructive border-1 bg-destructive/20 px-8 py-4 flex items-center rounded-md">
      <h3 className="text-xl font-bold text-destructive">
        Total Outstanding Fines
      </h3>
      <div className="ml-auto">
        <span className="text-2xl font-bold text-destructive">₱150.00</span>
      </div>
    </div>
  </div>
);

// No student data found state - keeps search visible
const NoStudentFound = () => (
  <>
    <SearchForm />

    <div className="py-[92px] mt-2 flex flex-col items-center justify-center space-y-6 text-center">
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

    <div className="py-[92px] mt-2 flex flex-col items-center justify-center space-y-6 text-center">
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

// Main component with condition handling
export default async function StudentLookup({
  eventIsActive,
  studentId,
}: {
  eventIsActive: boolean;
  studentId?: string;
}) {
  // Only fetch student data if event is active and we have a student ID
  const studentData =
    eventIsActive && studentId ? await fetchStudentData(studentId) : null;

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
        ) : studentData ? (
          // Student found state
          <>
            <SearchForm />
            <StudentDataDisplay student={studentData} />
          </>
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
