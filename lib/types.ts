export type SectionId =
  | "sprint-health"
  | "delivery"
  | "delivery-forecast"
  | "product-metrics"
  | "devex"
  | "benchmarks"
  | "process"
  | "allocation"
  | "capacity"
  | "scenarios"
  | "roadmap"
  | "metrics"
  | "reference"
  | "academy";

export type NavItem = {
  href: string;
  label: string;
  section: SectionId;
};

export type HighlightCard = {
  title: string;
  description: string;
  href: string;
  tags?: string[];
};

export type MetricDefinition = {
  id: string;
  name: string;
  category: string;
  summary: string;
  whyItMatters: string;
  scrumUse: string;
  related: string[];
};

export type PlaybookVisualization = {
  type: "stat-cards" | "bar-chart" | "data-table" | "progress-bars";
  dataKey: string;
  props?: Record<string, unknown>;
};

export type PlaybookStep = {
  title: string;
  description: string;
  endpoints?: string[];
  visualization?: PlaybookVisualization;
};

export type PlaybookPersonaGuide = {
  key: string;
  label: string;
  description: string;
};

export type PlaybookCategory =
  | "sprint-delivery"
  | "capacity-planning"
  | "devex-health"
  | "metrics"
  | "executive"
  | "ai-innovation";

export type PlaybookDefinition = {
  id: string;
  slug: string;
  title: string;
  goal: string;
  category: PlaybookCategory;
  personas: string[];
  outputs: string[];
  steps: PlaybookStep[];
  guides: PlaybookPersonaGuide[];
  source: { label: string; url: string };
  color: { from: string; to: string };
};

export type ExampleDefinition = {
  id: string;
  title: string;
  scenario: string;
  whatToNotice: string[];
  nextActions: string[];
};

export type EndpointDefinition = {
  name: string;
  path: string;
  domain: string;
  description: string;
};

export type JellyfishEndpoint = {
  path: string;
  name: string;
  desc: string;
};

export type EndpointGroup = {
  domain: string;
  endpoints: JellyfishEndpoint[];
};

export type DoraMetric = {
  name: string;
  desc: string;
};

export type Framework = {
  name: string;
  desc: string;
};

export type IntegrationCategory = {
  category: string;
  tools: string[];
};

export type PlatformFeatureCategory = {
  category: string;
  features: string[];
};

export type MockSprint = {
  name: string;
  committed: number;
  completed: number;
  carryOver: number;
  velocity: number;
  points: number;
};

export type MockDeliverable = {
  name: string;
  category: string;
  issues: number;
  percentComplete: number;
  status: "on-track" | "at-risk" | "behind";
};

export type MockTeamAllocation = {
  team: string;
  totalFte: number;
  features: number;
  ktlo: number;
  techDebt: number;
};

export type MockPersonAllocation = {
  name: string;
  fte: number;
  primaryCategory: string;
  spreadCount: number;
  flag?: string;
};

export type MockIssueLifecycle = {
  id: string;
  title: string;
  stages: { name: string; hours: number }[];
  totalHours: number;
};

export type MockWorkflowStage = {
  from: string;
  to: string;
  avgHours: number;
  handoffDelay: number;
};

export type MockTeamBenchmark = {
  team: string;
  velocity: number;
  cycleTimeDays: number;
  prReviewHours: number;
  deploymentsPerWeek: number;
  devexScore: number;
};

export type MockCapacityPlan = {
  team: string;
  availableFte: number;
  plannedFte: number;
  gap: number;
  status: "ok" | "tight" | "over";
};

export type MockAiAdoption = {
  team: string;
  copilot: number;
  cursor: number;
  claudeCode: number;
};

export type MockAiBeforeAfter = {
  team: string;
  before: { prsPerWeek: number; cycleTimeDays: number; reviewTimeHours: number };
  after: { prsPerWeek: number; cycleTimeDays: number; reviewTimeHours: number };
};

// Product pages
export type MockBurndown = {
  week: string;
  deliverable: string;
  percentComplete: number;
};

export type MockProductFlow = {
  team: string;
  cycleTimeDays: number;
  leadTimeDays: number;
  deployFrequency: number;
};

export type MockRoadmapItem = {
  initiative: string;
  plannedFte: number;
  actualFte: number;
  status: "on-track" | "under-invested" | "over-invested";
};
