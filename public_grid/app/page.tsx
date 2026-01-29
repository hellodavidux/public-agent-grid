"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AgentSidebar } from "@/components/agent-sidebar";
import { AgentGrid } from "@/components/agent-grid";
import { ORG_TAGS } from "@/components/agent-filter-bar";

const allAgents = [
  {
    id: "1",
    name: "Compliance Checker",
    description:
      "Automatically reviews LTV, DSCR, borrower history, and geographic flags. Validates compliance requirements and generates detailed audit reports.",
    category: ["recent", "favorites", "work", "all", "your-agents"],
    integrations: ["slack", "gmail", "figma"],
    labels: ["Compliance", "Finance", "Audit"],
    interfaceType: "Form" as const,
    authorName: "Alex Chen",
    createdDate: "Jan 15, 2025",
    lastUpdatedDate: "Jan 29, 2025",
    runsCount: 1247,
    runnersCount: 62,
  },
  {
    id: "2",
    name: "Document Verifier",
    description:
      "Detects forged files and fake borrower data with document-level AI analysis. Uses advanced ML to identify anomalies and inconsistencies.",
    category: ["recent", "favorites", "work", "all", "your-agents"],
    integrations: ["gmail", "connector", "excel"],
    labels: ["Security", "Analysis"],
    interfaceType: "Batch" as const,
    authorName: "Sam Rivera",
    createdDate: "Dec 3, 2024",
    lastUpdatedDate: "Jan 28, 2025",
    runsCount: 892,
    runnersCount: 45,
  },
  {
    id: "3",
    name: "Memo Generator",
    description:
      "Turns messy borrower data into polished investment memos and term sheets. Automates document generation with customizable templates.",
    category: ["favorites", "work", "all", "your-agents"],
    integrations: ["slack", "figma", "gmail"],
    labels: ["Documents", "Sales", "Templates", "Automation"],
    interfaceType: "Form" as const,
    authorName: "Jordan Lee",
    createdDate: "Nov 20, 2024",
    lastUpdatedDate: "Jan 27, 2025",
    runsCount: 2103,
    runnersCount: 105,
  },
  {
    id: "4",
    name: "File Scanner",
    description:
      "This agent scans closing folders, detects outdated or missing files. Ensures document completeness before deal finalization.",
    category: ["favorites", "work", "all", "your-agents"],
    integrations: ["connector", "gmail", "excel"],
    labels: ["Validation", "Ops", "Closing", "Checklist"],
    interfaceType: "Batch" as const,
    authorName: "Morgan Taylor",
    createdDate: "Jan 8, 2025",
    lastUpdatedDate: "Jan 29, 2025",
    runsCount: 456,
    runnersCount: 23,
  },
  {
    id: "5",
    name: "Campaign Writer",
    description:
      "Creates compelling marketing copy and campaigns tailored to your audience. Generates multi-channel content with brand voice consistency.",
    category: ["marketing", "all", "your-agents"],
    integrations: ["slack", "figma"],
    labels: ["Marketing", "Content", "Copy", "Campaigns", "Brand"],
    interfaceType: "Chat" as const,
    authorName: "Casey Kim",
    createdDate: "Dec 12, 2024",
    lastUpdatedDate: "Jan 26, 2025",
    runsCount: 1532,
    runnersCount: 77,
  },
  {
    id: "6",
    name: "Blog Generator",
    description:
      "Generates blog posts, social media content, and email newsletters. Optimizes content for engagement and SEO performance.",
    category: ["marketing", "all", "your-agents"],
    integrations: ["gmail", "slack"],
    labels: ["Content", "Social"],
    interfaceType: "Form" as const,
    authorName: "Riley Walsh",
    createdDate: "Jan 2, 2025",
    lastUpdatedDate: "Jan 25, 2025",
    runsCount: 678,
    runnersCount: 34,
  },
  {
    id: "7",
    name: "SEO Analyzer",
    description:
      "Analyzes and improves your content for better search engine rankings. Provides keyword suggestions and technical SEO recommendations.",
    category: ["marketing", "all", "your-agents"],
    integrations: ["connector", "excel"],
    labels: ["SEO", "Analytics"],
    interfaceType: "Batch" as const,
    authorName: "Quinn Davis",
    createdDate: "Dec 18, 2024",
    lastUpdatedDate: "Jan 24, 2025",
    runsCount: 321,
    runnersCount: 16,
  },
  {
    id: "8",
    name: "LinkedIn Scraper",
    description:
      "Identifies and qualifies potential leads from various data sources. Scrapes, finds leads, and sends personalized messages on LinkedIn.",
    category: ["sales", "all"],
    integrations: ["slack", "connector", "gmail"],
    labels: ["Scraping", "Sales", "LinkedIn", "Leads"],
    interfaceType: "Form" as const,
    authorName: "Jamie Foster",
    createdDate: "Nov 28, 2024",
    lastUpdatedDate: "Jan 23, 2025",
    runsCount: 2841,
    runnersCount: 142,
  },
  {
    id: "9",
    name: "Sales Forecaster",
    description:
      "Evaluates sales opportunities and provides win probability scores. Analyzes historical data to predict deal outcomes.",
    category: ["sales", "all"],
    integrations: ["gmail", "figma", "notion"],
    labels: ["Analytics", "Sales"],
    interfaceType: "Chat" as const,
    authorName: "Skyler Brooks",
    createdDate: "Jan 5, 2025",
    lastUpdatedDate: "Jan 22, 2025",
    runsCount: 1024,
    runnersCount: 51,
  },
  {
    id: "10",
    name: "Proposal Builder",
    description:
      "Generates customized sales pitches based on prospect profiles. Creates personalized presentations and proposal documents.",
    category: ["sales", "all"],
    integrations: ["slack", "gmail"],
    labels: ["Sales", "Docs"],
    interfaceType: "Form" as const,
    authorName: "Reese Morgan",
    createdDate: "Dec 22, 2024",
    lastUpdatedDate: "Jan 21, 2025",
    runsCount: 567,
    runnersCount: 28,
  },
  {
    id: "11",
    name: "Customer Support Bot",
    description:
      "Handles customer inquiries and provides instant, accurate responses. Uses knowledge base to resolve issues autonomously.",
    category: ["support", "all"],
    integrations: ["slack", "connector", "notion"],
    labels: ["Support", "Chat", "Helpdesk", "Knowledge base"],
    interfaceType: "Chat" as const,
    authorName: "Drew Hayes",
    createdDate: "Jan 10, 2025",
    lastUpdatedDate: "Jan 20, 2025",
    runsCount: 1893,
    runnersCount: 95,
  },
  {
    id: "12",
    name: "Ticket Router",
    description:
      "Automatically categorizes and prioritizes support tickets. Routes issues to appropriate teams based on urgency and type.",
    category: ["support", "all"],
    integrations: ["gmail", "slack", "notion"],
    labels: ["Support", "Ops"],
    interfaceType: "Batch" as const,
    authorName: "Parker Ellis",
    createdDate: "Dec 5, 2024",
    lastUpdatedDate: "Jan 19, 2025",
    runsCount: 734,
    runnersCount: 37,
  },
  {
    id: "13",
    name: "Ad Copy Optimizer",
    description:
      "A/B tests ad headlines and copy across channels. Suggests variants and tracks performance to improve conversion rates.",
    category: ["marketing", "all"],
    integrations: ["slack", "figma"],
    labels: ["Marketing", "Ads", "Optimization"],
    interfaceType: "Form" as const,
    authorName: "Morgan Blake",
    createdDate: "Jan 12, 2025",
    lastUpdatedDate: "Jan 28, 2025",
    runsCount: 912,
    runnersCount: 46,
  },
  {
    id: "14",
    name: "Deal Closer",
    description:
      "Tracks deal stages and suggests next steps. Sends reminders for follow-ups and prepares closing checklists for won opportunities.",
    category: ["sales", "all"],
    integrations: ["gmail", "slack", "notion"],
    labels: ["Sales", "Pipeline", "Follow-up"],
    interfaceType: "Chat" as const,
    authorName: "Jordan Reese",
    createdDate: "Dec 8, 2024",
    lastUpdatedDate: "Jan 27, 2025",
    runsCount: 1156,
    runnersCount: 58,
  },
];

// Match agent to filter tag (by integrations, labels, interfaceType, category)
function agentMatchesTag(
  agent: (typeof allAgents)[0],
  tagId: string
): boolean {
  const ti = tagId.toLowerCase();
  if (agent.integrations.some((i) => i.toLowerCase() === ti)) return true;
  const labelMatch: Record<string, string[]> = {
    engineering: ["Compliance", "Security", "Validation"],
    product: ["Analytics", "Content"],
    operations: ["Ops", "Validation"],
    "customer-success": ["Support", "Chat"],
    "web-scrapers": ["Scraping"],
    "data-extractors": ["Analysis", "Security", "Analytics"],
    "document-processors": ["Docs", "Validation", "Documents"],
    "email-agents": [], // match by integration gmail below
    "chat-assistants": [],
    automation: ["Ops", "Validation"],
    analytics: ["Analytics", "SEO"],
    "content-generation": ["Content", "Marketing", "Documents"],
  };
  if (tagId === "email-agents" && agent.integrations.includes("gmail")) return true;
  if (tagId === "chat-assistants" && agent.interfaceType === "Chat") return true;
  const labelsToMatch = labelMatch[tagId];
  if (labelsToMatch?.length && agent.labels.some((l) => labelsToMatch.includes(l))) return true;
  return false;
}

export default function AgentLibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState("your-agents");
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState("");
  const [toolSearchQuery, setToolSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("last-updated");
  const [integrationFilter, setIntegrationFilter] = useState("all");
  const [interfaceFilter, setInterfaceFilter] = useState("all");

  const handleCategoryChange = useCallback((cat: string) => {
    setSelectedCategory(cat);
    if (cat !== "all") setSelectedTagId(null);
  }, []);

  const sections = useMemo(() => {
    const filteredByCategory =
      selectedCategory === "all"
        ? allAgents
        : allAgents.filter((agent) =>
            agent.category.includes(selectedCategory)
          );

    const filteredBySidebarSearch = sidebarSearchQuery
      ? filteredByCategory.filter(
          (agent) =>
            agent.name
              .toLowerCase()
              .includes(sidebarSearchQuery.toLowerCase()) ||
            agent.description
              .toLowerCase()
              .includes(sidebarSearchQuery.toLowerCase())
        )
      : filteredByCategory;

    if (selectedCategory === "your-agents") {
      // For Your Agents tab, return saved agents and latest used
      const savedAgents = filteredBySidebarSearch.filter((a) =>
        a.category.includes("your-agents")
      );
      // Latest used by you - reversed order to simulate recency
      const latestUsed = savedAgents
        .slice()
        .reverse()
        .slice(0, Math.max(0, savedAgents.length - 3));
      
      // Saved categories sections
      const marketingAgents = allAgents.filter((a) => a.category.includes("marketing"));
      const salesAgents = allAgents.filter((a) => a.category.includes("sales"));
      const scrapersAgents = allAgents.filter((a) => a.category.includes("support")); // Using support as scrapers for demo

      return [
        { id: "saved-agents", title: "Saved Agents", agents: savedAgents },
        { id: "latest-used", title: "Latest used by you", agents: latestUsed },
        { id: "marketing", title: "Marketing", agents: marketingAgents },
        { id: "sales", title: "Sales", agents: salesAgents },
        { id: "scrapers", title: "Scrapers", agents: scrapersAgents },
      ];
    }

    if (selectedCategory === "all") {
      if (selectedTagId) {
        const tag = ORG_TAGS.find((t) => t.id === selectedTagId);
        const tagLabel = tag?.label ?? selectedTagId;
        const tagAgents = filteredBySidebarSearch.filter((a) =>
          agentMatchesTag(a, selectedTagId)
        );
        return [
          {
            id: `tag-${selectedTagId}`,
            title: tagLabel,
            agents: tagAgents,
            showStar: true,
          },
        ];
      }
      // Top Agents - featured/popular agents
      const topAgents = filteredBySidebarSearch.slice(0, 4);
      // Most used in Miro - agents with most runs in the org
      const mostUsedInMiro = filteredBySidebarSearch.slice(2, 8);
      // All agents
      const allAgentsList = filteredBySidebarSearch;

      return [
        { id: "top-agents", title: "Top Agents", agents: topAgents },
        { id: "most-used-miro", title: "Most used in Miro", agents: mostUsedInMiro },
        { id: "all-agents", title: "All Agents", agents: allAgentsList },
      ];
    }

    const sectionTitles: Record<string, string> = {
      "your-agents": "Your Agents",
      recent: "Recently Used",
      favorites: "Favorites",
      work: "Work",
      marketing: "Marketing",
      sales: "Sales",
      support: "Support",
      scrapers: "Scrapers",
    };

    return [
      {
        id: selectedCategory,
        title: sectionTitles[selectedCategory] || selectedCategory,
        agents: filteredBySidebarSearch,
      },
    ];
  }, [selectedCategory, sidebarSearchQuery, selectedTagId]);

  const router = useRouter();
  const handleAgentClick = useCallback(
    (agent: { id: string; name: string; description: string }) => {
      router.push(
        `/agent/${agent.id}?name=${encodeURIComponent(agent.name)}&description=${encodeURIComponent(agent.description)}`
      );
    },
    [router]
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <AgentSidebar
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        searchQuery={sidebarSearchQuery}
        onSearchChange={setSidebarSearchQuery}
      />
      <AgentGrid
        sections={sections}
        toolSearchQuery={toolSearchQuery}
        onToolSearchChange={setToolSearchQuery}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        integrationFilter={integrationFilter}
        onIntegrationFilterChange={setIntegrationFilter}
        interfaceFilter={interfaceFilter}
        onInterfaceFilterChange={setInterfaceFilter}
        selectedCategory={selectedCategory}
        selectedTagId={selectedTagId}
        onTagSelect={(tagId) => {
          setSelectedTagId(tagId);
          if (tagId != null) setSelectedCategory("all");
        }}
        onSeeMoreCategory={(sectionId) => {
          if (sectionId.startsWith("tag-")) {
            setSelectedCategory("all");
            return;
          }
          const toCategory: Record<string, string> = {
            "saved-agents": "your-agents",
            "latest-used": "your-agents",
            "top-agents": "all",
            "most-used-miro": "all",
            "all-agents": "all",
          };
          setSelectedCategory(toCategory[sectionId] ?? sectionId);
        }}
        onAgentClick={handleAgentClick}
        organisationName="Miro"
      />
    </div>
  );
}
