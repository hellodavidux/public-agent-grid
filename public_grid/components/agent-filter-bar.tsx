"use client";

import { Search, ArrowDownIcon, ArrowUpIcon, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const ORG_TAGS = [
  { id: "chat-assistants", label: "Chat Assistants" },
  { id: "automation", label: "Automation" },
  { id: "engineering", label: "Engineering" },
  { id: "analytics", label: "Analytics" },
  { id: "customer-success", label: "Customer Success" },
] as const;

const SORT_OPTIONS = [
  { value: "most-runs", label: "Most Used" },
  { value: "last-updated", label: "Last Updated" },
  { value: "last-created", label: "Recently Created" },
  { value: "name", label: "Name" },
];

interface AgentFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  selectedTagId?: string | null;
  onTagSelect?: (tagId: string | null) => void;
  // kept for API compat, unused visually
  integrationFilter?: string;
  onIntegrationFilterChange?: (filter: string) => void;
  interfaceFilter?: string;
  onInterfaceFilterChange?: (filter: string) => void;
  selectedCategory?: string;
}

export function AgentFilterBar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortByChange,
  selectedTagId = null,
  onTagSelect,
  selectedCategory,
}: AgentFilterBarProps) {
  const currentSort = SORT_OPTIONS.find((o) => o.value === sortBy) ?? SORT_OPTIONS[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Controls row */}
      <div className="flex gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-8 w-full border-border pl-9 shadow-sm"
          />
        </div>

        {/* Sort dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm shadow-sm hover:bg-accent"
            >
              <span>{currentSort.label}</span>
              <ArrowDownIcon className="size-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {SORT_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className="flex items-center justify-between gap-4"
                onClick={() => onSortByChange(option.value)}
              >
                <span>{option.label}</span>
                {option.value === sortBy && <ArrowDownIcon className="size-3.5 text-muted-foreground" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter button */}
        <button
          type="button"
          className="relative flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm shadow-sm hover:bg-accent"
        >
          <SlidersHorizontal className="size-3.5" />
          <span>Filter</span>
          {selectedCategory === "automations" && (
            <span className="absolute -right-1 -top-1 flex size-2.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
          )}
        </button>
      </div>

      {/* Label filter badges */}
      {selectedCategory === "all" && (
        <div className="flex flex-wrap items-center gap-2">
          {ORG_TAGS.map((tag) => {
            const isSelected = selectedTagId === tag.id;
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => onTagSelect?.(isSelected ? null : tag.id)}
                className={cn(
                  "cursor-pointer select-none rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                    : "bg-muted hover:bg-primary/10 hover:text-primary hover:shadow-sm",
                )}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
