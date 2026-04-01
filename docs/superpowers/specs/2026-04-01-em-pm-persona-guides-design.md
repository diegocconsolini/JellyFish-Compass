# Engineering Manager & Product Manager Persona Guides — Design Spec

**Issue:** diegocconsolini/JellyFish-Compass-internal#121
**Date:** 2026-04-01
**Scope:** Add EM and PM persona tabs to GuidePanel on all 11 data pages

## Overview

Extend the GuidePanel component to support dynamic persona tabs and add Engineering Manager and Product Manager guide content across all data pages. Currently the panel has two hardcoded personas (Scrum Master + Product Owner). The new version supports any number of personas, rendering pills on desktop and a dropdown on mobile.

## Design Decisions

### 1. GuidePanel — Dynamic Tabs with Mobile Dropdown

Replace the hardcoded 2-tab structure with a dynamic `tabs` array prop. On desktop (`sm:` and up), render pill buttons. On mobile (below `sm`), render a native `<select>` dropdown.

### 2. Content Presence — Only Show Relevant Tabs

Each page only shows persona tabs where meaningful guidance exists. EM gets guides on all 11 pages. PM gets guides on 9 of 11 (no PM guide on DevEx or Process — low relevance).

### 3. Guide Tone — API-Endpoint-Focused (Consistent)

All guides follow the same practical, API-endpoint-focused pattern as existing SM/PO guides. Endpoints referenced with `<code>` styling. Case study citations included where relevant.

### 4. Case Study Citations — Included

Guides include brief source citations (e.g., "Source: Jobvite achieved 80% throughput increase — jellyfish.co/case-studies/jobvite/") matching the existing PO guide pattern.

## GuidePanel Component Redesign

### New Props Interface

```typescript
type PersonaTab = {
  key: string;
  label: string;
  content: React.ReactNode;
};

type GuidePanelProps = {
  tabs: PersonaTab[];
};
```

### Behavior

- **1 tab**: Render content directly, no tab UI
- **2+ tabs on desktop** (`sm:` breakpoint and up): Render pill buttons in a flex row. First tab active by default.
- **2+ tabs on mobile** (below `sm`): Render a native `<select>` element with the same tab labels. Selecting an option switches the visible content.
- Active tab styling: `bg-blue-dim text-blue` pill (same as current)
- Inactive: `bg-surface-raised text-text-ghost hover:text-text-dim`
- Select dropdown styling: `bg-surface border border-border rounded-lg text-xs font-semibold text-text-primary`

### Breaking Change

All 11 data pages update from:
```tsx
<GuidePanel scrumMaster={...} productOwner={...} />
```
To:
```tsx
<GuidePanel tabs={[
  { key: "sm", label: "Scrum Master", content: ... },
  { key: "po", label: "Product Owner", content: ... },
  { key: "em", label: "Engineering Manager", content: ... },
  { key: "pm", label: "Product Manager", content: ... },
]} />
```

## Guide Content Per Page

### Content Template

Each guide follows this structure:
1. **Opening paragraph** — what this persona should look for on this page and why
2. **Key endpoints** — `<code>` references with what they return for this persona's use case
3. **Actionable patterns** — 2-3 numbered items: specific workflows using the data
4. **Source attribution** — citing jellyfish.co case study or solution page

### Content Grounding Rules

- All content sourced exclusively from official Jellyfish materials (jellyfish.co, Jellyfish-AI GitHub repos, case studies, solution pages, blog posts)
- No fabricated thresholds, benchmarks, or numbers
- Case study outcomes cited verbatim with source URLs
- API endpoint names must match `data/endpoints-full.ts`

### Per-Page Guide Coverage

| Page | SM | PO | EM | PM |
|------|----|----|----|----|
| Sprint Health | Yes | Yes | Yes | Yes |
| Delivery | Yes | Yes | Yes | Yes |
| Delivery Forecast | Yes | Yes | Yes | Yes |
| Product Metrics | Yes | Yes | Yes | Yes |
| DevEx | Yes | No* | Yes | No |
| Benchmarks | Yes | Yes | Yes | Yes |
| Process | Yes | Yes | Yes | No |
| Allocation | Yes | Yes | Yes | Yes |
| Capacity | Yes | Yes | Yes | Yes |
| Scenarios | Yes | Yes | Yes | Yes |
| Roadmap | Yes | Yes | Yes | Yes |

*DevEx currently has no PO guide (from previous modernization). It remains SM + EM only.

### EM Guide Focus By Page

| Page | EM Focus | Key Endpoints | Case Study Source |
|------|----------|---------------|-------------------|
| Sprint Health | Velocity trends for team coaching, capacity signals, leading indicators of sustainable delivery | `team_sprint_summary`, `team_metrics` | jellyfish.co/blog/how-jellyfish-supports-engineering-manager-responsibilities/ |
| Delivery | Cross-sprint deliverable visibility, bottleneck removal, Life Cycle Explorer patterns | `work_category_contents`, `deliverable_details`, `deliverable_scope_and_effort_history` | jellyfish.co/case-studies/jobvite/ — 80% throughput increase |
| Delivery Forecast | Scenario modeling for delivery impact, capacity-based timeline forecasting | `deliverable_details`, `allocations_by_team` | jellyfish.co/solutions/scenario-planner/ |
| Product Metrics | Allocation balance across investment categories, team health signals from flow metrics | `allocations_by_investment_category`, `team_metrics` | jellyfish.co/platform/resource-allocations/ |
| DevEx | Survey + system metrics pairing, coaching conversations, intervention tracking, burnout prevention | `team_metrics`, `unlinked_pull_requests` | jellyfish.co/blog/how-jellyfish-used-its-own-devex-tool-to-double-engineer-satisfaction-with-test-automation/ — test automation sentiment improved from 26 to 58 |
| Benchmarks | Cross-team comparison for improvement targets, depersonalizing performance conversations | `team_metrics`, `company_metrics` | jellyfish.co/blog/2025-engineering-benchmarks/ — based on 78,000 engineers |
| Process | Bottleneck identification via Life Cycle Explorer, review cycle time optimization | `team_metrics`, `deliverable_details` | jellyfish.co/platform/life-cycle-explorer/ |
| Allocation | Over-allocation detection, sustainable pace, hidden work visibility, team composition | `allocations_by_investment_category`, `allocations_by_team`, `allocations_by_person` | jellyfish.co/case-studies/jobvite/ — backlog shrunk from 20+ to 4 items |
| Capacity | Workload planning, FTE forecasting, team composition decisions | `allocations_by_team`, `allocations_by_person` | jellyfish.co/solutions/capacity-planner/ |
| Scenarios | Delivery impact modeling, resource reallocation trade-offs | `allocations_by_investment_category`, `allocations_by_team` | jellyfish.co/solutions/scenario-planner/ |
| Roadmap | Initiative health monitoring, dependency management, strategic alignment | `allocations_by_investment_category`, `deliverable_details` | jellyfish.co/case-studies/buildium/ |

### PM Guide Focus By Page

| Page | PM Focus | Key Endpoints | Case Study Source |
|------|----------|---------------|-------------------|
| Sprint Health | Predictability trends for roadmap confidence, sprint completion rate as a planning signal | `team_sprint_summary`, `company_metrics` | jellyfish.co/case-studies/precisely/ — predictability improved from 55% to 76.5% |
| Delivery | Initiative-level progress tracking, stakeholder reporting at work-category level | `work_category_contents`, `deliverable_details` | jellyfish.co/solutions/software-delivery-management/ |
| Delivery Forecast | Ship date communication to leadership, trade-off modeling (scope vs timeline vs resources) | `deliverable_details`, `allocations_by_team` | jellyfish.co/solutions/capacity-planner/ |
| Product Metrics | Investment distribution visibility, strategic alignment, allocation benchmarking, DORA context | `allocations_by_investment_category`, `team_metrics`, `company_metrics` | jellyfish.co/case-studies/salsify/ — proved 80% engineering on roadmap to justify headcount |
| Benchmarks | Peer validation for leadership conversations, setting realistic delivery expectations | `team_metrics`, `company_metrics` | jellyfish.co/case-studies/precisely/ — used benchmarks to communicate capacity |
| Allocation | Where engineering actually spends time, headcount justification using FTE language, allocation gap (leaders overestimate roadmap allocation by 62%) | `allocations_by_investment_category`, `allocations_by_team` | jellyfish.co/case-studies/salsify/ — eliminated 700 hrs/yr manual tracking |
| Capacity | Roadmap feasibility assessment, capacity constraints for quarterly planning | `allocations_by_team`, `allocations_by_person` | jellyfish.co/blog/how-to-align-product-and-engineering-to-drive-better-planning/ |
| Scenarios | Scope/resource/timeline trade-offs, presenting multiple credible plans to leadership | `allocations_by_investment_category`, `allocations_by_team` | jellyfish.co/blog/what-is-scenario-planning/ |
| Roadmap | Investment vs plan alignment, leadership communication, translating engineering metrics to business language | `allocations_by_investment_category`, `deliverable_details` | jellyfish.co/solutions/product-leaders/ |

## Files Changed

### Modified
| File | Change |
|------|--------|
| `components/ui/guide-panel.tsx` | Rewrite: dynamic tabs array, mobile dropdown, desktop pills |
| `app/sprint-health/page.tsx` | Update GuidePanel to tabs array, add EM + PM guides |
| `app/delivery/page.tsx` | Update GuidePanel to tabs array, add EM + PM guides |
| `app/delivery-forecast/page.tsx` | Update GuidePanel to tabs array, add EM + PM guides |
| `app/product-metrics/page.tsx` | Update GuidePanel to tabs array, add EM + PM guides (both tabs) |
| `app/devex/page.tsx` | Update GuidePanel to tabs array, add EM guide (no PM) |
| `app/benchmarks/page.tsx` | Update GuidePanel to tabs array, add EM + PM guides |
| `app/process/page.tsx` | Update GuidePanel to tabs array, add EM guide (no PM, both tabs) |
| `app/allocation/page.tsx` | Update GuidePanel to tabs array, add EM + PM guides |
| `app/capacity/page.tsx` | Update GuidePanel to tabs array, add EM + PM guides |
| `app/scenarios/page.tsx` | Update GuidePanel to tabs array, add EM + PM guides |
| `app/roadmap/page.tsx` | Update GuidePanel to tabs array, add EM + PM guides |

### Unchanged
- `components/ui/bottom-panel.tsx` — passes ReactNode, no interface change
- `components/ui/api-drawer.tsx` — no changes
- All other shared components

## Out of Scope

- No new pages or routes
- No new data or API endpoints
- No changes to API Explorer or BottomPanel behavior
- No visual changes outside the GuidePanel tabs area
- No changes to academy or reference pages (they use GuideBox, not GuidePanel)
