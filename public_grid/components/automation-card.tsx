"use client";

import { ZapIcon, ClockIcon, SquareChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Automation } from "@/lib/automations-data";

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
  connector: (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  ),
  excel: (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2 5 5h-5V4zM8 17v-2h4v2H8zm0-4v-2h8v2H8zm0-4v-2h8v2H8z"/>
    </svg>
  ),
};

interface AutomationCardProps {
  automation: Automation;
  onToggle?: (id: string) => void;
  onClick?: (automation: Automation) => void;
}

export function AutomationCard({ automation, onToggle, onClick }: AutomationCardProps) {
  const isActive = automation.status === "active";
  const isScheduled = automation.triggerType !== "slack";
  const isSlackTriggered = automation.triggerType === "slack";
  const footerIntegrations = isSlackTriggered
    ? automation.integrations.filter((i) => i !== "slack")
    : automation.integrations;

  return (
    <div className="group/card relative rounded-xl">
      <div
        role="button"
        tabIndex={0}
        onClick={() => onClick?.(automation)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(automation); }
        }}
        className="relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-muted/20 shadow transition-all duration-150 will-change-transform group-hover/card:shadow-md group-hover/card:-translate-y-0.5 group-hover/card:border-foreground/30"
      >
        {/* Header */}
        <div className="flex items-start gap-3 p-4 pb-0">
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
            {isScheduled
              ? <ClockIcon className="size-5 text-muted-foreground" />
              : <ZapIcon className="size-5 text-muted-foreground" />
            }
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h3 className="truncate text-sm font-medium">{automation.name}</h3>
            <div className="flex items-center gap-1.5 overflow-hidden text-xs whitespace-nowrap text-muted-foreground">
              <ZapIcon className="size-3.5 shrink-0 opacity-60" />
              <span className="truncate">Automation</span>
            </div>
          </div>

          {/* Status toggle */}
          <Switch
            checked={isActive}
            onCheckedChange={() => onToggle?.(automation.id)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Description */}
        {automation.description && (
          <p className="line-clamp-2 px-4 pt-2 text-xs text-muted-foreground">{automation.description}</p>
        )}

        {/* Footer */}
        <div className="mt-auto grid grid-cols-[auto_1fr] items-center gap-4 px-4 pb-4 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground/60">
              {isSlackTriggered
                ? `${automation.runsCount} runs`
                : `${automation.schedule} · ${automation.runsCount} runs`
              }
            </span>
          </div>

          <div className="flex items-center justify-end gap-1.5">
            {/* Trigger icon */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="flex size-6 shrink-0 cursor-default items-center justify-center rounded-md border bg-background transition-transform hover:scale-105"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isSlackTriggered
                      ? integrationIcons.slack
                      : <ClockIcon className="size-3.5 text-muted-foreground" />}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="border border-border bg-background px-2 py-1 shadow-md">
                  <span className="text-xs font-medium text-foreground">
                    {isSlackTriggered ? "Slack trigger" : automation.schedule}
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {footerIntegrations.length > 0 && (
                <>
                  {/* Divider */}
                  <div className="h-4 w-px bg-border" />

                  {/* Integration icons */}
                  <div className="flex items-center -space-x-1.5">
                    {footerIntegrations.slice(0, 3).map((integration, index) => (
                      <TooltipProvider key={index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="flex size-6 shrink-0 cursor-default items-center justify-center rounded-md border bg-background transition-transform hover:scale-105"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {integrationIcons[integration] ?? <SquareChevronRight className="size-3" />}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="border border-border bg-background px-2 py-1 shadow-md">
                            <span className="text-xs font-medium text-foreground capitalize">{integration}</span>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                    {footerIntegrations.length > 3 && (
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-md border bg-muted text-[10px] font-medium text-muted-foreground">
                        +{footerIntegrations.length - 3}
                      </div>
                    )}
                  </div>
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
