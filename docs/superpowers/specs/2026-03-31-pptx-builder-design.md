# PPTX Builder — Design Spec

**Date:** 2026-03-31
**Route:** `/metrics`
**Nav Group:** Knowledge

---

## Purpose

A visual PPTX builder that lets Jellyfish users compose slide decks from platform metrics. Users pick a template, customize which slides to include, preview each slide at 16:9, and export a branded PPTX — all from one page. Supports mock data (default), direct API calls (token), and MCP server (power users).

---

## Architecture

### Page Layout: Side-by-side

```
┌─────────────────────────────────────────────────────┐
│ PageHero: "Metrics Deck Builder"                     │
│ Data source toggle: [Mock] [API] [MCP]   [Export ▼] │
├──────────────────┬──────────────────────────────────┤
│ LEFT PANEL       │ RIGHT PANEL                       │
│                  │                                    │
│ Template Picker  │ 16:9 Slide Preview                │
│ ─────────────── │                                    │
│ Slide List       │ "Slide 2 of 6 — Sprint KPIs"     │
│  [drag to order] │                                    │
│  ☐ Title Slide   │ ┌──────────────────────────────┐ │
│  ☑ Sprint KPIs  │ │  Sprint Health KPIs           │ │
│  ☑ Delivery     │ │  ┌────┐┌────┐┌────┐┌────┐   │ │
│  ☑ Allocation   │ │  │56.3││88% ││3.0 ││2w  │   │ │
│  ☐ DevEx        │ │  └────┘└────┘└────┘└────┘   │ │
│  ☐ Benchmarks   │ └──────────────────────────────┘ │
│                  │                                    │
│ [+ Add Slide]    │ [← Prev]  [Next →]               │
│ [Export PPTX]    │                                    │
└──────────────────┴──────────────────────────────────┘
```

**Mobile:** Stacks vertically — slide list on top, preview below. Template picker collapses into a dropdown.

---

## Templates (Phase 1)

### Ceremony Templates
| Template | Pre-selected Slides |
|----------|-------------------|
| Sprint Review | Title, Sprint KPIs, Sprint History, Delivery Status |
| Retrospective Prep | Title, Sprint KPIs, DevEx Index, Unlinked PRs, Benchmarks |
| Stakeholder Update | Title, Sprint KPIs, Delivery Status, Allocation, Capacity Gaps |
| Capacity Planning | Title, Allocation FTE, Team Allocation, Capacity Gaps, Scenarios |
| Quarterly Business Review | Title, Sprint KPIs, Delivery Status, Allocation, DevEx, Benchmarks, Capacity |

### Audience Templates
| Template | Pre-selected Slides |
|----------|-------------------|
| For My Team | Title, Sprint KPIs, Sprint History, DevEx Index, Unlinked PRs |
| For Leadership | Title, Sprint KPIs, Delivery Status, Allocation, Capacity Gaps |
| For Product | Title, Delivery Status, Allocation, Capacity Gaps |
| For Finance | Title, Allocation FTE, Team Allocation |

---

## Available Slide Blocks

Each block maps to specific data and a PPTX slide template:

| Block | Data Source (Mock) | Data Source (API) | Slide Content |
|-------|-------------------|------------------|---------------|
| Title Slide | User-editable title + date | Same | Title + subtitle + date |
| Sprint KPIs | `mockSprintKpis` | `team_sprint_summary` | 4 stat cards (velocity, completion, carry-over, cadence) |
| Sprint History | `mockSprints` | `team_sprint_summary` | Table: Sprint, Committed, Completed, Carry-Over, Velocity |
| Delivery Status | `mockDeliverables` | `work_category_contents` | Table: Deliverable, Category, Issues, Complete, Status |
| Scope & Effort | `mockScopeEffort` | `deliverable_scope_and_effort_history` | Bar chart representation (8 weeks) |
| Allocation FTE | `mockInvestmentAllocation` | `allocations_by_investment_category` | Horizontal bars: Feature, KTLO, Tech Debt, Growth |
| Team Allocation | `mockTeamAllocations` | `allocations_by_team` | Table: Team, FTE, Features%, KTLO%, Tech Debt% |
| DevEx Index | `mockDevExScores` | `devex_insights_by_team` | Horizontal bars: team scores |
| Unlinked PRs | `mockUnlinkedPrs` | `unlinked_pull_requests` | Big number + team breakdown |
| Capacity Gaps | `mockCapacityPlan` | `allocations_by_team` | Table: Team, Available, Planned, Gap, Status |
| Team Benchmarks | `mockTeamBenchmarks` | `team_metrics` + `company_metrics` | Table: Team, Velocity, Cycle Time, PR Review, Deploys, DevEx |
| DORA Metrics | `doraMetrics` (static) | Same (reference data) | 4 metric definitions |
| Custom Text | User input | Same | Freeform title + body text |

---

## Data Sources

### Mock Mode (default)
- No auth needed
- All data from `data/mock-data.ts`
- Instant preview
- Export generates PPTX with mock data (labeled "Sample Data" on title slide)

### API Mode
- User enters Jellyfish API token
- Token validated via `testConnection()` from `lib/api-client.ts`
- Each slide block calls its mapped endpoint via `callEndpoint()`
- Preview updates with real data
- Export generates PPTX with real data (labeled with date range)

### MCP Mode
- User provides MCP server URL (default: `http://localhost:3100`)
- Connection validated
- Queries via MCP tool calls (JSON-RPC over HTTP)
- Natural language query support for custom slides
- Falls back to API mode if MCP unavailable

---

## PPTX Generation

### Library
`pptxgenjs` — MIT, client-side only, no server needed.

### Default Theme: Jellyfish Brand (from jellyfish.co)

Sourced directly from jellyfish.co brand:

| Token | Value | Usage |
|-------|-------|-------|
| Navy | `#0D062B` | Slide backgrounds |
| Purple | `#7319F2` | Primary accent, headings, KPI highlights |
| Purple Light | `#8F47F3` | Secondary accent, hover states |
| Neon Green | `#CFEF09` | Positive trends, success indicators |
| Aqua | `#13E2BF` | Charts, progress bars |
| Red | `#FF502A` | Negative trends, alerts |
| Light Purple BG | `#F9F6FE` | Light theme slide backgrounds |
| White | `#FFFFFF` | Text on dark, card backgrounds on light |
| Dark Gray | `#313131` | Text on light backgrounds |
| Purple Tint | `#E3D1FC` | Subtle borders, dividers |

**Gradients:**
- Title slide: `135deg, #0693e3 → #9b51e0` (vivid-cyan-blue to vivid-purple)
- Accent bar: `135deg, #020381 → #2874fc` (midnight gradient)

**Typography:**
- Font: Calibri (PPTX-safe, closest to Jellyfish's system font)
- Title: 42px bold
- Heading: 28px semibold
- Body: 16px regular
- KPI numbers: 48px bold
- Labels: 12px uppercase tracking

**Slide Layout Principles:**
- Generous whitespace — no cramming
- Left-aligned headings with purple accent bar (4px, gradient)
- KPI cards: dark navy background with colored top border (matches StatCard pattern)
- Tables: alternating row backgrounds (`#0D062B` / `#1a1040`)
- Progress bars: gradient fill (aqua to purple)
- Footer on every slide: "Jellyfish Compass · {date}" in small gray text

### Theme Options (user-selectable)

1. **Jellyfish Dark** (default) — navy backgrounds, white text, purple accents
2. **Jellyfish Light** — white/light purple backgrounds, dark text, purple accents
3. **Custom** — user uploads a PPTX template file. The builder extracts the slide master colors and applies them to generated slides. Uses pptxgenjs `defineSlideMaster()` API.

### Custom Template Upload

Users can upload a `.pptx` file as a base template:
- The builder reads the file's slide master (background, colors, fonts)
- Applies the master to all generated slides
- Data content (tables, charts, KPIs) adapts to the template's color scheme
- Stored in localStorage for reuse across sessions
- "Reset to Jellyfish theme" button to revert

### Slide Templates

Each slide block has a corresponding function in `lib/export-pptx.ts`:

**Title Slide:** `addTitleSlide(pptx, { title, subtitle, date })`
- Full gradient background (135deg purple)
- Large centered title (42px bold white)
- Subtitle below (20px regular, white 80% opacity)
- Date + "Jellyfish Compass" footer
- Optional: Jellyfish logo placement area

**KPI Slide:** `addKpiSlide(pptx, kpis)`
- 4 stat cards in a 2x2 grid
- Each card: navy background, colored top border (4px), KPI number (48px bold, colored), label (12px uppercase), trend indicator
- Colors: blue for velocity, green for completion, amber for carry-over, purple for cadence

**Table Slide:** `addTableSlide(pptx, { title, headers, rows })`
- Title + purple accent bar at top
- Full-width table with header row (purple background, white text)
- Alternating body rows (navy / slightly lighter navy)
- Status cells colored: green for on-track, amber for at-risk, red for behind

**Bar Chart Slide:** `addBarSlide(pptx, { title, bars })`
- Title + accent bar
- Horizontal bars with gradient fills (aqua → purple)
- Labels left, values right
- Proportional widths

**Big Number Slide:** `addBigNumberSlide(pptx, { title, number, subtitle, breakdown })`
- Title at top
- Massive centered number (72px bold, colored)
- Subtitle below (20px, gray)
- Small breakdown table or bars below

**Text Slide:** `addTextSlide(pptx, { title, body })`
- Title + accent bar
- Body text (16px, white)

### Output
File: `jellyfish-metrics-YYYY-MM-DD.pptx`
Triggered by clicking "Export PPTX" button.

---

## File Structure

```
app/
  metrics/page.tsx              ← The PPTX builder page (client component)
lib/
  export-pptx.ts                ← PPTX generation: slide template functions
  export-pptx-themes.ts         ← Dark/light PPTX brand tokens
components/
  metrics/
    template-picker.tsx          ← Template selection pills
    slide-list.tsx               ← Draggable/toggleable slide list
    slide-preview.tsx            ← 16:9 preview panel
    slide-blocks.tsx             ← Individual slide block preview renderers
    data-source-toggle.tsx       ← Mock / API / MCP selector
    export-button.tsx            ← Export trigger with loading state
data/
  slide-templates.ts             ← Template definitions (which blocks per template)
```

---

## State Management

Single page-level state:

```typescript
type BuilderState = {
  template: string | null;           // Active template ID
  slides: SlideBlock[];              // Ordered list of active slides
  selectedSlide: number;             // Index of slide shown in preview
  dataSource: "mock" | "api" | "mcp"; // Data mode
  token: string;                     // Jellyfish API token
  mcpUrl: string;                    // MCP server URL
  liveData: Record<string, unknown>; // Cached API/MCP responses
  loading: boolean;                  // Data fetch in progress
  theme: "dark" | "light";          // PPTX export theme
};
```

---

## Interactions

1. **Pick template** → pre-populates `slides` array with that template's blocks
2. **Toggle slide** → adds/removes from `slides` array
3. **Drag to reorder** → reorders `slides` array
4. **Click slide in list** → updates `selectedSlide`, preview panel shows that slide
5. **Switch data source** → triggers data fetch for all active slides
6. **Enter token** → validates, then fetches data for all slides
7. **Click Export** → generates PPTX from `slides` array using current data
8. **Add custom slide** → appends a text block to `slides`

---

## Dependencies to Install

```bash
npm install pptxgenjs @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

- `pptxgenjs` — PPTX generation
- `@dnd-kit` — drag-to-reorder slides (accessible, React-native)

---

## Navigation

- Route: `/metrics`
- Nav group: Knowledge (alongside Reference, Academy)
- Landing page: add to Knowledge section group
- SectionId: add `"metrics"` to union type

---

## Acceptance Criteria

- [ ] Page loads with template picker showing 9 templates (5 ceremony + 4 audience)
- [ ] Selecting a template populates the slide list
- [ ] Slides can be toggled on/off and reordered
- [ ] Preview panel shows 16:9 preview of selected slide with actual data
- [ ] Mock mode works with no auth (default)
- [ ] API mode works with token — real data in preview and export
- [ ] MCP mode connects to local server (stretch goal)
- [ ] Export generates a branded PPTX that opens in PowerPoint/Google Slides
- [ ] Mobile responsive — stacked layout on small screens
- [ ] Accessible — keyboard nav, screen reader support, WCAG AA
