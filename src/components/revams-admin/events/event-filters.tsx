"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Search,
  FilterIcon,
  Plus,
  X,
  RefreshCwIcon,
  Check,
  ArrowUpAZ,
  ArrowDownAZ,
  ChevronUp,
  ChevronDown,
  SortAscIcon,
  SortDescIcon,
} from "lucide-react";
import Link from "next/link";
import { ValidatedSearchParams } from "@/app/admin/events/page";
import { GetSemestersDataSuccess } from "@/lib/requests/semesters/get-many";
import { getSemesters } from "@/actions/semesters";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { FilterGroup } from "./event-filter-group";
import React from "react";

interface StatusOption {
  value: "active" | "inactive";
  label: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

interface SortOption {
  key: string;
  label: string;
  icon: (order: string) => React.ReactNode;
}

const SORT_OPTIONS: SortOption[] = [
  {
    key: "name",
    label: "Name",
    icon: (order: string) =>
      order === "asc" ? (
        <ArrowUpAZ size={14} className="mr-1.5" />
      ) : (
        <ArrowDownAZ size={14} className="mr-1.5" />
      ),
  },
  {
    key: "date",
    label: "Date",
    icon: (order: string) =>
      order === "asc" ? (
        <ChevronUp size={14} className="mr-1.5" />
      ) : (
        <ChevronDown size={14} className="mr-1.5" />
      ),
  },
];

interface OrderOption {
  value: "asc" | "desc";
  label: string;
}

const ORDER_OPTIONS: OrderOption[] = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

export default function EventsFilters({
  params,
}: {
  params: ValidatedSearchParams;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [origin, setOrigin] = useState<string>("");
  const [semesters, setSemesters] = useState<
    GetSemestersDataSuccess["semesters"]
  >([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Initial filters from URL params
  const [activeFilters, setActiveFilters] = useState({
    status: params.status || "",
    semesterId: params.semester_id || "",
  });

  // Draft filters that will be applied on "Done"
  const [draftFilters, setDraftFilters] = useState({
    status: params.status || "",
    semesterId: params.semester_id || "",
  });

  // Sort state
  const [activeSort, setActiveSort] = useState({
    sort: params.sort || "date",
    order: params.order || "desc",
  });

  // Draft sort that will be applied on "Apply"
  const [draftSort, setDraftSort] = useState({
    sort: params.sort || "date",
    order: params.order || "desc",
  });

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;
  const draftFilterCount = Object.values(draftFilters).filter(Boolean).length;

  // Calculate the sort label
  const getSortButtonLabel = () => {
    const sortOption = SORT_OPTIONS.find(
      option => option.key === activeSort.sort
    );
    if (!sortOption) return "Sort";

    return `Sort: ${sortOption.label}`;
  };

  useEffect(() => {
    setOrigin(window.location.origin);

    const fetchSemesters = async () => {
      const data = await getSemesters();
      setSemesters(data);
    };

    fetchSemesters();
  }, []);

  useEffect(() => {
    // Update active filters when URL params change
    const newFilters = {
      status: params.status || "",
      semesterId: params.semester_id || "",
    };
    setActiveFilters(newFilters);
    setDraftFilters(newFilters); // Reset draft filters too

    // Update active sort
    setActiveSort({
      sort: params.sort || "date",
      order: params.order || "desc",
    });
    setDraftSort({
      sort: params.sort || "date",
      order: params.order || "desc",
    });
  }, [params]);

  // When filter popover opens, initialize draft filters with current active filters
  useEffect(() => {
    if (isFilterOpen) {
      setDraftFilters({ ...activeFilters });
    }
  }, [isFilterOpen, activeFilters]);

  // When sort popover opens, initialize draft sort with current active sort
  useEffect(() => {
    if (isSortOpen) {
      setDraftSort({ ...activeSort });
    }
  }, [isSortOpen, activeSort]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState(
    params.search ? decodeURIComponent(params.search) : ""
  );
  const [oldSearchValue, setOldSearchValue] = useState(() => {
    return params.search ? decodeURIComponent(params.search) : "";
  });

  // Update a single draft filter
  const updateDraftFilter = (key: string, value: string) => {
    setDraftFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Apply all draft filters when Done is clicked
  const applyFilters = () => {
    // Create a new URL with current origin and pathname
    const url = new URL(`${origin}/admin/events`);

    // Add all params except filters that will be updated
    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== undefined &&
        key !== "status" &&
        key !== "semester_id" &&
        key !== "page"
      ) {
        url.searchParams.append(key, String(value));
      }
    });

    // Add draft filters
    if (draftFilters.status) {
      url.searchParams.append("status", draftFilters.status);
    }

    if (draftFilters.semesterId) {
      url.searchParams.append("semester_id", draftFilters.semesterId);
    }

    // Reset to page 1 when applying filters
    url.searchParams.append("page", "1");

    // Apply filters
    router.push(url.toString());
    setIsFilterOpen(false);
  };

  // Clear all draft filters
  const clearDraftFilters = () => {
    setDraftFilters({
      status: "",
      semesterId: "",
    });
  };

  // Apply sort when Done is clicked
  const applySort = () => {
    const url = new URL(`${origin}/admin/events`);

    // Add all existing params except sort params
    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== undefined &&
        key !== "sort" &&
        key !== "order" &&
        key !== "page"
      ) {
        url.searchParams.append(key, String(value));
      }
    });

    // Add sort params
    url.searchParams.append("sort", draftSort.sort);
    url.searchParams.append("order", draftSort.order);

    // Reset to page 1 when sorting
    url.searchParams.append("page", "1");

    // Apply sort
    router.push(url.toString());
    setIsSortOpen(false);
  };

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
          onBlur={e => {
            const { value: currentValue } = e.target;
            if (oldSearchValue === currentValue) {
              return;
            }
            setOldSearchValue(currentValue);

            const url = new URL(`${origin}/admin/events`);
            Object.entries(params).forEach(([key, value]) => {
              if (value !== undefined && key !== "search") {
                url.searchParams.append(key, String(value));
              }
            });
            if (currentValue) {
              url.searchParams.append(
                "search",
                encodeURIComponent(currentValue)
              );
            }
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
        {/* Filter Popover */}
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 min-w-[17%] relative"
            >
              <FilterIcon size={16} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <Badge
                  variant="default"
                  className="ml-1 px-1.5 min-w-5 h-5 text-xs flex items-center justify-center rounded-full"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Button
                  variant="link"
                  className={`text-sm ${
                    draftFilterCount === 0
                      ? "opacity-50 pointer-events-none font-normal text-muted-foreground"
                      : "text-foreground"
                  }`}
                  onClick={clearDraftFilters}
                >
                  Clear all
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {draftFilterCount > 0
                  ? `${draftFilterCount} filter${
                      draftFilterCount > 1 ? "s" : ""
                    } selected`
                  : "No filters selected"}
              </p>
            </div>

            {/* Filter Groups */}
            <div className="divide-y">
              {/* Status Filter Group */}
              <FilterGroup
                title="Status"
                activeFilter={draftFilters.status}
                badgeCount={draftFilters.status ? 1 : 0}
              >
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {STATUS_OPTIONS.map(option => (
                    <div
                      key={option.value}
                      className={`
                        inline-flex items-center px-3 py-1.5 rounded-md text-sm cursor-pointer
                        ${
                          draftFilters.status === option.value
                            ? "bg-primary/10 text-primary font-medium"
                            : "bg-background hover:bg-accent text-foreground"
                        }
                      `}
                      onClick={() => updateDraftFilter("status", option.value)}
                    >
                      <span className="capitalize">{option.label}</span>
                      {draftFilters.status === option.value && (
                        <Check size={14} className="ml-1 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              </FilterGroup>

              {/* Semester Filter Group */}
              <FilterGroup
                title="Semester"
                activeFilter={draftFilters.semesterId}
                badgeCount={draftFilters.semesterId ? 1 : 0}
              >
                <div className="mt-2 max-h-48 overflow-y-auto pr-1">
                  {semesters.length > 0 ? (
                    <div className="space-y-1">
                      {semesters.map(semester => (
                        <div
                          key={semester.id}
                          className={`
                            flex justify-between items-center w-full px-3 py-1.5 rounded-md text-sm cursor-pointer
                            ${
                              draftFilters.semesterId === semester.id.toString()
                                ? "bg-primary/10 text-primary font-medium"
                                : "bg-background hover:bg-accent text-foreground"
                            }
                          `}
                          onClick={() =>
                            updateDraftFilter(
                              "semesterId",
                              semester.id.toString()
                            )
                          }
                        >
                          <span className="capitalize">
                            {semester.name || ""}
                          </span>
                          {draftFilters.semesterId ===
                            semester.id.toString() && (
                            <Check size={14} className="ml-1 text-primary" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No semesters found
                    </p>
                  )}
                </div>
              </FilterGroup>
            </div>

            {/* Footer Actions */}
            <div className="p-3 bg-muted/20 flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={applyFilters}
                disabled={
                  JSON.stringify(draftFilters) === JSON.stringify(activeFilters)
                }
              >
                Apply Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Sort Popover */}
        <Popover open={isSortOpen} onOpenChange={setIsSortOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              {activeSort.order === "asc" && <SortAscIcon />}
              {activeSort.order === "desc" && <SortDescIcon />}
              <span>{getSortButtonLabel()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="start">
            {/* Header */}
            <div className="p-4 border-b">
              <h3 className="font-semibold text-lg">Sort By</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Choose a field and direction to sort events
              </p>
            </div>

            {/* Sort field selection */}
            <div className="p-4 border-b">
              <h4 className="font-medium text-sm mb-2">Field</h4>
              <div className="space-y-1">
                {SORT_OPTIONS.map(option => (
                  <div
                    key={option.key}
                    className={`
                      flex items-center px-3 py-2 rounded-md text-sm cursor-pointer
                      ${
                        draftSort.sort === option.key
                          ? "bg-primary/10 text-primary font-medium"
                          : "bg-background hover:bg-accent text-foreground"
                      }
                    `}
                    onClick={() =>
                      setDraftSort(prev => ({ ...prev, sort: option.key }))
                    }
                  >
                    {option.icon(draftSort.order)}
                    <span>{option.label}</span>
                    {draftSort.sort === option.key && (
                      <Check size={14} className="ml-auto text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sort direction selection */}
            <div className="p-4">
              <h4 className="font-medium text-sm mb-2">Direction</h4>
              <div className="space-y-1">
                {ORDER_OPTIONS.map(option => (
                  <div
                    key={option.value}
                    className={`
                      flex items-center px-3 py-2 rounded-md text-sm cursor-pointer
                      ${
                        draftSort.order === option.value
                          ? "bg-primary/10 text-primary font-medium"
                          : "bg-background hover:bg-accent text-foreground"
                      }
                    `}
                    onClick={() =>
                      setDraftSort(prev => ({
                        ...prev,
                        order: option.value,
                      }))
                    }
                  >
                    <span className="capitalize">{option.label}</span>
                    {draftSort.order === option.value && (
                      <Check size={14} className="ml-auto text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-3 bg-muted/20 flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSortOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={applySort}
                disabled={
                  JSON.stringify(draftSort) === JSON.stringify(activeSort)
                }
              >
                Apply Sort
              </Button>
            </div>
          </PopoverContent>
        </Popover>
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
