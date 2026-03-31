"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { GuideBox } from "@/components/ui/guide-box";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ApiExplorer } from "@/components/ui/api-explorer";
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
function getBestValue(key: keyof typeof mockTeamBenchmarks[0], lowerIsBetter: boolean): number {
  const values = mockTeamBenchmarks.map((t) => t[key] as number);
  return lowerIsBetter ? Math.min(...values) : Math.max(...values);
}

export default function BenchmarksPage() {
  const [token, setToken] = useState("");

  return (
    <div className="max-w-[1440px] mx-auto px-7 py-7">
      <PageHero
        eyebrow="Team Benchmarks"
        title="Cross-team comparison"
        subtitle="for learning, not ranking"
      />

      <GuideBox title="Scrum Master Guide: Team Benchmarks">
        <p>
          Team Benchmarks provide performance comparison data across teams. The purpose is learning,
          not competition — a team with lower velocity but higher code quality and fewer incidents
          may be healthier than a team shipping fast with high failure rates. Use benchmarks to start
          conversations about what&apos;s working and identify where teams can learn from each other.
        </p>
      </GuideBox>

      {/* Metric visualization grid */}
      <div className="grid grid-cols-2 gap-3 mb-5 xl:grid-cols-3">
        {metricGroups.map((metric) => (
          <div
            key={metric.key}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold">{metric.label}</h2>
              {metric.lowerIsBetter && (
                <span className="text-[10px] font-semibold text-text-ghost bg-surface-raised border border-border rounded-full px-2 py-0.5">
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

      {/* Data Table */}
      <div className="rounded-xl border border-border bg-surface mb-5 overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-bold">All Teams — Benchmark Data</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-raised">
                <th className="text-left px-5 py-3 text-[11.5px] font-semibold text-text-ghost uppercase tracking-wide">
                  Team
                </th>
                <th className="text-right px-5 py-3 text-[11.5px] font-semibold text-text-ghost uppercase tracking-wide">
                  Velocity
                </th>
                <th className="text-right px-5 py-3 text-[11.5px] font-semibold text-text-ghost uppercase tracking-wide">
                  Cycle Time
                </th>
                <th className="text-right px-5 py-3 text-[11.5px] font-semibold text-text-ghost uppercase tracking-wide">
                  PR Review
                </th>
                <th className="text-right px-5 py-3 text-[11.5px] font-semibold text-text-ghost uppercase tracking-wide">
                  Deploys/wk
                </th>
                <th className="text-right px-5 py-3 text-[11.5px] font-semibold text-text-ghost uppercase tracking-wide">
                  DevEx
                </th>
              </tr>
            </thead>
            <tbody>
              {mockTeamBenchmarks.map((team, idx) => {
                const bestVelocity = getBestValue("velocity", false);
                const bestCycleTime = getBestValue("cycleTimeDays", true);
                const bestPrReview = getBestValue("prReviewHours", true);
                const bestDeploys = getBestValue("deploymentsPerWeek", false);
                const bestDevEx = getBestValue("devexScore", false);

                return (
                  <tr
                    key={team.team}
                    className={`border-b border-border last:border-b-0 ${idx % 2 === 0 ? "bg-surface" : "bg-surface-raised/30"}`}
                  >
                    <td className="px-5 py-3 font-semibold text-text-primary">{team.team}</td>
                    <td
                      className={`px-5 py-3 text-right font-mono text-xs ${team.velocity === bestVelocity ? "text-green font-bold" : "text-text-dim"}`}
                    >
                      {team.velocity === bestVelocity ? "★ " : ""}{team.velocity} pts
                    </td>
                    <td
                      className={`px-5 py-3 text-right font-mono text-xs ${team.cycleTimeDays === bestCycleTime ? "text-green font-bold" : "text-text-dim"}`}
                    >
                      {team.cycleTimeDays === bestCycleTime ? "★ " : ""}{team.cycleTimeDays} d
                    </td>
                    <td
                      className={`px-5 py-3 text-right font-mono text-xs ${team.prReviewHours === bestPrReview ? "text-green font-bold" : "text-text-dim"}`}
                    >
                      {team.prReviewHours === bestPrReview ? "★ " : ""}{team.prReviewHours} h
                    </td>
                    <td
                      className={`px-5 py-3 text-right font-mono text-xs ${team.deploymentsPerWeek === bestDeploys ? "text-green font-bold" : "text-text-dim"}`}
                    >
                      {team.deploymentsPerWeek === bestDeploys ? "★ " : ""}{team.deploymentsPerWeek}
                    </td>
                    <td
                      className={`px-5 py-3 text-right font-mono text-xs ${team.devexScore === bestDevEx ? "text-green font-bold" : "text-text-dim"}`}
                    >
                      {team.devexScore === bestDevEx ? "★ " : ""}{team.devexScore}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-2.5 border-t border-border bg-surface-raised/30">
          <span className="text-[11px] text-text-ghost">
            ★ = best in class. Green values = best in class. Lower is better for Cycle Time and PR Review.
          </span>
        </div>
      </div>

      {/* API Token input */}
      <div className="mb-3">
        <label htmlFor="api-token" className="block text-[11.5px] font-semibold text-text-ghost mb-1.5">
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

      <ApiExplorer
        token={token}
        endpoints={explorerEndpoints}
        getParams={getParams}
        mockResponses={mockResponses}
      />

      <GuideBox title="Facilitating Benchmark Conversations">
        <div className="grid grid-cols-1 gap-x-6 gap-y-3 mt-1 md:grid-cols-3">
          <div>
            <div className="font-semibold text-text-primary mb-0.5">Retrospective</div>
            <p>
              Share one benchmark comparison per retro. Ask: &apos;Data team deploys 6x/week while
              Mobile deploys 2x — what can we learn from their process?&apos; Avoid framing as
              &apos;Mobile needs to catch up.&apos;
            </p>
          </div>
          <div>
            <div className="font-semibold text-text-primary mb-0.5">Leadership review</div>
            <p>
              Present benchmarks alongside context. High velocity with high cycle time may mean
              large batches — not necessarily a problem, but worth understanding.
            </p>
          </div>
          <div>
            <div className="font-semibold text-text-primary mb-0.5">Cross-team sync</div>
            <p>
              Use benchmarks to identify mentoring opportunities. A team excelling in PR review time
              can share their approach with teams where reviews are a bottleneck.
            </p>
          </div>
        </div>
      </GuideBox>
    </div>
  );
}
