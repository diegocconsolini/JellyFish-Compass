import { PageHero } from "@/components/ui/page-hero";
import { SectionBlock } from "@/components/ui/section-block";
import { Badge } from "@/components/ui/badge";
import { GuideBox } from "@/components/ui/guide-box";
import { metrics } from "@/data/metrics";
import type { VariantProps } from "class-variance-authority";

const modules = [
  {
    title: "Jellyfish fundamentals",
    description:
      "Understand what Jellyfish measures, how platform areas connect, and why Scrum Masters should read metrics as workflow signals rather than isolated dashboards.",
  },
  {
    title: "Delivery and scope",
    description:
      "Learn deliverables, scope and effort history, sprint health, and how to spot bottlenecks or creeping scope in practice.",
  },
  {
    title: "Allocations and FTE",
    description:
      "Ground allocation concepts in focus, KTLO pressure, and realistic planning conversations.",
  },
  {
    title: "DevEx and AI impact",
    description:
      "See how experience, workflow friction, and AI tooling adoption fit into a broader operating model.",
  },
];

type BadgeVariant = "blue" | "green" | "amber" | "red";

const categoryBadgeVariant: Record<string, BadgeVariant> = {
  DORA: "blue",
  "Developer Experience": "green",
  "Business Alignment": "amber",
  "Delivery Hygiene": "red",
};

export default function AcademyPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-7 py-7">
      <PageHero
        eyebrow="Academy"
        title="Learn Jellyfish"
        subtitle="for real ceremonies"
        intro="The Academy is the educational backbone of the app. It translates the full platform into practical language, with special attention to how Scrum Masters interpret and apply each capability."
      />

      <GuideBox title="Getting Started">
        Work through the modules in order if you are new to Jellyfish. If you
        already know the platform, jump to the metric definitions to sharpen how
        you frame data during standups, reviews, and retros. Each module maps
        directly to the dashboards you use most.
      </GuideBox>

      <SectionBlock
        title="Learning modules"
        copy="These modules form the core of the learning-first experience and connect directly into examples, reference, and playbooks."
      >
        <div className="grid grid-cols-2 gap-3">
          {modules.map((module) => (
            <div
              key={module.title}
              className="bg-surface rounded-xl border p-5"
            >
              <h3 className="font-bold mb-1.5">{module.title}</h3>
              <p className="text-sm text-text-dim leading-relaxed">
                {module.description}
              </p>
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock
        title="Core metrics"
        copy="These metric definitions cover the signals that matter most to Scrum Master workflows."
      >
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="bg-surface rounded-xl border p-5"
            >
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
                <span className="font-semibold text-text">Scrum Master angle:</span>{" "}
                {metric.scrumUse}
              </p>
            </div>
          ))}
        </div>
      </SectionBlock>
    </div>
  );
}
