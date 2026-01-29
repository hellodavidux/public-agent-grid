"use client";

import React, { useState } from "react";
import { Bookmark } from "lucide-react"; // Import Bookmark here

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  LayoutDashboard,
  Star,
  Plus,
  Users,
  TrendingUp,
  Megaphone,
  Bot,
  Database,
  FileText,
  Mail,
  MessageSquare,
  Zap,
  Globe,
  Shield,
  BarChart,
} from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

interface AgentSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const mainCategories: SidebarItem[] = [
  { id: "your-agents", label: "Your Agents", icon: <Star className="size-4" /> },
  { id: "all", label: "All Agents", icon: <LayoutDashboard className="size-4" /> },
];

const teamCategories: SidebarItem[] = [
  { id: "marketing", label: "Marketing", icon: <Megaphone className="size-4" /> },
  { id: "sales", label: "Sales", icon: <TrendingUp className="size-4" /> },
  { id: "scrapers", label: "Scrapers", icon: <Users className="size-4" /> },
];

interface TagOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: "team" | "agent-type" | "function";
}

const availableTags: TagOption[] = [
  // Team Tags
  { id: "engineering", label: "Engineering", icon: <Zap className="size-4" />, category: "team" },
  { id: "product", label: "Product", icon: <BarChart className="size-4" />, category: "team" },
  { id: "operations", label: "Operations", icon: <Shield className="size-4" />, category: "team" },
  { id: "customer-success", label: "Customer Success", icon: <MessageSquare className="size-4" />, category: "team" },
  // Agent Types
  { id: "web-scrapers", label: "Web Scrapers", icon: <Globe className="size-4" />, category: "agent-type" },
  { id: "data-extractors", label: "Data Extractors", icon: <Database className="size-4" />, category: "agent-type" },
  { id: "document-processors", label: "Document Processors", icon: <FileText className="size-4" />, category: "agent-type" },
  { id: "email-agents", label: "Email Agents", icon: <Mail className="size-4" />, category: "agent-type" },
  { id: "chat-assistants", label: "Chat Assistants", icon: <MessageSquare className="size-4" />, category: "agent-type" },
  // Functions
  { id: "automation", label: "Automation", icon: <Zap className="size-4" />, category: "function" },
  { id: "analytics", label: "Analytics", icon: <BarChart className="size-4" />, category: "function" },
  { id: "content-generation", label: "Content Generation", icon: <Bot className="size-4" />, category: "function" },
];

export function AgentSidebar({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: AgentSidebarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [savedCategories, setSavedCategories] = useState<SidebarItem[]>(() => [...teamCategories]);

  const filteredTags = availableTags.filter((tag) =>
    tag.label.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const handleAddCategory = (tag: TagOption) => {
    setSavedCategories((prev) => {
      if (prev.some((c) => c.id === tag.id)) return prev;
      return [...prev, { id: tag.id, label: tag.label, icon: tag.icon }];
    });
    setDropdownOpen(false);
  };

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-amber-300">
          <svg
            className="size-5 text-slate-800"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M4 4h4l4 8-4 8H4l4-8-4-8zm8 0h4l4 8-4 8h-4l4-8-4-8z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">Miro</span>
          <span className="text-xs text-muted-foreground">Enterprise</span>
        </div>
      </div>

      <ScrollArea className="flex-1 px-2">
        <nav className="flex flex-col gap-1 py-2">
          {mainCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                selectedCategory === category.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              {category.icon}
              <span>{category.label}</span>
            </button>
          ))}
        </nav>

        {/* Separator */}
        <div className="mx-3 my-2 border-t border-border" />

        {/* Your Categories header - styled like main nav items */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[1.19rem] top-9 bottom-2 w-px bg-border" />
          
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
              <Bookmark className="size-4" />
              <span>Your Categories</span>
            </div>
            <DropdownMenu
              open={dropdownOpen}
              onOpenChange={(open) => {
                setDropdownOpen(open);
                if (!open) setCategorySearch("");
              }}
            >
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Plus className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56" sideOffset={4}>
                <DropdownMenuLabel className="text-muted-foreground font-normal">
                  Save a Category...
                </DropdownMenuLabel>
                <div
                  className="px-2 pb-2"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search categories..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="h-8 pl-8 text-sm"
                    />
                  </div>
                </div>
                <DropdownMenuSeparator />
                {filteredTags.length === 0 ? (
                  <div className="px-2 py-4 text-center text-xs text-muted-foreground">
                    No categories match
                  </div>
                ) : (
                  filteredTags.map((tag) => (
                    <DropdownMenuItem
                      key={tag.id}
                      className="cursor-pointer"
                      onSelect={(e) => {
                        e.preventDefault();
                        handleAddCategory(tag);
                      }}
                    >
                      {tag.label}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Indented category items under Your Categories */}
          <nav className="flex flex-col gap-0.5 pl-6">
            {savedCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-left text-sm transition-colors",
                  selectedCategory === category.id
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                {category.label}
              </button>
            ))}
          </nav>
        </div>
      </ScrollArea>
    </aside>
  );
}
