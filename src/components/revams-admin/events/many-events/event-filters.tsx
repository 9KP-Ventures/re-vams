"use client";

import { useRef, useState, useEffect } from "react";
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
import {
  GetSemestersDataError,
  GetSemestersDataSuccess,
} from "@/lib/requests/semesters/get-many";
import { getSemesters } from "@/actions/semesters";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { FilterGroup } from "../../../ui/filter-group";
import React from "react";
import { useRouter } from "next/navigation";
import { useEventsParams } from "@/lib/hooks/event-params";
import {
  GetEventsStatusType,
  GetEventsSortType,
  GetEventsOrderType,
} from "@/lib/requests/events/get-many";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface StatusOption {
  value: GetEventsStatusType;
  label: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "on_going", label: "On Going" },
  { value: "completed", label: "Completed" },
];

interface SortOption {
  key: GetEventsSortType;
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
  value: GetEventsOrderType;
  label: string;
}

const ORDER_OPTIONS: OrderOption[] = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

export default function EventsFilters() {
  const router = useRouter();

  const {
    search,
    setSearch,
    status,
    setStatus,
    semesterId,
    setSemesterId,
    sort,
    order,
    setSortWithOrder,
    isPending,
  } = useEventsParams();

  // Component state
  const [semesters, setSemesters] = useState<
    GetSemestersDataSuccess["semesters"]
  >([]);
  const [semestersError, setSemestersError] = useState<
    GetSemestersDataError["error"] | null
  >(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Local state for search input
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState(search || "");
  const [oldSearchValue, setOldSearchValue] = useState(search || "");

  // Draft states for filters and sort
  const [draftFilters, setDraftFilters] = useState({
    status: status,
    semesterId: semesterId,
  });

  const [draftSort, setDraftSort] = useState({
    sort: sort || "date",
    order: order || "desc",
  });

  // Effect to load semesters
  useEffect(() => {
    const fetchSemesters = async () => {
      const data = await getSemesters();

      if ("error" in data) {
        setSemestersError(data.error);
        setSemesters([]);
        return;
      }

      setSemesters(data.semesters);
    };

    fetchSemesters();
  }, []);

  useEffect(() => {
    if (semestersError) {
      toast.error(`Semesters data error: ${semestersError.code}`, {
        description: semestersError.message,
      });
    }
  }, [semestersError]);

  // Effect to update draft states when URL params change
  useEffect(() => {
    // Update draft filters
    setDraftFilters({
      status: status,
      semesterId: semesterId || null,
    });

    // Update draft sort
    setDraftSort({
      sort: sort || "date",
      order: order || "desc",
    });

    // Update search value
    setSearchValue(search || "");
    setOldSearchValue(search || "");
  }, [search, status, semesterId, sort, order]);

  // When filter popover opens, initialize draft filters with current values
  useEffect(() => {
    if (isFilterOpen) {
      setDraftFilters({
        status: status,
        semesterId: semesterId || null,
      });
    }
  }, [isFilterOpen, status, semesterId]);

  // When sort popover opens, initialize draft sort with current values
  useEffect(() => {
    if (isSortOpen) {
      setDraftSort({
        sort: sort || "date",
        order: order || "desc",
      });
    }
  }, [isSortOpen, sort, order]);

  // Calculate counts and labels
  const activeFilterCount = [status, semesterId].filter(Boolean).length;
  const draftFilterCount = Object.values(draftFilters).filter(Boolean).length;

  // Calculate the sort label
  const getSortButtonLabel = () => {
    const sortOption = SORT_OPTIONS.find(option => option.key === sort);
    if (!sortOption) return "Sort";
    return `Sort: ${sortOption.label}`;
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // Handle search input blur
  const handleSearchBlur = () => {
    if (oldSearchValue === searchValue) {
      return;
    }

    setOldSearchValue(searchValue);
    setSearch(searchValue || null);
  };

  // Handle search input keydown
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchInputRef.current?.blur();
    }
  };

  // Handle search clear
  const handleSearchClear = () => {
    setSearchValue("");
    setOldSearchValue("");
    setSearch(null);
  };

  // Update a single draft filter
  const updateDraftFilter = (key: string, value: string) => {
    setDraftFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Apply all draft filters
  const applyFilters = () => {
    setStatus(draftFilters.status);
    setSemesterId(draftFilters.semesterId);
    setIsFilterOpen(false);
  };

  // Clear all draft filters
  const clearDraftFilters = () => {
    setDraftFilters({
      status: null,
      semesterId: null,
    });
  };

  // Apply sort
  const applySort = () => {
    setSortWithOrder(draftSort.sort, draftSort.order as "asc" | "desc");
    setIsSortOpen(false);
  };

  // Handle refresh
  const handleRefresh = () => {
    router.replace("/admin/events");
  };

  // Check if filter drafts have changed
  const hasFilterChanges =
    draftFilters.status !== (status || "") ||
    draftFilters.semesterId !== (semesterId || "");

  // Check if sort drafts have changed
  const hasSortChanges =
    draftSort.sort !== (sort || "date") ||
    draftSort.order !== (order || "desc");

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-rows-3 md:grid-rows-2 lg:grid-rows-1 gap-x-12 gap-y-3 mb-14">
      <div className="relative flex-1 col-span-2 lg:col-span-1 w-full md:w-[80%] lg:w-full">
        <Label htmlFor="search" className="sr-only">
          Search events
        </Label>
        <Input
          id="search"
          ref={searchInputRef}
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          onBlur={handleSearchBlur}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search events..."
          className="w-full h-10 px-9"
          disabled={isPending}
        />
        <span
          className={cn(
            isPending
              ? "text-muted-foreground cursor-default"
              : "text-primary cursor-pointer",
            "absolute left-3 top-1/2 transform -translate-y-1/2"
          )}
        >
          <Search size={18} />
        </span>
        {searchValue.length > 0 && (
          <button
            type="button"
            aria-label="Clear search"
            className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={handleSearchClear}
            disabled={isPending}
          >
            <X size={18} />
          </button>
        )}
      </div>
      <div className="flex gap-5 row-start-2 lg:row-start-1 col-start-1 lg:col-start-2">
        {/* Filter Popover */}
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild disabled={isPending}>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center w-28 relative"
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
            <div className="px-4 pb-2 py-2 sm:py-4 border-b">
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
              <p className="text-sm text-muted-foreground">
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
                              draftFilters.semesterId === semester.id
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
                          {draftFilters.semesterId === semester.id && (
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
            <div className="px-4 pt-2 pb-2 sm:pb-4 bg-muted/20 flex justify-between">
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
                disabled={!hasFilterChanges}
              >
                Apply Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Sort Popover */}
        <Popover open={isSortOpen} onOpenChange={setIsSortOpen}>
          <PopoverTrigger asChild disabled={isPending}>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              {(order || "desc") === "asc" ? <SortAscIcon /> : <SortDescIcon />}
              <span>{getSortButtonLabel()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0 mr-4" align="start">
            {/* Header */}
            <div className="px-4 pb-2 py-2 sm:py-4 border-b">
              <h3 className="font-semibold text-lg">Sort By</h3>
              <p className="text-sm text-muted-foreground">
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
            <div className="px-4 pb-2 sm:pb-4 bg-muted/20 flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSortOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={applySort} disabled={!hasSortChanges}>
                Apply Sort
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-full flex gap-5 md:justify-end row-start-3 md:row-start-1 col-start-1 md:col-start-3">
        <Button
          onClick={handleRefresh}
          size="lg"
          variant="outline"
          className="w-28 flex items-center gap-2"
          disabled={isPending}
        >
          <RefreshCwIcon size={16} />
          Refresh
        </Button>
        <Button
          asChild
          size="lg"
          className="flex items-center gap-2"
          disabled={isPending}
        >
          <Link href="/admin/events/create">
            <Plus size={16} />
            Create
          </Link>
        </Button>
      </div>
    </div>
  );
}
