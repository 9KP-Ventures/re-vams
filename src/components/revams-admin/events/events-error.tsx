"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface EventsErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  errorType?: string | undefined;
}

export default function EventsError({ errorType, ...props }: EventsErrorProps) {
  const router = useRouter();

  const errorMessages = {
    true: "We couldn't load your events. Please try again later.",
    fetch_failed: "Failed to fetch events from the server.",
  };

  const message =
    errorMessages[errorType as keyof typeof errorMessages] ||
    errorMessages.true;

  return (
    <div
      className={cn(
        "max-w-md mx-auto rounded-lg shadow-lg border border-destructive-foreground bg-destructive-foreground/20 p-5",
        props.className
      )}
    >
      {/* Error Header */}
      <div className="flex items-center mb-4">
        <div className="h-10 w-10 rounded-full bg-destructive-foreground/20 flex items-center justify-center mr-3">
          <AlertCircle size={20} className="text-destructive" />
        </div>
        <h3 className="text-destructive font-medium text-lg">
          Something went wrong
        </h3>
      </div>

      {/* Error Message */}
      <p className="text-muted-foreground mb-5">{message}</p>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button
          onClick={() => router.replace("/admin/events")}
          className="font-medium text-sm"
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
