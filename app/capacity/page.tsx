"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { SectionDivider } from "@/components/ui/section-divider";
import { BottomPanel } from "@/components/ui/bottom-panel";
import { GuidePanel } from "@/components/ui/guide-panel";
import { ApiDrawer } from "@/components/ui/api-drawer";
import { ProgressBar } from "@/components/ui/progress-bar";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { mockCapacityPlan, mockSprintForecast } from "@/data/mock-data";
import { endpointGroups } from "@/data/endpoints-full";

const allocationGroup = endpointGroups.find((g) => g.domain === "Allocations");
const capacityEndpoints = allocationGroup
  ? allocationGroup.endpoints.filter((e) =>
      ["allocations_by_team", "allocations_by_person"].includes(e.name)
    )
  : [];

const statusBadgeVariant: Record<string, "green" | "amber" | "red"> = {
  ok: "green",
  tight: "amber",
  over: "red",
};

const statusLabel: Record<string, string> = {
  ok: "OK",
  tight: "Tight",
  over: "Over",
};

const progressColor: Record<string, "green" | "amber" | "red"> = {
  ok: "green",
  tight: "amber",
  over: "red",
};

export default function CapacityPage() {
  const [token, setToken] = useState("");
  const [view, setView] = useState<"team" | "forecast">("team");

  const teamRows = mockCapacityPlan.map((row) => [
    <span key="team" className="font-medium text-text-primary">
      {row.team}
    </span>,
    <span key="available" className="font-mono">
      {row.availableFte}
    </span>,
    <span key="planned" className="font-mono">
      {row.plannedFte}
    </span>,
    <span
      key="gap"
      className={`font-mono font-semibold ${row.gap >= 0 ? "text-green" : "text-red"}`}
    >
      {row.gap >= 0 ? `+${row.gap}` : row.gap}
    </span>,
    <Badge key="status" variant={statusBadgeVariant[row.status]}>
      {statusLabel[row.status]}
    </Badge>,
  ]);

  const forecastRows = mockSprintForecast.map((row) => [
    <span key="sprint" className="font-medium text-text-primary">
      {row.sprint}
    </span>,
    <span key="available" className="font-mono">
      {row.totalAvailable}
    </span>,
    <span key="planned" className="font-mono">
      {row.totalPlanned}
    </span>,
    <Badge key="status" variant={statusBadgeVariant[row.status]}>
      {statusLabel[row.status]}
    </Badge>,
  ]);

  const smGuideContent = (
    <>
      <p>
        The Capacity Planner predicts workload capacity by analyzing historical
        allocation data, ongoing projects, planned work, upcoming priorities,
        and team size. It helps you set realistic sprint commitments and avoid
        overloading teams. When circumstances change, make dynamic adjustments
        by refining project scopes, reallocating resources, and recalibrating
        delivery plans — maintaining momentum without team burnout.
      </p>
      <ul className="list-disc list-inside space-y-2 mt-4">
        <li>
          <strong>Sprint Planning:</strong> Pull{" "}
          <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
            allocations_by_team
          </code>{" "}
          before planning to see actual available FTE. If planned work exceeds
          capacity, negotiate scope before committing — not after the sprint
          starts.
        </li>
        <li>
          <strong>Quarter Planning:</strong> Compare capacity across the next 3
          sprints. If a team is overcommitted in Sprint 27, start rebalancing
          now rather than discovering it mid-sprint.
        </li>
        <li>
          <strong>Stakeholder Communication:</strong> Use the gap data to
          explain delivery risks factually: &apos;Platform team is 0.9 FTE over
          capacity — either scope must decrease or timeline must extend.&apos;
        </li>
      </ul>
    </>
  );

  const poGuideContent = (
    <>
      <p>
        Use historical capacity data to{" "}
        <strong>set realistic delivery expectations</strong>. If a team has 8.2
        FTE available but 9.1 planned, something must give — negotiate scope or
        timeline before committing.
      </p>
      <p className="mt-2">
        Build trust in <strong>roadmap predictability</strong> by showing
        data-backed forecasts. When priorities shift, model the impact on
        timeline before committing to stakeholders.
      </p>
      <p className="mt-2 text-xs text-text-ghost">
        Source: jellyfish.co/solutions/capacity-planner/ — &quot;Build
        realistic roadmaps so your teams can thrive.&quot;
      </p>
    </>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      <PageHero
        eyebrow="Capacity Planner"
        title="Forecasting"
        subtitle="& workload planning"
      />

      <SectionDivider />

      {/* View toggle */}
      <div className="flex gap-2 mb-5">
        {(["team", "forecast"] as const).map((mode) => {
          const labels: Record<typeof mode, string> = {
            team: "By Team",
            forecast: "Sprint Forecast",
          };
          const isActive = view === mode;
          return (
            <button
              key={mode}
              onClick={() => setView(mode)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                isActive
                  ? "bg-blue/[0.08] text-blue border-blue/30"
                  : "bg-surface-raised border-border text-text-ghost hover:text-text-dim"
              }`}
            >
              {labels[mode]}
            </button>
          );
        })}
      </div>

      {/* Main content panel */}
      <div className="rounded-xl border border-border bg-surface p-5 mb-5">
        {view === "team" && (
          <div>
            <h2 className="text-sm font-bold mb-4">Team Capacity (FTE)</h2>
            <DataTable
              headers={["Team", "Available FTE", "Planned FTE", "Gap", "Status"]}
              rows={teamRows}
            />
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-text-dim mb-3">
                Capacity Utilization
              </h3>
              {mockCapacityPlan.map((row) => (
                <ProgressBar
                  key={row.team}
                  label={row.team}
                  value={`${row.plannedFte} / ${row.availableFte} FTE`}
                  percent={Math.min((row.plannedFte / row.availableFte) * 100, 100)}
                  color={progressColor[row.status]}
                />
              ))}
            </div>
          </div>
        )}

        {view === "forecast" && (
          <div>
            <h2 className="text-sm font-bold mb-4">Sprint Forecast</h2>
            <DataTable
              headers={["Sprint", "Available", "Planned", "Status"]}
              rows={forecastRows}
            />
          </div>
        )}
      </div>

      <BottomPanel
        guidesContent={
          <GuidePanel
            scrumMaster={smGuideContent}
            productOwner={poGuideContent}
          />
        }
        apiExplorerContent={
          <ApiDrawer
            token={token}
            setToken={setToken}
            endpoints={capacityEndpoints}
            getParams={() => ({
              hierarchy_level: "1",
              start: "2026-01-01",
              end: "2026-03-31",
            })}
          />
        }
      />
    </div>
  );
}
