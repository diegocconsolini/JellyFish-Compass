"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { GuideBox } from "@/components/ui/guide-box";
import { ProgressBar } from "@/components/ui/progress-bar";
import { DataTable } from "@/components/ui/data-table";
import { ApiExplorer } from "@/components/ui/api-explorer";
import { Badge } from "@/components/ui/badge";
import { mockInvestmentAllocation, mockTeamAllocations, mockPersonAllocations } from "@/data/mock-data";
import { endpointGroups } from "@/data/endpoints-full";

const colorValueMap: Record<string, string> = {
  blue: "text-blue",
  amber: "text-amber",
  violet: "text-violet",
  green: "text-green",
  ghost: "text-text-ghost",
};

const allocationGroup = endpointGroups.find((g) => g.domain === "Allocations");
const allocationEndpoints = allocationGroup ? allocationGroup.endpoints.slice(0, 5) : [];
const remainingCount = allocationGroup ? allocationGroup.endpoints.length - 5 : 0;

export default function AllocationPage() {
  const [viewMode, setViewMode] = useState<"investment" | "team" | "person">("investment");
  const [token, setToken] = useState("");

  const teamRows = mockTeamAllocations.map((row) => [
    <span key="team" className="font-medium text-text-primary">{row.team}</span>,
    <span key="fte" className="font-mono">{row.totalFte}</span>,
    <span key="features" className="font-mono">{row.features}%</span>,
    <span key="ktlo" className="font-mono">{row.ktlo}%</span>,
    <span key="techdebt" className="font-mono">{row.techDebt}%</span>,
  ]);

  const personRows = mockPersonAllocations.map((row) => [
    <span key="name" className="font-medium text-text-primary">{row.name}</span>,
    <span key="fte" className="font-mono">{row.fte}</span>,
    <span key="primary">{row.primaryCategory}</span>,
    <span key="spread" className="font-mono">{row.spreadCount}</span>,
    row.flag ? (
      <Badge
        key="flag"
        variant={row.flag === "High spread" ? "amber" : "red"}
      >
        {row.flag}
      </Badge>
    ) : (
      <span key="flag" className="text-text-ghost">—</span>
    ),
  ]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      <PageHero
        eyebrow="Allocation"
        title="Team allocation"
        subtitle="& capacity"
      />

      <GuideBox title="Scrum Master Guide: Team Allocation & Capacity">
        <p>
          <strong>FTE (Full-Time Equivalent)</strong> measures how much of a person&apos;s time is allocated to a given area.
          An FTE of <code>1.0</code> means one full-time person; <code>0.5</code> means half their time.
        </p>
        <p className="mt-2">
          Jellyfish computes FTE by analyzing where engineers spend time across investment categories:{" "}
          <code>Feature Development</code>, <code>Keep the Lights On (KTLO)</code>,{" "}
          <code>Tech Debt</code>, and <code>Growth / Scaling</code>.
          Use these views to identify imbalances and realign capacity with strategic priorities.
        </p>
        <p className="mt-2">
          There is no universal split — the right balance depends on your team&apos;s context, product maturity,
          and business priorities. Review your team&apos;s allocation trends over time and discuss significant
          shifts in your next planning session. Jellyfish&apos;s <strong>patented Work Model</strong> automatically
          calculates these allocations from work items — no manual time tracking required.
        </p>
      </GuideBox>

      {/* View mode toggle */}
      <div className="flex gap-2 mb-5">
        {(["investment", "team", "person"] as const).map((mode) => {
          const labels: Record<typeof mode, string> = {
            investment: "By Investment",
            team: "By Team",
            person: "By Person",
          };
          const isActive = viewMode === mode;
          return (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                isActive
                  ? "bg-blue-dim text-blue border-blue/30"
                  : "bg-surface-raised border-border text-text-ghost hover:text-text-dim"
              }`}
            >
              {labels[mode]}
            </button>
          );
        })}
      </div>

      {/* Conditional content */}
      <div className="rounded-xl border border-border bg-surface p-5 mb-5">
        {viewMode === "investment" && (
          <div>
            <h2 className="text-sm font-bold mb-4">Investment Allocation (FTE)</h2>
            {mockInvestmentAllocation.map((item) => (
              <ProgressBar
                key={item.label}
                label={item.label}
                value={`${item.value} FTE`}
                percent={(item.value / item.max) * 100}
                color={item.color}
                valueColor={colorValueMap[item.color]}
              />
            ))}
          </div>
        )}

        {viewMode === "team" && (
          <div>
            <h2 className="text-sm font-bold mb-4">Team Allocations</h2>
            <DataTable
              headers={["Team", "Total FTE", "Features %", "KTLO %", "Tech Debt %"]}
              rows={teamRows}
            />
          </div>
        )}

        {viewMode === "person" && (
          <div>
            <h2 className="text-sm font-bold mb-4">Person Allocations</h2>
            <DataTable
              headers={["Name", "FTE", "Primary", "Spread", "Flag"]}
              rows={personRows}
            />
          </div>
        )}
      </div>

      {/* Token input */}
      <div className="mb-4">
        <label htmlFor="api-token" className="block text-xs font-semibold text-text-ghost mb-1.5 uppercase tracking-wider">
          Jellyfish API Token (optional — for live mode)
        </label>
        <input
          id="api-token"
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="jf_..."
          className="w-full max-w-sm px-3 py-2 rounded-md border border-border bg-surface text-sm font-mono text-text-primary outline-none focus:border-blue"
        />
      </div>

      {/* API Explorer */}
      <ApiExplorer
        token={token}
        endpoints={allocationEndpoints}
        getParams={() => ({
          hierarchy_level: "1",
          start: "2026-01-01",
          end: "2026-03-31",
        })}
      />
      {remainingCount > 0 && (
        <p className="text-xs text-text-ghost mb-5">
          +{remainingCount} more allocation endpoints available in the full API reference.
        </p>
      )}

      <GuideBox title="Scrum Master Playbook: Capacity Management">
        <p className="font-semibold text-text-primary mb-2">Three topics every SM should track:</p>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>FTE drift</strong> — Compare planned vs. actual FTE each sprint.
            Use <code>allocations_by_team</code> to detect teams silently absorbing KTLO at the cost of features.
          </li>
          <li>
            <strong>High spread individuals</strong> — Engineers working across 4+ categories lose context-switching efficiency.
            Flag them in <code>allocations_by_person</code> and discuss focus in 1:1s.
          </li>
          <li>
            <strong>Unallocated capacity</strong> — Any FTE not mapped to a category is invisible to planning.
            Run <code>allocations_by_investment_category</code> regularly and drive unallocated to zero before quarter close.
          </li>
        </ol>
      </GuideBox>
    </div>
  );
}
