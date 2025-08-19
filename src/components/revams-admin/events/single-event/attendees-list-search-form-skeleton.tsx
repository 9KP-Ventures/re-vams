"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export default function AttendeesListSearchFormSkeleton() {
  return (
    <div role="search" className="relative">
      <Input
        type="text"
        placeholder="Search attendee..."
        className="w-full h-12 pl-10 pr-44"
        disabled={true}
      />
      <span
        className={cn(
          "text-muted-foreground cursor-default",
          "absolute left-3 top-1/2 transform -translate-y-1/2"
        )}
      >
        <Search size={18} />
      </span>
    </div>
  );
}
