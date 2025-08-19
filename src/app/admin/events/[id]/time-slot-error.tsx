import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TimeSlotDataError({
  eventId,
  slotId,
}: {
  eventId: number;
  slotId: number | undefined;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <Card className="max-w-md w-full shadow-lg border-destructive/10">
        <CardContent className="pt-6 pb-8 px-6">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Icon */}
            <div className="rounded-full bg-destructive/10 p-5 mb-2">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>

            {/* Title and description */}
            <div className="space-y-2">
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight">
                Something Went Wrong
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-sm">
                Time slot data {slotId && ` #${slotId}`} could not be loaded.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>

            <div className="pt-4 border-t w-full">
              <Button
                variant="link"
                asChild
                className="text-sm text-muted-foreground"
              >
                <Link href={`/admin/events/${eventId}`}>
                  Return to event overview
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
