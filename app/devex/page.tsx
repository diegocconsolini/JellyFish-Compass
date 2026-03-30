"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { GuideBox } from "@/components/ui/guide-box";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ApiExplorer } from "@/components/ui/api-explorer";
import { mockDevExScores, mockUnlinkedPrs } from "@/data/mock-data";
import { endpointGroups } from "@/data/endpoints-full";
import { doraMetrics } from "@/data/dora-metrics";
import { JellyfishEndpoint } from "@/lib/types";

const devexEndpoints =
  endpointGroups.find((g) => g.domain === "DevEx")?.endpoints ?? [];

const unlinkedPrEndpoint = endpointGroups
  .find((g) => g.domain === "Metrics")
  ?.endpoints.find((ep) => ep.name === "unlinked_pull_requests");

const explorerEndpoints: JellyfishEndpoint[] = [
  ...devexEndpoints,
  ...(unlinkedPrEndpoint ? [unlinkedPrEndpoint] : []),
];

function getParams(ep: JellyfishEndpoint): Record<string, string> {
  switch (ep.name) {
    case "unlinked_pull_requests":
      return { start: "2026-01-01", end: "2026-03-31" };
    default:
      return { team: "" };
  }
}

const mockResponses = {
  devex_insights_by_team: {
    teams: [
      { team: "Frontend", devex_score: 81, survey_response_rate: 0.87, dora_rating: "high" },
      { team: "Platform", devex_score: 78, survey_response_rate: 0.82, dora_rating: "high" },
      { team: "Data", devex_score: 72, survey_response_rate: 0.74, dora_rating: "medium" },
      { team: "Mobile", devex_score: 65, survey_response_rate: 0.68, dora_rating: "medium" },
    ],
    period: "2026-Q1",
    overall_devex_score: 74,
  },
};

export default function DevExPage() {
  const [token, setToken] = useState("");

  return (
    <div className="max-w-[1440px] mx-auto px-7 py-7">
      <PageHero
        eyebrow="DevEx"
        title="Developer experience"
        subtitle="& blockers"
      />

      <GuideBox title="Scrum Master Guide: Developer Experience & Blockers">
        <p>
          The <strong>DevEx Index</strong> is a composite score derived from two sources:{" "}
          <code>developer surveys</code> (measuring perceived friction, tool satisfaction, and
          psychological safety) and <code>DORA / SPACE metrics</code> (deployment frequency, lead
          time, change failure rate, and mean time to resolution). A score above 75 is considered
          healthy; below 65 warrants a focused retro.
        </p>
        <p className="mt-2">
          <strong>Unlinked PRs</strong> are pull requests merged during the period that have no
          associated Jira ticket or work item. They represent invisible work — effort that doesn&apos;t
          appear in planning or retrospectives. Use the <code>unlinked_pull_requests</code> endpoint
          to identify which teams have the highest ratio and run a targeted linking hygiene session.
        </p>
      </GuideBox>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {/* Left card: DevEx Index by Team */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold">DevEx Index by Team</h2>
            <Badge variant="green">Healthy</Badge>
          </div>
          {mockDevExScores.map((item) => (
            <ProgressBar
              key={item.team}
              label={item.team}
              value={`${item.score}`}
              percent={item.score}
              color={item.color}
            />
          ))}
        </div>

        {/* Right card: Unlinked PRs */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold">Unlinked PRs</h2>
            <Badge variant="red">Action needed</Badge>
          </div>
          <div className="flex flex-col items-center mb-5">
            <span className="text-5xl font-extrabold text-red">{mockUnlinkedPrs.total}</span>
            <span className="text-xs text-text-dim mt-1">pull requests merged without a linked ticket</span>
          </div>
          {mockUnlinkedPrs.byTeam.map((item) => (
            <ProgressBar
              key={item.team}
              label={item.team}
              value={`${item.count}`}
              percent={Math.round((item.count / mockUnlinkedPrs.total) * 100)}
              color={item.color}
            />
          ))}
        </div>
      </div>

      {/* DORA Metrics Reference */}
      <div className="mb-5">
        <h2 className="text-sm font-bold mb-3">DORA Metrics Reference</h2>
        <div className="grid grid-cols-2 gap-3">
          {doraMetrics.map((metric) => (
            <div
              key={metric.name}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <div className="font-bold text-sm text-text-primary mb-1.5">{metric.name}</div>
              <p className="text-sm text-text-dim leading-relaxed">{metric.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-[11.5px] font-semibold text-text-ghost mb-1.5">
          Jellyfish API Token (optional — for live mode)
        </label>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="jf_..."
          className="w-full max-w-sm px-3 py-2 rounded-md border border-border bg-surface text-sm font-mono text-text-primary outline-none focus:border-blue"
        />
      </div>

      <ApiExplorer
        token={token}
        endpoints={explorerEndpoints}
        getParams={getParams}
        mockResponses={mockResponses}
      />

      <GuideBox title="Scrum Master Playbook: DevEx & Unlinked Work">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-1">
          <div>
            <div className="font-semibold text-text-primary mb-0.5">Retrospective: DevEx deep dive</div>
            <p>
              Use <code>devex_insights_by_team</code> at the end of each quarter to present survey
              scores alongside DORA indicators. Teams with a DevEx score below 70 should identify
              the top friction sources — tooling, review wait time, or unclear requirements — and
              commit to one improvement per sprint.
            </p>
          </div>
          <div>
            <div className="font-semibold text-text-primary mb-0.5">Linking hygiene sprint ritual</div>
            <p>
              Pull <code>unlinked_pull_requests</code> weekly (narrow window: last 7 days) and share
              the list in your team Slack channel. Assign a rotating &quot;link captain&quot; who
              retrospectively links or flags PRs before the sprint closes. This keeps your allocation
              data accurate and eliminates invisible work.
            </p>
          </div>
          <div>
            <div className="font-semibold text-text-primary mb-0.5">DORA baseline & goal-setting</div>
            <p>
              At the start of each quarter, record your team&apos;s four DORA metrics using{" "}
              <code>team_metrics</code>. Set specific, measurable targets — for example, reduce lead
              time from 4 days to 2 days — and track weekly progress in your sprint review. Pair
              DORA improvements with DevEx survey results to confirm that tooling changes are
              actually felt by engineers.
            </p>
          </div>
        </div>
      </GuideBox>
    </div>
  );
}
