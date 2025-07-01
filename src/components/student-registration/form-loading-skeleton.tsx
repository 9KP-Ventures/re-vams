"use client";

export function FormLoadingSkeleton() {
  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-muted rounded-full mx-auto animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse" />
        </div>
      </div>
      <div className="bg-card rounded-lg border space-y-4 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-24" />
            <div className="h-10 bg-muted rounded animate-pulse" />
          </div>
        ))}
        <div className="h-12 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}
