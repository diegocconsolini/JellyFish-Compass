import { EndpointGroup } from "@/lib/types";

export const endpointGroups: EndpointGroup[] = [
  {
    domain: "Allocations",
    endpoints: [
      { path: "/endpoints/export/v0/allocations/details/by_person", name: "allocations_by_person", desc: "Allocation data for the whole company, aggregated by person" },
      { path: "/endpoints/export/v0/allocations/details/by_team", name: "allocations_by_team", desc: "Allocation data for the whole company, aggregated by team at specified hierarchy level" },
      { path: "/endpoints/export/v0/allocations/details/investment_category", name: "allocations_by_investment_category", desc: "Allocation data aggregated by investment category" },
      { path: "/endpoints/export/v0/allocations/details/investment_category/by_person", name: "allocations_by_investment_category_person", desc: "Allocation data aggregated by investment category and person" },
      { path: "/endpoints/export/v0/allocations/details/investment_category/by_team", name: "allocations_by_investment_category_team", desc: "Allocation data aggregated by investment category and team" },
      { path: "/endpoints/export/v0/allocations/details/work_category", name: "allocations_by_work_category", desc: "Allocation data aggregated by deliverable within specified work category" },
      { path: "/endpoints/export/v0/allocations/details/work_category/by_person", name: "allocations_by_work_category_person", desc: "Allocation data aggregated by deliverable within work category and person" },
      { path: "/endpoints/export/v0/allocations/details/work_category/by_team", name: "allocations_by_work_category_team", desc: "Allocation data aggregated by deliverable within work category and team" },
      { path: "/endpoints/export/v0/allocations/filter_fields", name: "allocations_filter_fields", desc: "Available fields and known values for filtering allocations" },
      { path: "/endpoints/export/v0/allocations/summary_filtered/by_investment_category", name: "allocations_summary_by_investment_category", desc: "Total FTE amounts for investment categories (supports filtering)" },
      { path: "/endpoints/export/v0/allocations/summary_filtered/by_work_category", name: "allocations_summary_by_work_category", desc: "Total FTE amounts for deliverables within a work category (supports filtering)" },
    ],
  },
  {
    domain: "Delivery",
    endpoints: [
      { path: "/endpoints/export/v0/delivery/deliverable_details", name: "deliverable_details", desc: "Data about a specific deliverable" },
      { path: "/endpoints/export/v0/delivery/scope_and_effort_history", name: "deliverable_scope_and_effort_history", desc: "Weekly data about deliverable scope and total effort allocated per week" },
      { path: "/endpoints/export/v0/delivery/work_categories", name: "work_categories", desc: "List of all known work categories" },
      { path: "/endpoints/export/v0/delivery/work_category_contents", name: "work_category_contents", desc: "Data about deliverables in a specified work category" },
    ],
  },
  {
    domain: "DevEx",
    endpoints: [
      { path: "/endpoints/export/v0/devex/insights/by_team", name: "devex_insights_by_team", desc: "DevEx insights data by team" },
    ],
  },
  {
    domain: "Metrics",
    endpoints: [
      { path: "/endpoints/export/v0/metrics/company_metrics", name: "company_metrics", desc: "Metrics data for the company during specified timeframe" },
      { path: "/endpoints/export/v0/metrics/person_metrics", name: "person_metrics", desc: "Metrics data for a specified person during specified timeframe" },
      { path: "/endpoints/export/v0/metrics/team_metrics", name: "team_metrics", desc: "Metrics data for a specified team during specified timeframe" },
      { path: "/endpoints/export/v0/metrics/team_sprint_summary", name: "team_sprint_summary", desc: "Issue count and story point data for a team's sprints in specified timeframe" },
      { path: "/endpoints/export/v0/metrics/unlinked_pull_requests", name: "unlinked_pull_requests", desc: "Details of unlinked pull requests merged during specified timeframe" },
    ],
  },
  {
    domain: "People",
    endpoints: [
      { path: "/endpoints/export/v0/people/list_engineers", name: "list_engineers", desc: "List of all active allocatable people as of a specific date" },
      { path: "/endpoints/export/v0/people/search", name: "search_people", desc: "Search for people by name, email, or id" },
    ],
  },
  {
    domain: "Teams",
    endpoints: [
      { path: "/endpoints/export/v0/teams/list_teams", name: "list_teams", desc: "All teams at specified hierarchy level (optionally includes child teams)" },
      { path: "/endpoints/export/v0/teams/search", name: "search_teams", desc: "Search for teams by name or id" },
    ],
  },
];

export const allEndpoints = endpointGroups.flatMap((g) => g.endpoints);
