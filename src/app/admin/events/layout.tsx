import EventsStats from "@/components/revams-admin/events/event-stats";
import EventsHeader from "@/components/revams-admin/events/events-header";

export default function AdminEventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-20 pt-16 pb-8 min-h-dvh flex flex-col">
      <EventsHeader />
      <EventsStats />
      {children}
    </div>
  );
}
