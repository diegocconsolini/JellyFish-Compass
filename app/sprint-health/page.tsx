"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { BarChart } from "@/components/ui/bar-chart";
import { SectionDivider } from "@/components/ui/section-divider";
import { BottomPanel } from "@/components/ui/bottom-panel";
import { GuidePanel } from "@/components/ui/guide-panel";
import { ApiDrawer } from "@/components/ui/api-drawer";
import { mockSprintKpis, mockSprints, mockScopeEffort } from "@/data/mock-data";
import { endpointGroups } from "@/data/endpoints-full";

const metricsEndpoints =
  endpointGroups.find((g) => g.domain === "Metrics")?.endpoints ?? [];

function getParams(ep: { name: string }): Record<string, string> {
  switch (ep.name) {
    case "team_sprint_summary":
      return { team: "platform", start: "2026-01-01", end: "2026-03-31" };
    case "team_metrics":
      return { team: "platform", start: "2026-01-01", end: "2026-03-31" };
    case "person_metrics":
      return { person: "", start: "2026-01-01", end: "2026-03-31" };
    case "company_metrics":
      return { start: "2026-01-01", end: "2026-03-31" };
    case "unlinked_pull_requests":
      return { start: "2026-01-01", end: "2026-03-31" };
    default:
      return {};
  }
}

const mockResponses = {
  team_sprint_summary: {
    team: "platform",
    sprints: [
      { sprint: "Sprint 24", committed: 18, completed: 16, carry_over: 2, velocity: 62 },
      { sprint: "Sprint 23", committed: 15, completed: 14, carry_over: 1, velocity: 54 },
      { sprint: "Sprint 22", committed: 20, completed: 16, carry_over: 4, velocity: 51 },
      { sprint: "Sprint 21", committed: 17, completed: 15, carry_over: 2, velocity: 58 },
    ],
    avg_velocity: 56.3,
    avg_completion_rate: 0.88,
  },
};

export default function SprintHealthPage() {
  const [token, setToken] = useState("");

  const sprintTableRows = mockSprints.map((s) => [
    <span key="name" className="font-medium text-text-primary">{s.name}</span>,
    <span key="committed">{s.committed}</span>,
    <span key="completed" className="text-green font-semibold">{s.completed}</span>,
    <span
      key="carry"
      className={s.carryOver > 2 ? "text-amber font-semibold" : ""}
    >
      {s.carryOver}
    </span>,
    <span key="velocity">{s.velocity}</span>,
  ]);

  const barChartData = mockScopeEffort.map((d) => ({
    label: d.week,
    values: [
      {
        height: (d.scope / 70) * 100,
        className: "bg-gradient-to-t from-blue/40 to-blue/90",
        label: `${d.scope}`,
      },
      {
        height: (d.effort / 70) * 100,
        className: "bg-gradient-to-t from-amber/40 to-amber/90",
        label: `${d.effort}`,
      },
    ],
  }));

  const barChartLegend = [
    { label: "Scope", className: "bg-blue" },
    { label: "Effort", className: "bg-amber" },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      <PageHero
        eyebrow="Sprint Health"
        title="Track velocity, completion"
        subtitle="& carry-over"
      />

      <SectionDivider />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard
          label="Avg Velocity"
          value={mockSprintKpis.avgVelocity.value}
          note={mockSprintKpis.avgVelocity.unit}
          trend={mockSprintKpis.avgVelocity.trend}
          trendDirection={mockSprintKpis.avgVelocity.direction}
          color="blue"
        />
        <StatCard
          label="Completion Rate"
          value={mockSprintKpis.completionRate.value}
          note={mockSprintKpis.completionRate.unit}
          trend={mockSprintKpis.completionRate.trend}
          trendDirection={mockSprintKpis.completionRate.direction}
          color="green"
        />
        <StatCard
          label="Carry-Over"
          value={mockSprintKpis.carryOver.value}
          note={mockSprintKpis.carryOver.unit}
          trend={mockSprintKpis.carryOver.trend}
          trendDirection={mockSprintKpis.carryOver.direction}
          color="amber"
        />
        <StatCard
          label="Sprint Cadence"
          value={mockSprintKpis.sprintCadence.value}
          note={mockSprintKpis.sprintCadence.unit}
          trend={mockSprintKpis.sprintCadence.trend}
          trendDirection={mockSprintKpis.sprintCadence.direction}
          color="violet"
        />
      </div>

      <SectionDivider />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-bold mb-4">Sprint History</h2>
          <DataTable
            headers={["Sprint", "Committed", "Completed", "Carry-Over", "Velocity"]}
            rows={sprintTableRows}
          />
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-bold mb-4">Velocity Trend — Scope vs Effort</h2>
          <BarChart data={barChartData} legend={barChartLegend} title="Velocity trend — scope vs effort over 8 weeks" />
        </div>
      </div>

      <BottomPanel
        guidesContent={
          <GuidePanel
            scrumMaster={
              <div>
                <p>
                  Use <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">team_sprint_summary</code> to pull committed vs. completed story points and
                  issue counts per sprint for a given team and date range. This endpoint surfaces carry-over
                  items and velocity trends that power your sprint retrospectives.
                </p>
                <p className="mt-2">
                  Pair with <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">team_metrics</code> for broader engineering health signals — PR cycle
                  time, review depth, and commit frequency — giving you leading indicators of whether your
                  velocity numbers reflect sustainable delivery or unseen bottlenecks.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mt-4">
                  <div>
                    <div className="font-semibold text-text-primary mb-0.5">Sprint Planning</div>
                    <p>
                      Query <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">team_sprint_summary</code> before planning to baseline your team&apos;s
                      historical velocity. Use the last 3–4 sprints to set a realistic commitment ceiling
                      and avoid over-promising.
                    </p>
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary mb-0.5">Daily Standup</div>
                    <p>
                      Use <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">team_metrics</code> mid-sprint to spot PR bottlenecks or review delays
                      that could threaten completion. An uptick in cycle time is an early warning before
                      carry-over materialises.
                    </p>
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary mb-0.5">Sprint Review</div>
                    <p>
                      Pull <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">team_sprint_summary</code> at sprint close to present committed vs.
                      completed to stakeholders. Highlight carry-over items with context from{" "}
                      <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">person_metrics</code> if individual blockers contributed.
                    </p>
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary mb-0.5">Retrospective</div>
                    <p>
                      Combine <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">team_sprint_summary</code>, <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">team_metrics</code>, and{" "}
                      <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">unlinked_pull_requests</code> to run a data-driven retro — correlate carry-over
                      spikes with PR hygiene gaps and identify systemic patterns across sprints.
                    </p>
                  </div>
                </div>
              </div>
            }
            productOwner={
              <div>
                <p>Use sprint completion rate and velocity trends to <strong>forecast delivery confidence</strong> for stakeholders. A consistent completion rate above 85% signals reliable planning — share this in roadmap reviews.</p>
                <p className="mt-2">Track carry-over trends to identify capacity issues <strong>before they impact your roadmap</strong>. Rising carry-over means the team is overcommitted — adjust scope in the next planning cycle rather than waiting for a missed deadline.</p>
                <p className="mt-2 text-xs text-text-ghost">Source: jellyfish.co/solutions/engineering-product-operations/ — Precisely achieved 22% increase in sprint predictability.</p>
              </div>
            }
          />
        }
        apiExplorerContent={
          <ApiDrawer
            token={token}
            setToken={setToken}
            endpoints={metricsEndpoints}
            getParams={getParams}
            mockResponses={mockResponses}
          />
        }
      />
    </div>
  );
}
