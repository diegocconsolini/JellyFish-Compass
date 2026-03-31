"use client";
import { PageHero } from "@/components/ui/page-hero";
import { SectionBlock } from "@/components/ui/section-block";
import { Badge } from "@/components/ui/badge";
import { GuideBox } from "@/components/ui/guide-box";
import { StatCard } from "@/components/ui/stat-card";

type BadgeVariant = "blue" | "green" | "amber" | "violet" | "ghost" | "red";

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

export default function AcademyShowcasePage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      <PageHero
        eyebrow="Academy"
        title="Showcase"
        subtitle="Capability stories"
        intro="Polished narrative pages that explain what Jellyfish can unlock across roles and use cases."
      />

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
              <h3 className="font-bold mb-1.5">{card.title}</h3>
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
  );
}
