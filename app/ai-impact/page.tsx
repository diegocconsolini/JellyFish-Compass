"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { GuideBox } from "@/components/ui/guide-box";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { DataTable } from "@/components/ui/data-table";
import { mockAiAdoption, mockAiBeforeAfter } from "@/data/mock-data";
import { integrations } from "@/data/integrations";

const aiCodingTools =
  integrations.find((g) => g.category === "AI Coding Tools")?.tools ?? [];

const beforeAfterHeaders = [
  "Team",
  "PRs/wk Before",
  "PRs/wk After",
  "Cycle Time Before",
  "Cycle Time After",
];

const beforeAfterRows = mockAiBeforeAfter.map((row) => [
  <span key="team" className="font-medium text-text-primary">
    {row.team}
  </span>,
  <span key="prs-before" className="text-text-dim">
    {row.before.prsPerWeek}
  </span>,
  <span key="prs-after" className="font-semibold text-green">
    {row.after.prsPerWeek}
  </span>,
  <span key="ct-before" className="text-text-dim">
    {row.before.cycleTimeDays}d
  </span>,
  <span key="ct-after" className="font-semibold text-green">
    {row.after.cycleTimeDays}d
  </span>,
]);

export default function AiImpactPage() {
  const [token, setToken] = useState("");

  return (
    <div className="max-w-[1440px] mx-auto px-7 py-7">
      <PageHero
        eyebrow="AI Impact"
        title="AI tool adoption"
        subtitle="& measurement"
      />

      <GuideBox title="Scrum Master Guide: Measuring AI Impact">
        <p>
          AI Impact measurement answers three questions: Are teams actually
          using AI tools? Which tools deliver measurable results? And where
          should the organization invest next? Jellyfish automatically detects
          AI usage patterns across GitHub Copilot, Cursor, Claude Code, and
          other tools — then links adoption data to delivery signals like
          throughput, cycle time, and code review speed. The goal is objective
          measurement, not advocacy for any specific tool.
        </p>
      </GuideBox>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {/* Left card: AI Tool Adoption by Team */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold">AI Tool Adoption by Team</h2>
            <Badge variant="blue">Adoption</Badge>
          </div>
          {mockAiAdoption.map((item) => (
            <div key={item.team} className="mb-4 last:mb-0">
              <div className="text-xs font-semibold text-text-primary mb-1.5">
                {item.team}
              </div>
              <ProgressBar
                label="Copilot"
                value={`${item.copilot}%`}
                percent={item.copilot}
                color="blue"
              />
              <ProgressBar
                label="Cursor"
                value={`${item.cursor}%`}
                percent={item.cursor}
                color="violet"
              />
              <ProgressBar
                label="Claude Code"
                value={`${item.claudeCode}%`}
                percent={item.claudeCode}
                color="green"
              />
            </div>
          ))}
        </div>

        {/* Right card: Before / After AI Adoption */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold">Before / After AI Adoption</h2>
            <Badge variant="green">Impact</Badge>
          </div>
          <DataTable headers={beforeAfterHeaders} rows={beforeAfterRows} />
          <p className="text-xs text-text-ghost mt-3">
            Green values indicate improvement after AI tool adoption. Cycle time
            is measured in days from ticket start to merge.
          </p>
        </div>
      </div>

      {/* Supported AI Coding Tools */}
      <div className="mb-5">
        <h2 className="text-sm font-bold mb-3">Supported AI Coding Tools</h2>
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex flex-wrap gap-2">
            {aiCodingTools.map((tool) => (
              <Badge key={tool} variant="ghost">
                {tool}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* API Note */}
      <div className="rounded-xl border border-border bg-surface p-5 mb-5">
        <p className="text-sm text-text-dim">
          <strong className="text-text-primary">Note:</strong> AI Impact data is
          generated at the platform level by Jellyfish. The Export API v0 does
          not include AI-specific endpoints — use the Jellyfish dashboard for
          adoption and impact analytics.
        </p>
      </div>

      {/* Token input kept for page pattern consistency, no API Explorer */}
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

      <GuideBox title="Using AI Data in Ceremonies">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-1">
          <div>
            <div className="font-semibold text-text-primary mb-0.5">
              Retrospective
            </div>
            <p>
              If a team adopted an AI tool 2–3 months ago, pull their
              before/after delivery metrics. If cycle time hasn&apos;t improved,
              investigate whether the tool is being used effectively, whether
              other bottlenecks dominate, or whether the team needs enablement
              support.
            </p>
          </div>
          <div>
            <div className="font-semibold text-text-primary mb-0.5">
              Planning
            </div>
            <p>
              Factor AI tool impact into capacity assumptions. A team with high
              Copilot adoption may have higher throughput than historical
              baselines suggest — adjust commitments accordingly.
            </p>
          </div>
          <div>
            <div className="font-semibold text-text-primary mb-0.5">
              Leadership review
            </div>
            <p>
              Present adoption rates alongside impact data. High adoption with
              no measurable improvement is a signal to investigate — not to roll
              back the tool.
            </p>
          </div>
        </div>
      </GuideBox>

      <p className="text-xs text-text-ghost mt-6">
        Customer outcome: TaskRabbit — teams shipping code faster and delivering
        twice the value in half the time (jellyfish.co/platform/jellyfish-ai-impact/).
      </p>
    </div>
  );
}
