"use client";

import { getSlotAttendees } from "@/actions/attendees";
import { ValidatedSingleEventParams } from "@/app/admin/events/[id]/page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GetSlotAttendeesDataSuccess } from "@/lib/requests/events/attendance-slots/attendees/get-many";
import { formatTime } from "@/lib/utils";
import { CheckCheck, Loader2, User2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import AttendeesFilters from "./attendees-filters";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AddAttendeeButton from "./add-attendee-button";

export default function AttendeesListView({
  attendees: initialAttendees,
  pagination,
  eventId,
  slotId,
  params,
}: {
  attendees: GetSlotAttendeesDataSuccess["attendees"];
  pagination: GetSlotAttendeesDataSuccess["pagination"];
  eventId: number;
  slotId: number;
  params: ValidatedSingleEventParams;
}) {
  const [ref, inView] = useInView();
  const [attendees, setAttendees] =
    useState<GetSlotAttendeesDataSuccess["attendees"]>(initialAttendees);
  const [page, setPage] = useState(1);

  // Selection mode state
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedAttendees, setSelectedAttendees] = useState<Set<string>>(
    new Set()
  );

  const loadingRef = useRef(false);

  // Reset selection when toggling selection mode off
  useEffect(() => {
    if (!selectionMode) {
      setSelectedAttendees(new Set());
    }
  }, [selectionMode]);

  useEffect(() => {
    loadingRef.current = false;
  }, [initialAttendees, params.search, params.sort, params.order]);

  const loadMoreAttendees = useCallback(async () => {
    // Return early if already loading, or no more pages
    if (loadingRef.current || attendees.length >= pagination.total) {
      return;
    }

    loadingRef.current = true;

    const next = page + 1;
    const data = await getSlotAttendees(eventId, slotId, params, next);

    if ("error" in data) {
      toast.error(`Attendees data error: ${data.error.code}`, {
        description: data.error.message,
      });
      setAttendees([]);
      return;
    }

    const { attendees: newAttendees } = data;

    if (newAttendees.length) {
      setPage(next);
      setAttendees((prev: GetSlotAttendeesDataSuccess["attendees"]) => [
        ...(prev?.length ? prev : []),
        ...newAttendees,
      ]);
    }
    setTimeout(() => {
      loadingRef.current = false;
    }, 300);
  }, [eventId, slotId, params, page, attendees, pagination]);

  useEffect(() => {
    if (inView && pagination.hasNextPage) {
      // Load more attendees when the loader comes into view
      loadMoreAttendees();
    }
  }, [pagination, inView, loadMoreAttendees, selectionMode]);

  // Toggle selection mode
  const handleToggleSelectionMode = () => {
    setSelectionMode(prev => !prev);
  };

  // Handle individual checkbox selection
  const handleSelectAttendee = (attendeeId: string) => {
    setSelectedAttendees(prev => {
      const newSet = new Set(prev);

      if (newSet.has(attendeeId)) {
        // If already selected, remove it
        newSet.delete(attendeeId);
      } else {
        // If not selected, check if adding would exceed the limit
        if (newSet.size >= 100) {
          // Show warning toast if trying to exceed limit
          toast.warning("Selection limit reached", {
            description: "You can delete up to 100 attendees only.",
          });
          return newSet; // Return unchanged set
        }

        // Add the attendee to selection
        newSet.add(attendeeId);
      }

      return newSet;
    });
  };

  // Handle select all checkboxes
  const handleSelectAll = () => {
    if (selectedAttendees.size === attendees.length) {
      // If all are selected, deselect all
      setSelectedAttendees(new Set());
    } else {
      // Otherwise, select all

      // Check if adding all would exceed the 100 limit
      if (attendees.length > 100) {
        // Limit selection to up to 100 only
        toast.warning("Selection limit reached", {
          description: "You can delete up to 100 attendees only.",
        });

        // Take only the first 100 attendees
        const limitedIds = attendees.slice(0, 100).map(a => a.student.id);
        setSelectedAttendees(new Set(limitedIds));
      } else {
        // Select all attendees (within limit)
        const allIds = attendees.map(a => a.student.id);
        setSelectedAttendees(new Set(allIds));
      }
    }
  };

  // Handle delete selected attendees
  const handleDeleteSelected = () => {
    if (selectedAttendees.size === 0) return;

    // TODO: Apply functionality to attendees bulk deletion
    toast.success(
      `${selectedAttendees.size} attendance records marked for deletion`,
      {
        description: "API functionality to be implemented.",
      }
    );

    // For demo purposes, we'll remove the selected attendees from the UI
    const remainingAttendees = attendees.filter(
      a => !selectedAttendees.has(a.student.id)
    );
    setAttendees(remainingAttendees);
    setSelectedAttendees(new Set());
  };

  // Check if all attendees are selected
  const allSelected =
    attendees.length > 0 && selectedAttendees.size === attendees.length;
  // Check if some (but not all) attendees are selected
  const someSelected = selectedAttendees.size > 0 && !allSelected;

  return (
    <div className="mt-6">
      <AddAttendeeButton />
      <div className="flex flex-wrap gap-2 mb-4 justify-between">
        <div className="flex items-center gap-1">
          {selectionMode ? (
            <span
              aria-label="Selected attendees count"
              className="text-primary flex gap-2 items-center"
            >
              <CheckCheck className="w-4 h-4" />
              {selectedAttendees.size} selected{" "}
              {selectedAttendees.size === 1 ? "attendee" : "attendees"}
            </span>
          ) : (
            <div>
              <h3 className="hidden md:block">
                There are {pagination.total || 0} total attendees in this slot
              </h3>

              <h3 className="block: md:hidden">
                Attendees ({pagination.total || 0})
              </h3>
            </div>
          )}

          {/* Selection mode toggle button */}
          {!selectionMode && (
            <Button
              variant="link"
              size="sm"
              onClick={handleToggleSelectionMode}
              className="flex items-center gap-1.5"
            >
              Select
            </Button>
          )}
        </div>

        {selectionMode && (
          <div
            aria-label="Selection controls"
            className="w-full sm:w-fit grid grid-cols-2 sm:grid-cols-none sm:flex gap-2"
          >
            {!allSelected && (
              <Button
                id="select-all"
                variant="link"
                onClick={handleSelectAll}
                aria-label="Select all attendees"
                className="hidden sm:block"
              >
                Select all
              </Button>
            )}

            {/* Selection mode toggle button */}
            <Button
              variant="outline"
              size="lg"
              onClick={handleToggleSelectionMode}
              className="flex items-center gap-1.5 w-full sm:w-fit"
            >
              Cancel
            </Button>

            {/* Delete button - only visible in selection mode */}
            {selectionMode && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="lg"
                    disabled={selectedAttendees.size === 0}
                    className="flex items-center gap-1.5 w-full sm:w-fit"
                  >
                    <span className="hidden md:block">Delete Selected</span>
                    <span className="block md:hidden">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {selectedAttendees.size}{" "}
                      attendance{" "}
                      {selectedAttendees.size === 1 ? "record" : "records"}?
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-white hover:bg-destructive/90"
                      onClick={handleDeleteSelected}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}

        {/* Only show filters when not in selection mode */}
        {!selectionMode && <AttendeesFilters />}
      </div>

      {/* Table-style list with headers */}
      {attendees.length > 0 ? (
        <div className="rounded-md border overflow-x-auto">
          <div
            className={`min-w-[850px] lg:min-w-[1050px] xl:min-w-[1230px] 2xl:min-w-[1500px] ${
              selectionMode ? "relative" : ""
            }`}
          >
            {/* Set minimum width to ensure content doesn't compress */}
            {/* Table headers */}
            <div
              className={`grid ${
                selectionMode
                  ? "grid-cols-[40px_1fr_1fr_0.5fr] lg:grid-cols-[40px_1fr_1fr_0.5fr_0.5fr] xl:grid-cols-[40px_1fr_1fr_1fr_0.5fr_0.5fr] 2xl:grid-cols-[40px_1fr_1fr_1fr_1fr_0.5fr_0.5fr]"
                  : "grid-cols-[1fr_1fr_0.5fr] lg:grid-cols-[1fr_1fr_0.5fr_0.5fr] xl:grid-cols-[1fr_1fr_1fr_0.5fr_0.5fr] 2xl:grid-cols-[1fr_1fr_1fr_1fr_0.5fr_0.5fr]"
              } gap-3 bg-muted/40 p-3 font-medium text-muted-foreground`}
            >
              {/* Select all checkbox - only visible in selection mode */}
              {selectionMode && (
                <div className="flex items-center justify-center">
                  <Checkbox
                    id="select-all"
                    checked={allSelected || (someSelected && "indeterminate")}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all attendees"
                  />
                </div>
              )}

              <div>Name</div>
              <div className="hidden 2xl:block">Degree</div>
              <div className="">Program</div>
              <div className="hidden xl:block">Major</div>
              <div className="hidden lg:block">Year</div>
              <div className="text-right">Time Attended</div>
            </div>

            {/* Table content */}
            <div className="divide-y">
              <ul>
                {attendees.map(attendee => (
                  <li key={attendee.student.id}>
                    <div
                      className={`grid ${
                        selectionMode
                          ? "grid-cols-[40px_1fr_1fr_0.5fr] lg:grid-cols-[40px_1fr_1fr_0.5fr_0.5fr] xl:grid-cols-[40px_1fr_1fr_1fr_0.5fr_0.5fr] 2xl:grid-cols-[40px_1fr_1fr_1fr_1fr_0.5fr_0.5fr]"
                          : "grid-cols-[1fr_1fr_0.5fr] lg:grid-cols-[1fr_1fr_0.5fr_0.5fr] xl:grid-cols-[1fr_1fr_1fr_0.5fr_0.5fr] 2xl:grid-cols-[1fr_1fr_1fr_1fr_0.5fr_0.5fr]"
                      } gap-3 px-3 py-3 md:py-6 items-center hover:bg-secondary/10 dark:hover:bg-primary/10 transition-colors`}
                    >
                      {/* Checkbox - only visible in selection mode */}
                      {selectionMode && (
                        <div className="flex items-center justify-center">
                          <Checkbox
                            id={`select-${attendee.student.id}`}
                            checked={selectedAttendees.has(attendee.student.id)}
                            onCheckedChange={() =>
                              handleSelectAttendee(attendee.student.id)
                            }
                            aria-label={`Select ${attendee.student.first_name} ${attendee.student.last_name}`}
                          />
                        </div>
                      )}

                      {/* Name column with ID badge and email */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {attendee.student.last_name}
                            {", "}
                            {attendee.student.first_name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {attendee.student.id}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground mt-0.5">
                          {attendee.student.email_address}
                        </span>
                      </div>

                      {/* Degree column */}
                      <div className="truncate hidden 2xl:block">
                        {attendee.student.degrees?.name || "-"}
                      </div>

                      {/* Program column */}
                      <div className="truncate">
                        {attendee.student.programs?.name || "-"}
                      </div>

                      {/* Major column */}
                      <div className="truncate hidden xl:block">
                        {attendee.student.majors?.name || "-"}
                      </div>

                      {/* Year column */}
                      <div className="hidden lg:block">
                        {attendee.student.year_levels?.name || "-"}
                      </div>

                      {/* Time column */}
                      <div className="text-right text-sm text-muted-foreground">
                        {formatTime(attendee.attendance_record.recorded_time)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Infinite scroll loading indicator */}
          {attendees.length < pagination.total && (
            <div className="py-4 text-center" ref={ref}>
              <div className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading more...</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card className="bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-muted p-3 mb-3">
              <User2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-center">
              {params.year_level_id || params.program_id || params.search
                ? "No associated attendees found with the search and filters."
                : "No attendees recorded for this time slot."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Show current page info */}
      {attendees.length > 0 && (
        <div className="my-8 text-sm text-center text-muted-foreground">
          Showing {attendees.length} of {pagination.total} attendees
        </div>
      )}
    </div>
  );
}
