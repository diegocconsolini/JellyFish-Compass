# Phase 2: Content Fixes + 6 New Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix fabricated content in existing pages, then build 6 new Jellyfish feature pages following the established pattern — all focused on helping Scrum Masters understand and use metrics, not marketing.

**Architecture:** Each new page follows the proven pattern: PageHero + GuideBox (what it is) + mock data visualization + DataTable + GuideBox (ceremony mapping) + API Explorer. Mock data in data/mock-data.ts, pages as client components.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, existing component library.

---

## Phase 1: Fix Existing Content (Issues #39, #46-#50)

**Priority: Do this first — removes fabricated data before building new pages.**

| Sub-Issue | Fix | File |
|-----------|-----|------|
| #46 | Remove DevEx fabricated thresholds (75/65/70), add Kaleris attribution | `app/devex/page.tsx` |
| #47 | Remove Allocation fabricated benchmarks (50-60/20-30/10-20%), add patented Work Model | `app/allocation/page.tsx` |
| #48 | Remove Delivery fabricated threshold (15% scope growth) | `app/delivery/page.tsx` |
| #49 | Add missing resource to Reference | `app/reference/page.tsx` |
| #50 | Fix stale HTML comment | `app/page.tsx` |

## Phase 2: Build 6 New Pages (Issues #40-#45, #51-#63)

**Execution order — build mock data first, then pages, then nav update:**

### Step 1: All mock data (#51, #53, #55, #57, #59, #61)
Add all new mock data constants to `data/mock-data.ts` in one commit.

### Step 2: Build pages (#52, #54, #56, #58, #60, #62)
Build each page independently — can be parallelized.

| Issue | Page | Route | Pattern Source |
|-------|------|-------|---------------|
| #52 | Life Cycle Explorer | `/life-cycle` | Sprint Health |
| #54 | Workflow Analysis | `/workflow` | Delivery |
| #56 | Team Benchmarks | `/benchmarks` | DevEx |
| #58 | Capacity Planner | `/capacity` | Allocation |
| #60 | AI Impact | `/ai-impact` | DevEx |
| #62 | Scenario Planner | `/scenarios` | Allocation |

### Step 3: Navigation update (#63)
Update nav, landing page, types — one commit after all pages built.

---

## Issue Hierarchy

```
#39 Remove fabricated thresholds (parent)
  ├── #46 Fix DevEx thresholds
  ├── #47 Fix Allocation benchmarks
  ├── #48 Fix Delivery threshold
  ├── #49 Add missing resource
  └── #50 Fix stale comment

#40 Life Cycle Explorer (parent)
  ├── #51 Mock data
  └── #52 Build page

#41 Workflow Analysis (parent)
  ├── #53 Mock data
  └── #54 Build page

#42 Team Benchmarks (parent)
  ├── #55 Mock data
  └── #56 Build page

#43 Capacity Planner (parent)
  ├── #57 Mock data
  └── #58 Build page

#44 AI Impact (parent)
  ├── #59 Mock data
  └── #60 Build page

#45 Scenario Planner (parent)
  ├── #61 Mock data
  └── #62 Build page

#63 Navigation update (after all pages)
```

## Total: 25 issues (7 parents + 17 sub-issues + 1 nav update)
