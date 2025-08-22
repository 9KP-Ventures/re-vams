"use client";

import { GetEventsDataSuccess } from "@/lib/requests/events/get-many";
import {
  CalendarIcon,
  ClockIcon,
  Edit,
  Loader2,
  School,
  Trash,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EventCard({
  event,
}: {
  event: GetEventsDataSuccess["events"][0];
}) {
  const router = useRouter();
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(false);

  const deleteEvent = async () => {
    setDeletingEvent(false);
    toast.info("Event deleted successfully.");
  };

  // TODO: Implement actual delete
  useEffect(() => {
    if (deletingEvent) {
      deleteEvent();
    }
  }, [deletingEvent, router]);

  return (
    <>
      <ContextMenu modal={false}>
        <ContextMenuTrigger>
          <Tooltip delayDuration={800}>
            <TooltipTrigger asChild>
              <li
                role="button"
                onClick={() => router.push(`/admin/events/${event.id}`)}
              >
                <Card className="cursor-pointer p-0 overflow-hidden shadow-lg hover:shadow-sm dark:hover:border-primary transition-[shadow,border]">
                  <CardContent className="p-8">
                    <div className="flex gap-2 justify-between items-start mb-4">
                      <h3 className="select-none font-semibold text-primary dark:text-foreground truncate">
                        {event.name}
                      </h3>
                      <div className="select-none flex items-center gap-4">
                        <Badge
                          className={cn(
                            "capitalize text-xs rounded-full",
                            event.status === "on_going"
                              ? "text-white bg-destructive"
                              : event.status === "completed"
                              ? "text-primary-foreground bg-primary"
                              : event.status === "upcoming"
                              ? "text-secondary-foreground bg-secondary"
                              : ""
                          )}
                        >
                          {event.status.split("_").join(" ")}
                        </Badge>
                      </div>
                    </div>

                    <div className="select-none space-y-2 pb-7 text-sm text-green-950 dark:text-muted-foreground">
                      <div className="space-x-2 flex items-center">
                        <CalendarIcon size={14} />
                        <span>
                          {new Date(event.date).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="space-x-2 flex items-center">
                        <ClockIcon size={14} />
                        <span>&mdash; to &mdash;</span>
                      </div>
                      <div className="space-x-2 flex items-center">
                        <School size={14} />
                        <span className="capitalize">
                          {event.semesters.name ?? ""}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </li>
            </TooltipTrigger>
            <TooltipContent>Right-click for options</TooltipContent>
          </Tooltip>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-[200px]">
          <ContextMenuItem className="text-base" disabled>
            {event.name}
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Open</ContextMenuItem>
          <ContextMenuItem>
            Edit
            <ContextMenuShortcut>
              <Edit />
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            variant="destructive"
            onClick={() => setAlertDialogOpen(true)}
          >
            Delete
            <ContextMenuShortcut>
              <Trash className="text-destructive" />
            </ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this event?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete and
              remove the event from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                setDeletingEvent(true);
              }}
            >
              {deletingEvent ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>Delete</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
