"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { GuideBox } from "@/components/ui/guide-box";
import { ProgressBar } from "@/components/ui/progress-bar";
import { DataTable } from "@/components/ui/data-table";
import { ApiExplorer } from "@/components/ui/api-explorer";
import { mockIssueLifecycle, mockStageAverages, mockWorkflowStages } from "@/data/mock-data";
import { endpointGroups } from "@/data/endpoints-full";
import { JellyfishEndpoint } from "@/lib/types";
import { cn } from "@/lib/utils";

// ─── Cycle Time (Life Cycle) data ────────────────────────────────────────────

const metricsEndpoints =
  endpointGroups.find((g) => g.domain === "Metrics")?.endpoints ?? [];

const deliveryEndpoints =
  endpointGroups.find((g) => g.domain === "Delivery")?.endpoints ?? [];

const lifecycleEndpoints = [
  ...metricsEndpoints.filter((ep) => ep.name === "team_metrics"),
  ...deliveryEndpoints.filter((ep) => ep.name === "deliverable_details"),
];

function getCycleParams(ep: { name: string }): Record<string, string> {
  switch (ep.name) {
    case "team_metrics":
      return { team: "platform", start: "2026-01-01", end: "2026-03-31" };
    case "deliverable_details":
      return { deliverable_id: "" };
    default:
      return {};
  }
}

const stageColors: Record<string, string> = {
  "To Do": "amber",
  "In Progress": "blue",
  "In Review": "violet",
  "QA": "green",
};

const maxAvgHours = Math.max(...mockStageAverages.map((s) => s.avgHours));

const STAGE_NAMES = ["To Do", "In Progress", "In Review", "QA"] as const;

// ─── Handoffs (Workflow) data ─────────────────────────────────────────────────

const mockWorkCategoryContents = {
  work_category: "epics",
  timeframe: "30d",
  end: "2026-03-31",
  deliverables: [
    {
      id: "del-001",
      name: "Auth Service Rewrite",
      status: "on-track",
      issues_total: 24,
      issues_complete: 19,
      percent_complete: 78,
      effort_allocated: 4.2,
    },
    {
      id: "del-002",
      name: "Mobile App v3.0",
      status: "at-risk",
      issues_total: 42,
      issues_complete: 19,
      percent_complete: 45,
      effort_allocated: 6.8,
    },
    {
      id: "del-003",
      name: "Data Pipeline Migration",
      status: "on-track",
      issues_total: 18,
      issues_complete: 17,
      percent_complete: 92,
      effort_allocated: 2.1,
    },
  ],
};

function getHandoffParams(ep: JellyfishEndpoint): Record<string, string> {
  switch (ep.name) {
    case "work_category_contents":
      return { work_category_slug: "epics", timeframe: "30d", end: "2026-03-31" };
    case "deliverable_scope_and_effort_history":
      return { deliverable_id: "" };
    default:
      return {};
  }
}

const FLOW_STAGES = ["Intake", "Triage", "Development", "Review", "QA", "Deploy"];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProcessPage() {
  const [tab, setTab] = useState<"cycle" | "handoffs">("cycle");
  const [token, setToken] = useState("");

  // ── Cycle Time tab derived data ──────────────────────────────────────────

  const issueTableRows = mockIssueLifecycle.map((issue) => {
    const stageHours = STAGE_NAMES.map(
      (name) => issue.stages.find((s) => s.name === name)?.hours ?? 0
    );
    const maxHours = Math.max(...stageHours);

    return [
      <span key="id" className="font-mono text-xs text-text-ghost">
        {issue.id}
      </span>,
      <span key="title" className="font-medium text-text-primary">
        {issue.title}
      </span>,
      ...stageHours.map((hours, i) => (
        <span
          key={STAGE_NAMES[i]}
          className={
            hours === maxHours && hours > 0 ? "text-amber font-semibold" : ""
          }
        >
          {hours}h
        </span>
      )),
      <span key="total" className="font-semibold text-text-primary">
        {issue.totalHours}h
      </span>,
    ];
  });

  // ── Handoffs tab derived data ────────────────────────────────────────────

  const maxTotal = Math.max(
    ...mockWorkflowStages.map((s) => s.avgHours + s.handoffDelay)
  );

  const tableHeaders = ["Transition", "Active Time", "Handoff Delay", "Total", "% Idle"];

  const tableRows = mockWorkflowStages.map((stage) => {
    const total = stage.avgHours + stage.handoffDelay;
    const idlePct = Math.round((stage.handoffDelay / total) * 100);
    const isHighIdle = idlePct > 30;

    return [
      <span key="transition" className="font-medium text-text-primary">
        {stage.from} → {stage.to}
      </span>,
      <span key="active" className="font-mono text-text-dim">
        {stage.avgHours}h
      </span>,
      <span key="handoff" className="font-mono text-text-dim">
        {stage.handoffDelay}h
      </span>,
      <span key="total" className="font-mono text-text-dim">
        {total}h
      </span>,
      <span
        key="idle"
        className={
          isHighIdle
            ? "font-mono font-semibold text-red-500"
            : "font-mono text-text-dim"
        }
      >
        {isHighIdle ? "⚠ " : ""}{idlePct}%
      </span>,
    ];
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      <PageHero
        eyebrow="Process Analysis"
        title="Cycle time"
        subtitle="& handoff efficiency"
      />

      {/* Tab bar */}
      <div role="tablist" aria-label="Process sections" className="flex gap-2 mb-8">
        <button
          type="button"
          role="tab"
          id="tab-cycle"
          aria-selected={tab === "cycle"}
          aria-controls="tabpanel-cycle"
          onClick={() => setTab("cycle")}
          className={cn(
            "px-4 py-2.5 min-h-[44px] rounded-lg text-sm font-medium flex items-center gap-2 transition-all cursor-pointer",
            tab === "cycle"
              ? "bg-blue/[0.08] text-blue border border-blue/30"
              : "bg-surface-raised border border-border text-text-ghost hover:text-text-dim"
          )}
        >
          Cycle Time
        </button>
        <button
          type="button"
          role="tab"
          id="tab-handoffs"
          aria-selected={tab === "handoffs"}
          aria-controls="tabpanel-handoffs"
          onClick={() => setTab("handoffs")}
          className={cn(
            "px-4 py-2.5 min-h-[44px] rounded-lg text-sm font-medium flex items-center gap-2 transition-all cursor-pointer",
            tab === "handoffs"
              ? "bg-blue/[0.08] text-blue border border-blue/30"
              : "bg-surface-raised border border-border text-text-ghost hover:text-text-dim"
          )}
        >
          Handoffs
        </button>
      </div>

      {/* ── Tab 1: Cycle Time ─────────────────────────────────────────────────── */}
      {tab === "cycle" && (
        <div
          role="tabpanel"
          id="tabpanel-cycle"
          aria-labelledby="tab-cycle"
          tabIndex={0}
        >
          <GuideBox title="Scrum Master Guide: Life Cycle Analysis">
            <p>
              The Life Cycle Explorer analyzes operational processes and trends at the issue level.
              Unlike sprint-level metrics, it shows how individual issues move through stages —
              revealing where work gets stuck, where handoffs create idle time, and which stages
              consistently slow delivery. Use this view to identify recurring bottleneck patterns
              and drive process improvements.
            </p>
          </GuideBox>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5">
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="text-sm font-bold mb-4">Stage Averages</h2>
              {mockStageAverages.map((stage) => (
                <ProgressBar
                  key={stage.name}
                  label={stage.name}
                  value={`${stage.avgHours}h`}
                  percent={(stage.avgHours / maxAvgHours) * 100}
                  color={stageColors[stage.name] ?? "blue"}
                />
              ))}
            </div>

            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="text-sm font-bold mb-4">Issue Cycle Time Breakdown</h2>
              <DataTable
                headers={["Issue", "Title", "To Do", "In Progress", "In Review", "QA", "Total"]}
                rows={issueTableRows}
              />
            </div>
          </div>

          <div className="mb-3">
            <label
              htmlFor="api-token-cycle"
              className="block text-[11.5px] font-semibold text-text-ghost mb-1.5"
            >
              Jellyfish API Token (optional — for live mode)
            </label>
            <input
              id="api-token-cycle"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="jf_..."
              className="w-full max-w-sm px-3 py-2 rounded-md border border-border bg-surface text-sm font-mono text-text-primary outline-none focus:border-blue"
            />
          </div>

          <ApiExplorer
            token={token}
            endpoints={lifecycleEndpoints}
            getParams={getCycleParams}
            mockResponses={{}}
          />

          <GuideBox title="Using Cycle Time in Ceremonies">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 mt-1">
              <div>
                <div className="font-semibold text-text-primary mb-0.5">Retrospective</div>
                <p>
                  Pull the stage averages at sprint close. If &apos;In Review&apos; consistently takes
                  longer than &apos;In Progress&apos;, your team has a review bottleneck — discuss
                  whether it&apos;s capacity, complexity, or process.
                </p>
              </div>
              <div>
                <div className="font-semibold text-text-primary mb-0.5">Sprint Planning</div>
                <p>
                  Use the issue-level data to identify outliers from the previous sprint. Issues that
                  spent disproportionate time in &apos;To Do&apos; may indicate backlog grooming gaps.
                </p>
              </div>
              <div>
                <div className="font-semibold text-text-primary mb-0.5">Standup</div>
                <p>
                  Surface any issue currently in a stage for longer than the team average. Early
                  detection prevents carry-over.
                </p>
              </div>
            </div>
          </GuideBox>

          <GuideBox title="Product Owner Guide: Bottleneck Visibility">
            <p>Identify which development stages consistently slow delivery. If &apos;In Review&apos; takes 3x longer than &apos;In Progress&apos;, <strong>budget accordingly in your roadmap</strong> — the bottleneck is real regardless of story point estimates.</p>
            <p className="mt-2">Use stage timing data to set <strong>accurate feature timelines</strong>. Tell stakeholders: &quot;Based on cycle time data, features of this size typically take 5-7 business days from start to deploy.&quot;</p>
          </GuideBox>
        </div>
      )}

      {/* ── Tab 2: Handoffs ───────────────────────────────────────────────────── */}
      {tab === "handoffs" && (
        <div
          role="tabpanel"
          id="tabpanel-handoffs"
          aria-labelledby="tab-handoffs"
          tabIndex={0}
        >
          <GuideBox title="Scrum Master Guide: Workflow Analysis">
            <p>
              Workflow Analysis traces work from intake to deployment, uncovering
              bottlenecks, handoffs, and delays that sprint-level metrics miss. Each
              transition between stages has two components: active work time and
              handoff delay (idle time waiting for the next stage to pick up). High
              handoff delays often point to capacity gaps, unclear ownership, or
              missing automation.
            </p>
          </GuideBox>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            {/* Flow visualization */}
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="text-sm font-bold mb-1">Workflow Stage Flow</h2>
              <p className="text-[12px] text-text-ghost mb-4">
                Active time (blue) + handoff delay (amber) per transition
              </p>

              {/* Stage pills row */}
              <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1">
                {FLOW_STAGES.map((stage, i) => (
                  <div key={stage} className="flex items-center gap-1 shrink-0">
                    <span className="px-2 py-0.5 rounded-md bg-surface-raised border border-border text-[11px] font-semibold text-text-dim whitespace-nowrap">
                      {stage}
                    </span>
                    {i < FLOW_STAGES.length - 1 && (
                      <span className="text-text-ghost text-[10px]">→</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Bars */}
              <div className="space-y-3">
                {mockWorkflowStages.map((stage) => {
                  const total = stage.avgHours + stage.handoffDelay;
                  const activeWidth = Math.round((stage.avgHours / maxTotal) * 100);
                  const handoffWidth = Math.round((stage.handoffDelay / maxTotal) * 100);

                  return (
                    <div key={`${stage.from}-${stage.to}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-medium text-text-dim">
                          {stage.from} → {stage.to}
                        </span>
                        <span className="text-[11px] font-mono text-text-ghost">
                          {total}h total
                        </span>
                      </div>
                      <div className="flex h-4 rounded overflow-hidden bg-surface-raised gap-px">
                        <div
                          className="h-full bg-blue/70 rounded-l transition-all"
                          style={{ width: `${activeWidth}%` }}
                          title={`Active: ${stage.avgHours}h`}
                        />
                        <div
                          className="h-full bg-amber-400/70 rounded-r transition-all"
                          style={{ width: `${handoffWidth}%` }}
                          title={`Handoff delay: ${stage.handoffDelay}h`}
                        />
                      </div>
                      <div className="flex gap-3 mt-0.5">
                        <span className="text-[10px] text-text-ghost">
                          Active: {stage.avgHours}h
                        </span>
                        <span className="text-[10px] text-text-ghost">
                          Delay: {stage.handoffDelay}h
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-blue/70" />
                  <span className="text-[11px] text-text-ghost">Active time</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-amber-400/70" />
                  <span className="text-[11px] text-text-ghost">Handoff delay</span>
                </div>
              </div>
            </div>

            {/* Data table */}
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="text-sm font-bold mb-1">Transition Breakdown</h2>
              <p className="text-[12px] text-text-ghost mb-4">
                Idle % &gt; 30% highlighted in red
              </p>
              <DataTable headers={tableHeaders} rows={tableRows} />
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="api-token-handoffs"
              className="block text-[11px] font-semibold uppercase tracking-widest text-text-ghost mb-1.5"
            >
              Jellyfish API Token
            </label>
            <input
              id="api-token-handoffs"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your token to enable live mode"
              className="w-full max-w-md px-3 py-2 rounded-md border border-border bg-surface text-sm font-mono text-text-primary outline-none focus:border-blue placeholder:text-text-ghost"
            />
          </div>

          <ApiExplorer
            token={token}
            endpoints={deliveryEndpoints}
            getParams={getHandoffParams}
            mockResponses={{ work_category_contents: mockWorkCategoryContents }}
          />

          <GuideBox title="Reducing Handoff Friction">
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-text-dim">Retrospective</p>
                <p>
                  Present the handoff delay data. Ask:{" "}
                  <em>&apos;Where does work sit waiting?&apos;</em> The Review→QA
                  transition often has the highest idle time — is it a reviewer
                  capacity issue or an unclear QA handoff process?
                </p>
              </div>
              <div>
                <p className="font-semibold text-text-dim">Planning</p>
                <p>
                  Set WIP limits per stage based on where idle time concentrates. If
                  Development→Review has a 6-hour delay, the team may need to
                  prioritize reviews before starting new work.
                </p>
              </div>
              <div>
                <p className="font-semibold text-text-dim">Process improvement</p>
                <p>
                  Target the single worst handoff each quarter. Reducing one
                  transition&apos;s idle time by 50% has more impact than small
                  improvements across all stages.
                </p>
              </div>
            </div>
          </GuideBox>

          <GuideBox title="Product Owner Guide: Process Efficiency">
            <p>Understand handoff delays that <strong>impact your delivery timeline</strong>. The transitions with highest idle time are where your features sit waiting — not being worked on.</p>
            <p className="mt-2">Focus improvement efforts on the <strong>single worst handoff</strong>. Reducing one transition&apos;s idle time by 50% has more roadmap impact than small improvements across all stages.</p>
            <p className="mt-2">Use workflow data to explain delivery timelines to stakeholders with specifics: &quot;Features spend an average of 16 hours waiting between Review and QA — we&apos;re working to reduce that.&quot;</p>
          </GuideBox>
        </div>
      )}
    </div>
  );
}
