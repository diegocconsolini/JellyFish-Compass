import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { SectionBlock } from "@/components/ui/section-block";
import { StatCard } from "@/components/ui/stat-card";
import { mockSprintKpis } from "@/data/mock-data";
import { metrics } from "@/data/metrics";
import { playbooks } from "@/data/playbooks";

const highlightCards = [
  {
    title: "Sprint Health",
    description:
      "Monitor velocity, carry-over, and completion rate trends across sprints with Jellyfish data.",
    href: "/sprint-health",
    tags: ["Velocity", "Carry-over"],
  },
  {
    title: "Allocation",
    description:
      "Understand how engineering effort is split across features, KTLO, and tech debt by team and person.",
    href: "/allocation",
    tags: ["FTE", "Investment mix"],
  },
  {
    title: "Playbooks",
    description:
      "Run guided retros, capacity reviews, and stakeholder updates using structured Jellyfish workflows.",
    href: "/playbooks",
    tags: ["Ceremonies", "Outputs"],
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="mb-10 rounded-xl border border-border bg-surface p-8">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-text-ghost mb-3">
          Scrum Master Dashboard
        </p>
        <h1 className="font-serif text-4xl font-bold tracking-tight text-text-primary mb-3">
          Jellyfish Compass
        </h1>
        <p className="max-w-2xl text-sm text-text-dim leading-relaxed mb-6">
          A modern dashboard for Scrum Masters. Translate Jellyfish signals into sprint ceremonies,
          stakeholder updates, and continuous improvement — with guided playbooks, featured metrics,
          and real allocation data.
        </p>
        <div className="flex gap-3">
          <Link
            href="/sprint-health"
            className="inline-flex items-center rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Sprint Health
          </Link>
          <Link
            href="/playbooks"
            className="inline-flex items-center rounded-lg border border-border bg-surface-raised px-4 py-2 text-sm font-semibold text-text-primary hover:bg-surface transition-colors"
          >
            Explore Playbooks
          </Link>
        </div>
      </section>

      {/* KPI Stat Cards */}
      <SectionBlock
        title="Sprint KPIs"
        copy="Key performance indicators from the current sprint cycle."
      >
        <div className="grid grid-cols-4 gap-3">
          <StatCard
            label="Avg Velocity"
            value={mockSprintKpis.avgVelocity.value}
            note={mockSprintKpis.avgVelocity.unit}
            trend={mockSprintKpis.avgVelocity.trend}
            trendDirection={mockSprintKpis.avgVelocity.direction}
            color="blue"
          />
          <StatCard
            label="Completion Rate"
            value={mockSprintKpis.completionRate.value}
            note={mockSprintKpis.completionRate.unit}
            trend={mockSprintKpis.completionRate.trend}
            trendDirection={mockSprintKpis.completionRate.direction}
            color="green"
          />
          <StatCard
            label="Carry-Over"
            value={mockSprintKpis.carryOver.value}
            note={mockSprintKpis.carryOver.unit}
            trend={mockSprintKpis.carryOver.trend}
            trendDirection={mockSprintKpis.carryOver.direction}
            color="amber"
          />
          <StatCard
            label="Sprint Cadence"
            value={mockSprintKpis.sprintCadence.value}
            note={mockSprintKpis.sprintCadence.unit}
            trend={mockSprintKpis.sprintCadence.trend}
            trendDirection={mockSprintKpis.sprintCadence.direction}
            color="violet"
          />
        </div>
      </SectionBlock>

      {/* Highlight Cards */}
      <SectionBlock
        title="Explore sections"
        copy="Jump into the key areas of the dashboard."
      >
        <div className="grid grid-cols-3 gap-3">
          {highlightCards.map((card) => (
            <article
              key={card.href}
              className="rounded-xl border border-border bg-surface p-5 flex flex-col gap-3"
            >
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-1">{card.title}</h3>
                <p className="text-xs text-text-dim leading-relaxed">{card.description}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {card.tags.map((tag) => (
                  <Badge key={tag} variant="ghost">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="mt-auto pt-1">
                <Link
                  href={card.href}
                  className="inline-flex items-center rounded-lg border border-border bg-surface-raised px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface transition-colors"
                >
                  Open
                </Link>
              </div>
            </article>
          ))}
        </div>
      </SectionBlock>

      {/* Featured Metrics */}
      <SectionBlock
        title="Featured metrics"
        copy="Core Jellyfish metrics every Scrum Master should know."
      >
        <div className="grid grid-cols-4 gap-3">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="rounded-xl border border-border bg-surface p-5 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-text-primary leading-snug">{metric.name}</h3>
                <Badge variant="blue">{metric.category}</Badge>
              </div>
              <p className="text-xs text-text-dim leading-relaxed">{metric.summary}</p>
              <p className="text-[11px] text-text-ghost leading-relaxed mt-auto pt-1">
                {metric.scrumUse}
              </p>
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* Featured Playbooks */}
      <SectionBlock
        title="Featured playbooks"
        copy="Guided workflows for your most important ceremonies."
      >
        <div className="grid grid-cols-3 gap-3">
          {playbooks.slice(0, 3).map((playbook) => (
            <div
              key={playbook.id}
              className="rounded-xl border border-border bg-surface p-5 flex flex-col gap-3"
            >
              <div>
                <h3 className="text-sm font-bold text-text-primary mb-1">{playbook.title}</h3>
                <p className="text-xs text-text-dim leading-relaxed">{playbook.goal}</p>
              </div>
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-wider text-text-ghost mb-1.5">
                  Outputs
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {playbook.outputs.map((output) => (
                    <Badge key={output} variant="ghost">
                      {output}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-auto pt-1">
                <Link
                  href={`/playbooks#${playbook.id}`}
                  className="inline-flex items-center rounded-lg border border-border bg-surface-raised px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface transition-colors"
                >
                  Run playbook
                </Link>
              </div>
            </div>
          ))}
        </div>
      </SectionBlock>
    </>
  );
}
