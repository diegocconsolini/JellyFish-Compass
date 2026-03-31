# Academy Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge Playbooks, Workspace, and Showcase into Academy as tabs, creating a single learning hub with modernized UI/UX and verified Jellyfish data.

**Architecture:** Convert Academy from a server component to a tabbed client component with 4 tabs (Modules, Playbooks, Workspace, Showcase). Remove 3 standalone pages and update navigation from 10 to 7 items. The landing page section grid updates from 10 to 7 cards.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, Lucide icons, existing component library (GuideBox, Badge, StatCard, DataTable, ProgressBar, SectionBlock).

**GitHub Issue:** #37

---

## File Structure

```
app/
  academy/page.tsx              ← REWRITE: tabbed client component with 4 tabs
  playbooks/page.tsx            ← DELETE
  workspace/page.tsx            ← DELETE
  showcase/page.tsx             ← DELETE
  page.tsx                      ← MODIFY: update section grid from 10 to 7
data/
  navigation.ts                 ← MODIFY: remove 3 items from secondaryNav
```

---

### Task 1: Update navigation — remove Playbooks, Workspace, Showcase

**Files:**
- Modify: `data/navigation.ts`

- [ ] **Step 1: Replace secondaryNav**

Replace the entire content of `data/navigation.ts`:

```typescript
import { NavItem } from "@/lib/types";

export const primaryNav: NavItem[] = [
  { href: "/sprint-health", label: "Sprint Health", section: "sprint-health" },
  { href: "/delivery", label: "Delivery", section: "delivery" },
  { href: "/allocation", label: "Allocation", section: "allocation" },
  { href: "/devex", label: "DevEx", section: "devex" },
  { href: "/people-teams", label: "People & Teams", section: "people-teams" },
  { href: "/reference", label: "Reference", section: "reference" },
];

export const secondaryNav: NavItem[] = [
  { href: "/academy", label: "Academy", section: "academy" },
];
```

- [ ] **Step 2: Verify typecheck**

```bash
npx tsc --noEmit
```

Expected: clean (header component imports primaryNav + secondaryNav, both still exist).

- [ ] **Step 3: Commit**

```bash
git add data/navigation.ts
git commit -m "refactor: remove Playbooks/Workspace/Showcase from nav — now Academy sub-tabs

Closes part of #37

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Update landing page — 7 sections instead of 10

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update the sections array and sectionIcons**

In `app/page.tsx`, replace the `sectionIcons` object and `sections` array. Remove the Playbooks, Workspace, Showcase entries. Update Academy description to mention it's a learning hub with playbooks and workspace.

Replace `sectionIcons`:

```typescript
const sectionIcons: Record<string, React.ReactNode> = {
  "/sprint-health": <Activity className="w-5 h-5 text-blue" />,
  "/delivery": <Rocket className="w-5 h-5 text-green" />,
  "/allocation": <Scale className="w-5 h-5 text-amber" />,
  "/devex": <Code2 className="w-5 h-5 text-violet" />,
  "/people-teams": <Users className="w-5 h-5 text-cyan" />,
  "/reference": <BookOpen className="w-5 h-5 text-blue" />,
  "/academy": <GraduationCap className="w-5 h-5 text-green" />,
};
```

Replace `sections`:

```typescript
const sections = [
  { href: "/sprint-health", label: "Sprint Health", desc: "Velocity, completion, carry-over trends", primary: true },
  { href: "/delivery", label: "Delivery", desc: "Scope, effort, deliverable tracking" },
  { href: "/allocation", label: "Allocation", desc: "FTE by investment, team, person" },
  { href: "/devex", label: "DevEx", desc: "Developer experience & unlinked PRs" },
  { href: "/people-teams", label: "People & Teams", desc: "Roster, hierarchy, search" },
  { href: "/reference", label: "Reference", desc: "25 endpoints, MCP, DORA, integrations" },
  { href: "/academy", label: "Academy", desc: "Learning hub — modules, playbooks, workspace, showcase" },
];
```

- [ ] **Step 2: Update section heading text**

Change `"All 10 sections"` to `"All sections"` and update subtitle:

```tsx
<h2 className="text-xl font-bold mb-1">All sections</h2>
<p className="text-sm text-text-dim mb-5">
  Six data dashboards plus a learning hub with playbooks, workspace, and showcase.
</p>
```

- [ ] **Step 3: Update grid from 5-col to 4-col for 7 items**

Change the grid class. The first row gets 4 items, second row gets 3:

```tsx
<div className="grid grid-cols-4 gap-2.5">
```

- [ ] **Step 4: Remove unused Lucide imports**

Remove `ClipboardList`, `Save`, `Sparkles` from the import statement since those sections are gone.

- [ ] **Step 5: Verify typecheck and build**

```bash
npx tsc --noEmit && npm run build
```

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx
git commit -m "refactor: update landing page — 7 sections, Academy as learning hub

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Rewrite Academy as tabbed learning hub

**Files:**
- Rewrite: `app/academy/page.tsx`

This is the main task. The new Academy page is a client component with 4 tabs: Modules, Playbooks, Workspace, Showcase.

- [ ] **Step 1: Write the complete Academy page**

Replace `app/academy/page.tsx` entirely. The page must:

**Imports:**
- `"use client"` directive
- `useState`, `useEffect` from React
- `PageHero` from `@/components/ui/page-hero`
- `SectionBlock` from `@/components/ui/section-block`
- `Badge` from `@/components/ui/badge`
- `GuideBox` from `@/components/ui/guide-box`
- `StatCard` from `@/components/ui/stat-card`
- `DataTable` from `@/components/ui/data-table`
- `metrics` from `@/data/metrics`
- `playbooks` from `@/data/playbooks`
- `BookOpen`, `ClipboardList`, `Save`, `Sparkles` from `lucide-react`

**Tab state:**
```tsx
type TabId = "modules" | "playbooks" | "workspace" | "showcase";
const [activeTab, setActiveTab] = useState<TabId>("modules");
```

**Tab bar UI:** 4 buttons in a row, styled like the Reference page section selector (rounded-full pills, active = bg-blue-dim text-blue border-blue/30, inactive = bg-surface-raised border-border text-text-ghost). Each tab has a Lucide icon + label:
- BookOpen + "Modules"
- ClipboardList + "Playbooks"
- Save + "Workspace"
- Sparkles + "Showcase"

**PageHero:** eyebrow "Academy", title "Learning hub", subtitle "for Scrum Masters", intro about the Academy being a single destination for learning, workflows, saved work, and platform capabilities.

**Modules tab content (activeTab === "modules"):**

1. GuideBox "Getting Started" — same content as current Academy page
2. SectionBlock "Learning modules" — 4 module cards in grid-cols-2, each card (bg-surface rounded-xl border p-5) with:
   - Title bold
   - Description
   - "Related" label + badges linking to relevant pages (e.g., "Sprint Health", "Delivery" for the delivery module)
3. SectionBlock "Core metrics" — 4 metric cards from `data/metrics.ts` in grid-cols-2, each showing:
   - Badge for category (blue=DORA, green=DevEx, amber=Business Alignment, red=Delivery Hygiene)
   - Name bold
   - whyItMatters paragraph
   - "Scrum Master angle:" + scrumUse

**Modules data (inline in the file):**
```typescript
const modules = [
  {
    title: "Jellyfish fundamentals",
    description: "Understand what Jellyfish measures, how platform areas connect, and why Scrum Masters should read metrics as workflow signals rather than isolated dashboards.",
    related: [{ label: "Reference", href: "/reference" }, { label: "Showcase", variant: "showcase" as const }],
  },
  {
    title: "Delivery and scope",
    description: "Learn deliverables, scope and effort history, sprint health, and how to spot bottlenecks or creeping scope in practice.",
    related: [{ label: "Sprint Health", href: "/sprint-health" }, { label: "Delivery", href: "/delivery" }],
  },
  {
    title: "Allocations and FTE",
    description: "Ground allocation concepts in focus, KTLO pressure, and realistic planning conversations.",
    related: [{ label: "Allocation", href: "/allocation" }],
  },
  {
    title: "DevEx and AI impact",
    description: "See how experience, workflow friction, and AI tooling adoption fit into a broader operating model.",
    related: [{ label: "DevEx", href: "/devex" }],
  },
];
```

**Playbooks tab content (activeTab === "playbooks"):**

1. GuideBox "How playbooks work" — same content as current Playbooks page
2. 3 playbook cards from `data/playbooks.ts` in grid-cols-1 (full width, stacked). Each card:
   - Title bold text-base
   - Goal paragraph
   - "Outputs:" label + output badges (blue)
   - "Steps:" label + ordered list with numbered steps
   - Each step: text-sm text-text-dim, mb-2
3. SectionBlock "Implementation principles" — 2 cards in grid-cols-2 (Structured and calm, Action-oriented) — same content as current Playbooks page

**Workspace tab content (activeTab === "workspace"):**

Full workspace functionality from current `workspace/page.tsx`:
- ARTIFACT_TYPES constant (6 types with localStorage keys)
- useState for items and inputs
- useEffect to load from localStorage on mount
- addItem, removeItem, clearType functions
- 6 artifact cards in grid-cols-3 with add/remove/clear UI

Copy the entire workspace logic from the current file. The only change: remove PageHero (the Academy PageHero covers it), and add a GuideBox at the top instead.

**Showcase tab content (activeTab === "showcase"):**

1. GuideBox "How this connects" — same as current Showcase page
2. SectionBlock "Capability stories" — 4 audience cards in grid-cols-2 with colored top borders and badges (same data as current Showcase)
3. SectionBlock "Platform-reported outcomes" — 4 StatCards in grid-cols-4 (32%, 2.6d, 21%, 25%)

Copy the audienceCards data and StatCard rendering from the current Showcase page.

**Wrapper:** `<div className="max-w-[1440px] mx-auto px-7 py-7">`

- [ ] **Step 2: Verify typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/academy/page.tsx
git commit -m "feat: rewrite Academy as tabbed learning hub — modules, playbooks, workspace, showcase

Closes #37

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Delete old standalone pages

**Files:**
- Delete: `app/playbooks/page.tsx`
- Delete: `app/workspace/page.tsx`
- Delete: `app/showcase/page.tsx`

- [ ] **Step 1: Delete the files**

```bash
rm app/playbooks/page.tsx app/workspace/page.tsx app/showcase/page.tsx
rmdir app/playbooks app/workspace app/showcase
```

- [ ] **Step 2: Verify build**

```bash
npx tsc --noEmit && npm run build
```

Expected: 9 routes instead of 12. Routes `/playbooks`, `/workspace`, `/showcase` should no longer appear.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove standalone Playbooks/Workspace/Showcase pages — absorbed into Academy

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Update SectionId type

**Files:**
- Modify: `lib/types.ts`

- [ ] **Step 1: Remove playbooks, workspace, showcase from SectionId**

In `lib/types.ts`, update the SectionId union type:

```typescript
export type SectionId =
  | "sprint-health"
  | "delivery"
  | "allocation"
  | "devex"
  | "people-teams"
  | "reference"
  | "academy";
```

- [ ] **Step 2: Verify typecheck**

```bash
npx tsc --noEmit
```

If any file still references the old SectionId values, fix them.

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "refactor: remove unused SectionId values for deleted pages

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Final verification and push

**Files:** None (verification only)

- [ ] **Step 1: Full build**

```bash
npm run build
```

Expected output: 9 static routes:
- `/`, `/_not-found`, `/academy`, `/allocation`, `/delivery`, `/devex`, `/people-teams`, `/reference`, `/sprint-health`

- [ ] **Step 2: Start dev server and smoke test**

```bash
npm run dev
```

Verify:
- Header shows 7 nav items (6 primary + Academy)
- `/academy` loads with 4 tabs
- Clicking each tab shows correct content
- Workspace tab persists items in localStorage
- Old routes (`/playbooks`, `/workspace`, `/showcase`) show 404
- Landing page shows 7 section cards

- [ ] **Step 3: Push**

```bash
git push
```

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Update navigation (10 → 7 items) | `data/navigation.ts` |
| 2 | Update landing page grid | `app/page.tsx` |
| 3 | Rewrite Academy as tabbed hub | `app/academy/page.tsx` |
| 4 | Delete old standalone pages | `app/playbooks/`, `app/workspace/`, `app/showcase/` |
| 5 | Clean up SectionId type | `lib/types.ts` |
| 6 | Final verification and push | — |
