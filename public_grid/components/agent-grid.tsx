"use client";

import { useState } from "react"

import { AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { Avatar } from "@/components/ui/avatar";
import { AgentCard } from "@/components/agent-card";
import { AgentFilterBar } from "@/components/agent-filter-bar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Star } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string;
  category: string[];
  authorName?: string;
  createdDate?: string;
  lastUpdatedDate?: string;
  integrations?: string[];
  labels?: string[];
  interfaceType?: "Form" | "Batch" | "Chat";
  runsCount?: number;
}

interface AgentSection {
  id: string;
  title: string;
  agents: Agent[];
  showStar?: boolean;
}

interface AgentGridProps {
  sections: AgentSection[];
  toolSearchQuery: string;
  onToolSearchChange: (query: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  integrationFilter: string;
  onIntegrationFilterChange: (filter: string) => void;
  interfaceFilter: string;
  onInterfaceFilterChange: (filter: string) => void;
  selectedCategory: string;
  selectedTagId?: string | null;
  onTagSelect?: (tagId: string | null) => void;
  onSeeMoreCategory?: (categoryId: string) => void;
  onAgentClick?: (agent: Agent) => void;
  organisationName?: string;
}

export function AgentGrid({
  sections,
  toolSearchQuery,
  onToolSearchChange,
  sortBy,
  onSortByChange,
  integrationFilter,
  onIntegrationFilterChange,
  interfaceFilter,
  onInterfaceFilterChange,
  selectedCategory,
  selectedTagId,
  onTagSelect,
  onSeeMoreCategory,
  onAgentClick,
  organisationName = "Miro",
}: AgentGridProps) {
  const [yourAgentsTab, setYourAgentsTab] = useState<"saved" | "latest">("saved");
  const [favouritedSectionIds, setFavouritedSectionIds] = useState<Set<string>>(new Set());

  const toggleSectionFavourite = (sectionId: string) => {
    setFavouritedSectionIds((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  const filteredSections = sections
    .map((section) => ({
      ...section,
      agents: section.agents.filter(
        (agent) =>
          agent.name.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
          agent.description.toLowerCase().includes(toolSearchQuery.toLowerCase())
      ),
    }))
    .filter((section) => section.agents.length > 0);

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-muted/30">
      <header className="px-6 py-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">AI Agents</h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-md border border-border bg-transparent px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              <Users className="size-4" />
              Share
            </button>
            <Avatar className="size-8 cursor-pointer">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" alt="Profile" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <AgentFilterBar
          searchQuery={toolSearchQuery}
          onSearchChange={onToolSearchChange}
          sortBy={sortBy}
          onSortByChange={onSortByChange}
          integrationFilter={integrationFilter}
          onIntegrationFilterChange={onIntegrationFilterChange}
          interfaceFilter={interfaceFilter}
          onInterfaceFilterChange={onInterfaceFilterChange}
          selectedCategory={selectedCategory}
          selectedTagId={selectedTagId}
          onTagSelect={onTagSelect}
        />
      </header>

      <ScrollArea className="min-h-0 flex-1">
        <div className="p-6">
          {filteredSections.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
              <p className="text-sm">No agents found</p>
              <p className="text-xs">Try adjusting your search</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {/* Render sections based on selected category */}
              {filteredSections.map((section) => (
                <section key={section.id}>
                  <div className="mb-4 flex items-center gap-2">
                    {section.showStar && (
                      <button
                        type="button"
                        onClick={() => toggleSectionFavourite(section.id)}
                        className="flex items-center justify-center rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={favouritedSectionIds.has(section.id) ? "Unfavourite" : "Favourite"}
                      >
                        <Star
                          className={`size-4 shrink-0 transition-colors ${
                            favouritedSectionIds.has(section.id)
                              ? "fill-muted-foreground text-muted-foreground"
                              : "fill-none text-muted-foreground hover:text-foreground"
                          }`}
                        />
                      </button>
                    )}
                    <h2 className="text-sm font-semibold text-foreground">
                      {section.title}
                    </h2>
                    <span className="flex size-5 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                      {section.agents.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {section.agents.map((agent) => (
                      <AgentCard
                        key={agent.id}
                        name={agent.name}
                        description={agent.description}
                        onStart={() => onAgentClick?.(agent)}
                        authorName={agent.authorName}
                        createdDate={agent.createdDate}
                        lastUpdatedDate={agent.lastUpdatedDate}
                        integrations={agent.integrations}
                        labels={agent.labels}
                        interfaceType={agent.interfaceType}
                        runsCount={agent.runsCount}
                      />
                    ))}
                  </div>
                  {onSeeMoreCategory && section.id !== "saved-agents" && section.id !== "latest-used" && (
                    <div className="mt-3 flex justify-center">
                      <button
                        type="button"
                        onClick={() => onSeeMoreCategory(section.id)}
                        className="text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                      >
                        See more
                      </button>
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </main>
  );
}
