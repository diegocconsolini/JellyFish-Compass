# Jellyfish Compass — Development Guide

## Repos

- **Public:** `diegocconsolini/JellyFish-Compass` — source code, deploys to Vercel
- **Private:** `diegocconsolini/JellyFish-Compass-internal` — all issues, specs, security
- **Live:** https://jf.orizon.sh

## Stack

Next.js 15 (App Router) + React 19 + TypeScript 5.8 (strict) + Tailwind CSS v4 + shadcn/ui. Hosted on Vercel. Auto-deploys on push to `main`.

## Architecture

- 14 data pages + landing page across 4 nav groups (Metrics, Operations, Planning, Knowledge)
- Two-row header on desktop, hamburger on mobile
- Dark/light mode via next-themes (defaults to system)
- Data pages use BottomPanel pattern: Guides tab (open by default, up to 4 persona tabs: SM, PO, EM, PM) + API Explorer tab
- GuidePanel supports dynamic tabs array with pills on desktop, dropdown on mobile
- PPTX Deck Builder at `/metrics` using pptxgenjs (client-side)
- Academy Playbooks: 17 interactive playbooks across 6 categories, dynamic route at `/academy/playbooks/[slug]`
- Playbook pages: sticky progress bar (IntersectionObserver), inline visualizations, per-step ApiDrawer

## Data Rules

- ALL factual content must be sourced from official Jellyfish materials (jellyfish.co, Jellyfish-AI GitHub repos)
- NO fabricated thresholds, benchmarks, or numbers
- Mock data is clearly fictional demonstration data
- Source repos are in `SourceRepos/` locally (gitignored) for reference

## Key Files

| File | Purpose |
|------|---------|
| `data/endpoints-full.ts` | 25 API endpoints across 6 domains |
| `data/mock-data.ts` | All mock data for visualizations |
| `data/playbooks.ts` | 17 interactive playbook definitions |
| `data/slide-templates.ts` | 13 slide blocks, 9 deck templates |
| `lib/api-client.ts` | Jellyfish API client (token auth) |
| `lib/export-pptx.ts` | PPTX slide generation (dynamic import) |
| `components/layout/site-header.tsx` | Responsive header with nav groups |
| `app/academy/page.tsx` | Academy root (redirects to modules) |
| `app/academy/playbooks/[slug]/page.tsx` | Dynamic interactive playbook detail page |
| `components/ui/bottom-panel.tsx` | Collapsible Guides + API Explorer tabs |
| `components/ui/guide-panel.tsx` | Dynamic persona tabs (SM, PO, EM, PM) |
| `components/ui/api-drawer.tsx` | Wraps ApiPanel + ApiExplorer |
| `components/ui/section-divider.tsx` | Gradient (major) and thin rule (minor) separators |
| `components/ui/playbook-progress.tsx` | Sticky progress bar for playbook steps |
| `components/ui/playbook-step.tsx` | Step renderer with visualization + inline ApiDrawer |
| `app/reference/page.tsx` | 16 subsections of reference content |

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build (must pass before pushing)
npm run typecheck  # TypeScript strict check
npm run lint       # ESLint
```

## Conventions

- Pages are client components ("use client") when they have state (API Explorer, tabs, toggles)
- Shared UI components in `components/ui/` — StatCard, DataTable, BarChart, ProgressBar, Badge, BottomPanel, GuidePanel, ApiDrawer, SectionDivider, PlaybookCard, PlaybookProgress, PlaybookStepSection, etc.
- Data page pattern: PageHero → SectionDivider → visualizations → BottomPanel (Guides tab open by default + API Explorer tab)
- GuidePanel uses dynamic `tabs: PersonaTab[]` prop — pills on desktop, `<select>` dropdown on mobile
- Playbook page pattern: PageHero → GuidePanel → sticky PlaybookProgress → PlaybookStepSections with inline visualizations + ApiDrawer
- All grids use responsive breakpoints: `grid-cols-1 lg:grid-cols-2`, `grid-cols-2 sm:grid-cols-4`, etc.
- Minimum text size: 12px (`text-xs`). Minimum touch target: 44px.
- All interactive elements need `aria-label`, `role`, or visible label
- Never use raw HTML injection — React JSX only
- pptxgenjs must be dynamically imported (has node: protocol deps that break SSR)

## Issues

Create in the **private** repo: `diegocconsolini/JellyFish-Compass-internal`
Issues are disabled on the public repo.

## Don't

- Don't add fabricated numbers or thresholds that look like Jellyfish standards
- Don't modify the live site (jf.orizon.sh) directly — only through git push
- Don't commit secrets, .env files, or SourceRepos/
- Don't use unsafe HTML rendering methods
