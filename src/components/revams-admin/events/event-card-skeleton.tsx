export default function EventCardSkeleton() {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="h-5 bg-muted rounded w-1/2"></div>
        <div className="flex items-center gap-2">
          <div className="h-5 bg-primary/20 rounded-full w-16"></div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-muted mr-2"></div>
          <div className="h-4 bg-muted rounded w-1/3"></div>
        </div>

        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-muted mr-2"></div>
          <div className="h-4 bg-muted rounded w-1/4"></div>
        </div>

        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-muted mr-2"></div>
          <div className="h-4 bg-muted rounded w-2/5"></div>
        </div>

        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-muted mr-2"></div>
          <div className="h-4 bg-muted rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
}
