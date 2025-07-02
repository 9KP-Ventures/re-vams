export default function EventsHeader() {
  return (
    <>
      <h1 className="text-4xl font-extrabold text-primary dark:text-foreground mb-1">
        Events
      </h1>
      {/* TODO: Turn into dynamic breadcrumbs */}
      <div className="text-sm text-primary/50 dark:text-muted-foreground mb-4">
        Dashboard / Events
      </div>
    </>
  );
}
