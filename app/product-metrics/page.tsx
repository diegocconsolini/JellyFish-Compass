"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { SectionDivider } from "@/components/ui/section-divider";
import { BottomPanel } from "@/components/ui/bottom-panel";
import { GuidePanel } from "@/components/ui/guide-panel";
import { ApiDrawer } from "@/components/ui/api-drawer";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import {
  mockInvestmentAllocation,
  mockTeamAllocations,
  mockProductFlow,
  mockProductQuality,
  mockSprintKpis,
  mockAiAdoption,
  mockAiBeforeAfter,
} from "@/data/mock-data";
import { endpointGroups } from "@/data/endpoints-full";
import { integrations } from "@/data/integrations";
import { JellyfishEndpoint } from "@/lib/types";
import { cn } from "@/lib/utils";

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

// ─── AI Impact data ───────────────────────────────────────────────────────────

const aiCodingTools =
  integrations.find((g) => g.category === "AI Coding Tools")?.tools ?? [];

const beforeAfterHeaders = [
  "Team",
  "PRs/wk Before",
  "PRs/wk After",
  "Cycle Time Before",
  "Cycle Time After",
];

const beforeAfterRows = mockAiBeforeAfter.map((row) => [
  <span key="team" className="font-medium text-text-primary">
    {row.team}
  </span>,
  <span key="prs-before" className="text-text-dim">
    {row.before.prsPerWeek}
  </span>,
  <span key="prs-after" className="font-semibold text-green">
    {row.after.prsPerWeek}
  </span>,
  <span key="ct-before" className="text-text-dim">
    {row.before.cycleTimeDays}d
  </span>,
  <span key="ct-after" className="font-semibold text-green">
    {row.after.cycleTimeDays}d
  </span>,
]);

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

type TabId = "metrics" | "ai-impact";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductMetricsPage() {
  const [tab, setTab] = useState<TabId>("metrics");
  const [token, setToken] = useState("");

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      {/* Hero */}
      <PageHero
        eyebrow="Product Metrics"
        title="Metrics that matter"
        subtitle="for product decisions"
      />

      <SectionDivider />

      {/* Tab bar */}
      <div role="tablist" aria-label="Product Metrics sections" className="flex gap-2 mb-8">
        <button
          type="button"
          role="tab"
          id="tab-metrics"
          aria-selected={tab === "metrics"}
          aria-controls="tabpanel-metrics"
          onClick={() => setTab("metrics")}
          className={cn(
            "px-4 py-2.5 min-h-[44px] rounded-lg text-sm font-medium flex items-center gap-2 transition-all cursor-pointer",
            tab === "metrics"
              ? "bg-blue/[0.08] text-blue border border-blue/30"
              : "bg-surface-raised border border-border text-text-ghost hover:text-text-dim"
          )}
        >
          Product Metrics
        </button>
        <button
          type="button"
          role="tab"
          id="tab-ai-impact"
          aria-selected={tab === "ai-impact"}
          aria-controls="tabpanel-ai-impact"
          onClick={() => setTab("ai-impact")}
          className={cn(
            "px-4 py-2.5 min-h-[44px] rounded-lg text-sm font-medium flex items-center gap-2 transition-all cursor-pointer",
            tab === "ai-impact"
              ? "bg-blue/[0.08] text-blue border border-blue/30"
              : "bg-surface-raised border border-border text-text-ghost hover:text-text-dim"
          )}
        >
          AI Impact
        </button>
      </div>

      {/* ── Tab 1: Product Metrics ─────────────────────────────────────────────── */}
      {tab === "metrics" && (
        <div
          role="tabpanel"
          id="tabpanel-metrics"
          aria-labelledby="tab-metrics"
          tabIndex={0}
        >
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
                  <p className="text-xs text-text-ghost mb-3 font-semibold uppercase tracking-wider">
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
                  <p className="text-xs text-text-ghost mb-3 font-semibold uppercase tracking-wider">
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

          <SectionDivider variant="minor" />

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
              <p className="mt-3 text-xs text-text-ghost">
                ★ = best in class. Lower is better for Cycle Time and Lead Time. Higher is better for
                Deploy Frequency.
              </p>
            </SectionCard>
          </section>

          <SectionDivider variant="minor" />

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
              <div className="mb-3 rounded-lg border border-amber-dim bg-amber-dim/30 px-4 py-3 text-xs text-amber">
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

          <SectionDivider variant="minor" />

          {/* ── Section 4: Progress Metrics ─────────────────────────────────────── */}
          <section className="mb-5" aria-labelledby="section-progress">
            <div className="mb-3 flex items-center gap-3 flex-wrap">
              <h2 id="section-progress" className="text-base font-bold">
                Progress Metrics
              </h2>
              <span className="text-xs text-text-ghost italic">Mixed — some API, some platform</span>
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
                <p className="text-xs text-text-dim mb-1">
                  {mockSprintKpis.completionRate.unit}
                </p>
                <div className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-green-dim text-green">
                  <span aria-hidden="true">↑</span>{" "}
                  {mockSprintKpis.completionRate.trend}
                </div>
                <p className="mt-3 text-xs text-text-ghost">
                  Pulled via{" "}
                  <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                    team_sprint_summary
                  </code>{" "}
                  endpoint.
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
                <p className="text-sm text-text-dim leading-relaxed">
                  Ship date predictions are calculated by the Jellyfish Capacity Planner using velocity
                  history, remaining scope, and team availability. They update automatically as scope
                  changes.
                </p>
                <p className="mt-3 text-xs text-text-dim">
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

          {/* ── Bottom Panel ───────────────────────────────────────────────────── */}
          <BottomPanel
            guidesContent={
              <GuidePanel
                tabs={[
                  {
                    key: "sm",
                    label: "Scrum Master",
                    content: (
                      <>
                        <p>
                          As a Scrum Master, you influence many of these metrics through ceremony quality and
                          process health.{" "}
                          <strong className="text-text-primary">Cycle time improves</strong> when reviews are
                          timely. <strong className="text-text-primary">Deployment frequency rises</strong>{" "}
                          when release processes are streamlined.
                        </p>
                        <p className="mt-2">
                          Help your Product Owner interpret these numbers in context. A spike in bugs after a
                          large release is different from a steady upward trend. A low completion rate during
                          onboarding weeks tells a different story than one during a stable sprint.
                        </p>
                      </>
                    ),
                  },
                  {
                    key: "po",
                    label: "Product Owner",
                    content: (
                      <>
                        <p>
                          These metrics help you understand engineering health from a product perspective.
                          Focus on{" "}
                          <strong className="text-text-primary">investment alignment</strong> (is effort going
                          where the roadmap says it should?),{" "}
                          <strong className="text-text-primary">flow efficiency</strong> (how fast can teams
                          deliver?), and <strong className="text-text-primary">quality signals</strong> (are
                          we shipping reliable software?).
                        </p>
                        <p className="mt-2">
                          Metrics labeled <Badge variant="green">API Available</Badge> can be pulled live via
                          the Jellyfish Export API. Metrics labeled{" "}
                          <Badge variant="amber">Platform Only</Badge> require the full Jellyfish platform.
                        </p>
                        <p className="mt-2 text-xs text-text-ghost">
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
                      </>
                    ),
                  },
                  {
                    key: "em",
                    label: "Eng Manager",
                    content: (
                      <>
                        <p>
                          Use{" "}
                          <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                            allocations_by_investment_category
                          </code>{" "}
                          to understand how your team&apos;s effort distributes across investment categories
                          (features, tech debt, infrastructure, support). Allocation balance is a leading
                          indicator of team health — teams over-indexed on maintenance have less capacity for
                          strategic work.
                        </p>
                        <p className="font-semibold text-text-dim mt-3">1. Investment Balance</p>
                        <p className="mt-1">
                          Compare your team&apos;s allocation split against organizational targets. If
                          leadership expects 60% innovation but{" "}
                          <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                            allocations_by_investment_category
                          </code>{" "}
                          shows 40%, surface this gap with data rather than anecdotes.
                        </p>
                        <p className="font-semibold text-text-dim mt-3">2. Flow Health</p>
                        <p className="mt-1">
                          Use{" "}
                          <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                            team_metrics
                          </code>{" "}
                          cycle time and deployment frequency alongside allocation data. Teams with healthy
                          allocation but slow cycle time may have process bottlenecks worth investigating.
                        </p>
                        <p className="mt-3 text-xs text-text-ghost">
                          Source: jellyfish.co/platform/resource-allocations/
                        </p>
                      </>
                    ),
                  },
                  {
                    key: "pm",
                    label: "Prod Manager",
                    content: (
                      <>
                        <p>
                          Use{" "}
                          <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                            allocations_by_investment_category
                          </code>{" "}
                          to see where engineering effort actually goes — not where people think it goes.
                          Jellyfish research shows engineering leaders overestimate roadmap allocation by 62%.
                          This gap is critical for planning.
                        </p>
                        <p className="font-semibold text-text-dim mt-3">1. Strategic Alignment</p>
                        <p className="mt-1">
                          Pull{" "}
                          <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                            allocations_by_investment_category
                          </code>{" "}
                          quarterly to verify engineering investment matches product strategy. Present to
                          leadership: &quot;X% of engineering is on roadmap, Y% on maintenance — here&apos;s
                          what that means for Q3 delivery.&quot;
                        </p>
                        <p className="font-semibold text-text-dim mt-3">2. Headcount Justification</p>
                        <p className="mt-1">
                          Use allocation data with{" "}
                          <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                            company_metrics
                          </code>{" "}
                          to build a data-backed case: &quot;To deliver on our roadmap, we need N additional
                          FTEs — here&apos;s the allocation analysis showing why.&quot;
                        </p>
                        <p className="mt-3 text-xs text-text-ghost">
                          Source: jellyfish.co/case-studies/salsify/ — Salsify proved 80% engineering on
                          roadmap to justify 25% headcount growth.
                        </p>
                      </>
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
      )}

      {/* ── Tab 2: AI Impact ──────────────────────────────────────────────────── */}
      {tab === "ai-impact" && (
        <div
          role="tabpanel"
          id="tabpanel-ai-impact"
          aria-labelledby="tab-ai-impact"
          tabIndex={0}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5">
            {/* Left card: AI Tool Adoption by Team */}
            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold">AI Tool Adoption by Team</h2>
                <Badge variant="blue">Adoption</Badge>
              </div>
              {mockAiAdoption.map((item) => (
                <div key={item.team} className="mb-4 last:mb-0">
                  <div className="text-xs font-semibold text-text-primary mb-1.5">
                    {item.team}
                  </div>
                  <ProgressBar
                    label="Copilot"
                    value={`${item.copilot}%`}
                    percent={item.copilot}
                    color="blue"
                  />
                  <ProgressBar
                    label="Cursor"
                    value={`${item.cursor}%`}
                    percent={item.cursor}
                    color="violet"
                  />
                  <ProgressBar
                    label="Claude Code"
                    value={`${item.claudeCode}%`}
                    percent={item.claudeCode}
                    color="green"
                  />
                </div>
              ))}
            </div>

            {/* Right card: Before / After AI Adoption */}
            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold">Before / After AI Adoption</h2>
                <Badge variant="green">Impact</Badge>
              </div>
              <DataTable headers={beforeAfterHeaders} rows={beforeAfterRows} />
              <p className="text-xs text-text-ghost mt-3">
                Green values indicate improvement after AI tool adoption. Cycle time
                is measured in days from ticket start to merge.
              </p>
            </div>
          </div>

          <SectionDivider variant="minor" />

          {/* Supported AI Coding Tools */}
          <div className="mb-5">
            <h2 className="text-sm font-bold mb-3">Supported AI Coding Tools</h2>
            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="flex flex-wrap gap-2">
                {aiCodingTools.map((tool) => (
                  <Badge key={tool} variant="ghost">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <SectionDivider variant="minor" />

          {/* API Note */}
          <div className="rounded-xl border border-border bg-surface p-5 mb-5">
            <p className="text-sm text-text-dim">
              <strong className="text-text-primary">Note:</strong> AI Impact data is
              generated at the platform level by Jellyfish. The Export API v0 does
              not include AI-specific endpoints — use the Jellyfish dashboard for
              adoption and impact analytics.
            </p>
          </div>

          <p className="text-xs text-text-ghost mt-2 mb-6">
            Customer outcome: TaskRabbit — teams shipping code faster and delivering
            twice the value in half the time (jellyfish.co/platform/jellyfish-ai-impact/).
          </p>

          {/* ── Bottom Panel ─────────────────────────────────────────────────── */}
          <BottomPanel
            guidesContent={
              <GuidePanel
                tabs={[
                  {
                    key: "sm",
                    label: "Scrum Master",
                    content: (
                      <>
                        <p>
                          AI Impact measurement answers three questions: Are teams actually
                          using AI tools? Which tools deliver measurable results? And where
                          should the organization invest next? Jellyfish automatically detects
                          AI usage patterns across GitHub Copilot, Cursor, Claude Code, and
                          other tools — then links adoption data to delivery signals like
                          throughput, cycle time, and code review speed. The goal is objective
                          measurement, not advocacy for any specific tool.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-4">
                          <div>
                            <div className="font-semibold text-text-primary mb-1">
                              Retrospective
                            </div>
                            <p>
                              If a team adopted an AI tool 2–3 months ago, pull their
                              before/after delivery metrics. If cycle time hasn&apos;t improved,
                              investigate whether the tool is being used effectively, whether
                              other bottlenecks dominate, or whether the team needs enablement
                              support.
                            </p>
                          </div>
                          <div>
                            <div className="font-semibold text-text-primary mb-1">
                              Planning
                            </div>
                            <p>
                              Factor AI tool impact into capacity assumptions. A team with high
                              Copilot adoption may have higher throughput than historical
                              baselines suggest — adjust commitments accordingly.
                            </p>
                          </div>
                          <div>
                            <div className="font-semibold text-text-primary mb-1">
                              Leadership review
                            </div>
                            <p>
                              Present adoption rates alongside impact data. High adoption with
                              no measurable improvement is a signal to investigate — not to roll
                              back the tool.
                            </p>
                          </div>
                        </div>
                      </>
                    ),
                  },
                  {
                    key: "em",
                    label: "Eng Manager",
                    content: (
                      <>
                        <p>
                          Use{" "}
                          <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                            team_metrics
                          </code>{" "}
                          alongside AI tool adoption data to measure the productivity impact of AI coding
                          tools. 90% of teams now use AI tools, but only 20% measure impact with metrics —
                          this is the measurement gap EMs should close.
                        </p>
                        <p className="font-semibold text-text-dim mt-3">1. Before/After Analysis</p>
                        <p className="mt-1">
                          Compare{" "}
                          <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                            team_metrics
                          </code>{" "}
                          (PR cycle time, deployment frequency) before and after AI tool rollout. Look for
                          concrete improvements, not just adoption numbers.
                        </p>
                        <p className="font-semibold text-text-dim mt-3">2. Coaching on AI Usage</p>
                        <p className="mt-1">
                          Use adoption data to identify teams or individuals who haven&apos;t adopted AI
                          tools, then coach on effective usage rather than mandating.
                        </p>
                        <p className="mt-3 text-xs text-text-ghost">
                          Source: jellyfish.co/blog/3-takeaways-for-engineering-managers-from-semr/ — 62%
                          report 25%+ productivity gains from AI.
                        </p>
                      </>
                    ),
                  },
                ]}
              />
            }
            apiExplorerContent={
              <div className="text-sm text-text-dim">
                <strong className="text-text-primary">No API Explorer available for this tab.</strong>{" "}
                AI Impact data is generated at the platform level by Jellyfish. The Export API v0 does
                not include AI-specific endpoints — use the Jellyfish dashboard for adoption and impact
                analytics.
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}
