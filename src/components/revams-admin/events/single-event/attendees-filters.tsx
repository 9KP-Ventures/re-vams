import { getPrograms } from "@/actions/programs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAttendeesListParams } from "@/lib/hooks/attendees-list-params";
import {
  GetSlotAttendeesOrderType,
  GetSlotAttendeesSortType,
} from "@/lib/requests/events/attendance-slots/attendees/get-many";
import {
  GetProgramsDataError,
  GetProgramsDataSuccess,
} from "@/lib/requests/programs/get";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Check,
  ChevronDown,
  ChevronUp,
  FilterIcon,
  SortAscIcon,
  SortDescIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FilterGroup } from "../../../ui/filter-group";
import {
  GetYearLevelsDataError,
  GetYearLevelsDataSuccess,
} from "@/lib/requests/year-levels/get";
import { getYearLevels } from "@/actions/year-levels";
import { toast } from "sonner";

interface SortOption {
  key: GetSlotAttendeesSortType;
  label: string;
  icon: (order: string) => React.ReactNode;
}

const SORT_OPTIONS: SortOption[] = [
  {
    key: "last_name",
    label: "Last Name",
    icon: order =>
      order === "asc" ? (
        <ArrowUpAZ size={14} className="mr-1.5" />
      ) : (
        <ArrowDownAZ size={14} className="mr-1.5" />
      ),
  },
  {
    key: "first_name",
    label: "First Name",
    icon: order =>
      order === "asc" ? (
        <ArrowUpAZ size={14} className="mr-1.5" />
      ) : (
        <ArrowDownAZ size={14} className="mr-1.5" />
      ),
  },
  {
    key: "recorded_time",
    label: "Time Attended",
    icon: order =>
      order === "asc" ? (
        <ChevronUp size={14} className="mr-1.5" />
      ) : (
        <ChevronDown size={14} className="mr-1.5" />
      ),
  },
];

interface OrderOption {
  value: GetSlotAttendeesOrderType;
  label: string;
}

const ORDER_OPTIONS: OrderOption[] = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

export default function AttendeesFilters() {
  const {
    programId,
    setProgramId,
    yearLevelId,
    setYearLevelId,
    sort,
    setSortWithOrder,
    order,
    isPending,
  } = useAttendeesListParams();

  const [programs, setPrograms] = useState<GetProgramsDataSuccess["programs"]>(
    []
  );
  const [programsError, setProgramsError] = useState<
    GetProgramsDataError["error"] | null
  >(null);

  const [yearLevels, setYearLevels] = useState<
    GetYearLevelsDataSuccess["year_levels"]
  >([]);
  const [yearLevelsError, setYearLevelsError] = useState<
    GetYearLevelsDataError["error"] | null
  >(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Draft states for filters and sort
  const [draftFilters, setDraftFilters] = useState({
    programId: programId,
    yearLevelId: yearLevelId,
  });

  const [draftSort, setDraftSort] = useState({
    sort: sort || "recorded_time",
    order: order || "asc",
  });

  const [isMounted, setIsMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024); // Default to desktop size

  useEffect(() => {
    if (programsError) {
      toast.error(`Programs data error: ${programsError.code}`, {
        description: programsError.message,
      });
    }
    if (yearLevelsError) {
      toast.error(`Year levels data error: ${yearLevelsError.code}`, {
        description: yearLevelsError.message,
      });
    }
  }, [programsError, yearLevelsError]);

  // Only run this effect on the client
  useEffect(() => {
    setIsMounted(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Effect to load programs and year levels
  useEffect(() => {
    const fetchPrograms = async () => {
      const data = await getPrograms();

      if ("error" in data) {
        setProgramsError(data.error);
        setPrograms([]);
        return;
      }

      setPrograms(data.programs);
      setProgramsError(null);
    };

    const fetchYearLevels = async () => {
      const data = await getYearLevels();

      if ("error" in data) {
        setYearLevelsError(data.error);
        setYearLevels([]);
        return;
      }

      setYearLevels(data.year_levels);
      setYearLevelsError(null);
    };

    fetchPrograms();
    fetchYearLevels();
  }, []);

  // Effect to update draft states when URL params change
  useEffect(() => {
    // Update draft filters
    setDraftFilters({
      programId: programId || null,
      yearLevelId: yearLevelId || null,
    });

    // Update draft sort
    setDraftSort({
      sort: sort || "recorded_time",
      order: order || "asc",
    });
  }, [programId, yearLevelId, sort, order]);

  // When filter popover opens, initialize draft filters with current values
  useEffect(() => {
    if (isFilterOpen) {
      setDraftFilters({
        programId: programId || null,
        yearLevelId: yearLevelId || null,
      });
    }
  }, [isFilterOpen, programId, yearLevelId]);

  // When sort popover opens, initialize draft sort with current values
  useEffect(() => {
    if (isSortOpen) {
      setDraftSort({
        sort: sort || "recorded_time",
        order: order || "asc",
      });
    }
  }, [isSortOpen, sort, order]);

  // Calculate counts and labels
  const activeFilterCount = [programId, yearLevelId].filter(Boolean).length;
  const draftFilterCount = Object.values(draftFilters).filter(Boolean).length;

  const getSortButtonLabel = () => {
    const sortOption = SORT_OPTIONS.find(option => option.key === sort);
    if (!sortOption) return "Sort";
    return `Sort: ${sortOption.label}`;
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
    setProgramId(draftFilters.programId);
    setYearLevelId(draftFilters.yearLevelId);
    setIsFilterOpen(false);
  };

  // Clear all draft filters
  const clearDraftFilters = () => {
    setDraftFilters({
      programId: null,
      yearLevelId: null,
    });
  };

  // Apply sort
  const applySort = () => {
    setSortWithOrder(draftSort.sort, draftSort.order as "asc" | "desc");
    setIsSortOpen(false);
  };

  // Check if filter drafts have changed
  const hasFilterChanges =
    draftFilters.programId !== (programId || "") ||
    draftFilters.yearLevelId !== (yearLevelId || "");

  // Check if sort drafts have changed
  const hasSortChanges =
    draftSort.sort !== (sort || "recorded_time") ||
    draftSort.order !== (order || "asc");

  return (
    <div className="flex gap-2">
      {/* Filter Popover */}
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-1.5"
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
        <PopoverContent
          className="w-[297px] md:w-[500px] p-0"
          align={isMounted && windowWidth < 768 ? "start" : "end"}
          side="bottom"
        >
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
          <div className="divide-y grid grid-cols-1 md:grid-cols-[1fr_0.5fr]">
            {/* Program Filter Group */}
            <FilterGroup
              title="Program"
              badgeCount={draftFilters.programId ? 1 : 0}
            >
              <div className="mt-2 max-h-36 md:max-h-48 overflow-y-auto pr-1">
                {programs.length > 0 ? (
                  <div className="space-y-1">
                    {programs.map(program => (
                      <div
                        key={program.id}
                        className={`
                            flex justify-between items-center w-full px-3 py-1.5 rounded-md text-sm cursor-pointer
                            ${
                              Number(draftFilters.programId) === program.id
                                ? "bg-primary/10 text-primary font-medium"
                                : "bg-background hover:bg-accent text-foreground"
                            }
                          `}
                        onClick={() =>
                          updateDraftFilter("programId", program.id.toString())
                        }
                      >
                        <span className="capitalize">{program.name || ""}</span>
                        {draftFilters.programId === program.id && (
                          <Check size={14} className="ml-1 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No programs found
                  </p>
                )}
              </div>
            </FilterGroup>

            {/* Year Level Filter Group */}
            <FilterGroup
              title="Year Level"
              badgeCount={draftFilters.yearLevelId ? 1 : 0}
            >
              <div className="mt-2 max-h-22 md:max-h-48 overflow-y-auto pr-1">
                {yearLevels.length > 0 ? (
                  <div className="space-y-1">
                    {yearLevels.map(yearLevel => (
                      <div
                        key={yearLevel.id}
                        className={`
                            flex justify-between items-center w-full px-3 py-1.5 rounded-md text-sm cursor-pointer
                            ${
                              Number(draftFilters.yearLevelId) === yearLevel.id
                                ? "bg-primary/10 text-primary font-medium"
                                : "bg-background hover:bg-accent text-foreground"
                            }
                          `}
                        onClick={() =>
                          updateDraftFilter(
                            "yearLevelId",
                            yearLevel.id.toString()
                          )
                        }
                      >
                        <span className="capitalize">
                          {yearLevel.name || ""}
                        </span>
                        {draftFilters.yearLevelId === yearLevel.id && (
                          <Check size={14} className="ml-1 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No year levels found
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
              Choose a field and direction to sort attendees
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
  );
}
