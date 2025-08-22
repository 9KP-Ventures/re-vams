import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import { GetStudentDataSuccess } from "@/lib/requests/students/get+delete";
import { Loader2 } from "lucide-react";

export default function StudentPreview({
  student,
  isLoading,
  isAdding,
  onAddAttendee,
}: {
  student: GetStudentDataSuccess["student"];
  isLoading: boolean;
  isAdding: boolean;
  onAddAttendee: () => void;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">
          Looking up student information...
        </p>
      </div>
    );
  }

  return (
    <Card className="border bg-card">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          {/* Student Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {student.last_name}, {student.first_name}
              </span>
              <Badge variant="outline" className="text-xs">
                {student.id}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">
              {student.email_address}
            </span>
          </div>

          {/* Academic Info */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Program:</span>
              <div className="font-medium">{student.programs?.name || "-"}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Year Level:</span>
              <div className="font-medium">
                {student.year_levels?.name || "-"}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Major:</span>
              <div className="font-medium">{student.majors?.name || "-"}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Degree:</span>
              <div className="font-medium">{student.degrees?.name || "-"}</div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={onAddAttendee}
              disabled={isAdding}
              className="w-full"
            >
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add to Attendees"
              )}
            </Button>
          </DialogFooter>
        </div>
      </CardContent>
    </Card>
  );
}
