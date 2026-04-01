import { PlaybookDefinition } from "@/lib/types";

export const playbooks: PlaybookDefinition[] = [
  {
    id: "retro",
    slug: "sprint-retrospective",
    title: "Sprint Retrospective",
    goal: "Turn Jellyfish metrics into a structured retro narrative that balances delivery, flow, blockers, and focus.",
    category: "sprint-delivery",
    personas: ["sm", "em", "pm"],
    outputs: ["Retro summary", "Action items", "Leadership talking points"],
    steps: [
      {
        title: "Review sprint health signals",
        description: "Pull sprint velocity, completion rate, and carry-over data to establish the baseline narrative. Compare against the last 3-4 sprints to identify trends — is velocity stable, improving, or declining?",
        endpoints: ["team_sprint_summary", "team_metrics"],
        visualization: { type: "stat-cards", dataKey: "sprintKpis" },
      },
      {
        title: "Inspect unlinked work and trend outliers",
        description: "Check for unlinked pull requests that represent off-process work. High unlinked PR counts correlate with context switching and hidden effort that does not appear in sprint planning.",
        endpoints: ["unlinked_pull_requests"],
        visualization: { type: "bar-chart", dataKey: "scopeEffort" },
      },
      {
        title: "Pull DevEx and blocker signals",
        description: "Review developer experience signals to surface friction points: slow CI, long review cycles, or codebase complexity. Pair quantitative metrics with qualitative team feedback for the retro discussion.",
        endpoints: ["devex_insights_by_team"],
        visualization: { type: "progress-bars", dataKey: "devExScores" },
      },
      {
        title: "Generate summary with actions and owners",
        description: "Synthesize the data into a concise retro summary: what went well (stable velocity, high completion), what needs attention (rising carry-over, unlinked work), and specific action items with assigned owners.",
      },
    ],
    guides: [
      { key: "sm", label: "Scrum Master", description: "Focus on ceremony flow: use velocity and carry-over trends to frame the retro narrative. Surface unlinked PRs as a discussion point for sprint hygiene. Keep actions specific and time-boxed." },
      { key: "em", label: "Engineering Manager", description: "Use retro data for coaching: correlate velocity dips with PR bottlenecks or review delays. Watch for sustained high velocity combined with rising carry-over — a burnout signal. Source: jellyfish.co/blog/how-jellyfish-supports-engineering-manager-responsibilities/" },
      { key: "pm", label: "Product Manager", description: "Track sprint predictability trends across retros to build roadmap confidence. A team consistently completing 85%+ of sprint goals is a reliable planning signal. Source: jellyfish.co/case-studies/precisely/" },
    ],
    source: { label: "Jellyfish: Engineering Manager Responsibilities", url: "https://jellyfish.co/blog/how-jellyfish-supports-engineering-manager-responsibilities/" },
    color: { from: "from-blue", to: "to-cyan" },
  },
  {
    id: "capacity",
    slug: "capacity-allocation-review",
    title: "Capacity and Allocation Review",
    goal: "Use Jellyfish allocation concepts to explain focus, KTLO pressure, and delivery tradeoffs.",
    category: "capacity-planning",
    personas: ["sm", "po", "em", "pm"],
    outputs: ["Capacity review brief", "Risk callouts", "Planning recommendations"],
    steps: [
      {
        title: "Start with FTE and allocation concepts",
        description: "Understand how Jellyfish measures allocation: FTE distribution across investment categories (Features, KTLO, Tech Debt, Growth, Unallocated) derived automatically from Git and Jira data — no manual time tracking required.",
      },
      {
        title: "Review investment categories and team spread",
        description: "Examine how engineering effort distributes across investment categories and identify individuals spread across too many projects. High-spread engineers are at risk of context switching overhead.",
        endpoints: ["allocations_by_investment_category", "allocations_by_person"],
        visualization: { type: "progress-bars", dataKey: "investmentAllocation" },
      },
      {
        title: "Call out capacity drift and KTLO pressure",
        description: "Compare planned allocation against actual. The gap reveals unplanned work — support tickets, maintenance tasks, incident response — that consumes capacity invisibly. Flag teams where KTLO exceeds planned levels.",
        visualization: { type: "data-table", dataKey: "teamAllocations", props: { headers: ["Team", "Total FTE", "Features %", "KTLO %", "Tech Debt %"] } },
      },
      {
        title: "Save output for planning and stakeholder review",
        description: "Document the capacity review findings: current allocation reality, risk callouts (over-allocated teams, high-spread individuals), and planning recommendations for the next quarter.",
      },
    ],
    guides: [
      { key: "sm", label: "Scrum Master", description: "Use allocation data to protect sprint capacity. If KTLO is consuming more than planned, raise it in sprint planning — the team may need scope reduction to maintain sustainable delivery." },
      { key: "po", label: "Product Owner", description: "Check allocation against backlog priorities. If the team's actual allocation to features is lower than expected, adjust backlog scope to match realistic capacity." },
      { key: "em", label: "Engineering Manager", description: "Watch for over-allocation: engineers on 3+ concurrent projects are at burnout risk. Use person-level allocation data for coaching conversations. Source: jellyfish.co/case-studies/jobvite/ — backlog shrunk from 20+ to 4 items." },
      { key: "pm", label: "Product Manager", description: "Allocation shows where engineering actually spends time. Jellyfish research shows leaders overestimate roadmap allocation by 62%. Use FTE data for headcount justification. Source: jellyfish.co/case-studies/salsify/" },
    ],
    source: { label: "Jellyfish: Resource Allocations", url: "https://jellyfish.co/platform/resource-allocations/" },
    color: { from: "from-green", to: "to-emerald-300" },
  },
  {
    id: "stakeholder",
    slug: "stakeholder-status-summary",
    title: "Stakeholder Status Summary",
    goal: "Turn Jellyfish signals into a concise update for partners and leadership.",
    category: "executive",
    personas: ["em", "pm"],
    outputs: ["Status summary", "Risk narrative", "Next-step recommendations"],
    steps: [
      {
        title: "Frame work in delivery and business terms",
        description: "Pull deliverable status grouped by work category so leadership sees progress at the initiative level. Translate engineering metrics into business language: FTEs, completion percentages, and timeline impact.",
        endpoints: ["company_metrics", "team_metrics"],
        visualization: { type: "data-table", dataKey: "deliverables", props: { headers: ["Deliverable", "Category", "Issues", "Complete", "Status"] } },
      },
      {
        title: "Highlight trend movement and known risks",
        description: "Surface cycle time trends, deployment frequency changes, and any deliverables that have stalled. Rising cycle time or declining deployment frequency are early signals to flag before they impact timelines.",
        visualization: { type: "stat-cards", dataKey: "productFlow" },
      },
      {
        title: "Translate metrics into stakeholder language",
        description: "Convert engineering metrics to executive terms. Instead of 'velocity dropped,' say '2.5 FTEs were diverted to incident response — here is the impact on our roadmap timeline.' Focus on what changed, why, and what you recommend.",
      },
      {
        title: "Save and reuse the summary template",
        description: "Document the status summary in a reusable format. Include: delivery progress by initiative, key risks with mitigation plans, resource constraints, and next-step recommendations.",
      },
    ],
    guides: [
      { key: "em", label: "Engineering Manager", description: "Use status data for data-backed leadership updates. Connect team metrics to business outcomes — shipping speed, quality trends, capacity constraints. Source: jellyfish.co/blog/presenting-engineering-operations/" },
      { key: "pm", label: "Product Manager", description: "Frame updates around initiative progress and investment alignment. Leadership wants to know: are we on track, where is risk, and what trade-offs are needed? Use FTE language. Source: jellyfish.co/solutions/product-leaders/" },
    ],
    source: { label: "Jellyfish: Presenting Engineering Operations", url: "https://jellyfish.co/blog/presenting-engineering-operations/" },
    color: { from: "from-violet", to: "to-purple-300" },
  },
];
