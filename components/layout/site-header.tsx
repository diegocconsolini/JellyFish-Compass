"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, X } from "lucide-react";
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
      { href: "/delivery-forecast", label: "Forecasting" },
      { href: "/product-metrics", label: "Product Metrics" },
      { href: "/devex", label: "DevEx" },
      { href: "/benchmarks", label: "Benchmarks" },
      { href: "/process", label: "Process" },
    ],
  },
  {
    id: "planning",
    label: "Planning",
    color: "bg-violet",
    items: [
      { href: "/capacity", label: "Capacity" },
      { href: "/scenarios", label: "Scenarios" },
      { href: "/roadmap", label: "Roadmap" },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    color: "bg-amber",
    items: [
      { href: "/metrics", label: "Deck Builder" },
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
  if (secondaryNav.some((item) => item.href === pathname)) {
    return "tools";
  }
  return "metrics";
}

export function SiteHeader() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeGroup, setActiveGroup] = useState(() => findActiveGroup(pathname));
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setActiveGroup(findActiveGroup(pathname));
  }, [pathname]);

  // Close menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const currentGroup = navGroups.find((g) => g.id === activeGroup) || navGroups[0];

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-border bg-bg/70 backdrop-blur-2xl backdrop-saturate-[1.6]">

      {/* ── DESKTOP (md+) ── */}
      {/* Row 1 */}
      <div className="hidden md:flex max-w-[1440px] mx-auto px-4 sm:px-7 h-12 items-center gap-5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue to-violet flex items-center justify-center text-xs" aria-hidden="true">🪼</div>
          <span className="text-[14px] font-bold tracking-tight">Jellyfish <span className="text-blue">Compass</span></span>
        </Link>
        {/* Group tabs */}
        <nav aria-label="Section groups" className="flex items-center gap-1 ml-4">
          <div role="tablist" className="flex items-center gap-1">
            {navGroups.map((group) => (
              <button
                key={group.id}
                role="tab"
                id={`tab-${group.id}`}
                aria-selected={activeGroup === group.id}
                aria-controls={`subnav-${group.id}`}
                onClick={() => setActiveGroup(group.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
                  activeGroup === group.id
                    ? "text-text-primary bg-surface-raised"
                    : "text-text-ghost hover:text-text-dim hover:bg-white/[0.04]"
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", group.color)} aria-hidden="true" />
                {group.label}
              </button>
            ))}
          </div>
        </nav>
        {/* Theme toggle */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label={mounted ? `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode` : "Toggle theme"}
            className="w-8 h-8 rounded-lg border border-border-vivid bg-transparent text-text-dim flex items-center justify-center text-xs cursor-pointer hover:border-text-ghost transition-colors"
          >
            <span aria-hidden="true">{mounted ? (resolvedTheme === "dark" ? "☀" : "☾") : "○"}</span>
          </button>
        </div>
      </div>

      {/* Row 2 — desktop sub-nav */}
      <nav
        role="tabpanel"
        id={`subnav-${currentGroup.id}`}
        aria-labelledby={`tab-${currentGroup.id}`}
        aria-label={`${currentGroup.label} pages`}
        className="hidden md:flex max-w-[1440px] mx-auto px-4 sm:px-7 h-9 items-center gap-0.5 border-t border-border/50"
      >
        {currentGroup.items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all",
              pathname === item.href
                ? "text-text-primary bg-surface-raised shadow-sm"
                : "text-text-ghost hover:text-text-dim hover:bg-white/[0.04]"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* ── MOBILE (below md) ── */}
      <div className="flex md:hidden max-w-[1440px] mx-auto px-4 h-12 items-center justify-between">
        {/* Logo — compact */}
        <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setMenuOpen(false)}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue to-violet flex items-center justify-center text-xs" aria-hidden="true">🪼</div>
          <span className="text-[14px] font-bold tracking-tight">
            <span className="text-blue">Compass</span>
          </span>
        </Link>
        {/* Right side: theme toggle + hamburger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label={mounted ? `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode` : "Toggle theme"}
            className="w-8 h-8 rounded-lg border border-border-vivid bg-transparent text-text-dim flex items-center justify-center cursor-pointer"
          >
            <span aria-hidden="true">{mounted ? (resolvedTheme === "dark" ? "☀" : "☾") : "○"}</span>
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            className="w-8 h-8 rounded-lg border border-border-vivid bg-transparent text-text-dim flex items-center justify-center cursor-pointer"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

    </header>

    {/* Mobile menu overlay — OUTSIDE header to avoid backdrop-filter stacking context */}
    {menuOpen && (
      <div className="md:hidden fixed inset-0 top-12 z-[60] bg-bg/95 backdrop-blur-xl overflow-y-auto">
        <nav aria-label="Mobile navigation" className="max-w-md mx-auto px-6 py-6 space-y-6">
          {navGroups.map((group) => (
            <div key={group.id}>
              <div className="flex items-center gap-2 mb-2">
                <span className={cn("w-2 h-2 rounded-full", group.color)} aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-widest text-text-ghost">{group.label}</span>
              </div>
              <div className="space-y-1 pl-4">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "block px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      pathname === item.href
                        ? "text-text-primary bg-surface-raised"
                        : "text-text-dim hover:text-text-primary hover:bg-surface-raised/50"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    )}
    </>
  );
}
