# Interactive Playbook Framework — Design Spec

**Issue:** diegocconsolini/JellyFish-Compass-internal#124
**Parent:** diegocconsolini/JellyFish-Compass-internal#123
**Date:** 2026-04-01
**Scope:** Playbook page architecture, routing, components, data schema, and upgrade of existing 3 playbooks. Does NOT include the 14 new playbooks (#125-#130).

## Design Decisions

1. **Index page** — Category pills + persona pills filter a card grid. Scrollable pills on mobile.
2. **Detail page** — Separate page per playbook via `/academy/playbooks/[slug]`. Full viewport per playbook, deep-linkable.
3. **Step flow** — Hybrid: all steps visible on scroll, sticky progress bar auto-highlights current step via IntersectionObserver.
4. **Guides** — Single GuidePanel at top of playbook (persona-specific approach guidance). No BottomPanel wrapper.
5. **API Explorer** — Per-step inline ApiDrawer embedded at steps that reference endpoints.
6. **Mobile** — Filter pills horizontally scrollable, cards stack single-column, progress bar compact dots, scroll-based step flow.

## Playbook Index Page

**Route:** `/academy/playbooks` (existing, redesigned)

### Filter Bar

Two rows of pills (or single row with separator):

**Category pills:** All | Sprint & Delivery | Capacity & Planning | DevEx & Health | Metrics | Executive | AI & Innovation

**Persona pills:** SM | PO | EM | PM

Selecting a category filters the grid to playbooks in that category. Selecting a persona filters to playbooks that include that persona. Both filters can be active simultaneously (AND logic). "All" resets the category filter.

On mobile: pills overflow horizontally with `-webkit-overflow-scrolling: touch`.

### Card Grid

Responsive grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

Each card shows:
- Gradient accent bar at top (color matches category)
- Title (bold, linked to detail page)
- Goal (1-2 lines, dimmed text)
- Category badge
- Persona badges (SM, PO, EM, PM — only those applicable)
- Step count ("4 steps")
- Source link (small, dimmed)

Cards link to `/academy/playbooks/[slug]`.

## Playbook Detail Page

**Route:** `/academy/playbooks/[slug]` (new dynamic route)

### Layout (top to bottom)

```
PageHero (eyebrow: category name, title: playbook title, subtitle: goal)
Source citation link (small, links to jellyfish.co source)
─────────────────────────────── gradient divider
GuidePanel (persona-specific "how to approach this playbook")
─────────────────────────────── gradient divider
Sticky Progress Bar (numbered step pills, sticks to top on scroll)
───────────────────────────────
Step 1: [title]
  Text description with <code> endpoint references
  Inline visualization (StatCards / BarChart / DataTable / ProgressBars)
  Inline ApiDrawer (if step references endpoints)
─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ thin rule
Step 2: [title]
  ...
─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ thin rule
Step N: [title]
  ...
─────────────────────────────── gradient divider
Source footer (Jellyfish blog/resource URL)
```

### Sticky Progress Bar

- Horizontal row of numbered pills (1, 2, 3, 4...)
- Sticks to top of viewport when scrolled past
- Current step highlighted (blue pill) via IntersectionObserver watching each step's `<section>` element
- Clicking a pill scrolls to that step (`scrollIntoView`)
- Mobile: same pills, compact size, horizontally scrollable if many steps

### Step Rendering

Each step is a `<section>` element with an `id` for scroll targeting.

Content:
- **Step number + title** as heading
- **Description** — text paragraphs with `<code>` endpoint references (same styling as data page guides)
- **Visualization** (optional) — renders the appropriate component with mock data:
  - `"stat-cards"` → `StatCard` grid
  - `"bar-chart"` → `BarChart` with data labels
  - `"data-table"` → `DataTable` with headers and rows
  - `"progress-bars"` → `ProgressBar` list
- **ApiDrawer** (optional) — inline at steps referencing endpoints. Uses page-level token state. Pre-filtered to only the endpoints relevant to this step.

### GuidePanel at Top

Uses the dynamic `tabs` API (from #121). Each playbook defines which personas have guidance. Content describes how to approach the playbook from that persona's perspective.

Not wrapped in BottomPanel — it sits directly on the page between the hero and the progress bar, always visible.

## Data Schema

### Updated `PlaybookDefinition` type

```typescript
// data/playbooks.ts

type PlaybookVisualization = {
  type: "stat-cards" | "bar-chart" | "data-table" | "progress-bars";
  dataKey: string; // key name from mock-data exports
  props?: Record<string, unknown>; // additional props (e.g., headers for DataTable)
};

type PlaybookStep = {
  title: string;
  description: string; // plain text description (rendered in the step component)
  endpoints?: string[]; // endpoint names for inline ApiDrawer
  visualization?: PlaybookVisualization;
};

// Note: Rich JSX content (code refs, bold text, etc.) is built in the
// PlaybookStepSection component using the description + endpoint names.
// The data file stays serializable (no JSX in data).

type PlaybookPersonaGuide = {
  key: string; // "sm", "po", "em", "pm"
  label: string;
  description: string; // plain text (JSX built in the detail page component)
};

type PlaybookCategory =
  | "sprint-delivery"
  | "capacity-planning"
  | "devex-health"
  | "metrics"
  | "executive"
  | "ai-innovation";

type PlaybookDefinition = {
  id: string;
  slug: string;
  title: string;
  goal: string;
  category: PlaybookCategory;
  personas: string[]; // which persona badges to show: ["sm", "po", "em", "pm"]
  outputs: string[];
  steps: PlaybookStep[];
  guides: PlaybookPersonaGuide[];
  source: { label: string; url: string };
  color: { from: string; to: string };
};
```

### Mock Data Mapping

Playbook visualizations reference existing mock data exports by key:

| dataKey | Mock Data Export | Visualization |
|---------|----------------|---------------|
| `sprints` | `mockSprints` | DataTable |
| `sprintKpis` | `mockSprintKpis` | StatCards |
| `scopeEffort` | `mockScopeEffort` | BarChart |
| `deliverables` | `mockDeliverables` | DataTable |
| `investmentAllocation` | `mockInvestmentAllocation` | ProgressBars |
| `teamAllocations` | `mockTeamAllocations` | DataTable |
| `personAllocations` | `mockPersonAllocations` | DataTable |
| `capacityPlan` | `mockCapacityPlan` | DataTable |
| `devExScores` | `mockDevExScores` | ProgressBars |
| `teamBenchmarks` | `mockTeamBenchmarks` | DataTable |
| `aiAdoption` | `mockAiAdoption` | ProgressBars |
| `aiBeforeAfter` | `mockAiBeforeAfter` | DataTable |
| `productFlow` | `mockProductFlow` | StatCards |

### Category Colors

| Category | Gradient |
|----------|----------|
| sprint-delivery | blue → cyan |
| capacity-planning | green → emerald |
| devex-health | amber → yellow |
| metrics | violet → purple |
| executive | red → rose |
| ai-innovation | cyan → teal |

## New Components

### `PlaybookCard` — `components/ui/playbook-card.tsx`

Props:
```typescript
{
  playbook: PlaybookDefinition;
}
```

Renders a linked card for the index grid. Gradient accent bar, title, goal, badges, step count.

### `PlaybookProgress` — `components/ui/playbook-progress.tsx`

Props:
```typescript
{
  steps: { id: string; title: string }[];
  currentStep: number;
  onStepClick: (index: number) => void;
}
```

Sticky horizontal progress bar. Numbered pills. Highlighted current step. Click to scroll. Uses `position: sticky; top: 0; z-index: 10`.

The parent page manages `currentStep` state via IntersectionObserver watching each step `<section>`.

### `PlaybookStepSection` — `components/ui/playbook-step.tsx`

Props:
```typescript
{
  index: number;
  step: PlaybookStep;
  token: string;
  setToken: (t: string) => void;
  allEndpoints: JellyfishEndpoint[];
}
```

Renders a single step: heading with step number, content (JSX), optional visualization component, optional ApiDrawer filtered to the step's endpoints.

## Files

### New
| File | Responsibility |
|------|---------------|
| `app/academy/playbooks/[slug]/page.tsx` | Dynamic detail page: hero, guides, progress bar, steps |
| `components/ui/playbook-card.tsx` | Index card component |
| `components/ui/playbook-progress.tsx` | Sticky progress bar |
| `components/ui/playbook-step.tsx` | Step renderer with visualization + ApiDrawer |

### Modified
| File | Change |
|------|--------|
| `data/playbooks.ts` | Expand type + upgrade 3 existing playbooks to new schema with steps, visualizations, guides |
| `app/academy/playbooks/page.tsx` | Redesign index: filter pills + card grid linking to detail pages |

### Unchanged
- All data page files
- All shared UI components (reused as-is)
- Academy modules, workspace, showcase pages

## Existing 3 Playbook Upgrades

### Sprint Retrospective
- **Visualization step 1:** StatCards grid using `mockSprintKpis` (velocity, completion rate, carry-over, cadence)
- **Visualization step 2:** BarChart using `mockScopeEffort` (scope vs effort trend)
- **ApiDrawer at step 1:** `team_sprint_summary`, `team_metrics`
- **ApiDrawer at step 2:** `unlinked_pull_requests`
- **ApiDrawer at step 3:** `devex_insights_by_team`
- **Guides:** SM (existing ceremony focus), EM (coaching + burnout signals), PM (predictability for roadmap)
- **Source:** jellyfish.co/blog/how-jellyfish-supports-engineering-manager-responsibilities/

### Capacity & Allocation Review
- **Visualization step 2:** ProgressBars using `mockInvestmentAllocation` (FTE by category)
- **Visualization step 2 alt:** DataTable using `mockPersonAllocations` (person spread + flags)
- **ApiDrawer at step 2:** `allocations_by_investment_category`, `allocations_by_person`
- **Guides:** SM (sprint capacity), PO (backlog feasibility), EM (over-allocation detection), PM (headcount justification)
- **Source:** jellyfish.co/platform/resource-allocations/

### Stakeholder Status Summary
- **Visualization step 1:** DataTable using `mockDeliverables` (deliverable status with badges)
- **Visualization step 2:** StatCards using `mockProductFlow` (cycle time, lead time, deploy freq)
- **ApiDrawer at step 1:** `company_metrics`, `team_metrics`
- **Guides:** EM (data-backed 1:1s), PM (leadership communication in FTE language)
- **Source:** jellyfish.co/blog/presenting-engineering-operations/

## Out of Scope

- 14 new playbooks (handled by sub-issues #125-#130)
- Changes to data pages or other academy tabs
- New mock data — reuses existing exports
- Workspace integration (saving playbook outputs — future enhancement)
