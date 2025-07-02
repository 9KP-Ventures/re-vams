import EventsStats from "@/components/revams-admin/events/event-stats";
import EventsHeader from "@/components/revams-admin/events/events-header";

export default function AdminEventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 xl:px-20 lg:px-12 md:px-6 pt-8 lg:pt-16 pb-8 min-h-screen flex flex-col">
      <EventsHeader />
      <EventsStats />
      {children}
    </div>
  );
}
