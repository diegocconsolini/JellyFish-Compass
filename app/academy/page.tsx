"use client";

import { useState, useEffect } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { SectionBlock } from "@/components/ui/section-block";
import { Badge } from "@/components/ui/badge";
import { GuideBox } from "@/components/ui/guide-box";
import { StatCard } from "@/components/ui/stat-card";
import { BookOpen, ClipboardList, Save, Sparkles } from "lucide-react";
import { metrics } from "@/data/metrics";
import { playbooks } from "@/data/playbooks";
import { doraMetrics } from "@/data/dora-metrics";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "modules" | "playbooks" | "workspace" | "showcase";
type BadgeVariant = "blue" | "green" | "amber" | "violet" | "ghost" | "red";

// ─── Modules data ────────────────────────────────────────────────────────────

const modules = [
  {
    title: "Jellyfish fundamentals",
    description:
      "Understand what Jellyfish measures, how platform areas connect, and why Scrum Masters should read metrics as workflow signals rather than isolated dashboards.",
    detail:
      "Covers the 6 product areas: AI Impact, Operational Effectiveness, Planning & Delivery, Business Alignment, DevEx, and DevFinOps.",
    related: ["Reference"],
    color: "from-blue to-cyan",
  },
  {
    title: "Delivery and scope",
    description:
      "Learn deliverables, scope and effort history, sprint health, and how to spot bottlenecks or creeping scope in practice.",
    detail:
      "Includes Life Cycle Explorer for issue-level analysis and Workflow Analysis for tracing work from intake to deployment.",
    related: ["Sprint Health", "Delivery"],
    color: "from-green to-emerald-300",
  },
  {
    title: "Allocations and FTE",
    description:
      "Ground allocation concepts in focus, KTLO pressure, and realistic planning conversations using Jellyfish's patented Work Model.",
    detail:
      "Automatic FTE calculation from work items — no time tracking required. Includes Capacity Planner and Scenario Planner.",
    related: ["Allocation"],
    color: "from-amber to-yellow-300",
  },
  {
    title: "DevEx and AI impact",
    description:
      "Two distinct platform products that together cover developer experience measurement and AI tooling ROI.",
    detail:
      "DevEx: research-backed surveys, DevEx Index, DORA/SPACE correlation, industry benchmarking, AI-driven recommendations. AI Impact: Adoption Insights, Multi-Tool Comparison, Impact Insights, AI Spend Insights, Auto Report Builder.",
    related: ["DevEx"],
    color: "from-violet to-purple-300",
  },
];

// ─── Metric category badge variants ──────────────────────────────────────────

const categoryBadgeVariant: Record<string, BadgeVariant> = {
  DORA: "blue",
  "Developer Experience": "green",
  "Business Alignment": "amber",
  "Delivery": "red",
};

// ─── Metric card gradient colors ─────────────────────────────────────────────

const metricCardColor: Record<string, string> = {
  DORA: "from-blue to-cyan",
  "Developer Experience": "from-green to-emerald-300",
  "Business Alignment": "from-amber to-yellow-300",
  "Delivery": "from-red to-red-300",
};

// ─── Playbook endpoint map ────────────────────────────────────────────────────

const endpointMap: Record<string, Record<number, string>> = {
  retro: {
    0: "team_sprint_summary, team_metrics",
    1: "unlinked_pull_requests",
    2: "devex_insights_by_team",
  },
  capacity: {
    1: "allocations_by_investment_category, allocations_by_person",
  },
  stakeholder: {
    0: "company_metrics, team_metrics",
  },
};

// ─── Playbook card gradient colors ───────────────────────────────────────────

const playbookCardColor: Record<string, string> = {
  retro: "from-blue to-cyan",
  capacity: "from-green to-emerald-300",
  stakeholder: "from-violet to-purple-300",
};

// ─── Workspace data ───────────────────────────────────────────────────────────

const ARTIFACT_TYPES = [
  { label: "Bookmarks", key: "jf-workspace-bookmarks" },
  { label: "Saved Summaries", key: "jf-workspace-saved-summaries" },
  { label: "Playbook Outputs", key: "jf-workspace-playbook-outputs" },
  { label: "Reusable Templates", key: "jf-workspace-reusable-templates" },
  { label: "Notes", key: "jf-workspace-notes" },
  { label: "Favorite Examples", key: "jf-workspace-favorite-examples" },
] as const;

type ArtifactKey = (typeof ARTIFACT_TYPES)[number]["key"];

const ARTIFACT_COLORS = [
  "from-blue to-cyan",
  "from-green to-emerald-300",
  "from-amber to-yellow-300",
  "from-violet to-purple-300",
  "from-blue to-cyan",
  "from-green to-emerald-300",
];

// ─── Showcase data ────────────────────────────────────────────────────────────

interface AudienceCard {
  title: string;
  description: string;
  accentFrom: string;
  accentTo: string;
  badgeVariant: BadgeVariant;
  badges: string[];
}

const audienceCards: AudienceCard[] = [
  {
    title: "For Scrum Masters",
    description:
      "Retro support, sprint health, blockers, and invisible work surface the context that keeps teams moving. Clearer planning prep and stakeholder communication without extra overhead.",
    accentFrom: "from-blue",
    accentTo: "to-cyan-400",
    badgeVariant: "blue",
    badges: ["Retro Support", "Sprint Health", "Blockers", "Invisible Work"],
  },
  {
    title: "For Engineering Leadership",
    description:
      "Delivery trend understanding, business alignment, investment decisions, and team comparisons make outcome-oriented reporting credible and fast.",
    accentFrom: "from-green",
    accentTo: "to-emerald-300",
    badgeVariant: "green",
    badges: ["Delivery Trends", "Business Alignment", "Board Reporting", "Team Health"],
  },
  {
    title: "For Platform Engineering",
    description:
      "Developer tooling impact measurement, DevEx surveys and index tracking, infrastructure ROI, and AI adoption insights across engineering teams.",
    accentFrom: "from-violet",
    accentTo: "to-purple-300",
    badgeVariant: "violet",
    badges: ["DevEx Measurement", "AI Impact", "Tooling ROI", "Benchmarks"],
  },
  {
    title: "For Product & Finance",
    description:
      "Delivery tracking, capacity planning, roadmap alignment for product leaders. Software capitalization and R&D financial reporting for finance teams.",
    accentFrom: "from-amber",
    accentTo: "to-yellow-300",
    badgeVariant: "amber",
    badges: ["Capacity Planning", "Roadmap Alignment", "DevFinOps", "Software Capitalization"],
  },
];

// ─── Tab config ───────────────────────────────────────────────────────────────

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "modules", label: "Modules", icon: <BookOpen size={16} aria-hidden="true" /> },
  { id: "playbooks", label: "Playbooks", icon: <ClipboardList size={16} aria-hidden="true" /> },
  { id: "workspace", label: "Workspace", icon: <Save size={16} aria-hidden="true" /> },
  { id: "showcase", label: "Showcase", icon: <Sparkles size={16} aria-hidden="true" /> },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AcademyPage() {
  const [activeTab, setActiveTab] = useState<Tab>("modules");

  // Workspace state
  const [items, setItems] = useState<Record<string, string[]>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    const loaded: Record<string, string[]> = {};
    for (const { key } of ARTIFACT_TYPES) {
      try {
        const raw = localStorage.getItem(key);
        loaded[key] = raw ? (JSON.parse(raw) as string[]) : [];
      } catch {
        loaded[key] = [];
      }
    }
    setItems(loaded);
  }, []);

  function addItem(key: ArtifactKey, value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setItems((prev) => {
      const updated = { ...prev, [key]: [...(prev[key] ?? []), trimmed] };
      localStorage.setItem(key, JSON.stringify(updated[key]));
      return updated;
    });
    setInputs((prev) => ({ ...prev, [key]: "" }));
  }

  function removeItem(key: ArtifactKey, index: number) {
    setItems((prev) => {
      const updated = {
        ...prev,
        [key]: (prev[key] ?? []).filter((_, i) => i !== index),
      };
      localStorage.setItem(key, JSON.stringify(updated[key]));
      return updated;
    });
  }

  function clearType(key: ArtifactKey) {
    setItems((prev) => {
      const updated = { ...prev, [key]: [] };
      localStorage.setItem(key, JSON.stringify([]));
      return updated;
    });
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      <PageHero
        eyebrow="Academy"
        title="Learning hub"
        subtitle="for Scrum Masters"
        intro="Your single destination for learning Jellyfish, running guided workflows, saving your work, and exploring platform capabilities."
      />

      {/* Tab bar */}
      <div role="tablist" aria-label="Academy sections" className="flex gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2.5 min-h-[44px] rounded-lg text-sm font-medium flex items-center gap-2 transition-all cursor-pointer",
              activeTab === tab.id
                ? "bg-blue-dim text-blue border border-blue/30"
                : "bg-surface-raised border border-border text-text-ghost hover:text-text-dim"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab 1: Modules ── */}
      {activeTab === "modules" && (
        <div role="tabpanel" id="tabpanel-modules" aria-labelledby="tab-modules" tabIndex={0}>
          <GuideBox title="Getting Started">
            Work through the modules in order if you are new to Jellyfish. If
            you already know the platform, jump to the metric definitions to
            sharpen how you frame data during standups, reviews, and retros.
            Each module maps directly to the dashboards you use most.
          </GuideBox>

          <SectionBlock
            title="Learning modules"
            copy="These modules form the core of the learning-first experience and connect directly into examples, reference, and playbooks."
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {modules.map((module) => (
                <div
                  key={module.title}
                  className="relative overflow-hidden bg-surface rounded-xl border border-border p-5"
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${module.color}`}
                  />
                  <h3 className="font-bold mb-1.5">{module.title}</h3>
                  <p className="text-sm text-text-dim leading-relaxed mb-2">
                    {module.description}
                  </p>
                  <p className="text-xs text-text-ghost leading-relaxed mb-3">
                    {module.detail}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-text-ghost font-semibold uppercase tracking-wide mr-0.5">
                      Related:
                    </span>
                    {module.related.map((rel) => (
                      <Badge key={rel} variant="ghost">
                        {rel}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionBlock>

          <SectionBlock
            title="DORA Metrics"
            copy="All 4 DORA metrics tracked by Jellyfish, verbatim from jellyfish.co/platform/devops-metrics/"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {doraMetrics.map((m) => (
                <div
                  key={m.name}
                  className="relative overflow-hidden bg-surface rounded-xl border border-border p-5"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue to-cyan" />
                  <Badge variant="blue" className="mb-2">
                    DORA
                  </Badge>
                  <h3 className="font-bold mb-1.5">{m.name}</h3>
                  <p className="text-sm text-text-dim leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </SectionBlock>

          <SectionBlock
            title="Core metrics"
            copy="These metric definitions cover the signals that matter most to Scrum Master workflows."
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="relative overflow-hidden bg-surface rounded-xl border border-border p-5"
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${metricCardColor[metric.category] ?? "from-blue to-cyan"}`}
                  />
                  <Badge
                    variant={categoryBadgeVariant[metric.category] ?? "blue"}
                    className="mb-2"
                  >
                    {metric.category}
                  </Badge>
                  <h3 className="font-bold mb-1.5">{metric.name}</h3>
                  <p className="text-sm text-text-dim leading-relaxed mb-2">
                    {metric.whyItMatters}
                  </p>
                  <p className="text-sm text-text-dim leading-relaxed">
                    <span className="font-semibold text-text">
                      Scrum Master angle:
                    </span>{" "}
                    {metric.scrumUse}
                  </p>
                </div>
              ))}
            </div>
          </SectionBlock>
        </div>
      )}

      {/* ── Tab 2: Playbooks ── */}
      {activeTab === "playbooks" && (
        <div role="tabpanel" id="tabpanel-playbooks" aria-labelledby="tab-playbooks" tabIndex={0}>
          <GuideBox title="How playbooks work">
            Playbooks guide you through a structured sequence of steps tied to a
            specific ceremony or communication need. Each playbook starts with
            context-setting, moves through signal inspection, and ends with a
            concrete output — a summary, a brief, or a set of talking points —
            that you can save and reuse.
          </GuideBox>

          <SectionBlock title="Available playbooks">
            <div className="grid grid-cols-1 gap-3">
              {playbooks.map((playbook) => (
                <div
                  key={playbook.id}
                  className="relative overflow-hidden bg-surface rounded-xl border border-border p-5"
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${playbookCardColor[playbook.id] ?? "from-blue to-cyan"}`}
                  />
                  <h3 className="font-bold text-base mb-2">{playbook.title}</h3>
                  <p className="text-text-dim text-sm mb-4">{playbook.goal}</p>

                  <div className="mb-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-text-ghost mb-2">
                      Outputs:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {playbook.outputs.map((output) => (
                        <Badge key={output} variant="blue">
                          {output}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-text-ghost mb-2">
                      Steps:
                    </div>
                    <ol className="list-decimal list-inside text-sm text-text-dim">
                      {playbook.steps.map((step, index) => (
                        <li key={index} className="mb-1.5">
                          {step}
                          {endpointMap[playbook.id]?.[index] && (
                            <code className="ml-1.5 font-mono text-[11px] bg-blue-dim text-blue px-1.5 py-0.5 rounded">
                              {endpointMap[playbook.id][index]}
                            </code>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </SectionBlock>

          <SectionBlock title="Implementation principles">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="relative overflow-hidden bg-surface rounded-xl border border-border p-5">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue to-cyan" />
                <h3 className="font-bold text-base mb-2">Structured and calm</h3>
                <p className="text-text-dim text-sm">
                  Users should move through a guided sequence, see what matters,
                  and leave with a clean summary rather than a pile of
                  disconnected tips.
                </p>
              </div>
              <div className="relative overflow-hidden bg-surface rounded-xl border border-border p-5">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green to-emerald-300" />
                <h3 className="font-bold text-base mb-2">Action-oriented</h3>
                <p className="text-text-dim text-sm">
                  Every playbook connects a Jellyfish concept to a real
                  ceremony, decision, or stakeholder conversation, then saves
                  the output to the Workspace.
                </p>
              </div>
            </div>
          </SectionBlock>
        </div>
      )}

      {/* ── Tab 3: Workspace ── */}
      {activeTab === "workspace" && (
        <div role="tabpanel" id="tabpanel-workspace" aria-labelledby="tab-workspace" tabIndex={0}>
          <GuideBox title="How Workspace works">
            Your workspace stores summaries, notes, templates, and artifacts
            collected from other pages. Use items from the{" "}
            <code>Modules</code> and <code>Playbooks</code> tabs to save items
            here — they persist locally so your work is always ready when you
            return.
          </GuideBox>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ARTIFACT_TYPES.map(({ label, key }, artifactIndex) => {
              const typeItems = items[key] ?? [];
              const inputValue = inputs[key] ?? "";
              const hasItems = typeItems.length > 0;
              const color = ARTIFACT_COLORS[artifactIndex] ?? "from-blue to-cyan";

              return (
                <div
                  key={key}
                  className="relative overflow-hidden bg-surface rounded-xl border border-border p-5 flex flex-col gap-4"
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${color}`}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">{label}</h3>
                    {hasItems ? (
                      <Badge variant="blue">{typeItems.length}</Badge>
                    ) : (
                      <Badge variant="ghost">empty</Badge>
                    )}
                  </div>

                  <div className="flex-1">
                    {hasItems ? (
                      <ul className="flex flex-col gap-1.5">
                        {typeItems.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between gap-2 text-xs text-text-dim bg-surface-raised rounded-lg px-3 py-2"
                          >
                            <span className="truncate">{item}</span>
                            <button
                              type="button"
                              onClick={() =>
                                removeItem(key as ArtifactKey, index)
                              }
                              className="shrink-0 min-w-[44px] min-h-[44px] -my-2 -mr-1 flex items-center justify-center text-text-ghost hover:text-red transition-colors"
                              aria-label={`Remove "${item}" from ${label}`}
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-text-ghost leading-relaxed">
                        No items yet. Add from the Modules and Playbooks tabs.
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <label htmlFor={`input-${key}`} className="sr-only">
                      New item for {label}
                    </label>
                    <input
                      id={`input-${key}`}
                      type="text"
                      value={inputValue}
                      onChange={(e) =>
                        setInputs((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          addItem(key as ArtifactKey, inputValue);
                      }}
                      placeholder={`Add to ${label}…`}
                      className="flex-1 min-w-0 min-h-[44px] rounded-lg border border-border bg-surface-raised px-3 py-2.5 text-xs placeholder:text-text-ghost focus:outline-none focus:ring-2 focus:ring-blue/40"
                    />
                    <button
                      type="button"
                      onClick={() => addItem(key as ArtifactKey, inputValue)}
                      aria-label={`Add item to ${label}`}
                      className="shrink-0 min-h-[44px] rounded-lg bg-blue px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                    >
                      Add
                    </button>
                  </div>

                  {hasItems && (
                    <button
                      type="button"
                      onClick={() => clearType(key as ArtifactKey)}
                      className="text-xs min-h-[44px] px-2 text-text-ghost hover:text-red transition-colors text-left"
                      aria-label={`Clear all items from ${label}`}
                    >
                      Clear all
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Tab 4: Showcase ── */}
      {activeTab === "showcase" && (
        <div role="tabpanel" id="tabpanel-showcase" aria-labelledby="tab-showcase" tabIndex={0}>
          <GuideBox title="How this connects">
            Each capability story below links to a <code>Playbook</code> for
            step-by-step guidance or an <code>Academy</code> module for deeper
            learning. Use Showcase to explore what Jellyfish can unlock across
            roles, then follow the trail into Playbooks or Academy to put it
            into practice.
          </GuideBox>

          <SectionBlock
            title="Capability stories"
            copy="Polished narrative pages that explain what Jellyfish can unlock across roles and use cases."
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {audienceCards.map((card) => (
                <div
                  key={card.title}
                  className="relative overflow-hidden bg-surface rounded-xl border border-border p-5"
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.accentFrom} ${card.accentTo}`}
                  />
                  <h3 className="font-bold text-sm mb-1.5">{card.title}</h3>
                  <p className="text-sm text-text-dim leading-relaxed mb-3">
                    {card.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {card.badges.map((badge) => (
                      <Badge key={badge} variant={card.badgeVariant}>
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionBlock>

          <SectionBlock
            title="Platform-reported outcomes"
            copy="Real signals from teams using Jellyfish across delivery, alignment, and efficiency."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard
                label="Revenue Focus"
                value="32%"
                color="blue"
                note="More focus on revenue-maximizing work"
                trend="jellyfish.co/tour"
                trendDirection="up"
              />
              <StatCard
                label="Cycle Time"
                value="2.6d"
                color="green"
                note="Reduction in cycle time"
                trend="jellyfish.co/tour"
                trendDirection="up"
              />
              <StatCard
                label="Time to Market"
                value="21%"
                color="amber"
                note="Faster time to market"
                trend="jellyfish.co/tour"
                trendDirection="up"
              />
              <StatCard
                label="Collaboration"
                value="25%"
                color="violet"
                note="More team collaboration"
                trend="jellyfish.co/tour"
                trendDirection="up"
              />
            </div>
            <p className="text-xs text-text-ghost mt-4">
              Customer-reported DevEx outcomes: Kaleris achieved 21% more
              productive and 19% more efficient engineering teams. Platform rated
              4.5/5 on G2 (357 reviews) and 4.8/5 on Gartner.
            </p>
          </SectionBlock>
        </div>
      )}
    </div>
  );
}
