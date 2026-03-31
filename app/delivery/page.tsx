"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { GuideBox } from "@/components/ui/guide-box";
import { BarChart } from "@/components/ui/bar-chart";
import { DataTable } from "@/components/ui/data-table";
import { ApiExplorer } from "@/components/ui/api-explorer";
import { Badge } from "@/components/ui/badge";
import { mockScopeEffort, mockDeliverables } from "@/data/mock-data";
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
    case "deliverable_details":
      return { deliverable_id: "" };
    case "deliverable_scope_and_effort_history":
      return { deliverable_id: "" };
    default:
      return {};
  }
}

const statusVariant: Record<
  "on-track" | "at-risk" | "behind",
  "green" | "amber" | "red"
> = {
  "on-track": "green",
  "at-risk": "amber",
  behind: "red",
};

const statusLabel: Record<"on-track" | "at-risk" | "behind", string> = {
  "on-track": "On Track",
  "at-risk": "At Risk",
  behind: "Behind",
};

export default function DeliveryPage() {
  const [token, setToken] = useState("");

  const barChartData = mockScopeEffort.map((d) => ({
    label: d.week,
    values: [
      {
        height: Math.round((d.scope / 70) * 100),
        className: "bg-gradient-to-t from-blue to-blue/60",
      },
      {
        height: Math.round((d.effort / 70) * 100),
        className: "bg-gradient-to-t from-violet to-violet/60",
      },
    ],
  }));

  const barChartLegend = [
    { label: "Scope", className: "bg-blue" },
    { label: "Effort", className: "bg-violet" },
  ];

  const tableHeaders = ["Deliverable", "Category", "Issues", "Complete", "Status"];

  const tableRows = mockDeliverables.map((d) => [
    <span key="name" className="font-medium text-text-primary">
      {d.name}
    </span>,
    <span key="cat" className="text-text-dim">
      {d.category}
    </span>,
    <span key="issues" className="font-mono text-text-dim">
      {d.issues}
    </span>,
    <span key="pct" className="font-mono text-text-dim">
      {d.percentComplete}%
    </span>,
    <Badge key="status" variant={statusVariant[d.status]}>
      {statusLabel[d.status]}
    </Badge>,
  ]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      <PageHero
        eyebrow="Delivery"
        title="Delivery tracking"
        subtitle="& scope management"
      />

      <GuideBox title="Scrum Master Guide: Delivery Tracking">
        <p>
          Delivery tracking in Jellyfish operates at the{" "}
          <strong>deliverable level</strong> — giving Scrum Masters visibility
          across epics, initiatives, and features that span multiple sprints.
          Unlike sprint-level metrics, delivery tracking surfaces scope drift,
          effort alignment, and completion trends over weeks.
        </p>
        <p className="mt-2">
          The four delivery endpoints power this view:
        </p>
        <ul className="mt-1.5 space-y-1 list-disc list-inside">
          <li>
            <code>work_category_contents</code> — lists all deliverables within
            an epic, initiative, or feature category
          </li>
          <li>
            <code>deliverable_details</code> — returns status, issue counts, and
            effort for a single deliverable
          </li>
          <li>
            <code>deliverable_scope_and_effort_history</code> — weekly scope and
            effort history for scope creep detection
          </li>
          <li>
            <code>work_categories</code> — enumerates all work category types
            configured in your Jellyfish instance
          </li>
        </ul>
      </GuideBox>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-bold mb-1">Scope &amp; Effort Trend</h2>
          <p className="text-[12px] text-text-ghost mb-4">8-week view — story points per week</p>
          <BarChart data={barChartData} legend={barChartLegend} />
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-bold mb-1">Active Deliverables</h2>
          <p className="text-[12px] text-text-ghost mb-4">Current delivery status by deliverable</p>
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

      <GuideBox title="Scrum Master Playbook: Delivery Insights">
        <p className="font-semibold text-text-primary mb-2">
          Three high-value patterns for delivery visibility:
        </p>
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-text-dim">1. Scope Creep Detection</p>
            <p>
              Use <code>deliverable_scope_and_effort_history</code> to compare
              week-over-week scope changes. A rising scope line alongside flat or
              declining effort signals unplanned work entering the deliverable.
              Flag deliverables with significant week-over-week scope growth and bring them to the
              next planning session. Define your own threshold based on your team&apos;s tolerance for
              scope change.
            </p>
          </div>
          <div>
            <p className="font-semibold text-text-dim">2. Cross-Sprint Visibility</p>
            <p>
              Deliverables span sprints, but sprint health metrics do not.
              Pull <code>work_category_contents</code> weekly to build a
              deliverable-level health summary that persists across sprint
              boundaries. This gives leadership a stable signal even during
              sprint transitions or mid-sprint re-planning.
            </p>
          </div>
          <div>
            <p className="font-semibold text-text-dim">3. Stakeholder Reporting</p>
            <p>
              Combine <code>deliverable_details</code> percent complete with
              effort data from allocations to build a concise status update:
              what is done, what is in flight, and where risk is concentrated.
              Group deliverables by <code>work_category</code> so business
              stakeholders see progress at the initiative level rather than the
              sprint level.
            </p>
          </div>
        </div>
      </GuideBox>

      <GuideBox title="Product Owner Guide: Delivery Tracking">
        <p>Monitor deliverable completion % to <strong>communicate credible timelines</strong> to stakeholders. Use <code>deliverable_scope_and_effort_history</code> to detect scope creep before it impacts ship dates.</p>
        <p className="mt-2">Track delivery status by work category to understand <strong>initiative-level progress</strong> — this is what leadership and product stakeholders want to see, not sprint-level detail.</p>
        <p className="mt-2">When a deliverable&apos;s scope grows week-over-week while effort stays flat, flag it immediately — this is the earliest signal of a timeline slip.</p>
      </GuideBox>
    </div>
  );
}
