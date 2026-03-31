"use client";
import { PageHero } from "@/components/ui/page-hero";
import { SectionBlock } from "@/components/ui/section-block";
import { Badge } from "@/components/ui/badge";
import { GuideBox } from "@/components/ui/guide-box";
import { metrics } from "@/data/metrics";
import { doraMetrics } from "@/data/dora-metrics";

type BadgeVariant = "blue" | "green" | "amber" | "violet" | "ghost" | "red";

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

const categoryBadgeVariant: Record<string, BadgeVariant> = {
  DORA: "blue",
  "Developer Experience": "green",
  "Business Alignment": "amber",
  Delivery: "red",
};

const metricCardColor: Record<string, string> = {
  DORA: "from-blue to-cyan",
  "Developer Experience": "from-green to-emerald-300",
  "Business Alignment": "from-amber to-yellow-300",
  Delivery: "from-red to-red-300",
};

export default function AcademyModulesPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      <PageHero
        eyebrow="Academy"
        title="Modules"
        subtitle="Learning hub"
        intro="Your single destination for learning Jellyfish, running guided workflows, saving your work, and exploring platform capabilities."
      />

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
  );
}
