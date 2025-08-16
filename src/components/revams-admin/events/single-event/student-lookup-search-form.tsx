"use client";

import { Input } from "@/components/ui/input";
import { useSingleEventParams } from "@/lib/hooks/single-event-params";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useRef, useState } from "react";

export default function SearchForm() {
  const { studentId, setStudentId, isPending } = useSingleEventParams();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState(studentId || "");
  const [oldSearchValue, setOldSearchValue] = useState(studentId || "");

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
    setStudentId(searchValue || null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchValue("");
    setOldSearchValue("");
    setStudentId(null);
  };

  return (
    <div role="searchbox" className="relative mb-6">
      <Input
        id="search"
        ref={searchInputRef}
        type="text"
        value={searchValue}
        onChange={handleSearchChange}
        onBlur={handleSearchBlur}
        onKeyDown={handleSearchKeyDown}
        placeholder={`${new Date().getFullYear().toString().slice(2)}-1-#####`}
        className="w-full h-10 px-9 font-mono tracking-wide"
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
