"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Search,
  FilterIcon,
  ArrowUpDown,
  Plus,
  X,
  RefreshCwIcon,
} from "lucide-react";
import Link from "next/link";
import { ValidatedSearchParams } from "@/app/admin/events/page";

export default function EventsFilters({
  params,
}: {
  params: ValidatedSearchParams;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [origin, setOrigin] = useState<string>("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState(params.search || "");

  return (
    <div className="grid grid-cols-3 gap-12 mb-14">
      <div className="relative flex-1">
        <Label htmlFor="search" className="sr-only">
          Search events
        </Label>
        <Input
          id="search"
          ref={searchInputRef}
          type="text"
          value={searchValue} // Always a string, never undefined
          onChange={e => setSearchValue(e.target.value)}
          placeholder="Search events..."
          className="w-full h-10 px-9"
          onBlur={() => {
            const url = new URL(`${origin}/admin/events`);
            Object.entries(params).forEach(([key, value]) => {
              if (value !== undefined) {
                url.searchParams.append(key, String(value));
              }
            });
            url.searchParams.append("search", encodeURIComponent(searchValue));
            router.push(url.toString());
          }}
          onKeyDown={e => {
            if (e.key === "Enter") {
              searchInputRef.current?.blur();
            }
          }}
        />
        <span className="cursor-pointer absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search size={18} />
        </span>
        {searchValue.length > 0 && (
          <Link
            role="button"
            aria-label="Clear search"
            className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2"
            href={pathname}
            onClick={() => {
              setSearchValue("");
            }}
          >
            <X size={18} />
          </Link>
        )}
      </div>
      <div className="flex gap-5">
        <Button
          asChild
          size="lg"
          variant="outline"
          className="flex items-center gap-2 min-w-[17%]"
        >
          <Link
            href={{
              pathname,
              query: {
                ...params,
                status: "active",
              },
            }}
          >
            <FilterIcon size={16} />
            Filter
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="flex items-center gap-2"
        >
          <Link
            href={{
              pathname,
              query: {
                ...params,
                sort: "name",
                order: params.order === "asc" ? "desc" : "asc",
              },
            }}
          >
            <ArrowUpDown size={16} />
            {params.sort === "name"
              ? params.order === "asc"
                ? "Name (A-Z)"
                : "Name (Z-A)"
              : "Sort by Name"}
          </Link>
        </Button>
      </div>
      <div className="w-full flex gap-5 justify-end">
        <Button asChild size="lg" variant="outline" className="w-fit">
          <Link href="/admin/events?" className="flex items-center gap-2">
            <RefreshCwIcon size={16} />
            Refresh
          </Link>
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="flex items-center gap-2 w-fit"
        >
          <Plus size={16} />
          Create
        </Button>
      </div>
    </div>
  );
}
