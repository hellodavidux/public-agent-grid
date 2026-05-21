"use client";

import { useState } from "react";
import {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  ZapIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Automation } from "@/lib/automations-data";

const SLACK_WORKSPACES = [
  { id: "ws-1", name: "Stack AI", icon: "🏢" },
  { id: "ws-2", name: "Marketing Team", icon: "📣" },
  { id: "ws-3", name: "Engineering", icon: "⚙️" },
];

const SLACK_CHANNELS = [
  { id: "ch-1", name: "#general" },
  { id: "ch-2", name: "#sales-leads" },
  { id: "ch-3", name: "#compliance" },
  { id: "ch-4", name: "#marketing" },
  { id: "ch-5", name: "#engineering" },
];

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const FREQUENCIES = ["Daily", "Weekly", "Monthly", "Custom"];

const INTEGRATIONS = [
  { id: "google-calendar", name: "Google Calendar", icon: (
    <svg className="size-5" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#fff"/>
      <path d="M16.5 3h-9A4.5 4.5 0 0 0 3 7.5v9A4.5 4.5 0 0 0 7.5 21h9a4.5 4.5 0 0 0 4.5-4.5v-9A4.5 4.5 0 0 0 16.5 3z" fill="#fff"/>
      <path d="M16.5 3h-9A4.5 4.5 0 0 0 3 7.5v9A4.5 4.5 0 0 0 7.5 21h9a4.5 4.5 0 0 0 4.5-4.5v-9A4.5 4.5 0 0 0 16.5 3z" stroke="#E0E0E0" strokeWidth="1"/>
      <path d="M7.5 9.5h9M7.5 12.5h9M7.5 15.5h5" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="7" y="6" width="2" height="3" rx="1" fill="#EA4335"/>
      <rect x="15" y="6" width="2" height="3" rx="1" fill="#EA4335"/>
    </svg>
  )},
  { id: "outlook", name: "Outlook Calendar", icon: (
    <svg className="size-5" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#0078D4"/>
      <path d="M13 5h6v14h-6V5z" fill="#fff" fillOpacity="0.3"/>
      <path d="M5 8h8v8H5V8z" fill="#fff"/>
      <path d="M9 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="#0078D4"/>
    </svg>
  )},
];

interface AutomationSetupModalProps {
  open: boolean;
  onClose: () => void;
  automation: Automation | null;
  /** If true, this is a first-time "set up" rather than "edit" */
  isSetup?: boolean;
  onSave?: () => void;
}

export function AutomationSetupModal({
  open,
  onClose,
  automation,
  isSetup = false,
  onSave,
}: AutomationSetupModalProps) {
  const isSlack = automation?.triggerType === "slack";

  // Schedule state
  const [frequency, setFrequency] = useState("Weekly");
  const [day, setDay] = useState("Monday");
  const [time, setTime] = useState("09:00");

  // Slack state
  const [workspace, setWorkspace] = useState(SLACK_WORKSPACES[0].id);
  const [channel, setChannel] = useState(SLACK_CHANNELS[1].id);

  // Integration connection state
  const [connected, setConnected] = useState<Record<string, boolean>>({});

  const requiredIntegrations = isSlack
    ? [INTEGRATIONS[0]]
    : [INTEGRATIONS[0], INTEGRATIONS[1]];

  const allConnected = requiredIntegrations.every((i) => connected[i.id]);

  const handleConnect = (id: string) => {
    setConnected((prev) => ({ ...prev, [id]: true }));
  };

  const handleSave = () => {
    onSave?.();
    onClose();
  };

  const triggerLabel = isSlack
    ? `#${SLACK_CHANNELS.find((c) => c.id === channel)?.name?.replace("#", "") ?? "channel"}`
    : frequency === "Daily"
    ? `Every day at ${time}`
    : frequency === "Weekly"
    ? `Every ${day} at ${time}`
    : frequency === "Custom"
    ? "Custom schedule"
    : `Monthly at ${time}`;

  if (!automation) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle className="sr-only">{isSetup ? "Set up automation" : "Edit automation"}</DialogTitle>
      <DialogDescription className="sr-only">Configure the trigger and integrations for {automation.name}</DialogDescription>
      <DialogContent className="p-0 overflow-hidden max-w-[480px]">
        {/* Header */}
        <div className="flex flex-col items-center px-8 pt-10 pb-6 border-b border-border">
          {/* App icon */}
          <div className="flex size-14 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md mb-4">
            {isSlack ? (
              <svg className="size-7" viewBox="0 0 24 24" fill="none">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="white"/>
                <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="white"/>
                <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="white"/>
                <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="white"/>
              </svg>
            ) : (
              <CalendarIcon className="size-7" />
            )}
          </div>
          <h2 className="text-lg font-semibold text-foreground text-center">{automation.name}</h2>
          {automation.description && (
            <p className="text-xs text-muted-foreground text-center mt-1 max-w-xs leading-relaxed line-clamp-2">
              {automation.description}
            </p>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 h-[360px] overflow-y-auto">

          {/* Trigger section */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2.5">Trigger</p>

            {isSlack ? (
              <div className="space-y-3">
                {/* Workspace */}
                <div className="space-y-1.5">
                  <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wide font-medium">Workspace</p>
                  <div className="space-y-1.5">
                    {SLACK_WORKSPACES.map((ws) => (
                      <button
                        key={ws.id}
                        onClick={() => setWorkspace(ws.id)}
                        className={cn(
                          "flex items-center gap-2.5 w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors",
                          workspace === ws.id
                            ? "border-foreground bg-foreground/5 text-foreground"
                            : "border-border bg-background text-muted-foreground hover:bg-muted/40"
                        )}
                      >
                        <span className="text-base">{ws.icon}</span>
                        <span className="flex-1 text-left font-medium text-sm">{ws.name}</span>
                        {workspace === ws.id && <CheckIcon className="size-4 text-foreground" />}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Channel */}
                <div className="space-y-1.5">
                  <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wide font-medium">Channel</p>
                  <div className="relative">
                    <select
                      value={channel}
                      onChange={(e) => setChannel(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-border bg-background px-3.5 py-2.5 pr-9 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    >
                      {SLACK_CHANNELS.map((ch) => (
                        <option key={ch.id} value={ch.id}>{ch.name}</option>
                      ))}
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Frequency dropdown */}
                <div className="relative">
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-border bg-background px-3.5 py-2.5 pr-9 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  >
                    {FREQUENCIES.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                </div>

                {/* Day dropdown — always rendered to prevent layout shift */}
                <div className={cn("relative", frequency !== "Weekly" && "invisible")}>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    disabled={frequency !== "Weekly"}
                    className="w-full appearance-none rounded-xl border border-border bg-background px-3.5 py-2.5 pr-9 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  >
                    {DAYS_OF_WEEK.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                </div>

                {/* Time — hidden for Custom */}
                <div className={cn("relative max-w-[180px]", frequency === "Custom" && "invisible")}>
                  <ClockIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    disabled={frequency === "Custom"}
                    className="w-full rounded-xl border border-border bg-background pl-8 pr-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  />
                </div>

                {/* Custom cron expression — always rendered, only visible for Custom */}
                <div className={cn(frequency !== "Custom" && "invisible")}>
                  <input
                    type="text"
                    placeholder="Cron expression, e.g. 0 9 * * 1"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  />
                </div>

                {/* Preview chip */}
                <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3.5 py-2.5">
                  <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Runs <span className="font-medium text-foreground">{triggerLabel}</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Integrations section */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2.5">Integrations</p>
            <div className="space-y-0 rounded-xl border border-border overflow-hidden divide-y divide-border">
              {requiredIntegrations.map((integration, idx) => (
                <div key={integration.id}>
                  <div className="flex items-center gap-3 px-4 py-3.5 bg-background">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-white overflow-hidden">
                      {integration.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{integration.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {connected[integration.id] ? "Connected" : "Not connected"}
                      </p>
                    </div>
                    {connected[integration.id] ? (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                        <CheckIcon className="size-3.5" />
                        Connected
                      </div>
                    ) : (
                      <button
                        onClick={() => handleConnect(integration.id)}
                        className="rounded-lg border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                  {idx < requiredIntegrations.length - 1 && (
                    <div className="flex items-center gap-3 px-4 py-1.5 bg-muted/20">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">or</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex flex-col gap-3">
          {!allConnected && (
            <p className="text-xs text-muted-foreground text-center">
              Connect all required integrations to continue
            </p>
          )}
          <button
            onClick={handleSave}
            disabled={!allConnected}
            className={cn(
              "w-full rounded-xl py-2.5 text-sm font-medium transition-colors",
              allConnected
                ? "bg-foreground text-background hover:bg-foreground/85"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {isSetup ? "Activate" : "Save changes"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
