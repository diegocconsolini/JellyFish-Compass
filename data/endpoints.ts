import { EndpointDefinition } from "@/lib/types";

export const endpoints: EndpointDefinition[] = [
  {
    name: "team_sprint_summary",
    path: "/endpoints/export/v0/metrics/team_sprint_summary",
    domain: "Metrics",
    description: "Issue count and story point data for a team's sprints in a specified timeframe.",
  },
  {
    name: "team_metrics",
    path: "/endpoints/export/v0/metrics/team_metrics",
    domain: "Metrics",
    description: "Team-level metrics across a timeframe for delivery and performance analysis.",
  },
  {
    name: "unlinked_pull_requests",
    path: "/endpoints/export/v0/metrics/unlinked_pull_requests",
    domain: "Metrics",
    description: "Details of unlinked pull requests merged during a specified timeframe.",
  },
  {
    name: "allocations_by_person",
    path: "/endpoints/export/v0/allocations/details/by_person",
    domain: "Allocations",
    description: "Allocation data for the company aggregated by person.",
  },
  {
    name: "devex_insights_by_team",
    path: "/endpoints/export/v0/devex/insights/by_team",
    domain: "DevEx",
    description: "Developer experience insights at the team level.",
  },
  {
    name: "list_teams",
    path: "/endpoints/export/v0/teams/list_teams",
    domain: "Teams",
    description: "Lists teams at a given hierarchy level and optionally their children.",
  },
];
