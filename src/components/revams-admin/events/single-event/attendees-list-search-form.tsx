"use client";

import { Input } from "@/components/ui/input";
import { useAttendeesListParams } from "@/lib/hooks/attendees-list-params";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useRef, useState } from "react";

export default function AttendeesListSearchForm() {
  const { search, setSearch, isPending } = useAttendeesListParams();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState(search || "");
  const [oldSearchValue, setOldSearchValue] = useState(search || "");

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchInputRef.current?.blur();
    }
  };

  const handleSearchBlur = () => {
    if (oldSearchValue === searchValue) {
      return;
    }

    setOldSearchValue(searchValue);
    setSearch(searchValue || null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchValue("");
    setOldSearchValue("");
    setSearch(null);
  };

  return (
    <div role="search" className="relative">
      <Input
        id="search"
        ref={searchInputRef}
        type="text"
        value={searchValue}
        onChange={handleSearchChange}
        onBlur={handleSearchBlur}
        onKeyDown={handleSearchKeyDown}
        placeholder="Search attendee..."
        className="w-full text-sm md:text-base h-12 pl-10 pr-22 md:pr-44"
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
  );
}
