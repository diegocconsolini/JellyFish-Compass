# PPTX Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a visual PPTX deck builder at `/metrics` where users pick templates, customize slides, preview at 16:9, and export branded Jellyfish presentations.

**Architecture:** Client-side page with left panel (template picker + draggable slide list) and right panel (16:9 preview). Data from mock (default), API (token), or MCP (power user). Export via pptxgenjs. Components split by responsibility: template picker, slide list, slide preview, export logic, PPTX generation.

**Tech Stack:** Next.js 15, React 19, TypeScript, pptxgenjs, @dnd-kit/core + @dnd-kit/sortable, Tailwind CSS v4, existing component library.

**GitHub Issue:** #85

---

## File Structure

```
lib/
  export-pptx.ts                ← PPTX slide builder functions (addTitleSlide, addKpiSlide, etc.)
  export-pptx-themes.ts         ← Jellyfish dark/light brand token objects
data/
  slide-templates.ts             ← 9 template definitions + 13 slide block definitions
components/
  metrics/
    template-picker.tsx          ← Template selection pill buttons
    slide-list.tsx               ← Draggable slide list with toggles
    slide-preview.tsx            ← 16:9 preview panel with slide rendering
    slide-blocks.tsx             ← Preview renderers for each slide block type
    data-source-toggle.tsx       ← Mock / API / MCP mode selector
    export-button.tsx            ← Export trigger with theme picker + loading
app/
  metrics/page.tsx               ← Main builder page wiring everything together
```

---

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install pptxgenjs and dnd-kit**

```bash
npm install pptxgenjs @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: build succeeds, no new errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install pptxgenjs + @dnd-kit for PPTX builder

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Create slide template definitions + PPTX brand themes

**Files:**
- Create: `data/slide-templates.ts`
- Create: `lib/export-pptx-themes.ts`

- [ ] **Step 1: Create slide-templates.ts**

This file defines all 13 slide block types, their data mappings, and the 9 templates.

```typescript
// data/slide-templates.ts

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
  apiEndpoint?: string; // endpoint name for live data
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
  // Ceremony
  { id: "sprint-review", label: "Sprint Review", group: "ceremony", slides: ["title", "sprint-kpis", "sprint-history", "delivery-status"] },
  { id: "retro-prep", label: "Retrospective Prep", group: "ceremony", slides: ["title", "sprint-kpis", "devex-index", "unlinked-prs", "benchmarks"] },
  { id: "stakeholder-update", label: "Stakeholder Update", group: "ceremony", slides: ["title", "sprint-kpis", "delivery-status", "allocation-fte", "capacity-gaps"] },
  { id: "capacity-planning", label: "Capacity Planning", group: "ceremony", slides: ["title", "allocation-fte", "team-allocation", "capacity-gaps"] },
  { id: "qbr", label: "Quarterly Business Review", group: "ceremony", slides: ["title", "sprint-kpis", "delivery-status", "allocation-fte", "devex-index", "benchmarks", "capacity-gaps"] },
  // Audience
  { id: "for-team", label: "For My Team", group: "audience", slides: ["title", "sprint-kpis", "sprint-history", "devex-index", "unlinked-prs"] },
  { id: "for-leadership", label: "For Leadership", group: "audience", slides: ["title", "sprint-kpis", "delivery-status", "allocation-fte", "capacity-gaps"] },
  { id: "for-product", label: "For Product", group: "audience", slides: ["title", "delivery-status", "allocation-fte", "capacity-gaps"] },
  { id: "for-finance", label: "For Finance", group: "audience", slides: ["title", "allocation-fte", "team-allocation"] },
];
```

- [ ] **Step 2: Create export-pptx-themes.ts**

```typescript
// lib/export-pptx-themes.ts

export type PptxTheme = {
  name: string;
  background: string;
  backgroundAlt: string;
  text: string;
  textDim: string;
  accent: string;
  accentLight: string;
  green: string;
  aqua: string;
  red: string;
  amber: string;
  headerBg: string;
  gradientStart: string;
  gradientEnd: string;
};

export const jellyfishDark: PptxTheme = {
  name: "Jellyfish Dark",
  background: "0D062B",
  backgroundAlt: "1a1040",
  text: "FFFFFF",
  textDim: "E3D1FC",
  accent: "7319F2",
  accentLight: "8F47F3",
  green: "CFEF09",
  aqua: "13E2BF",
  red: "FF502A",
  amber: "F59E0B",
  headerBg: "7319F2",
  gradientStart: "0693E3",
  gradientEnd: "9B51E0",
};

export const jellyfishLight: PptxTheme = {
  name: "Jellyfish Light",
  background: "F9F6FE",
  backgroundAlt: "FFFFFF",
  text: "313131",
  textDim: "6E6A80",
  accent: "7319F2",
  accentLight: "8F47F3",
  green: "16A34A",
  aqua: "0D9488",
  red: "DC2626",
  amber: "D97706",
  headerBg: "7319F2",
  gradientStart: "0693E3",
  gradientEnd: "9B51E0",
};
```

- [ ] **Step 3: Verify typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: slide template definitions + Jellyfish PPTX brand themes

13 slide blocks, 9 templates (5 ceremony, 4 audience).
Dark and light Jellyfish brand themes from jellyfish.co.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Build PPTX generation engine

**Files:**
- Create: `lib/export-pptx.ts`

- [ ] **Step 1: Create the PPTX generation engine**

This file contains all slide builder functions and the main export function. Each function takes a `pptxgenjs` instance, data, and a theme.

```typescript
// lib/export-pptx.ts
import PptxGenJS from "pptxgenjs";
import { PptxTheme, jellyfishDark } from "./export-pptx-themes";

// ─── Helpers ────────────────────────────────────────────

function addFooter(slide: PptxGenJS.Slide, theme: PptxTheme, date: string) {
  slide.addText(`Jellyfish Compass · ${date}`, {
    x: 0.5, y: "92%", w: "90%", h: 0.3,
    fontSize: 8, color: theme.textDim, fontFace: "Calibri",
  });
}

function addAccentBar(slide: PptxGenJS.Slide, theme: PptxTheme) {
  slide.addShape("rect", {
    x: 0.5, y: 0.9, w: 0.8, h: 0.06,
    fill: { color: theme.accent },
  });
}

// ─── Slide Builders ─────────────────────────────────────

export function addTitleSlide(
  pptx: PptxGenJS,
  data: { title: string; subtitle: string; date: string },
  theme: PptxTheme
) {
  const slide = pptx.addSlide();
  // Gradient background
  slide.background = {
    fill: { type: "solid", color: theme.background },
  };
  // Accent line at top
  slide.addShape("rect", {
    x: 0, y: 0, w: "100%", h: 0.06,
    fill: { color: theme.accent },
  });
  // Title
  slide.addText(data.title, {
    x: 0.8, y: 1.5, w: 8.4, h: 1.2,
    fontSize: 42, bold: true, color: theme.text, fontFace: "Calibri",
  });
  // Subtitle
  slide.addText(data.subtitle, {
    x: 0.8, y: 2.8, w: 8.4, h: 0.6,
    fontSize: 20, color: theme.textDim, fontFace: "Calibri",
  });
  // Date
  slide.addText(data.date, {
    x: 0.8, y: 3.6, w: 8.4, h: 0.4,
    fontSize: 14, color: theme.textDim, fontFace: "Calibri",
  });
  addFooter(slide, theme, data.date);
}

export function addKpiSlide(
  pptx: PptxGenJS,
  data: { label: string; value: string; unit: string; trend: string; color: string }[],
  theme: PptxTheme
) {
  const slide = pptx.addSlide();
  slide.background = { fill: { type: "solid", color: theme.background } };
  slide.addText("Sprint Health KPIs", {
    x: 0.5, y: 0.4, w: 9, h: 0.5,
    fontSize: 28, bold: true, color: theme.text, fontFace: "Calibri",
  });
  addAccentBar(slide, theme);

  const colorMap: Record<string, string> = {
    blue: theme.aqua, green: theme.green, amber: theme.amber, violet: theme.accent,
  };

  data.forEach((kpi, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 4.5;
    const y = 1.3 + row * 1.8;
    const kpiColor = colorMap[kpi.color] || theme.accent;

    // Card background
    slide.addShape("rect", {
      x, y, w: 4, h: 1.5,
      fill: { color: theme.backgroundAlt },
      rectRadius: 0.1,
    });
    // Top accent border
    slide.addShape("rect", {
      x, y, w: 4, h: 0.06,
      fill: { color: kpiColor },
    });
    // Label
    slide.addText(kpi.label.toUpperCase(), {
      x: x + 0.3, y: y + 0.2, w: 3.4, h: 0.25,
      fontSize: 10, bold: true, color: theme.textDim, fontFace: "Calibri",
    });
    // Value
    slide.addText(kpi.value, {
      x: x + 0.3, y: y + 0.45, w: 3.4, h: 0.6,
      fontSize: 42, bold: true, color: kpiColor, fontFace: "Calibri",
    });
    // Unit + trend
    slide.addText(`${kpi.unit}  ·  ${kpi.trend}`, {
      x: x + 0.3, y: y + 1.05, w: 3.4, h: 0.25,
      fontSize: 9, color: theme.textDim, fontFace: "Calibri",
    });
  });

  addFooter(slide, theme, new Date().toISOString().split("T")[0]);
}

export function addTableSlide(
  pptx: PptxGenJS,
  data: { title: string; headers: string[]; rows: string[][] },
  theme: PptxTheme
) {
  const slide = pptx.addSlide();
  slide.background = { fill: { type: "solid", color: theme.background } };
  slide.addText(data.title, {
    x: 0.5, y: 0.4, w: 9, h: 0.5,
    fontSize: 28, bold: true, color: theme.text, fontFace: "Calibri",
  });
  addAccentBar(slide, theme);

  const tableRows: PptxGenJS.TableRow[] = [];

  // Header row
  tableRows.push(
    data.headers.map((h) => ({
      text: h.toUpperCase(),
      options: {
        bold: true, fontSize: 9, color: "FFFFFF", fill: { color: theme.headerBg },
        fontFace: "Calibri",
      },
    }))
  );

  // Data rows
  data.rows.forEach((row, rowIdx) => {
    tableRows.push(
      row.map((cell) => ({
        text: cell,
        options: {
          fontSize: 11, color: theme.text,
          fill: { color: rowIdx % 2 === 0 ? theme.background : theme.backgroundAlt },
          fontFace: "Calibri",
        },
      }))
    );
  });

  slide.addTable(tableRows, {
    x: 0.5, y: 1.2, w: 9,
    border: { type: "solid", pt: 0.5, color: theme.backgroundAlt },
    colW: Array(data.headers.length).fill(9 / data.headers.length),
  });

  addFooter(slide, theme, new Date().toISOString().split("T")[0]);
}

export function addBarSlide(
  pptx: PptxGenJS,
  data: { title: string; bars: { label: string; value: number; max: number; color?: string }[] },
  theme: PptxTheme
) {
  const slide = pptx.addSlide();
  slide.background = { fill: { type: "solid", color: theme.background } };
  slide.addText(data.title, {
    x: 0.5, y: 0.4, w: 9, h: 0.5,
    fontSize: 28, bold: true, color: theme.text, fontFace: "Calibri",
  });
  addAccentBar(slide, theme);

  data.bars.forEach((bar, i) => {
    const y = 1.3 + i * 0.7;
    const pct = Math.min(bar.value / bar.max, 1);
    const barColor = bar.color || theme.aqua;

    // Label
    slide.addText(bar.label, {
      x: 0.5, y, w: 2.5, h: 0.4,
      fontSize: 12, color: theme.text, fontFace: "Calibri",
    });
    // Track
    slide.addShape("rect", {
      x: 3.2, y: y + 0.08, w: 5.5, h: 0.25,
      fill: { color: theme.backgroundAlt }, rectRadius: 0.05,
    });
    // Fill
    slide.addShape("rect", {
      x: 3.2, y: y + 0.08, w: 5.5 * pct, h: 0.25,
      fill: { color: barColor }, rectRadius: 0.05,
    });
    // Value
    slide.addText(String(bar.value), {
      x: 8.8, y, w: 1, h: 0.4,
      fontSize: 12, bold: true, color: barColor, fontFace: "Calibri", align: "right",
    });
  });

  addFooter(slide, theme, new Date().toISOString().split("T")[0]);
}

export function addBigNumberSlide(
  pptx: PptxGenJS,
  data: { title: string; number: string; subtitle: string; color: string; breakdown?: { label: string; value: number }[] },
  theme: PptxTheme
) {
  const slide = pptx.addSlide();
  slide.background = { fill: { type: "solid", color: theme.background } };
  slide.addText(data.title, {
    x: 0.5, y: 0.4, w: 9, h: 0.5,
    fontSize: 28, bold: true, color: theme.text, fontFace: "Calibri",
  });
  addAccentBar(slide, theme);

  slide.addText(data.number, {
    x: 0.5, y: 1.5, w: 9, h: 1.5,
    fontSize: 72, bold: true, color: data.color || theme.red, fontFace: "Calibri", align: "center",
  });
  slide.addText(data.subtitle, {
    x: 0.5, y: 3.0, w: 9, h: 0.4,
    fontSize: 16, color: theme.textDim, fontFace: "Calibri", align: "center",
  });

  if (data.breakdown) {
    data.breakdown.forEach((item, i) => {
      slide.addText(`${item.label}: ${item.value}`, {
        x: 2.5, y: 3.8 + i * 0.35, w: 5, h: 0.3,
        fontSize: 12, color: theme.textDim, fontFace: "Calibri", align: "center",
      });
    });
  }

  addFooter(slide, theme, new Date().toISOString().split("T")[0]);
}

export function addTextSlide(
  pptx: PptxGenJS,
  data: { title: string; body: string },
  theme: PptxTheme
) {
  const slide = pptx.addSlide();
  slide.background = { fill: { type: "solid", color: theme.background } };
  slide.addText(data.title, {
    x: 0.5, y: 0.4, w: 9, h: 0.5,
    fontSize: 28, bold: true, color: theme.text, fontFace: "Calibri",
  });
  addAccentBar(slide, theme);
  slide.addText(data.body, {
    x: 0.5, y: 1.2, w: 9, h: 3.5,
    fontSize: 16, color: theme.text, fontFace: "Calibri", lineSpacing: 24,
  });
  addFooter(slide, theme, new Date().toISOString().split("T")[0]);
}

// ─── Main Export Function ───────────────────────────────

export function generateDeck(
  slides: { blockId: string; data: unknown }[],
  theme: PptxTheme = jellyfishDark,
  titleData: { title: string; subtitle: string } = { title: "Engineering Metrics Report", subtitle: "Generated by Jellyfish Compass" }
): PptxGenJS {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE"; // 16:9
  pptx.author = "Jellyfish Compass";

  const date = new Date().toISOString().split("T")[0];

  for (const slide of slides) {
    switch (slide.blockId) {
      case "title":
        addTitleSlide(pptx, { ...titleData, date }, theme);
        break;
      case "sprint-kpis":
        addKpiSlide(pptx, slide.data as { label: string; value: string; unit: string; trend: string; color: string }[], theme);
        break;
      case "sprint-history":
      case "delivery-status":
      case "team-allocation":
      case "capacity-gaps":
      case "benchmarks":
        addTableSlide(pptx, slide.data as { title: string; headers: string[]; rows: string[][] }, theme);
        break;
      case "scope-effort":
      case "allocation-fte":
      case "devex-index":
        addBarSlide(pptx, slide.data as { title: string; bars: { label: string; value: number; max: number; color?: string }[] }, theme);
        break;
      case "unlinked-prs":
        addBigNumberSlide(pptx, slide.data as { title: string; number: string; subtitle: string; color: string; breakdown?: { label: string; value: number }[] }, theme);
        break;
      case "dora-metrics":
      case "custom-text":
        addTextSlide(pptx, slide.data as { title: string; body: string }, theme);
        break;
    }
  }

  return pptx;
}
```

- [ ] **Step 2: Verify typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add lib/export-pptx.ts
git commit -m "feat: PPTX generation engine — 6 slide types with Jellyfish branding

Title, KPI, Table, Bar, Big Number, Text slide builders.
generateDeck() orchestrates slides from block list + theme.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Build UI components

**Files:**
- Create: `components/metrics/template-picker.tsx`
- Create: `components/metrics/slide-list.tsx`
- Create: `components/metrics/slide-preview.tsx`
- Create: `components/metrics/slide-blocks.tsx`
- Create: `components/metrics/data-source-toggle.tsx`
- Create: `components/metrics/export-button.tsx`

- [ ] **Step 1: Create all 6 components**

Each component is focused on one responsibility. Read the spec for the exact behavior.

**template-picker.tsx** — Renders 9 template pills grouped by ceremony/audience. Clicking a template calls `onSelect(templateId)`.

**slide-list.tsx** — Draggable list of active slides using @dnd-kit. Each item shows block label, description, and a toggle checkbox. Drag handle for reorder. Uses `@dnd-kit/sortable`.

**slide-preview.tsx** — Right panel showing 16:9 aspect ratio preview of the selected slide. Shows "Slide N of M — {label}" header. Prev/Next buttons.

**slide-blocks.tsx** — Preview renderers for each of the 13 slide block types. Each takes the block's data and renders it as HTML (not PPTX — this is the web preview). Uses existing components (StatCard, DataTable, ProgressBar, Badge).

**data-source-toggle.tsx** — 3-option toggle: Mock (default), API (shows token input), MCP (shows URL input). Calls `onSourceChange`.

**export-button.tsx** — Button with theme picker dropdown (Dark/Light/Custom). Loading state during generation. Calls `onExport(theme)`.

Each component is a client component. They receive data and callbacks via props — no internal state management beyond UI concerns (like which template pill is hovered).

- [ ] **Step 2: Verify typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/metrics/
git commit -m "feat: PPTX builder UI components — template picker, slide list, preview, export

6 components: template-picker, slide-list, slide-preview,
slide-blocks, data-source-toggle, export-button.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Build the metrics page

**Files:**
- Create: `app/metrics/page.tsx`

- [ ] **Step 1: Build the main page**

Client component that wires together all components. Manages the `BuilderState` from the spec:

```typescript
type BuilderState = {
  template: string | null;
  slides: SlideBlockId[];
  selectedSlide: number;
  dataSource: "mock" | "api" | "mcp";
  token: string;
  mcpUrl: string;
  liveData: Record<string, unknown>;
  loading: boolean;
  exportTheme: "dark" | "light";
  titleText: string;
  subtitleText: string;
  customText: Record<string, { title: string; body: string }>;
};
```

Layout:
- PageHero at top
- Data source toggle + export button row
- Side-by-side: left panel (template picker + slide list), right panel (slide preview)
- Mobile: stacks vertically

The page contains a `getMockDataForBlock(blockId)` function that maps each block ID to the corresponding mock data from `data/mock-data.ts`, formatted for both the preview renderer and the PPTX generator.

Export flow:
1. User clicks Export
2. Page builds a `{ blockId, data }[]` array from active slides + current data
3. Calls `generateDeck(slides, theme)`
4. Calls `pptx.writeFile({ fileName: "jellyfish-metrics-YYYY-MM-DD.pptx" })`

- [ ] **Step 2: Verify typecheck and build**

```bash
npx tsc --noEmit && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add app/metrics/
git commit -m "feat: PPTX builder page — template picker, drag-to-reorder, preview, export

Side-by-side layout with 9 templates, 13 slide blocks,
mock/API/MCP data sources, branded PPTX export.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Navigation update

**Files:**
- Modify: `lib/types.ts`
- Modify: `components/layout/site-header.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Add "metrics" to SectionId**

In `lib/types.ts`, add `| "metrics"` to the SectionId union.

- [ ] **Step 2: Add to header nav**

In `components/layout/site-header.tsx`, add to the Knowledge navGroup items:

```typescript
{ href: "/metrics", label: "Deck Builder" },
```

Add it before Reference and Academy.

- [ ] **Step 3: Add to landing page**

In `app/page.tsx`, add to the Knowledge sectionGroup items:

```typescript
{ href: "/metrics", label: "Deck Builder", desc: "Build branded PPTX from Jellyfish metrics" },
```

Add the icon to `sectionIcons`:
```typescript
"/metrics": <Presentation className="w-5 h-5 text-amber" />,
```

Import `Presentation` from `lucide-react`.

- [ ] **Step 4: Verify build**

```bash
npx tsc --noEmit && npm run build
```

- [ ] **Step 5: Commit and push**

```bash
git add -A
git commit -m "feat: add Deck Builder to navigation — /metrics route in Knowledge group

Closes #85, #86, #94

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
git push
```

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Install dependencies | `package.json` |
| 2 | Slide templates + brand themes | `data/slide-templates.ts`, `lib/export-pptx-themes.ts` |
| 3 | PPTX generation engine | `lib/export-pptx.ts` |
| 4 | UI components (6) | `components/metrics/*.tsx` |
| 5 | Main builder page | `app/metrics/page.tsx` |
| 6 | Navigation update | `lib/types.ts`, header, landing page |
