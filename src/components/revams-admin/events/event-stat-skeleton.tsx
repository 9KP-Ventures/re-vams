"use client";

export function StatSkeleton({
  icon,
  width,
}: {
  icon: React.ReactNode;
  width: string;
}) {
  return (
    <div className="flex flex-col items-center text-center text-muted-foreground">
      <div className="bg-secondary/20 p-2 sm:p-3 md:p-4 rounded-full mb-2 md:mb-3">
        <div className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7">{icon}</div>
      </div>
      <div
        className={`h-5 sm:h-6 animate-pulse bg-muted rounded ${width}`}
      ></div>
      <div className="h-4 animate-pulse bg-muted/70 rounded w-16 sm:w-20 mt-1"></div>
    </div>
  );
}
