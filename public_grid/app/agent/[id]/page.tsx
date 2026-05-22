"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  SidebarIcon,
  ArrowLeftIcon,
  SearchIcon,
  SquarePenIcon,
  XIcon,
  PlusIcon,
  ArrowUpIcon,
  User,
  LayoutGrid,
  FolderArchiveIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ImageIcon,
  CameraIcon,
  FolderPlusIcon,
  ZapIcon,
  PlugIcon,
  BotIcon,
  SearchIcon as SearchIconAlias,
  GlobeIcon,
  PaletteIcon,
  BookOpenIcon,
  PaperclipIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getChatMessages,
  addRecentChat,
  getChatLabel,
  MOCK_RECENT_CHATS,
  RECENT_CHATS_EVENT,
  getExtraRecentChats,
  type ChatItem,
} from "@/lib/chats-data";
import { getAgentIcon } from "@/lib/agent-icons";
import { AgentSidebar } from "@/components/agent-sidebar";
import { AgentCard } from "@/components/agent-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DEFAULT_DESCRIPTION =
  "What does your application do? How does it behave? How should the user interact with it?";

const ALL_AGENTS = [
  { id: "1",  name: "Compliance Checker",    description: "Reviews LTV, DSCR, borrower history and compliance requirements.",   favorite: true  },
  { id: "2",  name: "Document Verifier",     description: "Detects forged files and fake borrower data with document-level AI.", favorite: true  },
  { id: "3",  name: "Memo Generator",        description: "Turns messy borrower data into polished investment memos.",           favorite: true  },
  { id: "4",  name: "File Scanner",          description: "Scans closing folders, detects outdated or missing files.",          favorite: true  },
  { id: "5",  name: "Campaign Writer",       description: "Creates compelling marketing copy tailored to your audience.",       favorite: false },
  { id: "6",  name: "Blog Generator",        description: "Generates blog posts, social media content, and newsletters.",      favorite: false },
  { id: "7",  name: "SEO Analyzer",          description: "Analyzes and improves your content for better search rankings.",    favorite: false },
  { id: "8",  name: "LinkedIn Scraper",      description: "Identifies and qualifies leads, sends personalized messages.",      favorite: false },
  { id: "9",  name: "Sales Forecaster",      description: "Evaluates sales opportunities and provides win probability scores.", favorite: false },
  { id: "10", name: "Proposal Builder",      description: "Generates customized sales pitches based on prospect profiles.",    favorite: false },
  { id: "11", name: "Customer Support Bot",  description: "Handles customer inquiries and provides instant responses.",        favorite: false },
  { id: "12", name: "Ticket Router",         description: "Automatically categorizes and prioritizes support tickets.",        favorite: false },
  { id: "13", name: "Ad Copy Optimizer",     description: "A/B tests ad headlines and copy across channels.",                  favorite: false },
  { id: "14", name: "Deal Closer",           description: "Tracks deal stages and suggests next steps for closing.",           favorite: false },
];

const MOCK_CONVERSATIONS = [
  { id: "conv1", title: "Summarize the Q2 report", time: "2h ago" },
  { id: "conv2", title: "Draft a customer onboarding email", time: "Yesterday" },
  { id: "conv3", title: "Analyze sales pipeline data", time: "2d ago" },
  { id: "conv4", title: "Explain our pricing tiers", time: "3d ago" },
  { id: "conv5", title: "Compare competitor features", time: "Last week" },
];

const MOCK_SUGGESTIONS = [
  "How can I get started with this agent?",
  "What are the main capabilities available?",
  "Show me an example of what you can do",
];

const toolbarBtn =
  "flex shrink-0 items-center justify-center rounded-lg size-8 p-0 text-muted-foreground hover:bg-muted-foreground/15 hover:text-foreground transition-colors";

function ChatThread({
  chatId,
  agentName,
}: {
  chatId: string;
  agentName: string;
}) {
  const messages = getChatMessages(chatId, agentName);
  return (
    <div className="mx-auto flex w-full max-w-[48rem] flex-col gap-4">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={cn(
            "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap",
            msg.role === "user"
              ? "self-end bg-primary text-primary-foreground"
              : "self-start bg-muted text-foreground"
          )}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
}

export default function AgentChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : "";
  const name = searchParams.get("name") ?? "";
  const chatId = searchParams.get("chat");
  const description = searchParams.get("description") ?? DEFAULT_DESCRIPTION;
  const isNewChat = !name || id === "new";

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<{id: string; name: string}[]>([]);
  const [agentSearch, setAgentSearch] = useState("");
  const [agentTab, setAgentTab] = useState<"all" | "favorites">("favorites");
  const [newChatKey, setNewChatKey] = useState(0);
  const [extraRecentChats, setExtraRecentChats] = useState<ChatItem[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const pendingChatIdRef = useRef<string | null>(null);

  useEffect(() => {
    const refresh = () => setExtraRecentChats(getExtraRecentChats());
    refresh();
    window.addEventListener(RECENT_CHATS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(RECENT_CHATS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen) searchRef.current?.focus();
  }, [isSearchOpen]);

  useEffect(() => {
    if (!chatId) {
      setActiveConv((prev) => (prev?.startsWith("new-") ? prev : null));
    }
  }, [chatId]);

  const conversationId = chatId ?? activeConv;
  const showChat = Boolean(conversationId);

  const beginConversation = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      // Reuse a pending chat ID (pre-created by handleNewChat) so it gets renamed instead of duplicated
      const convId = pendingChatIdRef.current ?? `new-${Date.now()}`;
      pendingChatIdRef.current = null;
      addRecentChat({
        id: convId,
        label: trimmed.slice(0, 60),
        timestamp: "Just now",
        ...(isNewChat
          ? {}
          : { agentId: id, agentName: name }),
      });
      setActiveConv(convId);
      setMessage("");
      if (!isNewChat && id && name) {
        router.replace(
          `/agent/${id}?chat=${convId}&name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}`
        );
      } else if (isNewChat) {
        router.replace(`/agent/new?chat=${convId}`);
      }
    },
    [description, id, isNewChat, name, router]
  );

  const arrivedViaChat = searchParams.get("from") === "chat";

  const handleNewChat = useCallback(() => {
    setActiveConv(null);
    setMessage("");
    setSelectedAgents([]);
    setAgentSearch("");
    if (id !== "new" && name && !arrivedViaChat) {
      const newId = `new-${Date.now()}`;
      pendingChatIdRef.current = newId;
      addRecentChat({
        id: newId,
        label: "New conversation",
        timestamp: "Just now",
        agentId: id,
        agentName: name,
      });
      router.push(`/agent/${id}?name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}`);
    } else {
      router.push("/agent/new");
      setNewChatKey((k) => k + 1);
    }
  }, [id, name, description, arrivedViaChat, router]);

  const handleBack = useCallback(() => {
    if (conversationId) {
      setActiveConv(null);
      if (!isNewChat && id && name) {
        router.replace(
          `/agent/${id}?name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}`
        );
      } else {
        router.replace("/agent/new");
      }
      return;
    }
    router.push("/");
  }, [conversationId, description, id, isNewChat, name, router]);

  const conversationTitle = conversationId
    ? getChatLabel(conversationId)
    : "New conversation";

  const renderChatHeader = (showToolbar = true) => (
    <header className="flex h-12 shrink-0 items-center gap-3 px-3">
      <button
        type="button"
        onClick={handleBack}
        className="flex shrink-0 items-center justify-center rounded-lg size-8 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
        aria-label="Back"
      >
        <ArrowLeftIcon className="size-4" />
      </button>
      <span className="min-w-0 truncate text-sm font-medium text-foreground">
        {conversationTitle}
      </span>
      {showToolbar && (
        <>
          <div className="flex-1" />
          <Link href="/" className={cn(toolbarBtn)} title="Back to grid">
            <LayoutGrid className="size-4" />
          </Link>
          <button type="button" className={toolbarBtn} title="Profile">
            <User className="size-4" />
          </button>
        </>
      )}
    </header>
  );

  const filtered = MOCK_CONVERSATIONS.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chatComposer = (centered: boolean) => (
    <div className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", centered && "justify-center items-center px-4 pb-4")}>
      <div className={cn("flex w-full flex-col gap-6", centered ? "max-w-[48rem] items-center text-center" : "")}>
        {centered && (
          <h2 className="text-2xl font-medium leading-none">
            Hey David, how can I help?
          </h2>
        )}
        <div className={cn("w-full", centered ? "" : "px-4 pb-4 pt-2")}>
          <div className={cn(
            "flex items-end gap-2 rounded-xl border border-border bg-background px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-ring/30",
            !centered && "mx-auto max-w-[48rem]"
          )}>
            <button type="button" className={cn(toolbarBtn, "mb-0.5")} title="Attach file">
              <PaperclipIcon className="size-4" />
            </button>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a message…"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  beginConversation(message);
                }
              }}
              className="min-h-[32px] flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              style={{ fieldSizing: "content" } as React.CSSProperties}
            />
            <button
              type="button"
              onClick={() => beginConversation(message)}
              className={cn(
                "mb-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                message.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground"
              )}
              title="Send"
            >
              <ArrowUpIcon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const recentChats = [...extraRecentChats, ...MOCK_RECENT_CHATS];

  const FAVOURITE_CHAT_AGENTS = [
    { id: "5", name: "Campaign Writer", description: "Creates compelling marketing copy tailored to your audience.", labels: ["Marketing", "Content"], integrations: ["slack", "figma"], runsCount: 1532 },
    { id: "9", name: "Sales Forecaster", description: "Evaluates opportunities and provides win probability scores.", labels: ["Analytics", "Sales"], integrations: ["gmail", "figma", "notion"], runsCount: 1024 },
    { id: "11", name: "Customer Support Bot", description: "Handles inquiries and provides instant, accurate responses.", labels: ["Support", "Chat"], integrations: ["slack", "connector", "notion"], runsCount: 1893 },
  ];

  /* ── New Chat ── */
  if (isNewChat) {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-muted" key={id}>
        <AgentSidebar
          selectedCategory="all"
          onCategoryChange={() => router.push("/")}
          categories={[
            { id: "work", label: "Engineering" },
            { id: "marketing", label: "Growth" },
            { id: "sales", label: "Revenue" },
          ]}
          organisationName="Stack AI Internal"
          userName="David Hidalgo"
          onNewChat={handleNewChat}
          activeChatId={conversationId}
        />
        <div
          key={newChatKey}
          className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-background"
        >
          {renderChatHeader(false)}
          {showChat ? (
            /* ── After first message: chat view ── */
            <>
              <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
                <ChatThread chatId={conversationId!} agentName="Assistant" />
              </div>
              <div className="shrink-0 px-4 pb-4 pt-2">
                <div className="mx-auto max-w-[48rem] flex flex-col rounded-xl border border-border bg-background px-3 pt-3 pb-2 shadow-sm focus-within:ring-2 focus-within:ring-ring/30">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a message…"
                    rows={3}
                    className="min-h-[72px] w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <div className="flex items-center justify-between pt-2">
                    <button type="button" className={toolbarBtn} title="Add">
                      <PlusIcon className="size-4" />
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                        message.trim()
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-muted text-muted-foreground"
                      )}
                      title="Send"
                    >
                      <ArrowUpIcon className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* ── Before first message: scrollable landing ── */
            <div className="flex flex-1 flex-col overflow-y-auto gap-6">
              {/* Greeting + composer — top-weighted so recent chats sit closer below */}
              <div className="relative flex w-full shrink-0 flex-col items-center bg-background px-4 pt-[24vh] pb-10">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #e5e5e5 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 90% 80% at 50% 54%, #000 45%, transparent 88%), linear-gradient(to bottom, transparent 0%, transparent 6%, black 24%)",
                    WebkitMaskComposite: "source-in",
                    maskImage:
                      "radial-gradient(ellipse 90% 80% at 50% 54%, #000 45%, transparent 88%), linear-gradient(to bottom, transparent 0%, transparent 6%, black 24%)",
                    maskComposite: "intersect",
                  }}
                />
                <div className="relative z-10 mx-auto w-full max-w-[48rem] flex flex-col items-center gap-8 text-center">
                <h2 className="text-2xl font-medium leading-none">
                  Hey David, how can I help?
                </h2>
                <div className="w-full">
                  <div className="flex flex-col rounded-xl border border-border bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring/30">
                    <div className="px-3 pt-3 pb-2">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write a message…"
                      rows={3}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          beginConversation(message);
                        }
                      }}
                      className="min-h-[72px] w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                    <div className="flex items-center gap-1.5 pt-2">
                      <div className="flex items-center gap-1">
                        {/* + attach/knowledge dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button type="button" className={toolbarBtn} title="Add files or knowledge">
                              <PlusIcon className="size-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="top" align="start" className="w-52">
                            <DropdownMenuItem className="gap-2.5 cursor-pointer">
                              <PaperclipIcon className="size-4 text-muted-foreground" />
                              Attach file
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2.5 cursor-pointer">
                              <ImageIcon className="size-4 text-muted-foreground" />
                              Add photos
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2.5 cursor-pointer">
                              <BookOpenIcon className="size-4 text-muted-foreground" />
                              Knowledge base
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {/* Agents dropdown */}
                        <DropdownMenu onOpenChange={(open) => { if (!open) setAgentSearch(""); }}>
                          <DropdownMenuTrigger asChild>
                            <button type="button" className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground transition-colors" title="Agents">
                              <BotIcon className="size-3.5" />
                              Agents
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="top" align="start" className="w-72 p-0" onCloseAutoFocus={(e) => e.preventDefault()}>
                            {/* Search */}
                            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                              <SearchIcon className="size-3.5 shrink-0 text-muted-foreground" />
                              <input
                                autoFocus
                                value={agentSearch}
                                onChange={(e) => setAgentSearch(e.target.value)}
                                onKeyDown={(e) => e.stopPropagation()}
                                placeholder="Search agents…"
                                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                              />
                            </div>
                            {/* Tabs */}
                            <div className="px-3 py-2">
                              <Tabs
                                value={agentTab}
                                onValueChange={(v) => setAgentTab(v as "all" | "favorites")}
                              >
                                <TabsList className="w-full">
                                  <TabsTrigger value="favorites" className="flex-1 text-xs">
                                    Favourites
                                  </TabsTrigger>
                                  <TabsTrigger value="all" className="flex-1 text-xs">
                                    All
                                  </TabsTrigger>
                                </TabsList>
                              </Tabs>
                            </div>
                            {/* List */}
                            <div className="max-h-56 overflow-y-auto py-1">
                              {ALL_AGENTS
                                .filter((a) => agentTab === "favorites" ? a.favorite : true)
                                .filter((a) => a.name.toLowerCase().includes(agentSearch.toLowerCase()))
                                .map((agent) => {
                                  const isSelected = selectedAgents.some((x) => x.id === agent.id);
                                  return (
                                    <DropdownMenuItem
                                      key={agent.id}
                                      className={cn("mx-1 flex cursor-pointer flex-col items-start gap-0.5 rounded-lg px-3 py-2", isSelected && "opacity-50")}
                                      onSelect={() => {
                                        if (!isSelected) setSelectedAgents((prev) => [...prev, { id: agent.id, name: agent.name }]);
                                      }}
                                    >
                                      <div className="flex items-center gap-2 w-full">
                                        <BotIcon className="size-3.5 shrink-0 text-muted-foreground" />
                                        <span className="text-sm font-medium">{agent.name}</span>
                                        {isSelected && <span className="ml-auto text-xs text-muted-foreground">Added</span>}
                                      </div>
                                      <p className="pl-5 text-xs text-muted-foreground line-clamp-1">{agent.description}</p>
                                    </DropdownMenuItem>
                                  );
                                })}
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {selectedAgents.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {selectedAgents.map((a) => (
                            <span key={a.id} className="flex items-center gap-1 rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium text-foreground">
                              {a.name}
                              <button type="button" onClick={() => setSelectedAgents((prev) => prev.filter((x) => x.id !== a.id))} className="ml-0.5 opacity-60 hover:opacity-100">
                                <XIcon className="size-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => beginConversation(message)}
                        className={cn(
                          "ml-auto flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                          message.trim()
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-muted text-muted-foreground"
                        )}
                        title="Send"
                      >
                        <ArrowUpIcon className="size-4" />
                      </button>
                    </div>
                    </div>
                  </div>
                  {/* Info banner — separate pill below the card */}
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-muted px-4 py-3 text-sm">
                    <span className="text-muted-foreground">Now you can call any workflow and knowledge base from here</span>
                    <button type="button" className="ml-4 shrink-0 text-muted-foreground/50 hover:text-foreground transition-colors">
                      <XIcon className="size-3.5" />
                    </button>
                  </div>
                </div>
                </div>
              </div>

              {/* Recent chats + favorites — part of the same scroll */}
              <div className="mx-auto w-full max-w-[48rem] pb-12 space-y-10">

                {/* Recent chats */}
                <div className="space-y-4">
                  <header className="flex items-center gap-2">
                    <ChevronDownIcon className="size-4 text-muted-foreground" />
                    <h2 className="font-medium">Recent chats</h2>
                    <span className="text-xs text-muted-foreground">({recentChats.length})</span>
                  </header>
                  <div className="flex flex-col gap-0.5">
                    {recentChats.map((chat) => (
                      <Link
                        key={chat.id}
                        href={
                          chat.agentId
                            ? `/agent/${chat.agentId}?chat=${chat.id}${chat.agentName ? `&name=${encodeURIComponent(chat.agentName)}` : ""}&from=chat`
                            : `/agent/new?chat=${chat.id}`
                        }
                        className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left transition-colors hover:bg-black/5"
                      >
                        {getAgentIcon(chat.agentId)}
                        <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                          {chat.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Favourite agents */}
                <div className="space-y-6">
                  <header className="flex items-center gap-2">
                    <ChevronDownIcon className="size-4 text-muted-foreground" />
                    <h2 className="font-medium">Favourite agents</h2>
                    <span className="text-xs text-muted-foreground">({FAVOURITE_CHAT_AGENTS.length})</span>
                  </header>
                  <div className="grid grid-cols-3 gap-6">
                    {FAVOURITE_CHAT_AGENTS.map((agent) => (
                      <AgentCard
                        key={agent.id}
                        name={agent.name}
                        description={agent.description}
                        interfaceType="Chat"
                        labels={agent.labels}
                        integrations={agent.integrations}
                        runsCount={agent.runsCount}
                        isFavorited
                        onStart={() =>
                          router.push(
                            `/agent/${agent.id}?name=${encodeURIComponent(agent.name)}&description=${encodeURIComponent(agent.description)}`
                          )
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* All agents link */}
                <div className="flex justify-center pb-4">
                  <Link
                    href="/"
                    className="flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                  >
                    <LayoutGrid className="size-4" />
                    Browse all agents
                  </Link>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── Named agent chat page ── */
  return (
    <div className="flex h-screen w-full overflow-hidden bg-muted" key={id}>
      <AgentSidebar
        selectedCategory="all"
        onCategoryChange={() => router.push("/")}
        categories={[
          { id: "work", label: "Engineering" },
          { id: "marketing", label: "Growth" },
          { id: "sales", label: "Revenue" },
        ]}
        organisationName="Stack AI Internal"
        userName="David Hidalgo"
        onNewChat={handleNewChat}
        activeChatId={conversationId}
        filterAgentId={id}
      />

      {/* Chat panel */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
        {renderChatHeader()}

        {/* Chat area */}
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {showChat ? (
            <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
              <ChatThread chatId={conversationId!} agentName={name} />
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-4 pb-4">
              <div className="flex w-full max-w-[48rem] flex-col items-center gap-6 text-center">
                <div className="flex size-14 items-center justify-center rounded-xl border border-border bg-muted/60">
                  {getAgentIcon(id, "size-7 text-muted-foreground")}
                </div>

                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-medium leading-none">{name}</h2>
                  <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>

                <div className="w-full">
                  <div className="flex flex-col rounded-xl border border-border bg-background px-3 pt-3 pb-2 shadow-sm focus-within:ring-2 focus-within:ring-ring/30">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write a message…"
                      rows={3}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          beginConversation(message);
                        }
                      }}
                      className="min-h-[72px] w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                    <div className="flex items-center justify-between pt-2">
                      <button type="button" className={toolbarBtn} title="Add">
                        <PlusIcon className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => beginConversation(message)}
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                          message.trim()
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-muted text-muted-foreground"
                        )}
                        title="Send"
                      >
                        <ArrowUpIcon className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2">
                  {MOCK_SUGGESTIONS.map((suggestion, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setMessage(suggestion)}
                      className="flex w-full items-start gap-2 rounded-xl border border-border px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                    >
                      <ArrowUpIcon className="mt-0.5 size-4 shrink-0" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showChat && (
            <div className="shrink-0 px-4 pb-4 pt-2">
              <div className="mx-auto max-w-[48rem] flex flex-col rounded-xl border border-border bg-background px-3 pt-3 pb-2 shadow-sm focus-within:ring-2 focus-within:ring-ring/30">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a message…"
                  rows={3}
                  className="min-h-[72px] w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <div className="flex items-center justify-between pt-2">
                  <button type="button" className={toolbarBtn} title="Add">
                    <PlusIcon className="size-4" />
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                      message.trim()
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted text-muted-foreground"
                    )}
                    title="Send"
                  >
                    <ArrowUpIcon className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
