"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
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

export default function EventsFilters({
  initialSortBy,
  initialSortOrder,
  initialSearch,
}: {
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
  initialSearch?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchValue, setSearchValue] = useState(initialSearch || "");
  const [sortBy, setSortBy] = useState(initialSortBy || "name");
  const [sortOrder, setSortOrder] = useState(initialSortOrder || "desc");

  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearchValue(initialSearch || "");
    }
    if (initialSortBy !== undefined) {
      setSortBy(initialSortBy || "name");
    }
    if (initialSortOrder !== undefined) {
      setSortOrder(initialSortOrder || "desc");
    }
  }, [initialSearch, initialSortBy, initialSortOrder]);

  const updateFilter = useCallback(
    (filterName: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(filterName, value);
      // Reset to page 1 when applying a new filter
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const updateSort = useCallback(
    (sortBy: string, order: "asc" | "desc") => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sort", sortBy);
      params.set("order", order);
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

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
          onBlur={() => updateFilter("search", searchValue)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              updateFilter("search", searchValue);
              searchInputRef.current?.blur();
            }
          }}
        />
        <span className="cursor-pointer absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search size={18} />
        </span>
        {searchValue.length > 0 && (
          <span
            role="button"
            aria-label="Clear search"
            className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={() => {
              setSearchValue("");
              updateFilter("search", "");
            }}
          >
            <X size={18} />
          </span>
        )}
      </div>
      <div className="flex gap-5">
        <Button
          size="lg"
          variant="outline"
          onClick={() => updateFilter("active", "true")}
          className="flex items-center gap-2 min-w-[17%]"
        >
          <FilterIcon size={16} />
          Filter
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() =>
            updateSort("name", sortOrder === "asc" ? "desc" : "asc")
          }
          className="flex items-center gap-2"
        >
          <ArrowUpDown size={16} />
          {sortBy === "name"
            ? sortOrder === "asc"
              ? "Name (A-Z)"
              : "Name (Z-A)"
            : "Sort by Name"}
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
