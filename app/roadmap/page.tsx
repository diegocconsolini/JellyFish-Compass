"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { SectionDivider } from "@/components/ui/section-divider";
import { BottomPanel } from "@/components/ui/bottom-panel";
import { GuidePanel } from "@/components/ui/guide-panel";
import { ApiDrawer } from "@/components/ui/api-drawer";
import { ProgressBar } from "@/components/ui/progress-bar";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { mockRoadmapItems, mockDeliverables } from "@/data/mock-data";
import { endpointGroups } from "@/data/endpoints-full";
import { JellyfishEndpoint } from "@/lib/types";

const allocationEndpoints =
  endpointGroups.find((g) => g.domain === "Allocations")?.endpoints ?? [];

const roadmapApiEndpoints = allocationEndpoints.filter((ep) =>
  [
    "allocations_by_work_category",
    "work_category_contents",
    "allocations_by_investment_category",
  ].includes(ep.name)
);

// Pull work_category_contents from Delivery domain as well
const deliveryEndpoints =
  endpointGroups.find((g) => g.domain === "Delivery")?.endpoints ?? [];

const workCategoryContentsEp = deliveryEndpoints.find(
  (ep) => ep.name === "work_category_contents"
);

const explorerEndpoints = workCategoryContentsEp
  ? [
      ...roadmapApiEndpoints,
      workCategoryContentsEp,
    ].filter(
      (ep, idx, arr) => arr.findIndex((e) => e.name === ep.name) === idx
    )
  : roadmapApiEndpoints;

const mockAllocByWorkCategory = {
  timeframe: "30d",
  end: "2026-03-31",
  work_category: "initiatives",
  allocations: [
    { initiative: "Auth Service Rewrite", actual_fte: 4.2 },
    { initiative: "Mobile App v3.0", actual_fte: 3.8 },
    { initiative: "Data Pipeline Migration", actual_fte: 2.1 },
    { initiative: "API Rate Limiting", actual_fte: 0.8 },
    { initiative: "Platform Monitoring", actual_fte: 2.4 },
  ],
};

const mockAllocByInvestmentCategory = {
  timeframe: "30d",
  end: "2026-03-31",
  categories: [
    { name: "Feature Development", total_fte: 12.4 },
    { name: "Keep the Lights On", total_fte: 5.8 },
    { name: "Tech Debt", total_fte: 3.2 },
    { name: "Growth / Scaling", total_fte: 2.1 },
  ],
};

function getParams(ep: JellyfishEndpoint): Record<string, string> {
  switch (ep.name) {
    case "allocations_by_work_category":
      return { work_category_slug: "initiatives", timeframe: "30d", end: "2026-03-31" };
    case "work_category_contents":
      return { work_category_slug: "initiatives", timeframe: "30d", end: "2026-03-31" };
    case "allocations_by_investment_category":
      return { timeframe: "30d", end: "2026-03-31" };
    default:
      return {};
  }
}

const MAX_FTE = 7;

const roadmapStatusVariant: Record<
  "on-track" | "under-invested" | "over-invested",
  "green" | "amber" | "red"
> = {
  "on-track": "green",
  "under-invested": "amber",
  "over-invested": "red",
};

const roadmapStatusLabel: Record<
  "on-track" | "under-invested" | "over-invested",
  string
> = {
  "on-track": "On Track",
  "under-invested": "Under-Invested",
  "over-invested": "Over-Invested",
};

const deliveryStatusVariant: Record<
  "on-track" | "at-risk" | "behind",
  "green" | "amber" | "red"
> = {
  "on-track": "green",
  "at-risk": "amber",
  behind: "red",
};

const deliveryStatusLabel: Record<"on-track" | "at-risk" | "behind", string> = {
  "on-track": "On Track",
  "at-risk": "At Risk",
  behind: "Behind",
};

export default function RoadmapPage() {
  const [token, setToken] = useState("");
  const [plannedFte, setPlannedFte] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      mockRoadmapItems.map((item) => [item.initiative, String(item.plannedFte)])
    )
  );

  function handlePlannedChange(initiative: string, value: string) {
    setPlannedFte((prev) => ({ ...prev, [initiative]: value }));
  }

  function parsePlanned(initiative: string): number {
    const v = parseFloat(plannedFte[initiative] ?? "0");
    return isNaN(v) ? 0 : v;
  }

  // Gap analysis table rows
  const gapTableHeaders = [
    "Initiative",
    "Planned FTE",
    "Actual FTE",
    "Gap",
    "Status",
  ];

  const gapTableRows = mockRoadmapItems.map((item) => {
    const planned = parsePlanned(item.initiative);
    const gap = item.actualFte - planned;
    const absGap = Math.abs(gap);
    const isBig = absGap > 1.0;
    const gapSign = gap > 0 ? "+" : "";
    const gapColor =
      item.status === "on-track"
        ? "text-green"
        : item.status === "under-invested"
        ? "text-amber"
        : "text-red";

    return [
      <span key="name" className="font-medium text-text-primary">
        {item.initiative}
      </span>,
      <span key="planned" className={`font-mono text-text-dim ${isBig ? "font-bold" : ""}`}>
        {planned.toFixed(1)}
      </span>,
      <span key="actual" className={`font-mono text-text-dim ${isBig ? "font-bold" : ""}`}>
        {item.actualFte.toFixed(1)}
      </span>,
      <span
        key="gap"
        className={`font-mono font-semibold ${gapColor} ${isBig ? "font-bold" : ""}`}
      >
        {gapSign}
        {gap.toFixed(1)}
      </span>,
      <Badge key="status" variant={roadmapStatusVariant[item.status]}>
        {roadmapStatusLabel[item.status]}
      </Badge>,
    ];
  });

  // Initiative health table rows
  const healthTableHeaders = [
    "Deliverable",
    "Category",
    "Issues",
    "Complete",
    "Status",
  ];

  const healthTableRows = mockDeliverables.map((d) => [
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
    <Badge key="status" variant={deliveryStatusVariant[d.status]}>
      {deliveryStatusLabel[d.status]}
    </Badge>,
  ]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      <PageHero
        eyebrow="Roadmap Alignment"
        title="Investment vs plan"
        subtitle="& initiative health"
      />

      <SectionDivider />

      {/* Section 1: Planned vs Actual */}
      <section className="mb-5" aria-labelledby="planned-vs-actual-heading">
        <div className="mb-4">
          <h2 id="planned-vs-actual-heading" className="text-base font-bold">
            Planned vs Actual
          </h2>
          <p className="text-sm text-text-dim mt-1">
            Side-by-side comparison of Jellyfish allocation data and your planned
            investment
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left card: Actual */}
          <div className="rounded-xl border border-blue/40 bg-surface p-5">
            <h3 className="text-sm font-bold mb-0.5">
              Actual Effort (from Jellyfish)
            </h3>
            <p className="text-xs text-text-ghost mb-4">
              FTE allocated per initiative — pulled from Jellyfish
            </p>
            {mockRoadmapItems.map((item) => (
              <ProgressBar
                key={item.initiative}
                label={item.initiative}
                value={`${item.actualFte.toFixed(1)} FTE`}
                percent={Math.round((item.actualFte / MAX_FTE) * 100)}
                color="blue"
              />
            ))}
          </div>

          {/* Right card: Planned (user input) */}
          <div className="rounded-xl border border-violet/40 bg-surface p-5">
            <h3 className="text-sm font-bold mb-0.5">
              Planned Effort (your input)
            </h3>
            <p className="text-xs text-text-ghost mb-4">
              Enter your planned FTE per initiative from your roadmap
            </p>
            {mockRoadmapItems.map((item) => {
              const planned = parsePlanned(item.initiative);
              const pct = Math.round(
                (Math.min(planned, MAX_FTE) / MAX_FTE) * 100
              );
              return (
                <div key={item.initiative} className="mb-3.5">
                  <div className="flex justify-between items-center mb-1 gap-2">
                    <label
                      htmlFor={`planned-${item.initiative.replace(/\s+/g, "-").toLowerCase()}`}
                      className="text-sm text-text-dim truncate flex-1"
                    >
                      {item.initiative}
                    </label>
                    <input
                      id={`planned-${item.initiative.replace(/\s+/g, "-").toLowerCase()}`}
                      type="number"
                      min="0"
                      max="20"
                      step="0.1"
                      value={plannedFte[item.initiative] ?? ""}
                      onChange={(e) =>
                        handlePlannedChange(item.initiative, e.target.value)
                      }
                      aria-label={`Planned FTE for ${item.initiative}`}
                      className="w-20 px-2 py-1 rounded-md border border-border bg-bg text-sm font-mono text-text-primary outline-none focus:border-violet text-right"
                    />
                  </div>
                  <div className="h-1.5 bg-surface-overlay rounded-full overflow-hidden">
                    <div
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Planned FTE for ${item.initiative}: ${planned.toFixed(1)}`}
                      className="h-full rounded-full bg-gradient-to-r from-violet to-purple-300 transition-all duration-200"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider variant="minor" />

      {/* Section 2: Gap Analysis */}
      <section className="mb-5" aria-labelledby="gap-analysis-heading">
        <div className="mb-4">
          <h2 id="gap-analysis-heading" className="text-base font-bold">
            Gap Analysis
          </h2>
          <p className="text-sm text-text-dim mt-1">
            Difference between actual and planned FTE — gaps greater than 1.0
            are highlighted in bold
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <DataTable
            headers={gapTableHeaders}
            rows={gapTableRows}
            caption="Gap analysis between planned and actual FTE per initiative"
          />
        </div>
      </section>

      <SectionDivider variant="minor" />

      {/* Section 3: Initiative Health */}
      <section className="mb-5" aria-labelledby="initiative-health-heading">
        <div className="mb-4">
          <h2 id="initiative-health-heading" className="text-base font-bold">
            Initiative Health
          </h2>
          <p className="text-sm text-text-dim mt-1">
            Delivery status of active deliverables across your initiatives
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <DataTable
            headers={healthTableHeaders}
            rows={healthTableRows}
            caption="Initiative health by deliverable"
          />
        </div>
      </section>

      <SectionDivider variant="minor" />

      {/* Section 4: Product Tool Integrations */}
      <section className="mb-5" aria-labelledby="integrations-heading">
        <div className="mb-4">
          <h2 id="integrations-heading" className="text-base font-bold">
            Product Tool Integrations
          </h2>
          <p className="text-sm text-text-dim mt-1">
            Connect your roadmap tool for automatic planned vs actual tracking
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-text-dim mb-3">
            Jellyfish integrates with product roadmap tools for automatic
            alignment:
          </p>
          <div className="flex flex-wrap gap-2 mb-4" aria-label="Supported product roadmap integrations">
            <Badge variant="ghost">Productboard</Badge>
            <Badge variant="ghost">Aha!</Badge>
            <Badge variant="ghost">ProductPlan</Badge>
          </div>
          <p className="text-sm text-text-dim">
            Connect your roadmap tool in Jellyfish platform settings for
            automatic planned vs actual tracking.
          </p>
        </div>
      </section>

      <BottomPanel
        guidesContent={
          <GuidePanel
            scrumMaster={
              <p>
                When you see under-invested initiatives, discuss in planning — is
                the team pulled toward unplanned work? When over-invested, check
                if scope expanded without the Product Owner&apos;s knowledge. Use
                this data to facilitate alignment conversations between product
                and engineering. Look for patterns in the{" "}
                <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                  allocations_by_work_category
                </code>{" "}
                endpoint to surface recurring misalignment.
              </p>
            }
            productOwner={
              <p>
                Compare what you planned to invest in each initiative with
                what&apos;s actually happening. The &apos;Actual FTE&apos; comes
                from Jellyfish allocation data. The &apos;Planned FTE&apos; is
                what you enter based on your roadmap. The gap tells you where
                engineering effort diverges from product strategy. Jellyfish
                integrates with Productboard, Aha!, and ProductPlan — use the{" "}
                <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                  allocations_by_investment_category
                </code>{" "}
                endpoint for automatic alignment.
              </p>
            }
          />
        }
        apiExplorerContent={
          <ApiDrawer
            token={token}
            setToken={setToken}
            endpoints={explorerEndpoints}
            getParams={getParams}
            mockResponses={{
              allocations_by_work_category: mockAllocByWorkCategory,
              allocations_by_investment_category: mockAllocByInvestmentCategory,
            }}
          />
        }
      />
    </div>
  );
}
