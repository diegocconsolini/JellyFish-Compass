"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { GuideBox } from "@/components/ui/guide-box";
import { DataTable } from "@/components/ui/data-table";
import { ApiExplorer } from "@/components/ui/api-explorer";
import { mockWorkflowStages } from "@/data/mock-data";
import { endpointGroups } from "@/data/endpoints-full";
import { JellyfishEndpoint } from "@/lib/types";

const deliveryEndpoints =
  endpointGroups.find((g) => g.domain === "Delivery")?.endpoints ?? [];

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

function getParams(ep: JellyfishEndpoint): Record<string, string> {
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

export default function WorkflowPage() {
  const [token, setToken] = useState("");

  // Compute max total for bar scaling
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
        eyebrow="Workflow Analysis"
        title="Intake to deployment"
        subtitle="& handoff delays"
      />

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
        <label htmlFor="api-token" className="block text-[11px] font-semibold uppercase tracking-widest text-text-ghost mb-1.5">
          Jellyfish API Token
        </label>
        <input
          id="api-token"
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
        getParams={getParams}
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
  );
}
