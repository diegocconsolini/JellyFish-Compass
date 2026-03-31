import Link from "next/link";
import {
  Activity,
  Rocket,
  Scale,
  Code2,
  Users,
  BookOpen,
  GraduationCap,
  RefreshCw,
  GitBranch,
  BarChart3,
  Gauge,
  Bot,
  Shuffle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

const steps = [
  {
    num: "01",
    phase: "LEARN",
    title: "Understand the platform",
    desc: "Academy modules explain DORA, DevEx, allocations, and delivery concepts in Scrum Master language. No jargon overload.",
    color: "from-blue to-cyan",
  },
  {
    num: "02",
    phase: "APPLY",
    title: "Run guided workflows",
    desc: "Playbooks walk you through retros, capacity reviews, and stakeholder updates step by step — with real outputs you can save.",
    color: "from-green to-emerald-300",
  },
  {
    num: "03",
    phase: "EXPLORE",
    title: "Query live data",
    desc: "The API Explorer lets you call any of 25 Jellyfish endpoints with your token, or preview mock data to learn the shape of responses.",
    color: "from-violet to-purple-300",
  },
];

const sectionIcons: Record<string, React.ReactNode> = {
  "/sprint-health": <Activity className="w-5 h-5 text-blue" />,
  "/delivery": <Rocket className="w-5 h-5 text-green" />,
  "/allocation": <Scale className="w-5 h-5 text-amber" />,
  "/devex": <Code2 className="w-5 h-5 text-violet" />,
  "/people-teams": <Users className="w-5 h-5 text-cyan" />,
  "/life-cycle": <RefreshCw className="w-5 h-5 text-green" />,
  "/workflow": <GitBranch className="w-5 h-5 text-amber" />,
  "/benchmarks": <BarChart3 className="w-5 h-5 text-violet" />,
  "/capacity": <Gauge className="w-5 h-5 text-blue" />,
  "/ai-impact": <Bot className="w-5 h-5 text-cyan" />,
  "/scenarios": <Shuffle className="w-5 h-5 text-amber" />,
  "/reference": <BookOpen className="w-5 h-5 text-blue" />,
  "/academy": <GraduationCap className="w-5 h-5 text-green" />,
};

const sectionGroups = [
  {
    title: "Metrics & Health",
    color: "from-blue to-cyan",
    items: [
      { href: "/sprint-health", label: "Sprint Health", desc: "Velocity, completion, carry-over trends", primary: true },
      { href: "/delivery", label: "Delivery", desc: "Scope, effort, deliverable tracking" },
      { href: "/devex", label: "DevEx", desc: "Developer experience & unlinked PRs" },
      { href: "/life-cycle", label: "Life Cycle", desc: "Issue-level cycle time & bottlenecks" },
    ],
  },
  {
    title: "Teams & Operations",
    color: "from-green to-emerald-300",
    items: [
      { href: "/allocation", label: "Allocation", desc: "FTE by investment, team, person" },
      { href: "/people-teams", label: "People & Teams", desc: "Roster, hierarchy, search" },
      { href: "/workflow", label: "Workflow", desc: "Intake-to-deployment handoff analysis" },
      { href: "/benchmarks", label: "Benchmarks", desc: "Cross-team comparison for learning" },
    ],
  },
  {
    title: "Planning & Intelligence",
    color: "from-violet to-purple-300",
    items: [
      { href: "/capacity", label: "Capacity", desc: "FTE forecasting & workload planning" },
      { href: "/scenarios", label: "Scenarios", desc: "What-if allocation modeling" },
      { href: "/ai-impact", label: "AI Impact", desc: "Tool adoption & ROI measurement" },
    ],
  },
  {
    title: "Knowledge",
    color: "from-amber to-yellow-300",
    items: [
      { href: "/reference", label: "Reference", desc: "25 endpoints, MCP, DORA, integrations" },
      { href: "/academy", label: "Academy", desc: "Learning hub — modules, playbooks, workspace" },
    ],
  },
];

const dataFeatures = [
  { color: "blue", text: "25 API endpoints", detail: "across 6 domains — allocations, delivery, devex, metrics, people, teams" },
  { color: "green", text: "4 DORA metrics", detail: "with verbatim descriptions from jellyfish.co" },
  { color: "amber", text: "Mock + Live API", detail: "toggle between sample data and real Jellyfish calls with your token" },
  { color: "violet", text: "33 integrations", detail: "across AI coding, issue tracking, CI/CD, monitoring, and collaboration" },
];

const workflowFeatures = [
  { color: "blue", text: "3 playbooks", detail: "Sprint Retro, Capacity Review, Stakeholder Summary with step-by-step guides" },
  { color: "green", text: "4 learning modules", detail: "covering fundamentals, delivery, allocations, and DevEx" },
  { color: "amber", text: "Scrum Master guides", detail: "on every data page mapping metrics to ceremonies" },
  { color: "violet", text: "Workspace", detail: "to save notes, summaries, and templates across sessions" },
];

const dotColors: Record<string, string> = {
  blue: "bg-blue",
  green: "bg-green",
  amber: "bg-amber",
  violet: "bg-violet",
};

export default function HomePage() {
  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-7 py-10">

      {/* Hero */}
      <section className="text-center py-12 mb-10">
        <Badge variant="blue" className="mb-5 text-xs px-3.5 py-1">
          For Scrum Masters & Engineering Teams
        </Badge>
        <h1 className="font-serif text-5xl font-normal tracking-tight mb-4">
          Your Jellyfish companion{" "}
          <em className="text-text-dim italic">for real ceremonies</em>
        </h1>
        <p className="text-text-dim text-[17px] max-w-2xl mx-auto leading-relaxed mb-7">
          Jellyfish Compass translates platform signals into actionable insights
          for sprint retros, capacity planning, stakeholder updates, and delivery
          reviews. Learn the metrics, run guided workflows, and explore live API
          data — all in one place.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/sprint-health"
            className="inline-flex items-center rounded-xl bg-blue px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
          <Link
            href="/reference"
            className="inline-flex items-center rounded-xl border border-border-vivid bg-transparent px-5 py-2.5 text-sm font-semibold text-text-primary hover:bg-surface transition-colors"
          >
            Browse Reference
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="mb-12">
        <p className="text-[11px] font-bold uppercase tracking-widest text-text-ghost mb-2">
          How it works
        </p>
        <h2 className="text-xl font-bold mb-1">Three ways to use Compass</h2>
        <p className="text-sm text-text-dim mb-5">
          Whether you&apos;re learning Jellyfish, running ceremonies, or exploring the API.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {steps.map((s) => (
            <div
              key={s.num}
              className="relative overflow-hidden rounded-xl border border-border bg-surface p-6"
            >
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${s.color}`} />
              <p className="text-[11px] font-bold text-text-ghost mb-2.5">
                {s.num} — {s.phase}
              </p>
              <h3 className="text-[15px] font-bold mb-1.5">{s.title}</h3>
              <p className="text-[13px] text-text-dim leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* All sections */}
      <section className="mb-12">
        <p className="text-[11px] font-bold uppercase tracking-widest text-text-ghost mb-2">
          Explore
        </p>
        <h2 className="text-xl font-bold mb-1">All sections</h2>
        <p className="text-sm text-text-dim mb-6">
          Eleven data dashboards, a complete API reference, and a learning hub.
        </p>
        <div className="space-y-6">
          {sectionGroups.map((group) => (
            <div key={group.title}>
              <div className="flex items-center gap-2.5 mb-3">
                <div className={`w-8 h-0.5 rounded-full bg-gradient-to-r ${group.color}`} />
                <span className="text-[11px] font-bold uppercase tracking-widest text-text-ghost">{group.title}</span>
              </div>
              <div className={`grid gap-2.5 ${group.items.length === 2 ? "grid-cols-1 sm:grid-cols-2" : group.items.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4"}`}>
                {group.items.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className={`relative overflow-hidden rounded-xl border p-4 transition-all hover:border-border-vivid hover:bg-surface-raised ${
                      s.primary
                        ? "border-blue/25 bg-blue-glow"
                        : "border-border bg-surface"
                    }`}
                  >
                    <div className="mb-2">{sectionIcons[s.href]}</div>
                    <div className="text-[13px] font-bold mb-0.5">{s.label}</div>
                    <div className="text-[11px] text-text-ghost leading-snug">{s.desc}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-border mb-10" />

      {/* What's inside */}
      <section className="mb-12">
        <p className="text-[11px] font-bold uppercase tracking-widest text-text-ghost mb-2">
          What&apos;s inside
        </p>
        <h2 className="text-xl font-bold mb-1">Built from verified Jellyfish data</h2>
        <p className="text-sm text-text-dim mb-5">
          Every endpoint, metric, and integration is sourced from official
          Jellyfish documentation and source code.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-surface p-6">
            <h3 className="text-sm font-bold mb-4">Data & Metrics</h3>
            {dataFeatures.map((f) => (
              <div key={f.text} className="flex items-start gap-2.5 mb-2.5">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${dotColors[f.color]}`} />
                <p className="text-[13px] text-text-dim leading-relaxed">
                  <strong className="text-text-primary font-semibold">{f.text}</strong>{" "}
                  {f.detail}
                </p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-border bg-surface p-6">
            <h3 className="text-sm font-bold mb-4">Workflows & Learning</h3>
            {workflowFeatures.map((f) => (
              <div key={f.text} className="flex items-start gap-2.5 mb-2.5">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${dotColors[f.color]}`} />
                <p className="text-[13px] text-text-dim leading-relaxed">
                  <strong className="text-text-primary font-semibold">{f.text}</strong>{" "}
                  {f.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
