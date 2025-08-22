import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Plus, Search } from "lucide-react";
import { useState } from "react";
import StudentPreview from "./student-preview";
import StudentRegistrationForm from "./student-registration-form";
import ResultMessage from "./student-result-message";
import { GetStudentDataSuccess } from "@/lib/requests/students/get+delete";
import { cn } from "@/lib/utils";

export default function AddAttendeeButton() {
  const [studentId, setStudentId] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Flags for different states (would be determined by API responses in real implementation)
  const [studentExists, setStudentExists] = useState(false);
  const [studentInAttendees, setStudentInAttendees] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultSuccess, setResultSuccess] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  // Mock data for student preview
  const mockStudent: GetStudentDataSuccess["student"] = {
    created_at: "",
    id: "2023-0002",
    first_name: "John",
    middle_name: "",
    last_name: "Doe",
    email_address: "john.doe@university.edu",
    programs: { id: 3, name: "Computer Science" },
    year_levels: { id: 3, name: "Third Year" },
    majors: { id: 4, name: "Software Engineering", program_id: 3 },
    degrees: { id: 1, name: "Bachelor of Science" },
  };

  const handleSearch = () => {
    if (!studentId.trim()) return;

    setIsSearching(true);
    setSearchPerformed(true);
    setShowResult(false);

    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);

      // For demo purposes, use ID to determine if student exists and is in attendees
      if (studentId === "2023-0001") {
        setStudentExists(true);
        setStudentInAttendees(true);
      } else if (studentId === "2023-0002") {
        setStudentExists(true);
        setStudentInAttendees(false);
      } else {
        setStudentExists(false);
        setStudentInAttendees(false);
      }
    }, 1500);
  };

  const handleAddAttendee = () => {
    setIsAdding(true);

    // Simulate API call
    setTimeout(() => {
      setIsAdding(false);
      setShowResult(true);
      setResultSuccess(true);
      setResultMessage(
        "Student has been successfully added to the attendees list."
      );
    }, 1500);
  };

  const handleRegisterSubmit = () => {
    setShowResult(true);
    setResultSuccess(true);
    setResultMessage(
      "Student has been registered and added to the attendees list."
    );
  };

  const resetState = () => {
    setStudentId("");
    setSearchPerformed(false);
    setIsSearching(false);
    setIsAdding(false);
    setStudentExists(false);
    setStudentInAttendees(false);
    setShowResult(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(resetState, 300); // Reset state after dialog close animation
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        setIsOpen(open);
        if (!open) setTimeout(resetState, 300);
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1.5">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Attendee</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Attendee</DialogTitle>
          <DialogDescription>
            Enter a student ID to record attendance for this slot.
          </DialogDescription>
        </DialogHeader>

        {!showResult ? (
          <>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="student-id" className="sr-only">
                  Student ID
                </Label>
                <Input
                  id="student-id"
                  placeholder="Enter student ID"
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                />
              </div>
              <Button
                type="button"
                onClick={handleSearch}
                disabled={!studentId.trim() || isSearching}
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {searchPerformed && (
              <div
                className={cn("mt-2", isSearching ? "invisible" : "visible")}
              >
                <ScrollArea className="max-h-[60vh]">
                  {studentInAttendees ? (
                    <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md">
                      <p className="text-yellow-800 dark:text-yellow-400 text-sm">
                        This student is already in the attendees list for this
                        slot.
                      </p>
                    </div>
                  ) : studentExists ? (
                    <StudentPreview
                      student={mockStudent}
                      isLoading={isSearching}
                      isAdding={isAdding}
                      onAddAttendee={handleAddAttendee}
                    />
                  ) : (
                    <StudentRegistrationForm
                      studentId={studentId}
                      onSubmit={handleRegisterSubmit}
                    />
                  )}
                </ScrollArea>
              </div>
            )}
          </>
        ) : (
          <ResultMessage
            success={resultSuccess}
            message={resultMessage}
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
