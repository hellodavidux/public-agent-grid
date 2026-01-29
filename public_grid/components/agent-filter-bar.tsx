"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Star } from "lucide-react";

export const ORG_TAGS = [
  { id: "engineering", label: "Engineering", starred: true },
  { id: "product", label: "Product", starred: false },
  { id: "operations", label: "Operations", starred: false },
  { id: "customer-success", label: "Customer Success", starred: false },
  { id: "web-scrapers", label: "Web Scrapers", starred: false },
  { id: "data-extractors", label: "Data Extractors", starred: false },
  { id: "document-processors", label: "Document Processors", starred: false },
  { id: "email-agents", label: "Email Agents", starred: false },
  { id: "chat-assistants", label: "Chat Assistants", starred: false },
  { id: "automation", label: "Automation", starred: false },
  { id: "analytics", label: "Analytics", starred: false },
  { id: "content-generation", label: "Content Generation", starred: false },
] as const;

interface AgentFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  integrationFilter: string;
  onIntegrationFilterChange: (filter: string) => void;
  interfaceFilter: string;
  onInterfaceFilterChange: (filter: string) => void;
  selectedCategory?: string;
  selectedTagId?: string | null;
  onTagSelect?: (tagId: string | null) => void;
}

const orgLabels = ORG_TAGS;

const sortOptions = [
  { value: "most-runs", label: "Most runs" },
  { value: "last-updated", label: "Last updated" },
  { value: "last-created", label: "Last created" },
  { value: "last-viewed", label: "Last viewed" },
  { value: "last-edited", label: "Last edited" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
];

const integrationOptions = [
  { value: "all", label: "All Integrations" },
  { value: "sharepoint", label: "SharePoint" },
  { value: "excel", label: "Excel" },
  { value: "word", label: "Word Docs" },
  { value: "google-drive", label: "Google Drive" },
  { value: "google-sheets", label: "Google Sheets" },
  { value: "slack", label: "Slack" },
  { value: "notion", label: "Notion" },
  { value: "salesforce", label: "Salesforce" },
  { value: "hubspot", label: "HubSpot" },
  { value: "zapier", label: "Zapier" },
];

const interfaceOptions = [
  { value: "all", label: "All Interfaces" },
  { value: "form", label: "Form" },
  { value: "batch", label: "Batch" },
  { value: "chat-assistant", label: "Chat Assistant" },
];

export function AgentFilterBar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortByChange,
  integrationFilter,
  onIntegrationFilterChange,
  interfaceFilter,
  onInterfaceFilterChange,
  selectedCategory,
  selectedTagId = null,
  onTagSelect,
}: AgentFilterBarProps) {
  const tagsScrollRef = useRef<HTMLDivElement>(null);

  const handleTagsWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = tagsScrollRef.current;
    if (!el || e.deltaY === 0) return;
    const canScrollLeft = el.scrollLeft > 0;
    const canScrollRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 1;
    if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Search and Filters Row */}
      <div className="flex w-full flex-col gap-2 md:flex-row md:items-center">
        {/* Search Input */}
        <div className="relative flex w-full items-center">
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-full rounded-md border border-input/90 bg-background pl-9 text-sm shadow-xs focus-visible:border-ring/50 focus-visible:ring-2 focus-visible:ring-ring/25"
          />
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          {/* Category Filter - only on All Agents tab */}
          {selectedCategory === "all" && (
            <Select
              value={selectedTagId ?? "all"}
              onValueChange={(v) => onTagSelect?.(v === "all" ? null : v)}
            >
              <SelectTrigger className="h-9 w-[140px] shrink-0 rounded-md border border-primary/20 bg-background text-sm shadow-sm">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {orgLabels.map((label) => (
                  <SelectItem key={label.id} value={label.id}>
                    {label.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {/* Integration Filter */}
          <Select value={integrationFilter} onValueChange={onIntegrationFilterChange}>
            <SelectTrigger className="h-9 w-[160px] shrink-0 rounded-md border border-primary/20 bg-background text-sm shadow-sm">
              <SelectValue placeholder="All Integrations" />
            </SelectTrigger>
            <SelectContent>
              {integrationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Interface Filter */}
          <Select value={interfaceFilter} onValueChange={onInterfaceFilterChange}>
            <SelectTrigger className="h-9 w-[150px] shrink-0 rounded-md border border-primary/20 bg-background text-sm shadow-sm">
              <SelectValue placeholder="All Interfaces" />
            </SelectTrigger>
            <SelectContent>
              {interfaceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort By Select */}
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="h-9 w-[140px] shrink-0 rounded-md border border-primary/20 bg-background text-sm shadow-sm">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Org Labels Row - Only show on All Agents tab, overflow to the right */}
      {selectedCategory === "all" && (
        <div
            ref={tagsScrollRef}
            onWheel={handleTagsWheel}
            className="w-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
          <div className="flex shrink-0 flex-nowrap items-center gap-2 py-0.5">
          {orgLabels.map((label) => {
            const isSelected = selectedTagId === label.id;
            return (
              <button
                key={label.id}
                type="button"
                onClick={() => onTagSelect?.(isSelected ? null : label.id)}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-muted text-foreground shadow-sm"
                    : "bg-muted text-foreground/85 hover:bg-muted/90 hover:text-foreground"
                }`}
              >
                {label.starred && <Star className="size-3 shrink-0 fill-muted-foreground text-muted-foreground" />}
                {label.label}
              </button>
            );
          })}
          </div>
        </div>
      )}
    </div>
  );
}
