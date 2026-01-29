"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  Search,
  Pencil,
  User,
  Star,
  FolderDown,
  ChevronDown,
  ImageIcon,
  Mic,
  Send,
  LayoutGrid,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const DEFAULT_DESCRIPTION =
  "What does your application do? How does it behave? How should the user interact with it?";

export default function AgentChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const name =
    searchParams.get("name") ?? "Application Name";
  const description =
    searchParams.get("description") ?? DEFAULT_DESCRIPTION;
  const [starred, setStarred] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-background" key={id}>
      {/* Top Header */}
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link
            href="/"
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Menu"
          >
            <LayoutGrid className="size-4" />
          </Link>
          <button
            type="button"
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Search"
          >
            <Search className="size-4" />
          </button>
          <button
            type="button"
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Edit"
          >
            <Pencil className="size-4" />
          </button>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <h1 className="truncate text-base font-semibold text-foreground">
              {name}
            </h1>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setStarred((s) => !s);
              }}
              className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={starred ? "Unfavourite" : "Favourite"}
            >
              <Star
                className={`size-4 ${starred ? "fill-amber-400 text-amber-500" : ""}`}
              />
            </button>
          </div>
        </div>
        <button
          type="button"
          className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Profile"
        >
          <User className="size-4" />
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Left Sidebar */}
        <aside className="flex w-14 shrink-0 flex-col border-r border-border bg-background">
          <div className="flex-1" />
          <div className="border-t border-border p-2">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <FolderDown className="size-4 shrink-0" />
              <span className="hidden truncate sm:inline">Archived Chats</span>
              <ChevronDown className="ml-auto size-4 shrink-0 opacity-70" />
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-8">
            {/* Cube / blocks icon */}
            <div className="flex items-center justify-center">
              <svg
                className="size-14 text-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
              </svg>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-foreground">{name}</h2>
                <button
                  type="button"
                  onClick={() => setStarred((s) => !s)}
                  className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label={starred ? "Unfavourite" : "Favourite"}
                >
                  <Star
                    className={`size-4 ${starred ? "fill-amber-400 text-amber-500" : ""}`}
                  />
                </button>
              </div>
              <p className="max-w-md text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          </div>

          {/* Message input */}
          <div className="shrink-0 border-t border-border bg-background px-4 py-4">
            <div className="mx-auto flex max-w-2xl items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2 shadow-xs">
              <button
                type="button"
                className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Attach"
              >
                <ImageIcon className="size-4" />
              </button>
              <Input
                placeholder="Write a message..."
                className="min-w-0 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
                readOnly
              />
              <button
                type="button"
                className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Voice input"
              >
                <Mic className="size-4" />
              </button>
              <button
                type="button"
                className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                aria-label="Send"
              >
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
