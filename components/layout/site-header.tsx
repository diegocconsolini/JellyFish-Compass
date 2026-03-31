"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { secondaryNav } from "@/data/navigation";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    id: "metrics",
    label: "Metrics",
    color: "bg-blue",
    items: [
      { href: "/sprint-health", label: "Sprint Health" },
      { href: "/delivery", label: "Delivery" },
      { href: "/devex", label: "DevEx" },
      { href: "/life-cycle", label: "Life Cycle" },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    color: "bg-green",
    items: [
      { href: "/allocation", label: "Allocation" },
      { href: "/people-teams", label: "People & Teams" },
      { href: "/workflow", label: "Workflow" },
      { href: "/benchmarks", label: "Benchmarks" },
    ],
  },
  {
    id: "planning",
    label: "Planning",
    color: "bg-violet",
    items: [
      { href: "/capacity", label: "Capacity" },
      { href: "/scenarios", label: "Scenarios" },
      { href: "/ai-impact", label: "AI Impact" },
    ],
  },
  {
    id: "knowledge",
    label: "Knowledge",
    color: "bg-amber",
    items: [
      { href: "/reference", label: "Reference" },
      { href: "/academy", label: "Academy" },
    ],
  },
];

function findActiveGroup(pathname: string): string {
  for (const group of navGroups) {
    if (group.items.some((item) => item.href === pathname)) {
      return group.id;
    }
  }
  // Check secondary nav
  if (secondaryNav.some((item) => item.href === pathname)) {
    return "knowledge";
  }
  return "metrics";
}

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [activeGroup, setActiveGroup] = useState(() => findActiveGroup(pathname));

  // Sync active group when navigating
  useEffect(() => {
    setActiveGroup(findActiveGroup(pathname));
  }, [pathname]);

  const currentGroup = navGroups.find((g) => g.id === activeGroup) || navGroups[0];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/70 backdrop-blur-2xl backdrop-saturate-[1.6]">
      {/* Row 1: Logo + Group tabs + Theme toggle */}
      <div className="max-w-[1440px] mx-auto px-7 h-12 flex items-center gap-5">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue to-violet flex items-center justify-center text-xs">
            🪼
          </div>
          <span className="text-[14px] font-bold tracking-tight">
            Jellyfish <span className="text-blue">Compass</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 ml-4">
          {navGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => setActiveGroup(group.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer",
                activeGroup === group.id
                  ? "text-text-primary bg-surface-raised"
                  : "text-text-ghost hover:text-text-dim hover:bg-white/[0.04]"
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", group.color)} />
              {group.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-7 h-7 rounded-lg border border-border-vivid bg-transparent text-text-dim flex items-center justify-center text-xs cursor-pointer hover:border-text-ghost transition-colors"
          >
            {theme === "dark" ? "\u2600" : "\u263E"}
          </button>
        </div>
      </div>

      {/* Row 2: Sub-navigation items for active group */}
      <div className="max-w-[1440px] mx-auto px-7 h-9 flex items-center gap-0.5 border-t border-border/50">
        {currentGroup.items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-3 py-1 rounded-md text-[12px] font-medium whitespace-nowrap transition-all",
              pathname === item.href
                ? "text-text-primary bg-surface-raised shadow-sm"
                : "text-text-ghost hover:text-text-dim hover:bg-white/[0.04]"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
