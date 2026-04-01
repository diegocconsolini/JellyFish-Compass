"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionDivider } from "@/components/ui/section-divider";
import { BottomPanel } from "@/components/ui/bottom-panel";
import { GuidePanel } from "@/components/ui/guide-panel";
import { ApiDrawer } from "@/components/ui/api-drawer";
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
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      <PageHero
        eyebrow="DevEx"
        title="Developer experience"
        subtitle="& blockers"
      />

      <SectionDivider />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5">
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

      <SectionDivider variant="minor" />

      {/* DORA Metrics Reference */}
      <div className="mb-5">
        <h2 className="text-sm font-bold mb-3">DORA Metrics Reference</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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
                      The <strong>DevEx Index</strong> is a composite score derived from two sources:{" "}
                      <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">developer surveys</code>{" "}
                      (measuring perceived friction, tool satisfaction, and psychological safety) and{" "}
                      <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">DORA / SPACE metrics</code>{" "}
                      (deployment frequency, lead time, change failure rate, and mean time to resolution).
                      Track your team&apos;s score over time and investigate drops in any quarter. Use the
                      trend — not a fixed threshold — to decide when a focused retro is warranted.
                    </p>
                    <p className="mt-2">
                      <strong>Unlinked PRs</strong> are pull requests merged during the period that have no
                      associated Jira ticket or work item. They represent invisible work — effort that
                      doesn&apos;t appear in planning or retrospectives. Use the{" "}
                      <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">unlinked_pull_requests</code>{" "}
                      endpoint to identify which teams have the highest ratio and run a targeted linking
                      hygiene session.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mt-4">
                      <div>
                        <div className="font-semibold text-text-primary mb-0.5">Retrospective: DevEx deep dive</div>
                        <p>
                          Use{" "}
                          <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">devex_insights_by_team</code>{" "}
                          at the end of each quarter to present survey scores alongside DORA indicators.
                          Teams showing a declining DevEx trend should identify the top friction sources —
                          tooling, review wait time, or unclear requirements — and commit to one improvement
                          per sprint.
                        </p>
                      </div>
                      <div>
                        <div className="font-semibold text-text-primary mb-0.5">Linking hygiene sprint ritual</div>
                        <p>
                          Pull{" "}
                          <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">unlinked_pull_requests</code>{" "}
                          weekly (narrow window: last 7 days) and share the list in your team Slack channel.
                          Assign a rotating &quot;link captain&quot; who retrospectively links or flags PRs
                          before the sprint closes. This keeps your allocation data accurate and eliminates
                          invisible work.
                        </p>
                      </div>
                      <div>
                        <div className="font-semibold text-text-primary mb-0.5">DORA baseline &amp; goal-setting</div>
                        <p>
                          At the start of each quarter, record your team&apos;s four DORA metrics using{" "}
                          <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">team_metrics</code>.
                          Set specific, measurable targets based on your team&apos;s baseline and track
                          weekly progress in your sprint review. Pair DORA improvements with DevEx survey
                          results to confirm that tooling changes are actually felt by engineers.
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-text-ghost">
                      Customer-reported DevEx outcomes: Kaleris achieved 21% more productive and 19% more
                      efficient engineering teams (jellyfish.co/platform/devex/). Platform rated 4.5/5 on
                      G2 and 4.8/5 on Gartner.
                    </p>
                  </div>
                ),
              },
              {
                key: "em",
                label: "Eng Manager",
                content: (
                  <div>
                    <p>
                      Use{" "}
                      <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">team_metrics</code>{" "}
                      alongside DevEx survey signals to pair quantitative system metrics with qualitative
                      developer sentiment. This is the bridge between &quot;what the data says&quot; and
                      &quot;how the team feels&quot; — EMs need both to coach effectively.
                    </p>
                    <div className="flex flex-col gap-4 mt-4">
                      <div>
                        <p className="font-semibold text-text-dim">1. Survey + Metrics Pairing</p>
                        <p className="mt-1">
                          When DevEx surveys flag &quot;testing is painful,&quot; check{" "}
                          <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">team_metrics</code>{" "}
                          for test-related cycle time. The combination of sentiment data and system metrics
                          pinpoints where to invest. Jellyfish used this approach internally: test automation
                          sentiment improved from 26 to 58 after targeted improvements.
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-text-dim">2. Burnout Prevention</p>
                        <p className="mt-1">
                          Use{" "}
                          <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">unlinked_pull_requests</code>{" "}
                          to identify off-process work that fragments focus. High unlinked PR counts often
                          correlate with context switching — a leading indicator of developer burnout.
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-text-dim">3. Intervention Tracking</p>
                        <p className="mt-1">
                          After making an improvement (e.g., speeding up CI, reducing meeting load), track
                          the same DevEx metrics over subsequent sprints. Use{" "}
                          <code className="text-xs font-mono bg-blue-dim text-blue px-1 py-0.5 rounded">team_metrics</code>{" "}
                          to verify that improvements in developer experience translate to delivery gains.
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-text-ghost">
                      Source: jellyfish.co/blog/how-jellyfish-used-its-own-devex-tool-to-double-engineer-satisfaction-with-test-automation/
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
            endpoints={explorerEndpoints}
            getParams={getParams}
            mockResponses={mockResponses}
          />
        }
      />
    </div>
  );
}
