"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGridIcon,
  PlusIcon,
  ChevronRightIcon,
  ZapIcon,
  MessageSquareIcon,
  PanelLeftIcon,
  SearchIcon,
  XIcon,
  ListFilterIcon,
  StarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MOCK_RECENT_CHATS,
  RECENT_CHATS_EVENT,
  getExtraRecentChats,
  type ChatItem,
} from "@/lib/chats-data";
import { getAgentIcon } from "@/lib/agent-icons";

function ChatSidebarLink({
  item,
  activeChatId,
  fallbackAgentId,
}: {
  item: ChatItem;
  activeChatId: string | null;
  fallbackAgentId?: string;
}) {
  const isActive = activeChatId === item.id;
  return (
    <Link
      href={
        item.agentId
          ? `/agent/${item.agentId}?chat=${item.id}${item.agentName ? `&name=${encodeURIComponent(item.agentName)}` : ""}&from=chat`
          : `/agent/new?chat=${item.id}`
      }
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left transition-colors hover:bg-black/5",
        isActive && "bg-black/8 font-medium"
      )}
    >
      {getAgentIcon(item.agentId ?? fallbackAgentId)}
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-xs",
          isActive ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}

interface Category {
  id: string;
  label: string;
}

interface AgentSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories?: Category[];
  organisationName?: string;
  organisationLogoUrl?: string;
  userName?: string;
  userAvatarUrl?: string;
  recentChats?: ChatItem[];
  activeChatId?: string | null;
  onNewChat?: () => void;
  agentMode?: boolean;
  filterAgentId?: string;
  activeSection?: "agents" | "automations";
  favoriteAgents?: { id: string; name: string }[];
}

export function AgentSidebar({
  selectedCategory,
  onCategoryChange,
  categories = [],
  organisationName = "StackAI Internal",
  organisationLogoUrl,
  userName = "David Hidalgo",
  userAvatarUrl,
  recentChats = MOCK_RECENT_CHATS,
  activeChatId = null,
  onNewChat,
  agentMode = false,
  filterAgentId,
  activeSection,
  favoriteAgents = [],
}: AgentSidebarProps) {
  const initials = organisationName[0]?.toUpperCase() ?? "S";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const pathname = usePathname();

  const [chatsOpen, setChatsOpen] = useState(true);
  const [teamsOpen, setTeamsOpen] = useState(false);
  const [chatSearchOpen, setChatSearchOpen] = useState(false);
  const [chatSearch, setChatSearch] = useState("");
  const [extraChats, setExtraChats] = useState<ChatItem[]>([]);
  const [chatFilterActive, setChatFilterActive] = useState(!!filterAgentId && !activeChatId);

  const teamCategories =
    categories.length > 0
      ? categories
      : [
          { id: "work", label: "Engineering" },
          { id: "marketing", label: "Growth" },
          { id: "sales", label: "Revenue" },
        ];

  useEffect(() => {
    const refresh = () => setExtraChats(getExtraRecentChats());
    refresh();
    window.addEventListener(RECENT_CHATS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(RECENT_CHATS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    if (activeChatId) setChatsOpen(true);
  }, [activeChatId]);

  const allChats = [...extraChats, ...recentChats];
  const mergedChats = filterAgentId && chatFilterActive
    ? allChats.filter((c) => c.agentId === filterAgentId)
    : allChats;

  const isAutomations = activeSection === "automations";
  const isNewChat = pathname === "/agent/new";

  const filteredChats = mergedChats.filter((c) =>
    c.label.toLowerCase().includes(chatSearch.toLowerCase())
  );

  if (agentMode) {
    return (
      <div className="flex h-full w-64 flex-col border-r border-black/5 bg-muted">
        {/* Org header */}
        <div className="flex items-center gap-2 px-3 py-3">
          <Avatar className="size-7 rounded-md border border-black/10">
            {organisationLogoUrl && (
              <AvatarImage src={organisationLogoUrl} alt={organisationName} loading="eager" />
            )}
            <AvatarFallback className="rounded-md text-xs font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <p className="flex-1 text-sm font-semibold tracking-tight truncate">{organisationName}</p>
          <button
            type="button"
            className="shrink-0 rounded p-0.5 text-muted-foreground/50 transition-colors hover:bg-black/5 hover:text-muted-foreground"
          >
            <PanelLeftIcon className="size-3.5" />
          </button>
        </div>

        <div className="px-2">
          <button
            type="button"
            onClick={onNewChat}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-black/5 hover:text-foreground"
          >
            <PlusIcon className="size-4 shrink-0" />
            <span>New Chat</span>
          </button>
        </div>

        <p className="px-5 pt-3 pb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
          Recents
        </p>

        {/* Search */}
        <div className="px-3 pb-1">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="text"
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              placeholder="Search"
              className="h-8 w-full rounded-md border border-black/10 bg-background py-1.5 pl-8 pr-7 text-xs text-foreground shadow-xs outline-none placeholder:text-muted-foreground/50 focus:border-black/15 focus:ring-2 focus:ring-ring/20"
            />
            {chatSearch && (
              <button
                type="button"
                onClick={() => setChatSearch("")}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground/50 transition-colors hover:bg-black/5 hover:text-muted-foreground"
                aria-label="Clear search"
              >
                <XIcon className="size-3" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-2">
          {filteredChats.length === 0 ? (
            <p className="px-3 py-2 text-xs text-muted-foreground/50">No conversations found</p>
          ) : (
            filteredChats.map((item) => (
              <ChatSidebarLink
                key={item.id}
                item={item}
                activeChatId={activeChatId}
                fallbackAgentId={filterAgentId}
              />
            ))
          )}
        </div>

        <div className="mt-auto border-t border-black/5 p-2 pb-3">
          <div className="flex items-center gap-2 rounded-md px-3 py-2">
            <Avatar className="size-6 rounded-full">
              {userAvatarUrl && <AvatarImage src={userAvatarUrl} alt={userName} />}
              <AvatarFallback className="text-[10px]">{userInitials}</AvatarFallback>
            </Avatar>
            <span className="truncate text-xs text-muted-foreground">{userName}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-64 flex-col border-r border-black/5 bg-muted">
      {/* Org header */}
      <div className="flex items-center gap-2 px-3 py-3">
        <Avatar className="size-7 rounded-md border border-black/10">
          {organisationLogoUrl && (
            <AvatarImage src={organisationLogoUrl} alt={organisationName} loading="eager" />
          )}
          <AvatarFallback className="rounded-md text-xs font-semibold">{initials}</AvatarFallback>
        </Avatar>
        <p className="flex-1 text-sm font-semibold tracking-tight truncate">
          {organisationName.replace(" ", " ")}
        </p>
        <button
          type="button"
          className="shrink-0 rounded p-0.5 text-muted-foreground/50 transition-colors hover:bg-black/5 hover:text-muted-foreground"
        >
          <PanelLeftIcon className="size-3.5" />
        </button>
      </div>

      {/* Nav */}
      <div className="flex flex-col gap-0.5 px-2">
        <button
          type="button"
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-black/5 hover:text-foreground"
        >
          <PlusIcon className="size-4 shrink-0" />
          <span>New Chat</span>
        </button>

        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={cn(
              "group/all-agents flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm leading-none transition-colors",
              (selectedCategory === "all" || selectedCategory === "automations") &&
                !isAutomations &&
                !isNewChat &&
                !filterAgentId &&
                !activeChatId
                ? "bg-black/8 text-foreground font-medium"
                : "text-foreground/70 hover:bg-black/5 hover:text-foreground"
            )}
          >
            <span
              role="button"
              tabIndex={0}
              aria-expanded={teamsOpen}
              aria-label={teamsOpen ? "Collapse teams" : "Expand teams"}
              onClick={(e) => {
                e.stopPropagation();
                setTeamsOpen((v) => !v);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  setTeamsOpen((v) => !v);
                }
              }}
              className="relative flex size-4 shrink-0 items-center justify-center rounded-sm hover:bg-black/5"
            >
              <LayoutGridIcon
                className={cn(
                  "size-4 shrink-0",
                  teamsOpen ? "hidden" : "block group-hover/all-agents:hidden"
                )}
              />
              <ChevronRightIcon
                className={cn(
                  "size-4 shrink-0 transition-transform duration-150",
                  teamsOpen
                    ? "block rotate-90"
                    : "hidden group-hover/all-agents:block"
                )}
              />
            </span>
            <span>All Agents</span>
          </button>
          {teamsOpen && (
            <div className="flex flex-col gap-0.5 pb-0.5">
              {teamCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onCategoryChange(cat.id)}
                  className={cn(
                    "flex w-full items-center rounded-md py-1.5 pl-9 pr-3 text-left text-xs leading-none transition-colors",
                    selectedCategory === cat.id &&
                      !isAutomations &&
                      !isNewChat &&
                      !filterAgentId &&
                      !activeChatId
                      ? "bg-black/8 font-medium text-foreground"
                      : "text-foreground/60 hover:bg-black/5 hover:text-foreground"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onCategoryChange("my-agents")}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm leading-none transition-colors",
            selectedCategory === "my-agents" &&
              !isAutomations &&
              !isNewChat &&
              !filterAgentId &&
              !activeChatId
              ? "bg-black/8 text-foreground font-medium"
              : "text-foreground/70 hover:bg-black/5 hover:text-foreground"
          )}
        >
          <StarIcon className="size-4 shrink-0" />
          <span>favourite agents</span>
          {favoriteAgents.length > 0 && (
            <span className="ml-auto text-xs text-muted-foreground/60">{favoriteAgents.length}</span>
          )}
        </button>

        <Link
          href="/automations"
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm leading-none transition-colors",
            isAutomations
              ? "bg-black/8 text-foreground font-medium"
              : "text-foreground/70 hover:bg-black/5 hover:text-foreground"
          )}
        >
          <ZapIcon className="size-4 shrink-0" />
          <span>My automations</span>
        </Link>

        <div className="my-1 mx-3 border-t border-black/8" />

        <button
          type="button"
          onClick={() => setChatsOpen((v) => !v)}
          className="group/chats flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-black/5 hover:text-foreground"
        >
          <span
            role="button"
            tabIndex={0}
            aria-expanded={chatsOpen}
            aria-label={chatsOpen ? "Collapse chats" : "Expand chats"}
            onClick={(e) => {
              e.stopPropagation();
              setChatsOpen((v) => !v);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                setChatsOpen((v) => !v);
              }
            }}
            className="relative flex size-4 shrink-0 items-center justify-center rounded-sm hover:bg-black/5"
          >
            <MessageSquareIcon
              className={cn(
                "size-4 shrink-0",
                chatsOpen ? "hidden" : "block group-hover/chats:hidden"
              )}
            />
            <ChevronRightIcon
              className={cn(
                "size-4 shrink-0 transition-transform duration-150",
                chatsOpen
                  ? "block rotate-90"
                  : "hidden group-hover/chats:block"
              )}
            />
          </span>
          <span className="flex-1 text-left">Chats</span>
          {filterAgentId && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setChatFilterActive((v) => !v);
                setChatsOpen(true);
              }}
              className={cn(
                "relative shrink-0 rounded p-0.5 transition-colors hover:bg-black/5",
                chatFilterActive
                  ? "text-foreground"
                  : "text-muted-foreground/50 hover:text-muted-foreground"
              )}
              aria-label={chatFilterActive ? "Show all chats" : "Filter to this agent"}
            >
              <ListFilterIcon className="size-3.5" />
              {chatFilterActive && (
                <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-primary" />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setChatSearchOpen((v) => {
                if (v) setChatSearch("");
                return !v;
              });
              setChatsOpen(true);
            }}
            className={cn(
              "shrink-0 rounded p-0.5 transition-colors hover:bg-black/5 hover:text-muted-foreground",
              chatSearchOpen ? "text-foreground" : "text-muted-foreground/50"
            )}
            aria-label={chatSearchOpen ? "Close search" : "Search chats"}
          >
            <SearchIcon className="size-3.5" />
          </button>
        </button>
        {chatsOpen && (
          <div className="flex flex-col gap-0.5 pb-0.5">
            {chatSearchOpen && (
              <div className="px-1 pb-1">
                <div className="relative">
                  <input
                    type="text"
                    value={chatSearch}
                    onChange={(e) => setChatSearch(e.target.value)}
                    placeholder="Search chats"
                    autoFocus
                    className="h-7 w-full rounded-md border border-black/10 bg-background px-2.5 pr-7 text-xs text-foreground shadow-xs outline-none placeholder:text-muted-foreground/50 focus:border-black/15 focus:ring-2 focus:ring-ring/20"
                  />
                  {chatSearch && (
                    <button
                      type="button"
                      onClick={() => setChatSearch("")}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground/50 transition-colors hover:bg-black/5 hover:text-muted-foreground"
                      aria-label="Clear search"
                    >
                      <XIcon className="size-3" />
                    </button>
                  )}
                </div>
              </div>
            )}
            {filteredChats.map((item) => (
              <ChatSidebarLink
                key={item.id}
                item={item}
                activeChatId={activeChatId}
                fallbackAgentId={filterAgentId}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-black/5 p-2 pb-3">
        <div className="flex items-center gap-2 rounded-md px-3 py-2">
          <Avatar className="size-6 rounded-full">
            {userAvatarUrl && <AvatarImage src={userAvatarUrl} alt={userName} />}
            <AvatarFallback className="text-[10px]">{userInitials}</AvatarFallback>
          </Avatar>
          <span className="truncate text-xs text-muted-foreground">{userName}</span>
        </div>
      </div>
    </div>
  );
}
