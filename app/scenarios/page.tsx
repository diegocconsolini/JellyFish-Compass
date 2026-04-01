"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionDivider } from "@/components/ui/section-divider";
import { BottomPanel } from "@/components/ui/bottom-panel";
import { GuidePanel } from "@/components/ui/guide-panel";
import { ApiDrawer } from "@/components/ui/api-drawer";
import { mockCurrentScenario, mockAdjustedScenario } from "@/data/mock-data";
import { endpointGroups } from "@/data/endpoints-full";

const colorValueMap: Record<string, string> = {
  blue: "text-blue",
  amber: "text-amber",
  violet: "text-violet",
  green: "text-green",
  ghost: "text-text-ghost",
};

const allocationGroup = endpointGroups.find((g) => g.domain === "Allocations");
const scenarioEndpoints = allocationGroup
  ? allocationGroup.endpoints.filter((e) =>
      ["allocations_by_investment_category", "allocations_by_team"].includes(e.name)
    )
  : [];

const TOTAL_FTE = 25;

// Labels that changed between current and adjusted scenario
const CHANGED_LABELS: Record<string, { from: number; to: number; sign: "+" | "-" }> = {
  "Feature Development": { from: 12.4, to: 14.2, sign: "+" },
  "Keep the Lights On": { from: 5.8, to: 4.0, sign: "-" },
};

export default function ScenariosPage() {
  const [token, setToken] = useState("");

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      <PageHero
        eyebrow="Scenario Planner"
        title="What-if modeling"
        subtitle="& allocation scenarios"
      />

      <SectionDivider />

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Current Allocation */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-bold mb-4 text-text-primary">Current Allocation</h2>
          {mockCurrentScenario.map((item) => (
            <ProgressBar
              key={item.label}
              label={item.label}
              value={`${item.value} FTE`}
              percent={(item.value / TOTAL_FTE) * 100}
              color={item.color}
              valueColor={colorValueMap[item.color]}
            />
          ))}
        </div>

        {/* Adjusted Scenario */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-bold mb-4 text-text-primary">
            Scenario: Shift 1.8 FTE from KTLO to Features
          </h2>
          {mockAdjustedScenario.map((item) => {
            const changed = CHANGED_LABELS[item.label];
            return (
              <div key={item.label} className="relative">
                <ProgressBar
                  label={item.label}
                  value={`${item.value} FTE`}
                  percent={(item.value / TOTAL_FTE) * 100}
                  color={item.color}
                  valueColor={colorValueMap[item.color]}
                />
                {changed && (
                  <span
                    className={`absolute right-0 top-0 text-xs font-semibold px-1.5 py-0.5 rounded ${
                      changed.sign === "+"
                        ? "text-green bg-green/10"
                        : "text-amber bg-amber/10"
                    }`}
                    aria-label={`Changed from ${changed.from} to ${changed.to} FTE`}
                  >
                    {changed.sign}
                    {Math.abs(changed.to - changed.from).toFixed(1)} FTE
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <SectionDivider variant="minor" />

      {/* Delta summary card */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-sm font-bold mb-3 text-text-primary">Delta Summary</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green flex-shrink-0" aria-hidden="true" />
            <span className="text-green font-medium">Feature Development: +1.8 FTE</span>
            <span className="text-text-ghost">(12.4 &rarr; 14.2)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber flex-shrink-0" aria-hidden="true" />
            <span className="text-amber font-medium">Keep the Lights On: &minus;1.8 FTE</span>
            <span className="text-text-ghost">(5.8 &rarr; 4.0)</span>
          </li>
          <li className="flex items-center gap-2 pt-1 border-t border-border mt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-text-ghost flex-shrink-0" aria-hidden="true" />
            <span className="text-text-dim font-medium">Net change: 0 FTE</span>
            <span className="text-text-ghost">&mdash; rebalance, not growth</span>
          </li>
        </ul>
      </div>

      <BottomPanel
        guidesContent={
          <GuidePanel
            scrumMaster={
              <div className="space-y-4">
                <p>
                  The Scenario Planner lets you model resource allocation scenarios by adjusting
                  variables like team size and project priorities to see how changes affect delivery
                  capacity. Use it before quarter planning to prepare data-backed proposals, or
                  mid-sprint to evaluate the impact of unexpected changes. The key question:{" "}
                  <em>
                    &ldquo;If we shift resources from X to Y, what does the delivery forecast
                    look like?&rdquo;
                  </em>
                </p>
                <ul className="space-y-3">
                  <li>
                    <strong>Quarter Planning:</strong> Build 2&ndash;3 scenarios before the planning
                    session. Present the tradeoffs clearly:{" "}
                    <em>
                      &ldquo;Scenario A adds 2 FTE to features but drops KTLO coverage to 16%.
                      Scenario B keeps current balance but extends the roadmap by 3 weeks.&rdquo;
                    </em>
                  </li>
                  <li>
                    <strong>Mid-Sprint Adjustment:</strong> When priorities shift unexpectedly, model
                    the reallocation impact before committing. Moving engineers between categories
                    mid-sprint has a context-switching cost that the raw FTE numbers don&apos;t show.
                    Use{" "}
                    <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                      allocations_by_investment_category
                    </code>{" "}
                    to see the before/after split.
                  </li>
                  <li>
                    <strong>Stakeholder Communication:</strong> Scenarios turn allocation
                    conversations from opinions into data. Instead of &ldquo;we need more
                    engineers,&rdquo; present:{" "}
                    <em>
                      &ldquo;Shifting 1.8 FTE from KTLO to Features increases feature throughput
                      by an estimated 15% but creates KTLO risk in areas X and Y.&rdquo;
                    </em>
                  </li>
                </ul>
              </div>
            }
            productOwner={
              <div className="space-y-3">
                <p>
                  Model &apos;what if&apos; scenarios before quarter planning to prepare{" "}
                  <strong>data-backed proposals</strong>. Show stakeholders the trade-off clearly:
                  &quot;If we shift 2 FTE to Feature X, Initiative Y slips by 3 weeks.&quot;
                </p>
                <p>
                  Use allocation scenarios to{" "}
                  <strong>align product priorities with engineering capacity</strong>. This turns
                  resource conversations from opinions into data &mdash; instead of &quot;we need
                  more engineers,&quot; present the specific impact of reallocation. Pull current
                  numbers via{" "}
                  <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">
                    allocations_by_team
                  </code>{" "}
                  to ground the conversation in actuals before proposing shifts.
                </p>
              </div>
            }
          />
        }
        apiExplorerContent={
          <ApiDrawer
            token={token}
            setToken={setToken}
            endpoints={scenarioEndpoints}
            getParams={() => ({
              hierarchy_level: "1",
              start: "2026-01-01",
              end: "2026-03-31",
            })}
          />
        }
      />
    </div>
  );
}
