# Jellyfish Compass v2 — Full Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Jellyfish Compass as a modern 10-page dashboard app merging all 6 JSX prototype tabs + 4 existing pages, with Tailwind + shadcn/ui, dark/light mode, and a live+mock API explorer.

**Architecture:** Next.js 15 App Router with Tailwind CSS + shadcn/ui component library. Global theme provider for dark/light mode. Shared ApiExplorer client component with mock/live toggle. All 25 JSX endpoints + mock data ported to typed data layer. Each page is a standalone route with guide boxes, data visualizations, and embedded API explorer sections.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, next-themes, DM Sans + JetBrains Mono + Instrument Serif fonts.

**Design Reference:** `public/mockup.html` — dark dashboard aesthetic, frosted glass header, colored stat cards, gradient progress bars, syntax-highlighted JSON output.

---

## File Structure

```
app/
  layout.tsx                    ← MODIFY: new theme provider, fonts, metadata
  globals.css                   ← REWRITE: Tailwind imports + custom tokens
  page.tsx                      ← REWRITE: new home/dashboard page
  sprint-health/page.tsx        ← CREATE: Sprint Health (JSX SprintHealthTab)
  delivery/page.tsx             ← CREATE: Delivery Tracking (JSX DeliveryTab)
  allocation/page.tsx           ← CREATE: Allocation (JSX AllocationTab)
  devex/page.tsx                ← CREATE: DevEx (JSX DevExTab)
  people-teams/page.tsx         ← CREATE: People & Teams (JSX PeopleTeamsTab)
  reference/page.tsx            ← REWRITE: Reference (JSX ReferenceTab — 11 subsections)
  academy/page.tsx              ← REWRITE: modernized with new components
  playbooks/page.tsx            ← REWRITE: modernized with new components
  workspace/page.tsx            ← REWRITE: functional with localStorage
  showcase/page.tsx             ← REWRITE: modernized with new components
components/
  layout/
    site-header.tsx             ← REWRITE: frosted glass, 10 nav items, theme toggle, API status
    site-footer.tsx             ← REWRITE: modernized footer
  ui/
    theme-provider.tsx          ← CREATE: next-themes wrapper
    page-hero.tsx               ← REWRITE: new typography, eyebrow style
    section-block.tsx           ← REWRITE: tailwind classes
    stat-card.tsx               ← REWRITE: colored borders, trends
    guide-box.tsx               ← CREATE: blue tinted guide with icon
    data-table.tsx              ← CREATE: styled table component
    bar-chart.tsx               ← CREATE: CSS bar chart
    progress-bar.tsx            ← CREATE: allocation/devex gradient bars
    badge.tsx                   ← CREATE: colored pill badges
    api-explorer.tsx            ← CREATE: full API explorer with mock/live toggle
    api-panel.tsx               ← CREATE: token input + connection test
    endpoint-pills.tsx          ← CREATE: endpoint selector pills
    json-viewer.tsx             ← CREATE: syntax-highlighted JSON output
    mock-bar.tsx                ← CREATE: horizontal bar with label/value
    content-card.tsx            ← REWRITE: tailwind
data/
  navigation.ts                 ← REWRITE: 10 nav items with sections
  endpoints-full.ts             ← CREATE: all 25 endpoints from JSX grouped by domain
  mock-data.ts                  ← CREATE: all mock sprint/delivery/allocation/devex data
  dora-metrics.ts               ← CREATE: 4 DORA metric definitions
  frameworks.ts                 ← CREATE: 4 framework definitions
  integrations.ts               ← CREATE: 5 integration categories (33 tools)
  platform-features.ts          ← CREATE: 6 feature categories
  highlights.ts                 ← MODIFY: updated paths
  metrics.ts                    ← KEEP
  playbooks.ts                  ← KEEP
  examples.ts                   ← KEEP
  endpoints.ts                  ← KEEP (seed catalog, reference page uses endpoints-full)
lib/
  types.ts                      ← MODIFY: add new types for endpoints, mock data, etc.
  api-client.ts                 ← CREATE: fetch wrapper for Jellyfish API
  constants.ts                  ← CREATE: API_BASE, color tokens
  theme.ts                      ← CREATE: dark/light CSS variable maps
```

---

### Task 1: Install Tailwind CSS + shadcn/ui + next-themes

**Files:**
- Modify: `package.json`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `tsconfig.json`
- Create: `components/ui/theme-provider.tsx`

- [ ] **Step 1: Install dependencies**

```bash
npm install tailwindcss @tailwindcss/postcss postcss next-themes class-variance-authority clsx tailwind-merge lucide-react
npx shadcn@latest init -d
```

When shadcn init asks questions, accept defaults (New York style, Zinc color, CSS variables: yes).

- [ ] **Step 2: Configure Tailwind CSS v4**

Replace `app/globals.css` with:

```css
@import "tailwindcss";

@theme {
  --font-sans: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-serif: 'Instrument Serif', Georgia, serif;

  --color-bg-deep: #06080d;
  --color-bg: #0b0f18;
  --color-surface: #111825;
  --color-surface-raised: #161f2e;
  --color-surface-overlay: #1b2638;
  --color-border: rgba(255,255,255,0.06);
  --color-border-vivid: rgba(255,255,255,0.1);
  --color-text-primary: #e8ecf4;
  --color-text-dim: #8b95a8;
  --color-text-ghost: #556275;
  --color-blue: #4f8ff7;
  --color-blue-dim: rgba(79,143,247,0.12);
  --color-blue-glow: rgba(79,143,247,0.06);
  --color-green: #34d399;
  --color-green-dim: rgba(52,211,153,0.12);
  --color-amber: #fbbf24;
  --color-amber-dim: rgba(251,191,36,0.1);
  --color-red: #f87171;
  --color-red-dim: rgba(248,113,113,0.1);
  --color-violet: #a78bfa;
  --color-violet-dim: rgba(167,139,250,0.1);
  --color-cyan: #22d3ee;
}

@layer base {
  * { @apply border-border; }
  body {
    @apply bg-bg text-text-primary font-sans antialiased;
  }
}
```

- [ ] **Step 3: Create theme provider**

Create `components/ui/theme-provider.tsx`:

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 4: Update layout.tsx with fonts and theme provider**

```tsx
import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { ReactNode } from "react";

import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/ui/theme-provider";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Jellyfish Compass",
  description: "Modern dashboard for Scrum Masters — metrics, API explorer, and guided workflows powered by Jellyfish.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${jetBrainsMono.variable}`}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```

Expected: Build succeeds (pages may show unstyled content — that's fine).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: install Tailwind CSS v4 + shadcn/ui + next-themes

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Port all data from JSX prototype

**Files:**
- Create: `data/endpoints-full.ts`
- Create: `data/mock-data.ts`
- Create: `data/dora-metrics.ts`
- Create: `data/frameworks.ts`
- Create: `data/integrations.ts`
- Create: `data/platform-features.ts`
- Create: `lib/constants.ts`
- Modify: `lib/types.ts`
- Modify: `data/navigation.ts`

- [ ] **Step 1: Extend types**

Add to `lib/types.ts`:

```typescript
export type SectionId =
  | "sprint-health"
  | "delivery"
  | "allocation"
  | "devex"
  | "people-teams"
  | "reference"
  | "academy"
  | "playbooks"
  | "workspace"
  | "showcase";

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
```

- [ ] **Step 2: Create constants**

Create `lib/constants.ts`:

```typescript
export const API_BASE = "https://app.jellyfish.co";
```

- [ ] **Step 3: Create endpoints-full.ts**

Create `data/endpoints-full.ts` — copy ALL 25 endpoints from JSX `ENDPOINTS` object, typed as `EndpointGroup[]`:

```typescript
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
```

- [ ] **Step 4: Create dora-metrics.ts, frameworks.ts, integrations.ts, platform-features.ts**

Create `data/dora-metrics.ts`:

```typescript
import { DoraMetric } from "@/lib/types";

export const doraMetrics: DoraMetric[] = [
  { name: "Deployment Frequency", desc: "Track how often the team pushes deployments. See the impact of process and tooling changes to ensure continuous improvement." },
  { name: "Lead Time for Changes", desc: "Understand the duration of your full value delivery cycle, from the moment a change is selected for development to its deployment." },
  { name: "Mean Time to Resolution", desc: "Measure the time from the start of an incident to its resolution, and minimize system downtime." },
  { name: "Change Failure Rate", desc: "Monitor the frequency of incidents or deployment failures to guarantee uninterrupted delivery of value to your customers." },
];
```

Create `data/frameworks.ts`:

```typescript
import { Framework } from "@/lib/types";

export const frameworks: Framework[] = [
  { name: "SPACE Framework", desc: "Satisfaction, Performance, Activity, Communication, Efficiency" },
  { name: "DevEx Index", desc: "Single score tracking developer experience over time" },
  { name: "AI Impact Framework", desc: "Data-driven model for AI adoption, productivity, and business outcomes" },
  { name: "SEI Maturity Model", desc: "Software Engineering Intelligence maturity assessment" },
];
```

Create `data/integrations.ts`:

```typescript
import { IntegrationCategory } from "@/lib/types";

export const integrations: IntegrationCategory[] = [
  { category: "AI Coding Tools", tools: ["GitHub Copilot", "Cursor", "Claude Code", "Windsurf", "Amazon Q Developer", "Gemini Code Assist", "Augment", "Baz", "Graphite", "Greptile"] },
  { category: "Issue Tracking", tools: ["Jira", "Linear", "Azure Boards", "Productboard", "Aha!", "ProductPlan"] },
  { category: "Source & CI/CD", tools: ["GitHub (Cloud & Enterprise)", "GitLab", "Bitbucket Cloud", "Bitbucket Server", "Azure DevOps", "Azure Repos", "Jenkins", "CircleCI", "Buildkite"] },
  { category: "Monitoring", tools: ["PagerDuty", "Opsgenie", "SonarQube", "CodeRabbit", "Sourcegraph"] },
  { category: "Collaboration", tools: ["Slack", "Google Sheets", "Google Calendar"] },
];
```

Create `data/platform-features.ts`:

```typescript
import { PlatformFeatureCategory } from "@/lib/types";

export const platformFeatures: PlatformFeatureCategory[] = [
  { category: "AI Impact", features: ["Drive Adoption", "Enable Teams", "Impact Insights", "Vendor Comparison", "Investment Management", "Workflow Optimization", "Report Builder"] },
  { category: "Operational Effectiveness", features: ["Metrics (DORA, flow, custom)", "Life Cycle Explorer", "Workflow Analysis", "People Management", "Team Benchmarks"] },
  { category: "Planning & Delivery", features: ["Capacity Planner", "Scenario Planner"] },
  { category: "Business Alignment", features: ["Resource Allocations (Patented Work Model)"] },
  { category: "DevEx", features: ["Research-backed surveys", "DevEx Index", "DORA/SPACE correlation", "Industry benchmarking", "AI-driven recommendations", "Automated tracking"] },
  { category: "DevFinOps", features: ["Software Capitalization"] },
];
```

- [ ] **Step 5: Create mock-data.ts**

Create `data/mock-data.ts` with all mock data from JSX:

```typescript
import { MockSprint, MockDeliverable, MockTeamAllocation, MockPersonAllocation } from "@/lib/types";

export const mockSprints: MockSprint[] = [
  { name: "Sprint 24", committed: 18, completed: 16, carryOver: 2, velocity: 62, points: 62 },
  { name: "Sprint 23", committed: 15, completed: 14, carryOver: 1, velocity: 54, points: 54 },
  { name: "Sprint 22", committed: 20, completed: 16, carryOver: 4, velocity: 51, points: 51 },
  { name: "Sprint 21", committed: 17, completed: 15, carryOver: 2, velocity: 58, points: 58 },
];

export const mockScopeEffort = [
  { week: "W1", scope: 38, effort: 32 },
  { week: "W2", scope: 42, effort: 40 },
  { week: "W3", scope: 35, effort: 36 },
  { week: "W4", scope: 50, effort: 45 },
  { week: "W5", scope: 40, effort: 42 },
  { week: "W6", scope: 55, effort: 50 },
  { week: "W7", scope: 47, effort: 49 },
  { week: "W8", scope: 60, effort: 55 },
];

export const mockDeliverables: MockDeliverable[] = [
  { name: "Auth Service Rewrite", category: "Epics", issues: 24, percentComplete: 78, status: "on-track" },
  { name: "Mobile App v3.0", category: "Epics", issues: 42, percentComplete: 45, status: "at-risk" },
  { name: "Data Pipeline Migration", category: "Initiatives", issues: 18, percentComplete: 92, status: "on-track" },
  { name: "API Rate Limiting", category: "Features", issues: 8, percentComplete: 30, status: "behind" },
];

export const mockInvestmentAllocation = [
  { label: "Feature Development", value: 12.4, max: 25, color: "blue" as const },
  { label: "Keep the Lights On", value: 5.8, max: 25, color: "amber" as const },
  { label: "Tech Debt", value: 3.2, max: 25, color: "violet" as const },
  { label: "Growth / Scaling", value: 2.1, max: 25, color: "green" as const },
  { label: "Unallocated", value: 1.5, max: 25, color: "ghost" as const },
];

export const mockTeamAllocations: MockTeamAllocation[] = [
  { team: "Platform", totalFte: 8.2, features: 52, ktlo: 28, techDebt: 20 },
  { team: "Mobile", totalFte: 6.1, features: 45, ktlo: 35, techDebt: 20 },
  { team: "Data", totalFte: 5.4, features: 60, ktlo: 20, techDebt: 20 },
  { team: "Frontend", totalFte: 5.3, features: 48, ktlo: 32, techDebt: 20 },
];

export const mockPersonAllocations: MockPersonAllocation[] = [
  { name: "A. Santos", fte: 1.0, primaryCategory: "Features", spreadCount: 2 },
  { name: "B. Kim", fte: 0.9, primaryCategory: "KTLO", spreadCount: 4, flag: "High spread" },
  { name: "C. Patel", fte: 1.0, primaryCategory: "Features", spreadCount: 1 },
  { name: "D. Chen", fte: 0.6, primaryCategory: "Tech Debt", spreadCount: 3, flag: "Under-allocated" },
];

export const mockDevExScores = [
  { team: "Frontend", score: 81, color: "green" as const },
  { team: "Platform", score: 78, color: "blue" as const },
  { team: "Data", score: 72, color: "blue" as const },
  { team: "Mobile", score: 65, color: "amber" as const },
];

export const mockUnlinkedPrs = {
  total: 23,
  byTeam: [
    { team: "Platform", count: 9, color: "red" as const },
    { team: "Mobile", count: 7, color: "red" as const },
    { team: "Data", count: 4, color: "amber" as const },
    { team: "Frontend", count: 3, color: "blue" as const },
  ],
};

export const mockSprintKpis = {
  avgVelocity: { value: "56.3", unit: "story points / sprint", trend: "+12% vs last quarter", direction: "up" as const },
  completionRate: { value: "88%", unit: "committed vs completed", trend: "+5% improvement", direction: "up" as const },
  carryOver: { value: "3.0", unit: "avg items / sprint", trend: "watch threshold", direction: "down" as const },
  sprintCadence: { value: "2w", unit: "consistent cadence", trend: "stable", direction: "up" as const },
};
```

- [ ] **Step 6: Update navigation**

Rewrite `data/navigation.ts`:

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
  { href: "/playbooks", label: "Playbooks", section: "playbooks" },
  { href: "/workspace", label: "Workspace", section: "workspace" },
  { href: "/showcase", label: "Showcase", section: "showcase" },
];
```

- [ ] **Step 7: Verify typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: port all JSX data — 25 endpoints, DORA, frameworks, integrations, mock data

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Build shared UI components

**Files:**
- Create: `components/ui/guide-box.tsx`
- Create: `components/ui/badge.tsx`
- Create: `components/ui/data-table.tsx`
- Create: `components/ui/bar-chart.tsx`
- Create: `components/ui/progress-bar.tsx`
- Create: `components/ui/json-viewer.tsx`
- Create: `components/ui/endpoint-pills.tsx`
- Rewrite: `components/ui/stat-card.tsx`
- Rewrite: `components/ui/page-hero.tsx`
- Rewrite: `components/ui/section-block.tsx`

- [ ] **Step 1: Create guide-box.tsx**

```tsx
type GuideBoxProps = {
  title: string;
  children: React.ReactNode;
};

export function GuideBox({ title, children }: GuideBoxProps) {
  return (
    <div className="rounded-xl border border-blue-dim bg-blue-glow p-5 mb-5">
      <div className="text-xs font-bold text-blue mb-1.5 flex items-center gap-1.5">
        <span>💡</span> {title}
      </div>
      <div className="text-sm text-text-dim leading-relaxed">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Create badge.tsx**

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold",
  {
    variants: {
      variant: {
        blue: "bg-blue-dim text-blue",
        green: "bg-green-dim text-green",
        amber: "bg-amber-dim text-amber",
        red: "bg-red-dim text-red",
        violet: "bg-violet-dim text-violet",
        ghost: "bg-surface-raised text-text-ghost",
      },
    },
    defaultVariants: { variant: "blue" },
  }
);

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ variant, className, ...props }: BadgeProps) {
  return <span className={badgeVariants({ variant, className })} {...props} />;
}
```

- [ ] **Step 3: Create stat-card.tsx**

```tsx
type StatCardProps = {
  label: string;
  value: string;
  note: string;
  trend?: string;
  trendDirection?: "up" | "down";
  color: "blue" | "green" | "amber" | "violet";
};

const topBorderColors = {
  blue: "from-blue to-cyan",
  green: "from-green to-emerald-300",
  amber: "from-amber to-yellow-300",
  violet: "from-violet to-purple-300",
};

const valueColors = {
  blue: "text-blue",
  green: "text-green",
  amber: "text-amber",
  violet: "text-violet",
};

const trendStyles = {
  up: "text-green bg-green-dim",
  down: "text-red bg-red-dim",
};

export function StatCard({ label, value, note, trend, trendDirection, color }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-5">
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${topBorderColors[color]}`} />
      <div className="text-[11px] font-semibold uppercase tracking-wider text-text-ghost mb-2">
        {label}
      </div>
      <div className={`text-3xl font-extrabold tracking-tight ${valueColors[color]}`}>
        {value}
      </div>
      <div className="text-[11px] text-text-ghost mt-1">{note}</div>
      {trend && trendDirection && (
        <div className={`inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded mt-1.5 ${trendStyles[trendDirection]}`}>
          {trendDirection === "up" ? "↑" : "↓"} {trend}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create data-table.tsx**

```tsx
type DataTableProps = {
  headers: string[];
  rows: React.ReactNode[][];
};

export function DataTable({ headers, rows }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} className="text-left text-[10.5px] font-semibold uppercase tracking-wider text-text-ghost px-3 py-2 border-b border-border-vivid">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2.5 text-sm border-b border-border">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 5: Create bar-chart.tsx**

```tsx
type BarChartProps = {
  data: { label: string; values: { height: number; className: string }[] }[];
  legend?: { label: string; className: string }[];
};

export function BarChart({ data, legend }: BarChartProps) {
  return (
    <div>
      <div className="flex items-end gap-1.5 h-[140px]">
        {data.map((col) => (
          <div key={col.label} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            {col.values.map((bar, i) => (
              <div key={i} className={`w-full rounded-t ${bar.className}`} style={{ height: `${bar.height}%` }} />
            ))}
            <div className="text-[10px] text-text-ghost">{col.label}</div>
          </div>
        ))}
      </div>
      {legend && (
        <div className="flex gap-3 mt-2.5 text-[11px] text-text-dim">
          {legend.map((l) => (
            <span key={l.label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-sm inline-block ${l.className}`} />
              {l.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Create progress-bar.tsx**

```tsx
const gradients = {
  blue: "from-blue to-cyan",
  green: "from-green to-emerald-300",
  amber: "from-amber to-yellow-300",
  red: "from-red to-red-300",
  violet: "from-violet to-purple-300",
  ghost: "from-text-ghost to-text-ghost",
};

type ProgressBarProps = {
  label: string;
  value: string;
  percent: number;
  color: keyof typeof gradients;
  valueColor?: string;
};

export function ProgressBar({ label, value, percent, color, valueColor }: ProgressBarProps) {
  return (
    <div className="mb-2.5">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-text-dim">{label}</span>
        <span className={`font-semibold font-mono text-xs ${valueColor || "text-text-primary"}`}>{value}</span>
      </div>
      <div className="h-1.5 bg-surface-overlay rounded-full overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${gradients[color]}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Create json-viewer.tsx**

```tsx
type JsonViewerProps = {
  data: unknown;
};

export function JsonViewer({ data }: JsonViewerProps) {
  const json = JSON.stringify(data, null, 2);
  return (
    <pre className="mt-3 bg-bg-deep border border-border rounded-lg p-4 max-h-[200px] overflow-auto font-mono text-[11.5px] text-[#c9d1d9] leading-relaxed">
      {json}
    </pre>
  );
}
```

- [ ] **Step 8: Create endpoint-pills.tsx**

```tsx
"use client";

import { JellyfishEndpoint } from "@/lib/types";

type EndpointPillsProps = {
  endpoints: JellyfishEndpoint[];
  selected: string | null;
  onSelect: (ep: JellyfishEndpoint) => void;
};

export function EndpointPills({ endpoints, selected, onSelect }: EndpointPillsProps) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-3.5">
      {endpoints.map((ep) => (
        <button
          key={ep.name}
          onClick={() => onSelect(ep)}
          className={`px-3 py-1.5 rounded-md font-mono text-[11.5px] font-medium border transition-all cursor-pointer ${
            selected === ep.name
              ? "bg-blue-dim border-blue/30 text-blue"
              : "bg-surface-raised border-border text-text-ghost hover:text-text-dim hover:border-border-vivid"
          }`}
        >
          {ep.name}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 9: Rewrite page-hero.tsx and section-block.tsx**

`components/ui/page-hero.tsx`:

```tsx
type PageHeroProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  intro?: string;
};

export function PageHero({ eyebrow, title, subtitle, intro }: PageHeroProps) {
  return (
    <div className="mb-6">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-blue mb-1.5">
        {eyebrow}
      </div>
      <h1 className="font-serif text-4xl font-normal tracking-tight">
        {title}
        {subtitle && <i className="text-text-dim"> {subtitle}</i>}
      </h1>
      {intro && <p className="text-text-dim text-[15px] mt-1.5 max-w-xl">{intro}</p>}
    </div>
  );
}
```

`components/ui/section-block.tsx`:

```tsx
import { ReactNode } from "react";

type SectionBlockProps = {
  title: string;
  copy?: string;
  children: ReactNode;
};

export function SectionBlock({ title, copy, children }: SectionBlockProps) {
  return (
    <section className="mb-5">
      <div className="mb-4">
        <h2 className="text-base font-bold">{title}</h2>
        {copy && <p className="text-sm text-text-dim mt-1">{copy}</p>}
      </div>
      {children}
    </section>
  );
}
```

- [ ] **Step 10: Verify build**

```bash
npm run build
```

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: build shared UI components — stat cards, tables, charts, badges, guide boxes

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Build API Explorer component + API client

**Files:**
- Create: `lib/api-client.ts`
- Create: `components/ui/api-explorer.tsx`
- Create: `components/ui/api-panel.tsx`

- [ ] **Step 1: Create API client**

Create `lib/api-client.ts`:

```typescript
import { API_BASE } from "./constants";

export async function testConnection(token: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${API_BASE}/endpoints/export/v0/teams/list_teams?hierarchy_level=1`,
      { headers: { Authorization: `Token ${token}` } }
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function callEndpoint(
  path: string,
  token: string,
  params: Record<string, string>
): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  try {
    const url = new URL(path, API_BASE);
    for (const [k, v] of Object.entries(params)) {
      if (v) url.searchParams.set(k, v);
    }
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Token ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      return { ok: true, data };
    }
    const text = await res.text();
    return { ok: false, error: `HTTP ${res.status}: ${text}` };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
```

- [ ] **Step 2: Create api-panel.tsx**

Create `components/ui/api-panel.tsx` — client component with token input and connection test:

```tsx
"use client";

import { useState } from "react";
import { testConnection } from "@/lib/api-client";
import { Badge } from "./badge";

type ApiPanelProps = {
  token: string;
  setToken: (t: string) => void;
};

export function ApiPanel({ token, setToken }: ApiPanelProps) {
  const [status, setStatus] = useState<null | "loading" | "connected" | "error">(null);

  async function handleConnect() {
    if (!token.trim()) { setStatus("error"); return; }
    setStatus("loading");
    const ok = await testConnection(token);
    setStatus(ok ? "connected" : "error");
  }

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-surface mb-5">
      <input
        type="password"
        placeholder="Jellyfish API token"
        value={token}
        onChange={(e) => { setToken(e.target.value); setStatus(null); }}
        className="flex-1 px-3 py-2 rounded-lg border border-border bg-bg text-sm font-mono text-text-primary placeholder:text-text-ghost outline-none focus:border-blue"
      />
      <button
        onClick={handleConnect}
        disabled={status === "loading"}
        className="px-4 py-2 rounded-lg bg-blue text-white text-sm font-semibold disabled:opacity-50 cursor-pointer"
      >
        {status === "loading" ? "Testing..." : "Connect"}
      </button>
      {status === "connected" && <Badge variant="green">Connected</Badge>}
      {status === "error" && <Badge variant="red">Failed</Badge>}
    </div>
  );
}
```

- [ ] **Step 3: Create api-explorer.tsx**

Create `components/ui/api-explorer.tsx`:

```tsx
"use client";

import { useState } from "react";
import { JellyfishEndpoint } from "@/lib/types";
import { callEndpoint } from "@/lib/api-client";
import { EndpointPills } from "./endpoint-pills";
import { JsonViewer } from "./json-viewer";
import { Badge } from "./badge";

type ApiExplorerProps = {
  token: string;
  endpoints: JellyfishEndpoint[];
  defaultParams?: Record<string, string>;
  getParams?: (ep: JellyfishEndpoint) => Record<string, string>;
  mockResponses?: Record<string, unknown>;
};

export function ApiExplorer({ token, endpoints, defaultParams, getParams, mockResponses }: ApiExplorerProps) {
  const [selected, setSelected] = useState<JellyfishEndpoint | null>(null);
  const [params, setParams] = useState<Record<string, string>>(defaultParams || {});
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [useMock, setUseMock] = useState(true);

  function handleSelect(ep: JellyfishEndpoint) {
    setSelected(ep);
    setResult(null);
    setError(null);
    const p = getParams ? getParams(ep) : defaultParams || {};
    setParams(p);
  }

  async function handleExecute() {
    if (!selected) return;

    if (useMock && mockResponses?.[selected.name]) {
      setResult(mockResponses[selected.name]);
      setError(null);
      return;
    }

    if (!token) {
      setError("Enter a Jellyfish API token above to use live mode.");
      return;
    }

    setLoading(true);
    const res = await callEndpoint(selected.path, token, params);
    setLoading(false);
    if (res.ok) {
      setResult(res.data);
      setError(null);
    } else {
      setError(res.error || "Request failed");
      setResult(null);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5 mb-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold">API Explorer</h3>
        <div className="flex items-center gap-2 text-[11.5px] text-text-ghost">
          <span>Mock</span>
          <button
            onClick={() => setUseMock(!useMock)}
            className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${useMock ? "bg-blue" : "bg-green shadow-[0_0_8px_rgba(52,211,153,.25)]"}`}
          >
            <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all shadow ${useMock ? "left-[3px]" : "right-[3px]"}`} />
          </button>
          <span className={useMock ? "text-blue font-semibold" : "text-green font-semibold"}>
            {useMock ? "Mock" : "Live"}
          </span>
        </div>
      </div>

      <EndpointPills endpoints={endpoints} selected={selected?.name || null} onSelect={handleSelect} />

      {selected && (
        <div className="rounded-xl border border-border-vivid bg-bg p-4">
          <div className="flex items-center gap-2 mb-3.5">
            <Badge variant="green">GET</Badge>
            <span className="font-mono text-sm text-text-dim">{selected.path}</span>
          </div>

          {Object.entries(params).map(([k, v]) => (
            <div key={k} className="flex gap-2.5 mb-1.5">
              <span className="font-mono text-[11.5px] font-semibold text-text-ghost w-24 pt-2 text-right">{k}</span>
              <input
                value={v}
                onChange={(e) => setParams((p) => ({ ...p, [k]: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-md border border-border bg-surface text-sm font-mono text-text-primary outline-none focus:border-blue"
              />
            </div>
          ))}

          <button
            onClick={handleExecute}
            disabled={loading}
            className="mt-2.5 px-5 py-2 rounded-lg bg-blue text-white text-sm font-semibold disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Calling..." : "▶ Execute"}
          </button>

          {error && (
            <div className="mt-3 p-3 rounded-lg bg-red-dim text-red text-sm">{error}</div>
          )}

          {result && <JsonViewer data={result} />}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: API Explorer with mock/live toggle, token panel, endpoint pills

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Build site header + footer

**Files:**
- Rewrite: `components/layout/site-header.tsx`
- Rewrite: `components/layout/site-footer.tsx`

- [ ] **Step 1: Rewrite site-header.tsx**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { primaryNav, secondaryNav } from "@/data/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/70 backdrop-blur-2xl backdrop-saturate-[1.6]">
      <div className="max-w-[1440px] mx-auto px-7 h-14 flex items-center gap-5">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue to-violet flex items-center justify-center text-sm">
            🪼
          </div>
          <span className="text-[15px] font-bold tracking-tight">
            Jellyfish <span className="text-blue">Compass</span>
          </span>
        </Link>

        <nav className="flex items-center gap-0.5 ml-3">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-lg text-[12.5px] font-medium whitespace-nowrap transition-all ${
                pathname === item.href
                  ? "text-text-primary bg-surface-raised shadow-sm"
                  : "text-text-ghost hover:text-text-dim hover:bg-white/[0.04]"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="w-px h-4 bg-border-vivid mx-1.5" />
          {secondaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-lg text-[12.5px] font-medium whitespace-nowrap transition-all ${
                pathname === item.href
                  ? "text-text-primary bg-surface-raised shadow-sm"
                  : "text-text-ghost hover:text-text-dim hover:bg-white/[0.04]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-8 h-8 rounded-lg border border-border-vivid bg-transparent text-text-dim flex items-center justify-center text-sm cursor-pointer hover:border-text-ghost transition-colors"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Rewrite site-footer.tsx**

```tsx
export function SiteFooter() {
  return (
    <footer className="border-t border-border py-5 px-7 text-center">
      <p className="text-[11.5px] text-text-ghost max-w-[1440px] mx-auto">
        Jellyfish Compass v2.0 &middot; Built with Next.js 15 + Tailwind + shadcn/ui &middot; All data verified from Jellyfish platform
      </p>
    </footer>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: frosted glass header with 10 nav items + dark/light toggle

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Build Home page

**Files:**
- Rewrite: `app/page.tsx`

- [ ] **Step 1: Rewrite home page**

Full dashboard home page with hero, quick stats, feature cards linking to all 10 sections. Show the 4 KPI cards from Sprint Health as a teaser, plus navigation cards for each section. Use StatCard, SectionBlock, and card layouts.

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: home page with dashboard hero, quick stats, section navigation

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Build Sprint Health page

**Files:**
- Create: `app/sprint-health/page.tsx`

- [ ] **Step 1: Build full Sprint Health page**

Port JSX `SprintHealthTab` as a Next.js page. Client component with:
- PageHero with eyebrow "Sprint Health"
- GuideBox "Scrum Master Guide: Sprint Metrics & Health"
- 4 StatCards: Avg Velocity, Completion Rate, Carry-Over, Cadence (from `mockSprintKpis`)
- DataTable with sprint history (from `mockSprints`)
- BarChart with velocity trend (from `mockScopeEffort`)
- ApiExplorer with 5 metrics endpoints, getParams function mapping endpoint name to params
- GuideBox "How to Use This in Your Sprint Ceremonies" with 4 sub-sections
- Mock responses for team_sprint_summary and team_metrics

- [ ] **Step 2: Commit**

```bash
git add app/sprint-health/
git commit -m "feat: Sprint Health page — KPIs, sprint table, velocity chart, API explorer

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Build Delivery page

**Files:**
- Create: `app/delivery/page.tsx`

- [ ] **Step 1: Build full Delivery page**

Port JSX `DeliveryTab`. Client component with:
- PageHero "Delivery Tracking"
- GuideBox "Scrum Master Guide: Delivery Tracking"
- BarChart with scope & effort trend (8 weeks from `mockScopeEffort`)
- DataTable with active deliverables (from `mockDeliverables`) — status column uses Badge
- ApiExplorer with 4 delivery endpoints
- GuideBox "Scrum Master Playbook: Delivery Insights" with scope creep, cross-sprint, stakeholder topics

- [ ] **Step 2: Commit**

```bash
git add app/delivery/
git commit -m "feat: Delivery page — scope/effort chart, deliverables table, API explorer

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Build Allocation page

**Files:**
- Create: `app/allocation/page.tsx`

- [ ] **Step 1: Build full Allocation page**

Port JSX `AllocationTab`. Client component with:
- PageHero "Team Allocation & Capacity"
- GuideBox "Scrum Master Guide: Team Allocation & Capacity"
- View mode toggle: "By Investment" | "By Team" | "By Person"
- Investment view: ProgressBar components for each category (from `mockInvestmentAllocation`)
- Team view: DataTable with team allocations (from `mockTeamAllocations`)
- Person view: DataTable with person allocations (from `mockPersonAllocations`) — flags as Badge
- ApiExplorer with first 5 allocation endpoints + "+6 more" indicator
- GuideBox "Scrum Master Playbook: Capacity Management"

- [ ] **Step 2: Commit**

```bash
git add app/allocation/
git commit -m "feat: Allocation page — investment/team/person views, progress bars, API explorer

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Build DevEx page

**Files:**
- Create: `app/devex/page.tsx`

- [ ] **Step 1: Build full DevEx page**

Port JSX `DevExTab`. Client component with:
- PageHero "Developer Experience & Blockers"
- GuideBox explaining DevEx Index + unlinked PRs
- Two-column: left = DevEx Index by team (ProgressBar from `mockDevExScores`), right = Unlinked PRs (big number 23 + team breakdown from `mockUnlinkedPrs`)
- DORA Metrics Reference section: 4 cards from `doraMetrics`
- ApiExplorer with devex + unlinked_pull_requests endpoints
- GuideBox "Scrum Master Playbook: DevEx & Unlinked Work"

- [ ] **Step 2: Commit**

```bash
git add app/devex/
git commit -m "feat: DevEx page — DevEx index, unlinked PRs, DORA reference, API explorer

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: Build People & Teams page

**Files:**
- Create: `app/people-teams/page.tsx`

- [ ] **Step 1: Build full People & Teams page**

Port JSX `PeopleTeamsTab`. Client component with:
- PageHero "People & Teams"
- GuideBox explaining roster/hierarchy use case
- Two-column: left = People Endpoints (list_engineers, search_people), right = Team Endpoints (list_teams, search_teams) — each with clickable endpoint rows
- ApiExplorer with people + teams endpoints, getParams mapping per endpoint
- GuideBox "Use Cases for Scrum Masters" with 3 use cases

- [ ] **Step 2: Commit**

```bash
git add app/people-teams/
git commit -m "feat: People & Teams page — endpoint cards, API explorer, use case guides

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: Build Reference page (11 subsections)

**Files:**
- Rewrite: `app/reference/page.tsx`

- [ ] **Step 1: Build full Reference page**

Port JSX `ReferenceTab` with all 11 sub-sections. Client component with:
- PageHero "Reference"
- Section selector buttons (11 sections)
- Active section state, conditional rendering
- Subsections:
  1. All 25 API Endpoints (grouped by domain from `endpointGroups`)
  2. Internal Agent Endpoints (7 entries as DataTable)
  3. Webhook Endpoints (3 entries + payload schema in code block)
  4. MCP Tools & Config (25 tools table + 4 config vars table)
  5. jf_agent On-Prem (git providers, run modes, env vars)
  6. DORA Metrics (from `doraMetrics`)
  7. Frameworks (from `frameworks` + 7 tracked metrics as Badge)
  8. Platform Features (from `platformFeatures` — features as Badge)
  9. Integrations (from `integrations` — tools as Badge)
  10. Key URLs (17 entries as DataTable with links)
  11. Infrastructure Stack (8 layers as DataTable + GitHub repos)

- [ ] **Step 2: Commit**

```bash
git add app/reference/
git commit -m "feat: Reference page — 11 subsections, 25 endpoints, MCP, DORA, integrations

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 13: Modernize Academy page

**Files:**
- Rewrite: `app/academy/page.tsx`

- [ ] **Step 1: Rewrite Academy with new components**

Same content as current, but using new UI components: PageHero (serif title), SectionBlock, cards with Tailwind classes, metric cards with Badge for category, GuideBox for learning tips.

- [ ] **Step 2: Commit**

```bash
git add app/academy/
git commit -m "feat: modernize Academy page with new UI components

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 14: Modernize Playbooks page

**Files:**
- Rewrite: `app/playbooks/page.tsx`

- [ ] **Step 1: Rewrite Playbooks with new components**

Same content, new UI. Each playbook as a card with: title, goal, outputs as Badge pills, steps as a numbered list with subtle styling. GuideBox for implementation guidance.

- [ ] **Step 2: Commit**

```bash
git add app/playbooks/
git commit -m "feat: modernize Playbooks page with badges, step lists, guide boxes

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 15: Build functional Workspace page

**Files:**
- Rewrite: `app/workspace/page.tsx`

- [ ] **Step 1: Build Workspace with localStorage persistence**

Client component. Features:
- PageHero "Workspace"
- 6 artifact type cards (Bookmarks, Saved summaries, Playbook outputs, Templates, Notes, Favorite examples)
- Each type shows count from localStorage
- Simple add/remove interface — user can type a note or title and save it
- Items stored in localStorage under `jellyfish-workspace-{type}` keys
- Empty states with helpful prompts
- Clear all button per type

- [ ] **Step 2: Commit**

```bash
git add app/workspace/
git commit -m "feat: functional Workspace with localStorage persistence, 6 artifact types

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 16: Modernize Showcase page

**Files:**
- Rewrite: `app/showcase/page.tsx`

- [ ] **Step 1: Rewrite Showcase with new components**

Same 4 capability stories, new UI. Cards with gradient accents per audience type. Add platform-reported outcomes section (4 stats from JSX: 32%, 2.6 days, 21%, 25%). Badge tags for capabilities. GuideBox connecting showcase to playbooks.

- [ ] **Step 2: Commit**

```bash
git add app/showcase/
git commit -m "feat: modernize Showcase with audience cards, platform outcomes, badges

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 17: Final integration, cleanup, and verification

**Files:**
- Modify: `app/globals.css` (any final tweaks)
- Delete: `app/examples/page.tsx` (content merged into Sprint Health and DevEx pages)
- Modify: `data/highlights.ts` (update paths for new routes)

- [ ] **Step 1: Update highlights.ts paths**

```typescript
import { HighlightCard } from "@/lib/types";

export const homePaths: HighlightCard[] = [
  {
    title: "Monitor sprint health & delivery",
    description: "Track velocity, completion rates, carry-over, and delivery patterns with live Jellyfish data.",
    href: "/sprint-health",
    tags: ["Metrics", "Real-time"],
  },
  {
    title: "Explore team allocations",
    description: "Understand FTE distribution across investment categories, teams, and individuals.",
    href: "/allocation",
    tags: ["Capacity", "Planning"],
  },
  {
    title: "Run guided playbooks",
    description: "Step-by-step workflows for retros, capacity reviews, and stakeholder updates.",
    href: "/playbooks",
    tags: ["Ceremonies", "Outputs"],
  },
];
```

- [ ] **Step 2: Remove old examples page**

```bash
rm app/examples/page.tsx
```

The examples content (sprint health + devex scenarios) has been absorbed into the Sprint Health and DevEx pages as guide boxes and mock data interpretations.

- [ ] **Step 3: Full build and typecheck**

```bash
npm run typecheck && npm run build
```

Expected: No errors.

- [ ] **Step 4: Manual smoke test**

```bash
npm run dev
```

Visit each of the 10 pages and verify:
- Header nav highlights correct page
- Dark/light toggle works
- All mock data renders
- API Explorer shows on applicable pages
- All cards, tables, charts, progress bars render correctly

- [ ] **Step 5: Final commit and push**

```bash
git add -A
git commit -m "feat: final integration — updated navigation, removed old examples, cleanup

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
git push
```

---

## Summary

| Task | Page/Component | Status |
|------|---------------|--------|
| 1 | Tailwind + shadcn/ui + themes | - [ ] |
| 2 | Port all JSX data | - [ ] |
| 3 | Shared UI components (11) | - [ ] |
| 4 | API Explorer + client | - [ ] |
| 5 | Header + Footer | - [ ] |
| 6 | Home page | - [ ] |
| 7 | Sprint Health | - [ ] |
| 8 | Delivery | - [ ] |
| 9 | Allocation | - [ ] |
| 10 | DevEx | - [ ] |
| 11 | People & Teams | - [ ] |
| 12 | Reference (11 subsections) | - [ ] |
| 13 | Academy | - [ ] |
| 14 | Playbooks | - [ ] |
| 15 | Workspace (localStorage) | - [ ] |
| 16 | Showcase | - [ ] |
| 17 | Integration + cleanup | - [ ] |
