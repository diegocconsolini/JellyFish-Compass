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

  const smGuideContent = (
    <div className="space-y-3">
      <p>
        <strong>FTE (Full-Time Equivalent)</strong> measures how much of a person&apos;s time is allocated to a given area.
        An FTE of <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">1.0</code> means one full-time person;{" "}
        <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">0.5</code> means half their time.
      </p>
      <p>
        Jellyfish computes FTE by analyzing where engineers spend time across investment categories:{" "}
        <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">Feature Development</code>,{" "}
        <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">Keep the Lights On (KTLO)</code>,{" "}
        <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">Tech Debt</code>, and{" "}
        <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">Growth / Scaling</code>.
        Use these views to identify imbalances and realign capacity with strategic priorities.
      </p>
      <p>
        There is no universal split — the right balance depends on your team&apos;s context, product maturity,
        and business priorities. Review your team&apos;s allocation trends over time and discuss significant
        shifts in your next planning session. Jellyfish&apos;s <strong>patented Work Model</strong> automatically
        calculates these allocations from work items — no manual time tracking required.
      </p>
      <p className="font-semibold text-text-primary pt-1">Three topics every SM should track:</p>
      <ol className="list-decimal list-inside space-y-2">
        <li>
          <strong>FTE drift</strong> — Compare planned vs. actual FTE each sprint.
          Use{" "}
          <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">allocations_by_team</code>{" "}
          to detect teams silently absorbing KTLO at the cost of features.
        </li>
        <li>
          <strong>High spread individuals</strong> — Engineers working across 4+ categories lose context-switching efficiency.
          Flag them in{" "}
          <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">allocations_by_person</code>{" "}
          and discuss focus in 1:1s.
        </li>
        <li>
          <strong>Unallocated capacity</strong> — Any FTE not mapped to a category is invisible to planning.
          Run{" "}
          <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">allocations_by_investment_category</code>{" "}
          regularly and drive unallocated to zero before quarter close.
        </li>
      </ol>
    </div>
  );

  const poGuideContent = (
    <div className="space-y-3">
      <p>
        Use allocation data to verify that <strong>engineering investment matches roadmap priorities</strong>.
        If your top product initiative has 10% of planned effort but 40% goes to KTLO, that&apos;s a misalignment to raise in planning.
      </p>
      <p>
        Jellyfish&apos;s <strong>patented Work Model</strong> automatically calculates how effort distributes across product lines,
        initiatives, and deliverables — no manual tracking required. Use{" "}
        <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">allocations_by_work_category</code>{" "}
        to see effort by initiative.
      </p>
      <p>
        Compare effort across teams to identify where investment concentrates and whether it matches your product strategy.
      </p>
    </div>
  );

  const emGuideContent = (
    <div className="space-y-3">
      <p>
        Use{" "}
        <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">allocations_by_investment_category</code>,{" "}
        <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">allocations_by_team</code>, and{" "}
        <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">allocations_by_person</code>{" "}
        to see where engineering effort actually goes. Jellyfish automatically infers allocation from Git and Jira data without requiring manual time tracking.
      </p>
      <p className="font-semibold text-text-dim">Over-Allocation Detection</p>
      <p>
        Use{" "}
        <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">allocations_by_person</code>{" "}
        to identify engineers spread across too many projects. High spread individuals are at risk of context switching overhead and burnout. Target anyone allocated across 3+ concurrent projects for workload rebalancing.
      </p>
      <p className="font-semibold text-text-dim">Hidden Work Visibility</p>
      <p>
        Compare planned allocation against actual from{" "}
        <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">allocations_by_investment_category</code>.
        The gap reveals unplanned work — support tickets, maintenance tasks, incident response — that consumes capacity invisibly.
      </p>
      <p className="font-semibold text-text-dim">Team Composition</p>
      <p>
        Use{" "}
        <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">allocations_by_team</code>{" "}
        to evaluate whether teams have the right mix of skills for their current workload.
      </p>
      <p className="mt-3 text-xs text-text-ghost">
        Source: jellyfish.co/case-studies/jobvite/ — backlog shrunk from 20+ to 4 items by understanding true work allocation.
      </p>
    </div>
  );

  const pmGuideContent = (
    <div className="space-y-3">
      <p>
        Use{" "}
        <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">allocations_by_investment_category</code>{" "}
        to answer the fundamental PM question: where is engineering actually spending time? Jellyfish research shows engineering leaders overestimate roadmap allocation by 62%.
      </p>
      <p className="font-semibold text-text-dim">Investment Visibility</p>
      <p>
        Pull{" "}
        <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">allocations_by_investment_category</code>{" "}
        to present leadership with the real picture: &ldquo;We have 50 engineers, but only 30 FTEs are available for new roadmap work.&rdquo;
      </p>
      <p className="font-semibold text-text-dim">Headcount Justification</p>
      <p>
        Use{" "}
        <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">allocations_by_team</code>{" "}
        to build a data-backed hiring case with specific FTE numbers and trade-off options.
      </p>
      <p className="font-semibold text-text-dim">FTE Language</p>
      <p>
        Allocation uses Full-Time Equivalents — the language finance and leadership understand.
      </p>
      <p className="mt-3 text-xs text-text-ghost">
        Source: jellyfish.co/case-studies/salsify/ — eliminated 700 hours/year of manual tracking; justified 25% engineering headcount growth.
      </p>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      <PageHero
        eyebrow="Allocation"
        title="Team allocation"
        subtitle="& capacity"
      />

      <SectionDivider />

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
                  ? "bg-blue/[0.08] text-blue border-blue/30"
                  : "bg-surface-raised border-border text-text-ghost hover:text-text-dim"
              }`}
            >
              {labels[mode]}
            </button>
          );
        })}
      </div>

      {/* Conditional content panel */}
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

      <BottomPanel
        guidesContent={
          <GuidePanel
            tabs={[
              { key: "sm", label: "Scrum Master", content: smGuideContent },
              { key: "po", label: "Product Owner", content: poGuideContent },
              { key: "em", label: "Eng Manager", content: emGuideContent },
              { key: "pm", label: "Prod Manager", content: pmGuideContent },
            ]}
          />
        }
        apiExplorerContent={
          <div className="space-y-3">
            <ApiDrawer
              token={token}
              setToken={setToken}
              endpoints={allocationEndpoints}
              getParams={() => ({
                hierarchy_level: "1",
                start: "2026-01-01",
                end: "2026-03-31",
              })}
            />
            {remainingCount > 0 && (
              <p className="text-xs text-text-ghost">
                +{remainingCount} more allocation endpoints available in the full API reference.
              </p>
            )}
          </div>
        }
      />
    </div>
  );
}
