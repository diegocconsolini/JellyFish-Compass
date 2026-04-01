"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { ProgressBar } from "@/components/ui/progress-bar";
import { DataTable } from "@/components/ui/data-table";
import { SectionDivider } from "@/components/ui/section-divider";
import { BottomPanel } from "@/components/ui/bottom-panel";
import { GuidePanel } from "@/components/ui/guide-panel";
import { ApiDrawer } from "@/components/ui/api-drawer";
import { mockTeamBenchmarks } from "@/data/mock-data";
import { endpointGroups } from "@/data/endpoints-full";
import { JellyfishEndpoint } from "@/lib/types";

const metricsEndpoints = endpointGroups.find((g) => g.domain === "Metrics")?.endpoints ?? [];

const teamMetricsEndpoint = metricsEndpoints.find((ep) => ep.name === "team_metrics");
const companyMetricsEndpoint = metricsEndpoints.find((ep) => ep.name === "company_metrics");

const explorerEndpoints: JellyfishEndpoint[] = [
  ...(teamMetricsEndpoint ? [teamMetricsEndpoint] : []),
  ...(companyMetricsEndpoint ? [companyMetricsEndpoint] : []),
];

function getParams(ep: JellyfishEndpoint): Record<string, string> {
  switch (ep.name) {
    case "team_metrics":
      return { team: "platform", start: "2026-01-01", end: "2026-03-31" };
    case "company_metrics":
      return { start: "2026-01-01", end: "2026-03-31" };
    default:
      return {};
  }
}

const mockResponses = {
  team_metrics: {
    team: "platform",
    period: { start: "2026-01-01", end: "2026-03-31" },
    velocity: 62,
    cycle_time_days: 3.2,
    pr_review_time_hours: 6,
    deployments_per_week: 4,
    devex_score: 78,
  },
  company_metrics: {
    period: { start: "2026-01-01", end: "2026-03-31" },
    avg_velocity: 49.75,
    avg_cycle_time_days: 3.225,
    avg_pr_review_time_hours: 6.75,
    avg_deployments_per_week: 4.25,
    avg_devex_score: 74,
    teams: ["platform", "mobile", "data", "frontend"],
  },
};

// Metric group definitions for the visualization grid
const metricGroups = [
  {
    label: "Velocity (story points)",
    key: "velocity" as const,
    max: 70,
    color: "blue" as const,
    lowerIsBetter: false,
    unit: "pts",
  },
  {
    label: "Cycle Time (days)",
    key: "cycleTimeDays" as const,
    max: 5,
    color: "amber" as const,
    lowerIsBetter: true,
    unit: "d",
  },
  {
    label: "PR Review Time (hours)",
    key: "prReviewHours" as const,
    max: 14,
    color: "violet" as const,
    lowerIsBetter: true,
    unit: "h",
  },
  {
    label: "Deployments / Week",
    key: "deploymentsPerWeek" as const,
    max: 7,
    color: "green" as const,
    lowerIsBetter: false,
    unit: "/wk",
  },
  {
    label: "DevEx Score",
    key: "devexScore" as const,
    max: 100,
    color: "blue" as const,
    lowerIsBetter: false,
    unit: "",
  },
];

// Find best-in-class value for each metric
function getBestValue(key: keyof (typeof mockTeamBenchmarks)[0], lowerIsBetter: boolean): number {
  const values = mockTeamBenchmarks.map((t) => t[key] as number);
  return lowerIsBetter ? Math.min(...values) : Math.max(...values);
}

// Pre-compute best values once
const bestVelocity = getBestValue("velocity", false);
const bestCycleTime = getBestValue("cycleTimeDays", true);
const bestPrReview = getBestValue("prReviewHours", true);
const bestDeploys = getBestValue("deploymentsPerWeek", false);
const bestDevEx = getBestValue("devexScore", false);

// Build DataTable rows from mockTeamBenchmarks
const tableHeaders = ["Team", "Velocity", "Cycle Time", "PR Review", "Deploys/wk", "DevEx"];

const tableRows = mockTeamBenchmarks.map((team) => [
  <span key="team" className="font-semibold text-text-primary">{team.team}</span>,
  <span
    key="velocity"
    className={`font-mono text-xs ${team.velocity === bestVelocity ? "text-green font-bold" : "text-text-dim"}`}
  >
    {team.velocity === bestVelocity ? "★ " : ""}{team.velocity} pts
  </span>,
  <span
    key="cycle"
    className={`font-mono text-xs ${team.cycleTimeDays === bestCycleTime ? "text-green font-bold" : "text-text-dim"}`}
  >
    {team.cycleTimeDays === bestCycleTime ? "★ " : ""}{team.cycleTimeDays} d
  </span>,
  <span
    key="pr"
    className={`font-mono text-xs ${team.prReviewHours === bestPrReview ? "text-green font-bold" : "text-text-dim"}`}
  >
    {team.prReviewHours === bestPrReview ? "★ " : ""}{team.prReviewHours} h
  </span>,
  <span
    key="deploys"
    className={`font-mono text-xs ${team.deploymentsPerWeek === bestDeploys ? "text-green font-bold" : "text-text-dim"}`}
  >
    {team.deploymentsPerWeek === bestDeploys ? "★ " : ""}{team.deploymentsPerWeek}
  </span>,
  <span
    key="devex"
    className={`font-mono text-xs ${team.devexScore === bestDevEx ? "text-green font-bold" : "text-text-dim"}`}
  >
    {team.devexScore === bestDevEx ? "★ " : ""}{team.devexScore}
  </span>,
]);

export default function BenchmarksPage() {
  const [token, setToken] = useState("");

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      <PageHero
        eyebrow="Team Benchmarks"
        title="Cross-team comparison"
        subtitle="for learning, not ranking"
      />

      <SectionDivider />

      {/* Metric visualization grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 xl:grid-cols-3">
        {metricGroups.map((metric) => (
          <div
            key={metric.key}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold">{metric.label}</h2>
              {metric.lowerIsBetter && (
                <span className="text-xs font-semibold text-text-ghost bg-surface-raised border border-border rounded-full px-2 py-0.5">
                  lower is better
                </span>
              )}
            </div>
            {mockTeamBenchmarks.map((team) => {
              const rawValue = team[metric.key] as number;
              // For "lower is better" metrics, invert the bar length visually:
              // a low value fills more of the bar to indicate it's "more favorable"
              const percent = metric.lowerIsBetter
                ? Math.round(((metric.max - rawValue) / metric.max) * 100)
                : Math.round((rawValue / metric.max) * 100);
              return (
                <ProgressBar
                  key={team.team}
                  label={team.team}
                  value={`${rawValue}${metric.unit}`}
                  percent={Math.max(0, Math.min(100, percent))}
                  color={metric.color}
                />
              );
            })}
          </div>
        ))}
      </div>

      <SectionDivider variant="minor" />

      {/* Data Table */}
      <div className="rounded-xl border border-border bg-surface mb-5 overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-bold">All Teams — Benchmark Data</h2>
        </div>
        <div className="px-5 py-4">
          <DataTable
            headers={tableHeaders}
            rows={tableRows}
            caption="Team benchmark data comparing velocity, cycle time, PR review time, deployments per week, and DevEx score"
          />
        </div>
        <div className="px-5 py-2.5 border-t border-border bg-surface-raised/30">
          <p className="text-xs text-text-ghost">
            ★ = best in class. Green values = best in class. Lower is better for Cycle Time and PR Review.
          </p>
        </div>
      </div>

      <BottomPanel
        guidesContent={
          <GuidePanel
            tabs={[
              {
                key: "sm",
                label: "Scrum Master",
                content: (
                  <div className="space-y-4">
                    <p>
                      Team Benchmarks provide performance comparison data across teams. The purpose is
                      learning, not competition — a team with lower velocity but higher code quality and
                      fewer incidents may be healthier than a team shipping fast with high failure rates.
                      Use benchmarks to start conversations about what&apos;s working and identify where
                      teams can learn from each other.
                    </p>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-3">
                      <div>
                        <div className="font-semibold text-text-primary mb-0.5 text-sm">Retrospective</div>
                        <p>
                          Share one benchmark comparison per retro. Ask:{" "}
                          <em>
                            &apos;Data team deploys 6x/week while Mobile deploys 2x — what can we learn
                            from their process?&apos;
                          </em>{" "}
                          Avoid framing as &apos;Mobile needs to catch up.&apos;
                        </p>
                      </div>
                      <div>
                        <div className="font-semibold text-text-primary mb-0.5 text-sm">Leadership review</div>
                        <p>
                          Present benchmarks alongside context. High velocity with high cycle time may
                          mean large batches — not necessarily a problem, but worth understanding.
                        </p>
                      </div>
                      <div>
                        <div className="font-semibold text-text-primary mb-0.5 text-sm">Cross-team sync</div>
                        <p>
                          Use benchmarks to identify mentoring opportunities. A team excelling in PR
                          review time can share their approach with teams where reviews are a bottleneck.
                        </p>
                      </div>
                    </div>
                    <p>
                      Relevant endpoints:{" "}
                      <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                        team_metrics
                      </code>{" "}
                      and{" "}
                      <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                        company_metrics
                      </code>
                      .
                    </p>
                  </div>
                ),
              },
              {
                key: "po",
                label: "Product Owner",
                content: (
                  <div className="space-y-3">
                    <p>
                      Use benchmarks to <strong>set realistic expectations per team</strong> when
                      planning. A team with a 4.8-day cycle time needs more roadmap buffer than one with a
                      2.1-day cycle time.
                    </p>
                    <p>
                      Compare deployment frequency across teams to understand which teams can deliver{" "}
                      <strong>faster iterations</strong> — useful for deciding where to place
                      time-sensitive features.
                    </p>
                    <p>
                      Benchmarks help product leaders have informed conversations about timelines without
                      guessing or pressuring teams into unrealistic commitments. Use{" "}
                      <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                        company_metrics
                      </code>{" "}
                      to see org-wide averages alongside individual team data.
                    </p>
                  </div>
                ),
              },
              {
                key: "em",
                label: "Eng Manager",
                content: (
                  <div className="space-y-3">
                    <p>
                      Use{" "}
                      <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                        team_metrics
                      </code>{" "}
                      and{" "}
                      <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                        company_metrics
                      </code>{" "}
                      to compare your teams against industry peers. Benchmarking depersonalizes
                      performance conversations — instead of &quot;your team is slow,&quot; you can say
                      &quot;we&apos;re at 30th percentile for cycle time — here&apos;s what 70th percentile
                      teams do differently.&quot;
                    </p>
                    <p className="font-semibold text-text-dim">1. Improvement Targets</p>
                    <p>
                      Use benchmark percentiles to set realistic goals. &quot;Our 8-day cycle time is 50th
                      percentile; targeting 60th percentile means reducing to 6 days. Here&apos;s a
                      plan.&quot;
                    </p>
                    <p className="font-semibold text-text-dim">2. Cross-Team Learning</p>
                    <p>
                      Identify your best-performing teams on each metric, then facilitate knowledge
                      sharing. Teams at different percentiles for the same metric likely have process
                      differences worth surfacing.
                    </p>
                    <p className="mt-3 text-xs text-text-ghost">
                      Source: jellyfish.co/blog/2025-engineering-benchmarks/ — based on 78,000 engineers
                      and 11,000 teams.
                    </p>
                  </div>
                ),
              },
              {
                key: "pm",
                label: "Prog Manager",
                content: (
                  <div className="space-y-3">
                    <p>
                      Use{" "}
                      <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                        team_metrics
                      </code>{" "}
                      and{" "}
                      <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                        company_metrics
                      </code>{" "}
                      benchmarks to validate delivery expectations with leadership. When the board asks
                      &quot;why can&apos;t we ship faster?&quot;, benchmark data provides an objective answer.
                    </p>
                    <p className="font-semibold text-text-dim">1. Expectation Setting</p>
                    <p>
                      Pull{" "}
                      <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                        company_metrics
                      </code>{" "}
                      benchmarks to show leadership: &quot;Our 12-day cycle time is aligned with peer SaaS
                      companies our size.&quot; This depersonalizes the conversation and grounds expectations
                      in industry reality.
                    </p>
                    <p className="font-semibold text-text-dim">2. Investment Case</p>
                    <p>
                      When cycle time or deployment frequency lags peers, use benchmark gaps to justify
                      investment in process improvements or headcount.
                    </p>
                    <p className="mt-3 text-xs text-text-ghost">
                      Source: jellyfish.co/case-studies/precisely/ — used benchmarks to clearly
                      communicate capacity and set realistic expectations.
                    </p>
                  </div>
                ),
              },
            ]}
          />
        }
        apiExplorerContent={
          <ApiDrawer
            token={token}
            setToken={setToken}
            endpoints={explorerEndpoints}
            getParams={getParams}
            mockResponses={mockResponses}
          />
        }
      />
    </div>
  );
}
