"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { GuideBox } from "@/components/ui/guide-box";
import { ProgressBar } from "@/components/ui/progress-bar";
import { DataTable } from "@/components/ui/data-table";
import { ApiExplorer } from "@/components/ui/api-explorer";
import { mockIssueLifecycle, mockStageAverages } from "@/data/mock-data";
import { endpointGroups } from "@/data/endpoints-full";

const metricsEndpoints =
  endpointGroups.find((g) => g.domain === "Metrics")?.endpoints ?? [];

const deliveryEndpoints =
  endpointGroups.find((g) => g.domain === "Delivery")?.endpoints ?? [];

const lifecycleEndpoints = [
  ...metricsEndpoints.filter((ep) => ep.name === "team_metrics"),
  ...deliveryEndpoints.filter((ep) => ep.name === "deliverable_details"),
];

function getParams(ep: { name: string }): Record<string, string> {
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

export default function LifeCyclePage() {
  const [token, setToken] = useState("");

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
            hours === maxHours && hours > 0
              ? "text-amber font-semibold"
              : ""
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

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      <PageHero
        eyebrow="Life Cycle Explorer"
        title="Issue-level cycle time"
        subtitle="& bottleneck analysis"
      />

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
        endpoints={lifecycleEndpoints}
        getParams={getParams}
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
  );
}
