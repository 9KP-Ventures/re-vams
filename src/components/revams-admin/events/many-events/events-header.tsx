import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function EventsHeader() {
  return (
    <>
      <h1 className="text-4xl font-extrabold text-primary dark:text-foreground mb-1">
        Events
      </h1>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="#">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Events</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
