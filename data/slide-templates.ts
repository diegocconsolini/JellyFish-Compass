export type SlideBlockId =
  | "title"
  | "sprint-kpis"
  | "sprint-history"
  | "delivery-status"
  | "scope-effort"
  | "allocation-fte"
  | "team-allocation"
  | "devex-index"
  | "unlinked-prs"
  | "capacity-gaps"
  | "benchmarks"
  | "dora-metrics"
  | "custom-text";

export type SlideBlock = {
  id: SlideBlockId;
  label: string;
  description: string;
  category: "metrics" | "delivery" | "allocation" | "devex" | "capacity" | "general";
  apiEndpoint?: string;
};

export const slideBlocks: SlideBlock[] = [
  { id: "title", label: "Title Slide", description: "Deck title, subtitle, and date", category: "general" },
  { id: "sprint-kpis", label: "Sprint KPIs", description: "Velocity, completion, carry-over, cadence", category: "metrics", apiEndpoint: "team_sprint_summary" },
  { id: "sprint-history", label: "Sprint History", description: "Last 4 sprints: committed vs completed", category: "metrics", apiEndpoint: "team_sprint_summary" },
  { id: "delivery-status", label: "Delivery Status", description: "Active deliverables with status", category: "delivery", apiEndpoint: "work_category_contents" },
  { id: "scope-effort", label: "Scope & Effort", description: "8-week scope vs effort trend", category: "delivery", apiEndpoint: "deliverable_scope_and_effort_history" },
  { id: "allocation-fte", label: "Allocation FTE", description: "Investment category breakdown", category: "allocation", apiEndpoint: "allocations_by_investment_category" },
  { id: "team-allocation", label: "Team Allocation", description: "Team FTE split: features, KTLO, tech debt", category: "allocation", apiEndpoint: "allocations_by_team" },
  { id: "devex-index", label: "DevEx Index", description: "Developer experience scores by team", category: "devex", apiEndpoint: "devex_insights_by_team" },
  { id: "unlinked-prs", label: "Unlinked PRs", description: "Pull requests without linked tickets", category: "devex", apiEndpoint: "unlinked_pull_requests" },
  { id: "capacity-gaps", label: "Capacity Gaps", description: "Available vs planned FTE per team", category: "capacity", apiEndpoint: "allocations_by_team" },
  { id: "benchmarks", label: "Team Benchmarks", description: "Cross-team metric comparison", category: "metrics", apiEndpoint: "team_metrics" },
  { id: "dora-metrics", label: "DORA Metrics", description: "4 DORA metric definitions", category: "general" },
  { id: "custom-text", label: "Custom Text", description: "Freeform title and body", category: "general" },
];

export type TemplateDefinition = {
  id: string;
  label: string;
  group: "ceremony" | "audience";
  slides: SlideBlockId[];
};

export const templates: TemplateDefinition[] = [
  { id: "sprint-review", label: "Sprint Review", group: "ceremony", slides: ["title", "sprint-kpis", "sprint-history", "delivery-status"] },
  { id: "retro-prep", label: "Retrospective Prep", group: "ceremony", slides: ["title", "sprint-kpis", "devex-index", "unlinked-prs", "benchmarks"] },
  { id: "stakeholder-update", label: "Stakeholder Update", group: "ceremony", slides: ["title", "sprint-kpis", "delivery-status", "allocation-fte", "capacity-gaps"] },
  { id: "capacity-planning", label: "Capacity Planning", group: "ceremony", slides: ["title", "allocation-fte", "team-allocation", "capacity-gaps"] },
  { id: "qbr", label: "Quarterly Business Review", group: "ceremony", slides: ["title", "sprint-kpis", "delivery-status", "allocation-fte", "devex-index", "benchmarks", "capacity-gaps"] },
  { id: "for-team", label: "For My Team", group: "audience", slides: ["title", "sprint-kpis", "sprint-history", "devex-index", "unlinked-prs"] },
  { id: "for-leadership", label: "For Leadership", group: "audience", slides: ["title", "sprint-kpis", "delivery-status", "allocation-fte", "capacity-gaps"] },
  { id: "for-product", label: "For Product", group: "audience", slides: ["title", "delivery-status", "allocation-fte", "capacity-gaps"] },
  { id: "for-finance", label: "For Finance", group: "audience", slides: ["title", "allocation-fte", "team-allocation"] },
];
