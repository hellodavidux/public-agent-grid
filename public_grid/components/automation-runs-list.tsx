"use client";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getAgentIcon } from "@/lib/agent-icons";
import { cn } from "@/lib/utils";

export interface AutomationRunItem {
  id: string;
  title: string;
  statusLabel: string;
  time: string;
  agentId?: string;
  automationId?: string;
}

interface AutomationRunsListProps {
  runs: AutomationRunItem[];
  showIcons?: boolean;
  onRunClick?: (run: AutomationRunItem) => void;
}

export function AutomationRunsList({
  runs,
  showIcons = false,
  onRunClick,
}: AutomationRunsListProps) {
  return (
    <Table>
      <TableBody>
        {runs.map((run) => (
          <TableRow
            key={run.id}
            className={cn(onRunClick && "cursor-pointer")}
            onClick={() => onRunClick?.(run)}
          >
            <TableCell className="w-full pl-0">
              <div
                className={cn(
                  "flex items-start",
                  showIcons ? "gap-4" : "justify-between gap-6"
                )}
              >
                {showIcons && (
                  <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-background text-muted-foreground">
                    <span className="flex size-5 items-center justify-center">
                      {getAgentIcon(run.agentId, "size-5 text-muted-foreground")}
                    </span>
                  </div>
                )}
                <div className="flex min-w-0 flex-1 items-start justify-between gap-6">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight">
                      {run.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{run.statusLabel}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums pt-0.5">
                    {run.time}
                  </span>
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
