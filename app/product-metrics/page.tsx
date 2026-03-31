"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { GuideBox } from "@/components/ui/guide-box";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { ApiExplorer } from "@/components/ui/api-explorer";
import {
  mockInvestmentAllocation,
  mockTeamAllocations,
  mockProductFlow,
  mockProductQuality,
  mockSprintKpis,
} from "@/data/mock-data";
import { endpointGroups } from "@/data/endpoints-full";
import { JellyfishEndpoint } from "@/lib/types";

// ─── Endpoint setup ───────────────────────────────────────────────────────────

const metricsEndpoints = endpointGroups.find((g) => g.domain === "Metrics")?.endpoints ?? [];
const allocationsEndpoints = endpointGroups.find((g) => g.domain === "Allocations")?.endpoints ?? [];

function pickEndpoint(name: string): JellyfishEndpoint | undefined {
  return [...metricsEndpoints, ...allocationsEndpoints].find((ep) => ep.name === name);
}

const explorerEndpoints: JellyfishEndpoint[] = [
  "team_metrics",
  "company_metrics",
  "allocations_by_work_category",
  "allocations_by_investment_category",
]
  .map(pickEndpoint)
  .filter((ep): ep is JellyfishEndpoint => ep !== undefined);

function getParams(ep: JellyfishEndpoint): Record<string, string> {
  switch (ep.name) {
    case "team_metrics":
      return { team: "platform", start: "2026-01-01", end: "2026-03-31" };
    case "company_metrics":
      return { start: "2026-01-01", end: "2026-03-31" };
    case "allocations_by_work_category":
      return { work_category: "features", start: "2026-01-01", end: "2026-03-31" };
    case "allocations_by_investment_category":
      return { start: "2026-01-01", end: "2026-03-31" };
    default:
      return {};
  }
}

const mockResponses: Record<string, unknown> = {
  team_metrics: {
    team: "platform",
    period: { start: "2026-01-01", end: "2026-03-31" },
    cycle_time_days: 3.2,
    lead_time_days: 5.8,
    deployments_per_week: 4.0,
    velocity: 62,
  },
  company_metrics: {
    period: { start: "2026-01-01", end: "2026-03-31" },
    avg_cycle_time_days: 3.225,
    avg_lead_time_days: 5.9,
    avg_deployments_per_week: 4.25,
    teams: ["platform", "mobile", "data", "frontend"],
  },
  allocations_by_work_category: {
    work_category: "features",
    total_fte: 12.4,
    by_team: [
      { team: "Platform", fte: 4.2 },
      { team: "Mobile", fte: 2.9 },
      { team: "Data", fte: 3.2 },
      { team: "Frontend", fte: 2.1 },
    ],
  },
  allocations_by_investment_category: {
    period: { start: "2026-01-01", end: "2026-03-31" },
    categories: [
      { category: "Feature Development", total_fte: 12.4 },
      { category: "Keep the Lights On", total_fte: 5.8 },
      { category: "Tech Debt", total_fte: 3.2 },
      { category: "Growth / Scaling", total_fte: 2.1 },
      { category: "Unallocated", total_fte: 1.5 },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const borderColor: Record<string, string> = {
  blue: "from-blue to-cyan",
  green: "from-green to-emerald-300",
  amber: "from-amber to-yellow-300",
  violet: "from-violet to-purple-300",
};

function SectionCard({
  accentColor,
  badge,
  children,
}: {
  accentColor: "blue" | "green" | "amber" | "violet";
  badge: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface mb-5">
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${borderColor[accentColor]}`}
        aria-hidden="true"
      />
      <div className="px-5 pt-5 pb-1 flex items-center justify-between flex-wrap gap-2">
        {badge}
      </div>
      <div className="px-5 pb-5">{children}</div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-bold text-text-primary mb-3">{children}</h2>;
}

// ─── Best-value helpers for flow table ───────────────────────────────────────

const bestCycleTime = Math.min(...mockProductFlow.map((r) => r.cycleTimeDays));
const bestLeadTime = Math.min(...mockProductFlow.map((r) => r.leadTimeDays));
const bestDeployFreq = Math.max(...mockProductFlow.map((r) => r.deployFrequency));

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductMetricsPage() {
  const [token, setToken] = useState("");

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      {/* Hero */}
      <PageHero
        eyebrow="Product Metrics"
        title="Metrics that matter"
        subtitle="for product decisions"
      />

      {/* PO Guide */}
      <GuideBox title="Product Owner Guide: Reading Product Metrics">
        <p>
          These metrics help you understand engineering health from a product perspective. Focus on{" "}
          <strong className="text-text-primary">investment alignment</strong> (is effort going where
          the roadmap says it should?),{" "}
          <strong className="text-text-primary">flow efficiency</strong> (how fast can teams
          deliver?), and <strong className="text-text-primary">quality signals</strong> (are we
          shipping reliable software?).
        </p>
        <p className="mt-2">
          Metrics labeled <Badge variant="green">API Available</Badge> can be pulled live via the
          Jellyfish Export API. Metrics labeled{" "}
          <Badge variant="amber">Platform Only</Badge> require the full Jellyfish platform.
        </p>
        <p className="mt-1.5 text-[11.5px] text-text-ghost">
          Source:{" "}
          <a
            href="https://jellyfish.co/library/product-metrics/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue transition-colors"
          >
            jellyfish.co/library/product-metrics/
          </a>
        </p>
      </GuideBox>

      {/* ── Section 1: Investment Metrics ──────────────────────────────────── */}
      <section className="mb-5" aria-labelledby="section-investment">
        <div className="mb-3 flex items-center gap-3 flex-wrap">
          <h2 id="section-investment" className="text-base font-bold">
            Investment Metrics
          </h2>
          <Badge variant="green">API Available</Badge>
        </div>

        <SectionCard
          accentColor="blue"
          badge={
            <SectionHeading>Engineering Investment by Category</SectionHeading>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1">
            {/* Progress bars */}
            <div>
              <p className="text-[11.5px] text-text-ghost mb-3 font-semibold uppercase tracking-wider">
                FTE by Investment Category
              </p>
              {mockInvestmentAllocation.map((item) => (
                <ProgressBar
                  key={item.label}
                  label={item.label}
                  value={`${item.value} FTE`}
                  percent={Math.round((item.value / item.max) * 100)}
                  color={item.color}
                />
              ))}
            </div>

            {/* Team allocation table */}
            <div>
              <p className="text-[11.5px] text-text-ghost mb-3 font-semibold uppercase tracking-wider">
                Allocation by Team
              </p>
              <DataTable
                caption="Team allocation breakdown by investment category"
                headers={["Team", "Total FTE", "Features %", "KTLO %", "Tech Debt %"]}
                rows={mockTeamAllocations.map((t) => [
                  <span key="team" className="font-semibold text-text-primary">
                    {t.team}
                  </span>,
                  <span key="fte" className="font-mono text-xs text-text-dim">
                    {t.totalFte}
                  </span>,
                  <span key="feat" className="font-mono text-xs text-blue">
                    {t.features}%
                  </span>,
                  <span key="ktlo" className="font-mono text-xs text-amber">
                    {t.ktlo}%
                  </span>,
                  <span key="debt" className="font-mono text-xs text-violet">
                    {t.techDebt}%
                  </span>,
                ])}
              />
            </div>
          </div>
        </SectionCard>
      </section>

      {/* ── Section 2: Flow Metrics ─────────────────────────────────────────── */}
      <section className="mb-5" aria-labelledby="section-flow">
        <div className="mb-3 flex items-center gap-3 flex-wrap">
          <h2 id="section-flow" className="text-base font-bold">
            Flow Metrics
          </h2>
          <Badge variant="green">API Available</Badge>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <StatCard
            label="Avg Cycle Time"
            value="3.2d"
            note="across all teams"
            color="blue"
          />
          <StatCard
            label="Avg Lead Time"
            value="5.9d"
            note="intake to deploy"
            color="amber"
          />
          <StatCard
            label="Avg Deploy Freq"
            value="4.3/wk"
            note="deployments per week"
            color="green"
          />
          <StatCard
            label="Teams Tracked"
            value="4"
            note="Platform, Mobile, Data, Frontend"
            color="violet"
          />
        </div>

        <SectionCard
          accentColor="green"
          badge={
            <SectionHeading>Flow by Team</SectionHeading>
          }
        >
          <DataTable
            caption="Flow metrics by team — cycle time, lead time, deployment frequency"
            headers={["Team", "Cycle Time", "Lead Time", "Deploy Freq/wk"]}
            rows={mockProductFlow.map((row) => [
              <span key="team" className="font-semibold text-text-primary">
                {row.team}
              </span>,
              <span
                key="cycle"
                className={`font-mono text-xs font-semibold ${
                  row.cycleTimeDays === bestCycleTime ? "text-green" : "text-text-dim"
                }`}
              >
                {row.cycleTimeDays === bestCycleTime ? "★ " : ""}
                {row.cycleTimeDays}d
              </span>,
              <span
                key="lead"
                className={`font-mono text-xs font-semibold ${
                  row.leadTimeDays === bestLeadTime ? "text-green" : "text-text-dim"
                }`}
              >
                {row.leadTimeDays === bestLeadTime ? "★ " : ""}
                {row.leadTimeDays}d
              </span>,
              <span
                key="deploy"
                className={`font-mono text-xs font-semibold ${
                  row.deployFrequency === bestDeployFreq ? "text-green" : "text-text-dim"
                }`}
              >
                {row.deployFrequency === bestDeployFreq ? "★ " : ""}
                {row.deployFrequency}/wk
              </span>,
            ])}
          />
          <p className="mt-3 text-[11px] text-text-ghost">
            ★ = best in class. Lower is better for Cycle Time and Lead Time. Higher is better for
            Deploy Frequency.
          </p>
        </SectionCard>
      </section>

      {/* ── Section 3: Quality Metrics ──────────────────────────────────────── */}
      <section className="mb-5" aria-labelledby="section-quality">
        <div className="mb-3 flex items-center gap-3 flex-wrap">
          <h2 id="section-quality" className="text-base font-bold">
            Quality Metrics
          </h2>
          <Badge variant="amber">Platform Only</Badge>
        </div>

        <SectionCard
          accentColor="amber"
          badge={
            <SectionHeading>Quality by Product</SectionHeading>
          }
        >
          <div className="mb-3 rounded-lg border border-amber-dim bg-amber-dim/30 px-4 py-3 text-[12.5px] text-amber">
            Quality metrics are tracked in the Jellyfish platform and your monitoring tools. The
            data below is sample data for illustration.
          </div>
          <DataTable
            caption="Quality metrics by product — bugs, critical issues, resolution time, uptime"
            headers={["Product", "Bugs", "Critical", "Avg Resolution", "Uptime %"]}
            rows={mockProductQuality.map((row) => [
              <span key="product" className="font-semibold text-text-primary">
                {row.product}
              </span>,
              <span
                key="bugs"
                className={`font-mono text-xs ${row.bugs > 20 ? "text-red font-bold" : "text-text-dim"}`}
              >
                {row.bugs}
              </span>,
              <span
                key="critical"
                className={`font-mono text-xs font-semibold ${
                  row.criticalBugs === 0
                    ? "text-green"
                    : row.criticalBugs >= 3
                    ? "text-red"
                    : "text-amber"
                }`}
              >
                {row.criticalBugs}
              </span>,
              <span key="resolution" className="font-mono text-xs text-text-dim">
                {row.avgResolutionDays}d
              </span>,
              <span
                key="uptime"
                className={`font-mono text-xs font-semibold ${
                  row.uptime >= 99.8 ? "text-green" : row.uptime >= 99.5 ? "text-amber" : "text-red"
                }`}
              >
                {row.uptime}%
              </span>,
            ])}
          />
        </SectionCard>
      </section>

      {/* ── Section 4: Progress Metrics ─────────────────────────────────────── */}
      <section className="mb-5" aria-labelledby="section-progress">
        <div className="mb-3 flex items-center gap-3 flex-wrap">
          <h2 id="section-progress" className="text-base font-bold">
            Progress Metrics
          </h2>
          <span className="text-[11.5px] text-text-ghost italic">Mixed — some API, some platform</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Sprint Completion Rate */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-5">
            <div
              className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green to-emerald-300"
              aria-hidden="true"
            />
            <div className="flex items-start justify-between mb-3 gap-2 flex-wrap">
              <h3 className="text-sm font-bold">Sprint Completion Rate</h3>
              <Badge variant="green">API Available</Badge>
            </div>
            <div className="text-4xl font-extrabold text-green tracking-tight mb-1">
              {mockSprintKpis.completionRate.value}
            </div>
            <p className="text-[12.5px] text-text-dim mb-1">
              {mockSprintKpis.completionRate.unit}
            </p>
            <div className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-green-dim text-green">
              <span aria-hidden="true">↑</span>{" "}
              {mockSprintKpis.completionRate.trend}
            </div>
            <p className="mt-3 text-[11.5px] text-text-ghost">
              Pulled via <code className="font-mono text-[10.5px] bg-surface-raised px-1.5 py-0.5 rounded">team_sprint_summary</code> endpoint.
            </p>
          </div>

          {/* Predicted Ship Dates */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-5">
            <div
              className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet to-purple-300"
              aria-hidden="true"
            />
            <div className="flex items-start justify-between mb-3 gap-2 flex-wrap">
              <h3 className="text-sm font-bold">Predicted Ship Dates</h3>
              <Badge variant="amber">Platform Only</Badge>
            </div>
            <p className="text-[13px] text-text-dim leading-relaxed">
              Ship date predictions are calculated by the Jellyfish Capacity Planner using velocity
              history, remaining scope, and team availability. They update automatically as scope
              changes.
            </p>
            <p className="mt-3 text-[12px] text-text-dim">
              Access predictions in the{" "}
              <span className="font-semibold text-text-primary">Capacity Planner</span> module of
              the Jellyfish platform, or on the{" "}
              <a
                href="/delivery-forecast"
                className="text-blue underline hover:opacity-80 transition-opacity"
              >
                Delivery Forecast
              </a>{" "}
              page in this tool.
            </p>
          </div>
        </div>
      </section>

      {/* SM Guide */}
      <GuideBox title="Scrum Master Guide: Supporting Product Metrics">
        <p>
          As a Scrum Master, you influence many of these metrics through ceremony quality and
          process health.{" "}
          <strong className="text-text-primary">Cycle time improves</strong> when reviews are
          timely. <strong className="text-text-primary">Deployment frequency rises</strong> when
          release processes are streamlined.
        </p>
        <p className="mt-2">
          Help your Product Owner interpret these numbers in context. A spike in bugs after a
          large release is different from a steady upward trend. A low completion rate during
          onboarding weeks tells a different story than one during a stable sprint.
        </p>
      </GuideBox>

      {/* API Token */}
      <div className="mb-3">
        <label
          htmlFor="api-token-product-metrics"
          className="block text-[11.5px] font-semibold text-text-ghost mb-1.5"
        >
          Jellyfish API Token (optional — for live mode)
        </label>
        <input
          id="api-token-product-metrics"
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
        endpoints={explorerEndpoints}
        getParams={getParams}
        mockResponses={mockResponses}
      />
    </div>
  );
}
