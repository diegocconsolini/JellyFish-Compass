"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { DataTable } from "@/components/ui/data-table";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { SectionDivider } from "@/components/ui/section-divider";
import { BottomPanel } from "@/components/ui/bottom-panel";
import { GuidePanel } from "@/components/ui/guide-panel";
import { ApiDrawer } from "@/components/ui/api-drawer";
import {
  mockBurndown,
  mockShipEstimates,
  mockDeliverables,
} from "@/data/mock-data";
import { endpointGroups } from "@/data/endpoints-full";
import { JellyfishEndpoint } from "@/lib/types";

// Relevant endpoints: work_category_contents, deliverable_details,
// deliverable_scope_and_effort_history (Delivery) + team_sprint_summary (Metrics)
const deliveryEndpoints =
  endpointGroups.find((g) => g.domain === "Delivery")?.endpoints.filter((ep) =>
    ["work_category_contents", "deliverable_details", "deliverable_scope_and_effort_history"].includes(ep.name)
  ) ?? [];

const metricsEndpoints =
  endpointGroups.find((g) => g.domain === "Metrics")?.endpoints.filter((ep) =>
    ep.name === "team_sprint_summary"
  ) ?? [];

const forecastEndpoints = [...deliveryEndpoints, ...metricsEndpoints];

function getParams(ep: JellyfishEndpoint): Record<string, string> {
  switch (ep.name) {
    case "work_category_contents":
      return { work_category_slug: "epics", timeframe: "30d", end: "2026-03-31" };
    case "deliverable_details":
      return { deliverable_id: "" };
    case "deliverable_scope_and_effort_history":
      return { deliverable_id: "", timeframe: "60d" };
    case "team_sprint_summary":
      return { team_id: "", start: "2026-01-01", end: "2026-03-31" };
    default:
      return {};
  }
}

// Top-border gradient classes per deliverable
const deliverableBorderGradient: Record<string, string> = {
  "Auth Service Rewrite": "from-blue to-cyan",
  "Mobile App v3.0": "from-amber to-yellow-300",
  "Data Pipeline Migration": "from-green to-emerald-300",
  "API Rate Limiting": "from-violet to-purple-300",
};

const deliverableProgressColor: Record<string, string> = {
  "Auth Service Rewrite": "blue",
  "Mobile App v3.0": "amber",
  "Data Pipeline Migration": "green",
  "API Rate Limiting": "violet",
};

// Group burndown data by deliverable
const burndownByDeliverable = mockBurndown.reduce<
  Record<string, { week: string; percentComplete: number }[]>
>((acc, entry) => {
  if (!acc[entry.deliverable]) acc[entry.deliverable] = [];
  acc[entry.deliverable].push({
    week: entry.week,
    percentComplete: entry.percentComplete,
  });
  return acc;
}, {});

const allDeliverableNames = Object.keys(burndownByDeliverable);

const confidenceVariant: Record<"high" | "medium" | "low", "green" | "amber" | "red"> = {
  high: "green",
  medium: "amber",
  low: "red",
};

const confidenceLabel: Record<"high" | "medium" | "low", string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const mockShipEstimatesResponse = {
  generated_at: "2026-03-31",
  estimates: mockShipEstimates.map((e) => ({
    deliverable: e.deliverable,
    percent_complete: e.percentComplete,
    remaining_points: e.remainingPoints,
    avg_velocity: e.avgVelocity,
    estimated_sprints: e.estimatedSprints,
    estimated_ship_date: e.estimatedDate,
    confidence: e.confidence,
  })),
};

export default function DeliveryForecastPage() {
  const [token, setToken] = useState("");

  const tableHeaders = [
    "Deliverable",
    "Complete",
    "Remaining",
    "Est. Sprints",
    "Est. Date",
    "Confidence",
  ];

  const tableRows = mockShipEstimates.map((est) => [
    <span key="name" className="font-medium text-text-primary">
      {est.deliverable}
    </span>,
    <span key="pct" className="font-mono text-text-dim">
      {est.percentComplete}%
    </span>,
    <span key="remaining" className="font-mono text-text-dim">
      {est.remainingPoints} pts
    </span>,
    <span key="sprints" className="font-mono text-text-dim">
      {est.estimatedSprints}
    </span>,
    <span key="date" className="font-mono text-text-dim">
      {est.estimatedDate}
    </span>,
    <Badge key="confidence" variant={confidenceVariant[est.confidence]}>
      {confidenceLabel[est.confidence]}
    </Badge>,
  ]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      <PageHero
        eyebrow="Delivery Forecasting"
        title="Ship date estimates"
        subtitle="& completion tracking"
      />

      <SectionDivider />

      {/* Section 1: Completion Burndown */}
      <section aria-labelledby="burndown-heading" className="mb-5">
        <h2
          id="burndown-heading"
          className="text-sm font-bold mb-1 text-text-primary"
        >
          Completion Burndown
        </h2>
        <p className="text-xs text-text-ghost mb-4">
          Weekly % completion per deliverable — last 7 weeks
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {allDeliverableNames.map((delivName) => {
            const weeks = burndownByDeliverable[delivName];
            const currentPct =
              mockDeliverables.find((d) => d.name === delivName)
                ?.percentComplete ?? 0;
            const borderGradient =
              deliverableBorderGradient[delivName] ?? "from-blue to-cyan";
            const progressColor =
              deliverableProgressColor[delivName] ?? "blue";

            // Week-over-week delta between first and last data point
            const firstPct = weeks[0]?.percentComplete ?? 0;
            const lastPct = weeks[weeks.length - 1]?.percentComplete ?? 0;
            const delta = lastPct - firstPct;

            return (
              <div
                key={delivName}
                className="relative overflow-hidden rounded-xl border border-border bg-surface p-5"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${borderGradient}`}
                  aria-hidden="true"
                />

                <h3 className="text-[13px] font-semibold text-text-primary mb-0.5 leading-snug">
                  {delivName}
                </h3>
                <p className="text-xs text-text-ghost mb-3">
                  {delta >= 0 ? "+" : ""}
                  {delta}pp over 7 weeks
                </p>

                {/* Mini sparkline — week dots */}
                <div
                  className="flex items-end gap-1 h-10 mb-3"
                  aria-hidden="true"
                >
                  {weeks.map((w) => (
                    <div
                      key={w.week}
                      className="flex-1 flex flex-col items-center gap-0.5"
                    >
                      <div
                        className={`w-full rounded-sm bg-gradient-to-t ${borderGradient} opacity-80`}
                        style={{ height: `${(w.percentComplete / 100) * 40}px` }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-[10px] text-text-ghost mb-3 font-mono">
                  {weeks.map((w) => (
                    <span key={w.week}>{w.week}</span>
                  ))}
                </div>

                <ProgressBar
                  label="Current completion"
                  value={`${currentPct}%`}
                  percent={currentPct}
                  color={progressColor}
                />
              </div>
            );
          })}
        </div>
      </section>

      <SectionDivider variant="minor" />

      {/* Section 2: Compass Ship Estimates */}
      <section aria-labelledby="estimates-heading" className="mb-5">
        <h2
          id="estimates-heading"
          className="text-sm font-bold mb-1 text-text-primary"
        >
          Compass Ship Estimates
        </h2>
        <p className="text-xs text-text-ghost mb-4">
          Calculated from current velocity and remaining work
        </p>

        <div className="rounded-xl border border-border bg-surface p-5">
          <DataTable
            headers={tableHeaders}
            rows={tableRows}
            caption="Compass ship date estimates by deliverable"
          />
        </div>

        <div className="relative overflow-hidden rounded-xl border border-amber-dim bg-amber-dim/30 p-5 mt-4">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber to-yellow-300" />
          <p className="text-xs font-bold text-amber mb-1">Compass Estimate</p>
          <p className="text-sm text-text-dim">
            These dates are calculated by Compass from current velocity and
            remaining work. They may differ from Jellyfish platform forecasts.
            For probabilistic delivery forecasting with confidence intervals, use
            the{" "}
            <strong>Jellyfish Capacity Planner</strong> at app.jellyfish.co.
          </p>
        </div>
      </section>

      <BottomPanel
        guidesContent={
          <GuidePanel
            tabs={[
              {
                key: "sm",
                label: "Scrum Master",
                content: (
                  <p>
                    Track deliverable completion over time to identify trajectory shifts
                    early. Use sprint velocity and remaining work to estimate when
                    deliverables will complete. Share burndown data in sprint reviews to
                    set stakeholder expectations.
                  </p>
                ),
              },
              {
                key: "po",
                label: "Product Owner",
                content: (
                  <p>
                    Use the ship estimates to set stakeholder expectations. Present
                    &lsquo;high confidence&rsquo; deliverables as firm commitments and
                    &lsquo;medium/low confidence&rsquo; ones with caveats. When estimates
                    slip week-over-week, raise the risk immediately rather than waiting
                    for the sprint to close.
                  </p>
                ),
              },
              {
                key: "em",
                label: "Eng Manager",
                content: (
                  <div className="space-y-3 text-sm text-text-dim">
                    <p>
                      Use{" "}
                      <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                        deliverable_details
                      </code>{" "}
                      with{" "}
                      <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                        allocations_by_team
                      </code>{" "}
                      to model how capacity changes impact delivery timelines. Scenario
                      modeling lets Engineering Managers quantify the opportunity cost of
                      reprioritization — instead of saying &ldquo;we need more
                      engineers,&rdquo; model &ldquo;reducing scope by 2 features ships 3
                      weeks earlier.&rdquo;
                    </p>
                    <p className="font-semibold text-text-dim">
                      1. Capacity-Based Forecasting
                    </p>
                    <p>
                      Pull{" "}
                      <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                        allocations_by_team
                      </code>{" "}
                      to see actual available capacity, then compare against{" "}
                      <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                        deliverable_details
                      </code>{" "}
                      remaining scope. The gap between available FTEs and required FTEs is
                      your timeline risk.
                    </p>
                    <p className="font-semibold text-text-dim">
                      2. Reallocation Impact
                    </p>
                    <p>
                      Before moving engineers between teams, model the delivery impact on
                      both the source and destination projects using allocation and
                      deliverable data. The net impact is rarely zero — make the trade-off
                      explicit with data.
                    </p>
                    <p className="mt-3 text-xs text-text-ghost">
                      Source: jellyfish.co/solutions/scenario-planner/
                    </p>
                  </div>
                ),
              },
              {
                key: "pm",
                label: "Prog Manager",
                content: (
                  <div className="space-y-3 text-sm text-text-dim">
                    <p>
                      Use{" "}
                      <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                        deliverable_details
                      </code>{" "}
                      to forecast ship dates and communicate realistic timelines to
                      leadership. The gap between optimistic estimates and data-driven
                      forecasts is where stakeholder trust breaks down — close it with
                      evidence.
                    </p>
                    <p className="font-semibold text-text-dim">
                      1. Trade-Off Modeling
                    </p>
                    <p>
                      When leadership asks &ldquo;can we add feature X?&rdquo;, pull
                      current{" "}
                      <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                        allocations_by_team
                      </code>{" "}
                      and{" "}
                      <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                        deliverable_details
                      </code>{" "}
                      to model three options: (A) add headcount, (B) defer lower-priority
                      features, (C) accept a slip. Present all three with data.
                    </p>
                    <p className="font-semibold text-text-dim">
                      2. Confidence Communication
                    </p>
                    <p>
                      Use historical completion rates from sprint data alongside
                      deliverable progress to communicate ship dates with confidence
                      ranges, not point estimates. This sets realistic expectations and
                      builds stakeholder trust.
                    </p>
                    <p className="mt-3 text-xs text-text-ghost">
                      Source: jellyfish.co/solutions/capacity-planner/
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
            endpoints={forecastEndpoints}
            getParams={getParams}
            mockResponses={{
              work_category_contents: mockShipEstimatesResponse,
            }}
          />
        }
      />
    </div>
  );
}
