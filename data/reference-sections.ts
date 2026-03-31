// data/reference-sections.ts
// Single source of truth for Reference route slugs and labels.
// Used by: app/reference/[section]/page.tsx (routing) and app-sidebar.tsx (nav tree).

export const REFERENCE_SLUGS = [
  "endpoints",
  "agent",
  "webhooks",
  "mcp",
  "jf-agent",
  "agent-config",
  "urls",
  "infra",
  "dora",
  "frameworks",
  "features",
  "integrations",
  "personas",
  "people-teams",
  "resources",
  "library",
  "limitations",
] as const;

export type ReferenceSlug = (typeof REFERENCE_SLUGS)[number];

export const REFERENCE_LABELS: Record<ReferenceSlug, string> = {
  endpoints: "All 25 Endpoints",
  agent: "Agent Endpoints",
  webhooks: "Webhooks",
  mcp: "MCP Tools",
  "jf-agent": "jf_agent",
  "agent-config": "Agent Config",
  urls: "Key URLs",
  infra: "Infrastructure",
  dora: "DORA Metrics",
  frameworks: "Frameworks",
  features: "Platform Features",
  integrations: "Integrations",
  personas: "Personas",
  "people-teams": "People & Teams",
  resources: "Resources",
  library: "Knowledge Library",
  limitations: "Limitations",
};
