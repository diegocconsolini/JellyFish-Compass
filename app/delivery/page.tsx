"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { BarChart } from "@/components/ui/bar-chart";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { SectionDivider } from "@/components/ui/section-divider";
import { BottomPanel } from "@/components/ui/bottom-panel";
import { GuidePanel } from "@/components/ui/guide-panel";
import { ApiDrawer } from "@/components/ui/api-drawer";
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
        label: `${d.scope}`,
      },
      {
        height: Math.round((d.effort / 70) * 100),
        className: "bg-gradient-to-t from-amber to-amber/60",
        label: `${d.effort}`,
      },
    ],
  }));

  const barChartLegend = [
    { label: "Scope", className: "bg-blue" },
    { label: "Effort", className: "bg-amber" },
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

      <SectionDivider />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-bold mb-1">Scope &amp; Effort Trend</h2>
          <p className="text-xs text-text-ghost mb-4">8-week view — story points per week</p>
          <BarChart data={barChartData} legend={barChartLegend} title="Scope and effort trend — 8-week view" />
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-bold mb-1">Active Deliverables</h2>
          <p className="text-xs text-text-ghost mb-4">Current delivery status by deliverable</p>
          <DataTable headers={tableHeaders} rows={tableRows} />
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
                  <div>
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
                        <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">work_category_contents</code> — lists all deliverables within
                        an epic, initiative, or feature category
                      </li>
                      <li>
                        <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">deliverable_details</code> — returns status, issue counts, and
                        effort for a single deliverable
                      </li>
                      <li>
                        <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">deliverable_scope_and_effort_history</code> — weekly scope and
                        effort history for scope creep detection
                      </li>
                      <li>
                        <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">work_categories</code> — enumerates all work category types
                        configured in your Jellyfish instance
                      </li>
                    </ul>
                    <p className="font-semibold text-text-primary mt-4 mb-2">
                      Three high-value patterns for delivery visibility:
                    </p>
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-text-dim">1. Scope Creep Detection</p>
                        <p>
                          Use <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">deliverable_scope_and_effort_history</code> to compare
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
                          Pull <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">work_category_contents</code> weekly to build a
                          deliverable-level health summary that persists across sprint
                          boundaries. This gives leadership a stable signal even during
                          sprint transitions or mid-sprint re-planning.
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-text-dim">3. Stakeholder Reporting</p>
                        <p>
                          Combine <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">deliverable_details</code> percent complete with
                          effort data from allocations to build a concise status update:
                          what is done, what is in flight, and where risk is concentrated.
                          Group deliverables by <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">work_category</code> so business
                          stakeholders see progress at the initiative level rather than the
                          sprint level.
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: "po",
                label: "Product Owner",
                content: (
                  <div>
                    <p>Monitor deliverable completion % to <strong>communicate credible timelines</strong> to stakeholders. Use <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">deliverable_scope_and_effort_history</code> to detect scope creep before it impacts ship dates.</p>
                    <p className="mt-2">Track delivery status by work category to understand <strong>initiative-level progress</strong> — this is what leadership and product stakeholders want to see, not sprint-level detail.</p>
                    <p className="mt-2">When a deliverable&apos;s scope grows week-over-week while effort stays flat, flag it immediately — this is the earliest signal of a timeline slip.</p>
                  </div>
                ),
              },
              {
                key: "em",
                label: "Eng Manager",
                content: (
                  <div>
                    <p>
                      Use <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">work_category_contents</code> and <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">deliverable_scope_and_effort_history</code> for cross-sprint deliverable visibility. As an Engineering Manager, deliverable-level health data persists across sprint boundaries — giving you a stable signal for stakeholder updates and resource decisions even during sprint transitions.
                    </p>
                    <div className="space-y-3 mt-3">
                      <div>
                        <p className="font-semibold text-text-dim">1. Bottleneck Removal</p>
                        <p>
                          Use <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">deliverable_scope_and_effort_history</code> to identify deliverables where scope grows but effort stays flat. This is scope creep that threatens timelines. Flag deliverables with significant week-over-week scope growth and bring them to planning before they become emergencies.
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-text-dim">2. Cross-Team Dependencies</p>
                        <p>
                          Pull <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">work_category_contents</code> weekly to track multi-team deliverables. When one team&apos;s component blocks another, the data surfaces the dependency before it cascades into missed deadlines.
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-text-dim">3. Throughput Optimization</p>
                        <p>
                          Compare deliverable completion rates across teams using <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">deliverable_details</code>. Teams with similar scope but different throughput may have process differences worth investigating in retrospectives.
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-text-ghost">Source: jellyfish.co/case-studies/jobvite/ — Jobvite achieved 80% increase in delivery throughput.</p>
                  </div>
                ),
              },
              {
                key: "pm",
                label: "Prog Manager",
                content: (
                  <div>
                    <p>
                      Use <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">work_category_contents</code> to track initiative-level progress for stakeholder reporting. Product Managers need deliverable status grouped by work category so leadership sees progress at the initiative level — not sprint-level detail that obscures the bigger picture.
                    </p>
                    <div className="space-y-3 mt-3">
                      <div>
                        <p className="font-semibold text-text-dim">1. Stakeholder Reporting</p>
                        <p>
                          Combine <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">deliverable_details</code> percent complete with <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">work_category_contents</code> to build a concise status update: what is done, what is in flight, and where risk is concentrated. Group by work category for business-level visibility.
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-text-dim">2. Scope Creep Detection</p>
                        <p>
                          Monitor <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">deliverable_scope_and_effort_history</code> to detect when deliverable scope grows week-over-week while effort stays flat. Flag this to engineering leadership immediately — it is the earliest signal of a timeline slip.
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-text-ghost">Source: jellyfish.co/solutions/software-delivery-management/</p>
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
            endpoints={deliveryEndpoints}
            getParams={getParams}
            mockResponses={{ work_category_contents: mockWorkCategoryContents }}
          />
        }
      />
    </div>
  );
}
