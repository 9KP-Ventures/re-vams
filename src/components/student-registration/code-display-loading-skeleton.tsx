// components/ui/code-loading-skeleton.tsx
export function CodeLoadingSkeleton() {
  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse" />
        </div>
      </div>

      {/* Card skeleton */}
      <div className="bg-card rounded-lg border space-y-6 p-6">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="w-48 h-48 bg-muted rounded mx-auto animate-pulse" />
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-3/4 mx-auto" />
        </div>
        <div className="h-12 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}
