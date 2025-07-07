export default function EventsPaginationSkeleton() {
  return (
    <div className="flex justify-center items-center gap-2 animate-pulse">
      <div className="w-20 h-9 bg-muted rounded-md"></div>
      <div className="flex space-x-1">
        <div className="w-9 h-9 bg-muted rounded-md"></div>
        <div className="w-9 h-9 bg-muted rounded-md"></div>
        <div className="w-9 h-9 bg-muted rounded-md"></div>
      </div>
      <div className="w-20 h-9 bg-muted rounded-md"></div>
    </div>
  );
}
