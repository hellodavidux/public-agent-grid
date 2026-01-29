"use client";

import React, { useLayoutEffect, useRef, useState } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LayoutGrid, MessageSquare, FileText, Star, Info, BarChart2, User, Users } from "lucide-react";

interface AgentCardProps {
  name: string;
  description: string;
  onStart?: () => void;
  integrations?: string[];
  labels?: string[];
  interfaceType?: "Form" | "Batch" | "Chat";
  authorName?: string;
  createdDate?: string;
  lastUpdatedDate?: string;
  runsCount?: number;
  runnersCount?: number;
}

const integrationIcons: Record<string, React.ReactNode> = {
  slack: (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#36C5F0"/>
      <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#2EB67D"/>
      <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#ECB22E"/>
      <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#E01E5A"/>
    </svg>
  ),
  gmail: (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
      <path d="M1.636 21.002h3.819V11.73L0 6.82v12.546c0 .904.732 1.636 1.636 1.636z" fill="#34A853"/>
      <path d="M18.545 21.002h3.819c.904 0 1.636-.732 1.636-1.636V6.82l-5.455 4.91v9.272z" fill="#4285F4"/>
      <path d="M5.455 11.73V4.64L12 9.548l6.545-4.91v7.092L12 16.64l-6.545-4.91z" fill="#FBBC05"/>
    </svg>
  ),
  figma: (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="none">
      <path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4z" fill="#0ACF83"/>
      <path d="M4 12c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4z" fill="#A259FF"/>
      <path d="M4 4c0-2.208 1.792-4 4-4h4v8H8C5.792 8 4 6.208 4 4z" fill="#F24E1E"/>
      <path d="M12 0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4h-4V0z" fill="#FF7262"/>
      <path d="M20 12c0 2.208-1.792 4-4 4s-4-1.792-4-4 1.792-4 4-4 4 1.792 4 4z" fill="#1ABCFE"/>
    </svg>
  ),
  connector: (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  ),
  notion: (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.14-1.4.14L4.46 4.208zM2.864 5.456v13.97c0 .7.42 1.12 1.12 1.12h.14l13.31-.98c.7-.047 1.12-.42 1.12-1.12V4.208L2.864 5.456z"/>
    </svg>
  ),
  excel: (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2 5 5h-5V4zM8 17v-2h4v2H8zm0-4v-2h8v2H8zm0-4v-2h8v2H8z"/>
    </svg>
  ),
};

const interfaceIcons: Record<string, React.ReactNode> = {
  Form: <LayoutGrid className="size-3" />,
  Batch: <FileText className="size-3" />,
  Chat: <MessageSquare className="size-3" />,
};

export function AgentCard({
  name,
  description,
  onStart,
  integrations = ["slack", "connector", "gmail"],
  labels = ["Scraping", "Sales"],
  interfaceType = "Form",
  authorName,
  createdDate,
  lastUpdatedDate,
  runsCount = 0,
  runnersCount = 0,
}: AgentCardProps) {
  const labelsContainerRef = useRef<HTMLDivElement>(null);
  const [visibleLabelCount, setVisibleLabelCount] = useState(() => Math.min(2, labels.length));

  useLayoutEffect(() => {
    setVisibleLabelCount(Math.min(2, labels.length));
  }, [labels.length]);

  useLayoutEffect(() => {
    const el = labelsContainerRef.current;
    if (!el || visibleLabelCount === 0) return;
    if (el.scrollWidth > el.clientWidth) {
      setVisibleLabelCount((n) => Math.max(0, n - 1));
    }
  }, [labels, visibleLabelCount]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onStart?.()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onStart?.();
        }
      }}
      className="group relative flex h-48 cursor-pointer flex-col rounded-lg border bg-card p-4 shadow-xs transition-colors hover:border-primary/30"
    >
      {/* Top Row: Integrations (left); Star/Form (absolute top-right) */}
      <div className="mb-3 flex items-start">
        <div className="flex items-center gap-0 -space-x-3">
          {integrations.slice(0, 3).map((integration, index) => {
            const label = integration.charAt(0).toUpperCase() + integration.slice(1);
            return (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="relative z-[1] flex size-7 shrink-0 cursor-default items-center justify-center rounded-full bg-muted ring-2 ring-card transition-transform hover:z-[2] hover:scale-105"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {integrationIcons[integration] || (
                        <div className="size-3 rounded bg-muted-foreground/20" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="border border-border bg-background px-2 py-1 shadow-md">
                    <span className="text-xs font-medium text-foreground">{label}</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>

      {/* Top-right: Form label and star button share same spot, right-aligned; star replaces Form on hover */}
      <div className="absolute right-4 top-4 flex justify-end">
        <div className="relative inline-flex items-center">
          <div
            className="flex items-center gap-1 px-1.5 py-0.5 text-xs text-muted-foreground transition-opacity group-hover:opacity-0"
            aria-hidden
          >
            {interfaceIcons[interfaceType]}
            <span>{interfaceType}</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Toggle favorite logic here
                  }}
                  className="absolute right-0 top-0 flex size-6 shrink-0 items-center justify-center rounded-md p-0.5 text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100"
                  aria-label="Favourite"
                >
                  <Star className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="border border-border bg-background px-2 py-1 shadow-md">
                <span className="text-xs font-medium text-foreground">Save as favourite</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Header/Title */}
      <h3 className="mb-1.5 text-sm font-semibold text-foreground">{name}</h3>

      {/* Description – one line, no tooltip */}
      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>

      {/* Bottom Row: Labels (left), Stats (runs) / Info icon (right; stats by default, info on hover) – single line, no wrap */}
      <div className="mt-auto flex items-center justify-between gap-2">
        <div
          ref={labelsContainerRef}
          className="flex min-w-0 flex-1 flex-nowrap items-center gap-1.5 overflow-hidden"
        >
          {labels.slice(0, visibleLabelCount).map((label, index) => (
            <span
              key={index}
              className="shrink-0 rounded-md bg-muted/70 px-2.5 py-1 text-xs font-medium text-muted-foreground"
            >
              {label}
            </span>
          ))}
          {labels.length > visibleLabelCount && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="shrink-0 cursor-default rounded-md bg-muted/70 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    +{labels.length - visibleLabelCount}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="border border-border bg-background px-2 py-1.5 shadow-md">
                  <span className="text-xs text-foreground">
                    {labels.slice(visibleLabelCount).join(", ")}
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="relative flex shrink-0 items-center">
          <div
            className="flex items-center gap-1 text-[11px] text-muted-foreground transition-opacity group-hover:opacity-0"
            aria-hidden
          >
            <BarChart2 className="size-3.5 shrink-0" />
            <span>{runsCount.toLocaleString()}</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-1/2 flex size-6 shrink-0 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
                  aria-label="More info"
                >
                  <Info className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs border border-border bg-background p-3 shadow-lg">
                <div className="flex flex-col gap-2 text-xs text-foreground">
                  <p className="font-semibold text-foreground">{name}</p>
                  <p className="leading-relaxed">{description}</p>
                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 border-t border-border pt-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <User className="size-2.5" />
                      </span>
                      {authorName ? `by ${authorName}` : "—"}
                    </span>
                    <span aria-hidden>·</span>
                    <span className="flex items-center gap-1">
                      <BarChart2 className="size-3.5 shrink-0" />
                      {runsCount.toLocaleString()} runs
                    </span>
                    {runnersCount > 0 && (
                      <>
                        <span aria-hidden>·</span>
                        <span className="flex items-center gap-1">
                          <Users className="size-3.5 shrink-0" />
                          {runnersCount.toLocaleString()} people
                        </span>
                      </>
                    )}
                    {(createdDate || lastUpdatedDate) && (
                      <>
                        <span aria-hidden>·</span>
                        {createdDate && <span>Created {createdDate}</span>}
                        {createdDate && lastUpdatedDate && <span aria-hidden>·</span>}
                        {lastUpdatedDate && <span>Updated {lastUpdatedDate}</span>}
                      </>
                    )}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
