import { PageHero } from "@/components/ui/page-hero";
import { SectionBlock } from "@/components/ui/section-block";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { GuideBox } from "@/components/ui/guide-box";

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
      "Delivery trend understanding, business alignment, and team comparisons make outcome-oriented reporting credible and fast.",
    accentFrom: "from-green",
    accentTo: "to-emerald-300",
    badgeVariant: "green",
    badges: ["Delivery Trends", "Business Alignment", "Team Comparisons"],
  },
  {
    title: "For DevEx and AI Impact",
    description:
      "Show how workflow friction, survey insights, and AI tooling investment fit into a broader operating model — and prove the return.",
    accentFrom: "from-violet",
    accentTo: "to-purple-300",
    badgeVariant: "violet",
    badges: ["Workflow Friction", "Survey Insights", "AI Tooling"],
  },
  {
    title: "For Platform Breadth",
    description:
      "Surface MCP, integrations, planning, and DevFinOps feature connections without losing users in system detail.",
    accentFrom: "from-amber",
    accentTo: "to-yellow-300",
    badgeVariant: "amber",
    badges: ["MCP", "Integrations", "Planning", "DevFinOps"],
  },
];

export default function ShowcasePage() {
  return (
    <div className="max-w-[1440px] mx-auto px-7 py-7">
      <PageHero
        eyebrow="Showcase"
        title="Platform capabilities"
        subtitle="by audience"
        intro="Jellyfish covers the full engineering operating model — from sprint ceremonies to executive reporting. This showcase demonstrates that breadth in a way that feels inspiring, credible, and grounded in practical workflows."
      />

      <GuideBox title="How this connects">
        Each capability story below links to a{" "}
        <code>Playbook</code> for step-by-step guidance or an{" "}
        <code>Academy</code> module for deeper learning. Use Showcase to explore
        what Jellyfish can unlock across roles, then follow the trail into
        Playbooks or Academy to put it into practice.
      </GuideBox>

      <SectionBlock
        title="Capability stories"
        copy="Polished narrative pages that explain what Jellyfish can unlock across roles and use cases."
      >
        <div className="grid grid-cols-2 gap-3">
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
        <div className="grid grid-cols-4 gap-3">
          <StatCard
            label="Improvement"
            value="32%"
            color="blue"
            note="in engineering alignment"
          />
          <StatCard
            label="Time Saved"
            value="2.6d"
            color="green"
            note="per sprint on average"
          />
          <StatCard
            label="Efficiency Gain"
            value="21%"
            color="amber"
            note="in delivery throughput"
          />
          <StatCard
            label="Delivery Boost"
            value="25%"
            color="violet"
            note="faster time to market"
          />
        </div>
      </SectionBlock>
    </div>
  );
}
