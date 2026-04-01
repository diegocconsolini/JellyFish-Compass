"use client";

import { StatCard } from "@/components/ui/stat-card";
import { BarChart } from "@/components/ui/bar-chart";
import { DataTable } from "@/components/ui/data-table";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ApiDrawer } from "@/components/ui/api-drawer";
import { SectionDivider } from "@/components/ui/section-divider";
import { allEndpoints } from "@/data/endpoints-full";
import {
  mockSprintKpis,
  mockScopeEffort,
  mockDeliverables,
  mockInvestmentAllocation,
  mockTeamAllocations,
  mockPersonAllocations,
  mockDevExScores,
  mockTeamBenchmarks,
  mockCapacityPlan,
  mockAiAdoption,
  mockAiBeforeAfter,
  mockProductFlow,
} from "@/data/mock-data";
import type { PlaybookStep } from "@/lib/types";

// ---- Internal visualization component ----

function StepVisualization({
  type,
  dataKey,
}: {
  type: string;
  dataKey: string;
}) {
  if (type === "stat-cards") {
    if (dataKey === "sprintKpis") {
      const kpis = mockSprintKpis;
      return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Avg Velocity"
            value={kpis.avgVelocity.value}
            note={kpis.avgVelocity.unit}
            trend={kpis.avgVelocity.trend}
            trendDirection={kpis.avgVelocity.direction}
            color="blue"
          />
          <StatCard
            label="Completion Rate"
            value={kpis.completionRate.value}
            note={kpis.completionRate.unit}
            trend={kpis.completionRate.trend}
            trendDirection={kpis.completionRate.direction}
            color="green"
          />
          <StatCard
            label="Carry-Over"
            value={kpis.carryOver.value}
            note={kpis.carryOver.unit}
            trend={kpis.carryOver.trend}
            trendDirection={kpis.carryOver.direction}
            color="amber"
          />
          <StatCard
            label="Sprint Cadence"
            value={kpis.sprintCadence.value}
            note={kpis.sprintCadence.unit}
            trend={kpis.sprintCadence.trend}
            trendDirection={kpis.sprintCadence.direction}
            color="violet"
          />
        </div>
      );
    }
  }

  if (type === "bar-chart") {
    if (dataKey === "scopeEffort") {
      return (
        <BarChart
          title="Scope vs Effort Over Time"
          data={mockScopeEffort.map((d) => ({
            label: d.week,
            values: [
              { height: d.scope, className: "bg-blue opacity-70" },
              { height: d.effort, className: "bg-green opacity-70" },
            ],
          }))}
          legend={[
            { label: "Scope", className: "bg-blue opacity-70" },
            { label: "Effort", className: "bg-green opacity-70" },
          ]}
        />
      );
    }

    if (dataKey === "teamAllocations") {
      return (
        <BarChart
          title="Team Allocation by Category"
          data={mockTeamAllocations.map((d) => ({
            label: d.team,
            values: [
              { height: d.features, className: "bg-blue opacity-80", label: `${d.features}%` },
              { height: d.ktlo, className: "bg-amber opacity-80" },
              { height: d.techDebt, className: "bg-violet opacity-80" },
            ],
          }))}
          legend={[
            { label: "Features", className: "bg-blue opacity-80" },
            { label: "KTLO", className: "bg-amber opacity-80" },
            { label: "Tech Debt", className: "bg-violet opacity-80" },
          ]}
        />
      );
    }

    if (dataKey === "aiAdoption") {
      return (
        <BarChart
          title="AI Tool Adoption by Team"
          data={mockAiAdoption.map((d) => ({
            label: d.team,
            values: [
              { height: d.copilot, className: "bg-blue opacity-80", label: `${d.copilot}%` },
              { height: d.cursor, className: "bg-violet opacity-80" },
              { height: d.claudeCode, className: "bg-green opacity-80" },
            ],
          }))}
          legend={[
            { label: "Copilot", className: "bg-blue opacity-80" },
            { label: "Cursor", className: "bg-violet opacity-80" },
            { label: "Claude Code", className: "bg-green opacity-80" },
          ]}
        />
      );
    }

    if (dataKey === "productFlow") {
      return (
        <BarChart
          title="Cycle Time vs Lead Time by Team"
          data={mockProductFlow.map((d) => ({
            label: d.team,
            values: [
              {
                height: Math.round((d.cycleTimeDays / 10) * 100),
                className: "bg-blue opacity-80",
                label: `${d.cycleTimeDays}d`,
              },
              {
                height: Math.round((d.leadTimeDays / 10) * 100),
                className: "bg-amber opacity-80",
              },
            ],
          }))}
          legend={[
            { label: "Cycle Time", className: "bg-blue opacity-80" },
            { label: "Lead Time", className: "bg-amber opacity-80" },
          ]}
        />
      );
    }
  }

  if (type === "data-table") {
    if (dataKey === "deliverables") {
      const statusColor: Record<string, string> = {
        "on-track": "text-green",
        "at-risk": "text-amber",
        behind: "text-red",
      };
      return (
        <DataTable
          caption="Deliverables progress table"
          headers={["Name", "Category", "Issues", "% Complete", "Status"]}
          rows={mockDeliverables.map((d) => [
            <span key="name" className="font-medium text-text-primary">{d.name}</span>,
            <span key="cat" className="text-text-dim">{d.category}</span>,
            <span key="issues" className="font-mono">{d.issues}</span>,
            <span key="pct" className="font-mono">{d.percentComplete}%</span>,
            <span key="status" className={`font-semibold capitalize ${statusColor[d.status]}`}>{d.status}</span>,
          ])}
        />
      );
    }

    if (dataKey === "personAllocations") {
      return (
        <DataTable
          caption="Person allocation table"
          headers={["Name", "FTE", "Primary Category", "Spread Count", "Flag"]}
          rows={mockPersonAllocations.map((d) => [
            <span key="name" className="font-medium text-text-primary">{d.name}</span>,
            <span key="fte" className="font-mono">{d.fte}</span>,
            <span key="primary" className="text-text-dim">{d.primaryCategory}</span>,
            <span key="spread" className="font-mono">{d.spreadCount}</span>,
            d.flag ? (
              <span key="flag" className="text-amber font-semibold text-xs">{d.flag}</span>
            ) : (
              <span key="flag" className="text-text-ghost">—</span>
            ),
          ])}
        />
      );
    }

    if (dataKey === "teamBenchmarks") {
      return (
        <DataTable
          caption="Team benchmarks table"
          headers={["Team", "Velocity", "Cycle Time (days)", "PR Review (hrs)", "Deploys/wk", "DevEx Score"]}
          rows={mockTeamBenchmarks.map((d) => [
            <span key="team" className="font-medium text-text-primary">{d.team}</span>,
            <span key="vel" className="font-mono">{d.velocity}</span>,
            <span key="cycle" className="font-mono">{d.cycleTimeDays}</span>,
            <span key="pr" className="font-mono">{d.prReviewHours}</span>,
            <span key="deploy" className="font-mono">{d.deploymentsPerWeek}</span>,
            <span key="devex" className="font-mono">{d.devexScore}</span>,
          ])}
        />
      );
    }

    if (dataKey === "capacityPlan") {
      const statusColor: Record<string, string> = {
        ok: "text-green",
        tight: "text-amber",
        over: "text-red",
      };
      return (
        <DataTable
          caption="Capacity plan table"
          headers={["Team", "Available FTE", "Planned FTE", "Gap", "Status"]}
          rows={mockCapacityPlan.map((d) => [
            <span key="team" className="font-medium text-text-primary">{d.team}</span>,
            <span key="avail" className="font-mono">{d.availableFte}</span>,
            <span key="plan" className="font-mono">{d.plannedFte}</span>,
            <span key="gap" className={`font-mono font-semibold ${d.gap < 0 ? "text-red" : "text-green"}`}>{d.gap > 0 ? `+${d.gap}` : d.gap}</span>,
            <span key="status" className={`font-semibold capitalize ${statusColor[d.status]}`}>{d.status}</span>,
          ])}
        />
      );
    }

    if (dataKey === "aiBeforeAfter") {
      return (
        <DataTable
          caption="AI before and after comparison"
          headers={["Team", "PRs/wk Before", "PRs/wk After", "Cycle Time Before", "Cycle Time After", "Review hrs Before", "Review hrs After"]}
          rows={mockAiBeforeAfter.map((d) => [
            <span key="team" className="font-medium text-text-primary">{d.team}</span>,
            <span key="prb" className="font-mono text-text-dim">{d.before.prsPerWeek}</span>,
            <span key="pra" className="font-mono text-green">{d.after.prsPerWeek}</span>,
            <span key="ctb" className="font-mono text-text-dim">{d.before.cycleTimeDays}d</span>,
            <span key="cta" className="font-mono text-green">{d.after.cycleTimeDays}d</span>,
            <span key="rvb" className="font-mono text-text-dim">{d.before.reviewTimeHours}h</span>,
            <span key="rva" className="font-mono text-green">{d.after.reviewTimeHours}h</span>,
          ])}
        />
      );
    }
  }

  if (type === "progress-bars") {
    if (dataKey === "investmentAllocation") {
      return (
        <div className="space-y-1">
          {mockInvestmentAllocation.map((d) => (
            <ProgressBar
              key={d.label}
              label={d.label}
              value={`${d.value} FTE`}
              percent={Math.round((d.value / d.max) * 100)}
              color={d.color}
            />
          ))}
        </div>
      );
    }

    if (dataKey === "devExScores") {
      return (
        <div className="space-y-1">
          {mockDevExScores.map((d) => (
            <ProgressBar
              key={d.team}
              label={d.team}
              value={`${d.score}`}
              percent={d.score}
              color={d.color}
            />
          ))}
        </div>
      );
    }
  }

  return null;
}

// ---- Exported component ----

export function PlaybookStepSection({
  index,
  step,
  token,
  setToken,
}: {
  index: number;
  step: PlaybookStep;
  token: string;
  setToken: (t: string) => void;
}) {
  const stepEndpoints = step.endpoints
    ? allEndpoints.filter((ep) => step.endpoints!.includes(ep.name))
    : [];

  return (
    <section aria-labelledby={`step-${index}-heading`}>
      <div className="flex items-start gap-4 mb-3">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-raised border border-border-vivid flex items-center justify-center text-sm font-bold text-text-dim"
          aria-hidden="true"
        >
          {index + 1}
        </div>
        <h3
          id={`step-${index}-heading`}
          className="text-lg font-semibold text-text-primary leading-snug pt-1"
        >
          {step.title}
        </h3>
      </div>

      <p className="text-sm text-text-dim leading-relaxed mb-4 ml-12">
        {step.description}
      </p>

      {step.visualization && (
        <div className="ml-12 mb-4">
          <StepVisualization
            type={step.visualization.type}
            dataKey={step.visualization.dataKey}
          />
        </div>
      )}

      {stepEndpoints.length > 0 && (
        <div className="ml-12 mb-4">
          <ApiDrawer
            token={token}
            setToken={setToken}
            endpoints={stepEndpoints}
          />
        </div>
      )}

      <SectionDivider variant="minor" />
    </section>
  );
}
