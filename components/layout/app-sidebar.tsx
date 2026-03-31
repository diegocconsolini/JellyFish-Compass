"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Activity,
  Rocket,
  TrendingUp,
  PieChart,
  Code2,
  BarChart3,
  GitBranch,
  Gauge,
  Shuffle,
  Map,
  Presentation,
  BookOpen,
  GraduationCap,
  Menu,
  X,
  ChevronRight,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Nav structure ────────────────────────────────────────────────────────────

const navGroups = [
  {
    id: "metrics",
    label: "Metrics",
    color: "text-blue",
    dotColor: "bg-blue",
    hoverBg: "hover:bg-blue/10",
    activeBg: "bg-blue/15",
    activeBorder: "border-blue/50",
    activeText: "text-blue",
    items: [
      { href: "/sprint-health", label: "Sprint Health", icon: Activity },
      { href: "/delivery", label: "Delivery", icon: Rocket },
      { href: "/delivery-forecast", label: "Forecasting", icon: TrendingUp },
      { href: "/product-metrics", label: "Product Metrics", icon: PieChart },
      { href: "/devex", label: "DevEx", icon: Code2 },
      { href: "/benchmarks", label: "Benchmarks", icon: BarChart3 },
      { href: "/process", label: "Process", icon: GitBranch },
    ],
  },
  {
    id: "planning",
    label: "Planning",
    color: "text-violet",
    dotColor: "bg-violet",
    hoverBg: "hover:bg-violet/10",
    activeBg: "bg-violet/15",
    activeBorder: "border-violet/50",
    activeText: "text-violet",
    items: [
      { href: "/capacity", label: "Capacity", icon: Gauge },
      { href: "/scenarios", label: "Scenarios", icon: Shuffle },
      { href: "/roadmap", label: "Roadmap", icon: Map },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    color: "text-amber",
    dotColor: "bg-amber",
    hoverBg: "hover:bg-amber/10",
    activeBg: "bg-amber/15",
    activeBorder: "border-amber/50",
    activeText: "text-amber",
    items: [
      { href: "/metrics", label: "Deck Builder", icon: Presentation },
      { href: "/reference", label: "Reference", icon: BookOpen },
      { href: "/academy", label: "Academy", icon: GraduationCap },
    ],
  },
];

function findActiveGroup(pathname: string): string {
  for (const group of navGroups) {
    if (group.items.some((item) => item.href === pathname)) return group.id;
  }
  return "metrics";
}

// ─── Desktop sidebar ──────────────────────────────────────────────────────────

function DesktopSidebar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-50",
        "border-r border-border bg-bg/80 backdrop-blur-2xl backdrop-saturate-[1.6]",
        "transition-[width] duration-200 ease-in-out overflow-hidden",
        expanded ? "w-[220px]" : "w-12"
      )}
      aria-label="Primary navigation"
    >
      {/* Logo / toggle */}
      <div className={cn(
        "flex items-center h-12 shrink-0 border-b border-border/50",
        expanded ? "px-3 gap-2" : "justify-center"
      )}>
        <Link
          href="/"
          aria-label="Jellyfish Compass home"
          className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-blue to-violet shrink-0"
        >
          <span className="text-xs" aria-hidden="true">🪼</span>
        </Link>
        {expanded && (
          <span className="text-[13px] font-bold tracking-tight truncate">
            Jellyfish <span className="text-blue">Compass</span>
          </span>
        )}
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          className={cn(
            "flex items-center justify-center w-6 h-6 rounded-md text-text-ghost hover:text-text-dim hover:bg-surface-raised transition-colors cursor-pointer shrink-0",
            expanded ? "ml-auto" : "hidden"
          )}
        >
          <ChevronRight size={14} className={cn("transition-transform", expanded && "rotate-180")} />
        </button>
      </div>

      {/* Collapse trigger when collapsed */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          aria-label="Expand sidebar"
          className="absolute top-3 right-0 translate-x-1/2 z-10 w-5 h-5 rounded-full border border-border bg-bg text-text-ghost hover:text-text-dim flex items-center justify-center cursor-pointer"
        >
          <ChevronRight size={10} />
        </button>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        {navGroups.map((group) => (
          <div key={group.id} className="mb-1">
            {/* Group label */}
            {expanded ? (
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 mt-1",
                "text-[10px] font-bold uppercase tracking-widest",
                group.color
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", group.dotColor)} aria-hidden="true" />
                {group.label}
              </div>
            ) : (
              <div className={cn("w-full h-px my-2", group.dotColor, "opacity-20")} aria-hidden="true" />
            )}

            {/* Items */}
            {group.items.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  title={expanded ? undefined : label}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 min-h-[44px] transition-colors",
                    expanded ? "px-3" : "justify-center px-0",
                    isActive
                      ? cn(group.activeBg, "border-l-2", group.activeBorder, group.activeText)
                      : cn("text-text-ghost hover:text-text-dim", group.hoverBg, "border-l-2 border-transparent")
                  )}
                >
                  <Icon
                    size={16}
                    className={cn("shrink-0", isActive ? group.activeText : "text-current")}
                    aria-hidden="true"
                  />
                  {expanded && (
                    <span className="text-xs font-medium truncate">{label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom: theme toggle */}
      <div className={cn(
        "shrink-0 border-t border-border/50 py-2",
        expanded ? "px-3" : "flex justify-center"
      )}>
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label={mounted ? `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode` : "Toggle theme"}
          className={cn(
            "flex items-center gap-2 min-h-[44px] text-text-ghost hover:text-text-dim transition-colors cursor-pointer rounded-md hover:bg-surface-raised",
            expanded ? "w-full px-2" : "w-9 justify-center"
          )}
        >
          {mounted ? (
            resolvedTheme === "dark"
              ? <Sun size={14} aria-hidden="true" />
              : <Moon size={14} aria-hidden="true" />
          ) : (
            <span className="w-3.5 h-3.5 rounded-full border border-current" aria-hidden="true" />
          )}
          {expanded && (
            <span className="text-xs font-medium">
              {mounted ? (resolvedTheme === "dark" ? "Light mode" : "Dark mode") : "Theme"}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}

// ─── Mobile header + overlay ──────────────────────────────────────────────────

function MobileNav() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const activeGroup = findActiveGroup(pathname);

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-50 flex items-center h-12 px-4 border-b border-border bg-bg/80 backdrop-blur-2xl backdrop-saturate-[1.6] gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue to-violet flex items-center justify-center text-xs" aria-hidden="true">🪼</div>
          <span className="text-[14px] font-bold tracking-tight">
            Jellyfish <span className="text-blue">Compass</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label={mounted ? `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode` : "Toggle theme"}
            className="w-8 h-8 rounded-lg border border-border-vivid bg-transparent text-text-dim flex items-center justify-center cursor-pointer"
          >
            {mounted ? (
              resolvedTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />
            ) : (
              <span aria-hidden="true">○</span>
            )}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            className="w-8 h-8 rounded-lg border border-border-vivid bg-transparent text-text-dim flex items-center justify-center cursor-pointer"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 top-12 z-[60] bg-bg/95 backdrop-blur-xl overflow-y-auto">
          <nav aria-label="Mobile navigation" className="max-w-md mx-auto px-6 py-6 space-y-6">
            {navGroups.map((group) => (
              <div key={group.id}>
                <div className={cn("flex items-center gap-2 mb-2", group.color)}>
                  <span className={cn("w-2 h-2 rounded-full", group.dotColor)} aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-widest">{group.label}</span>
                </div>
                <div className="space-y-1 pl-4">
                  {group.items.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                          isActive
                            ? cn(group.activeBg, group.activeText)
                            : "text-text-dim hover:text-text-primary hover:bg-surface-raised/50"
                        )}
                      >
                        <Icon size={16} aria-hidden="true" />
                        {label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function AppSidebar() {
  return (
    <>
      <DesktopSidebar />
      <MobileNav />
    </>
  );
}

// Export sidebar width for layout use
export const SIDEBAR_WIDTH_COLLAPSED = "48px";
export const SIDEBAR_WIDTH_EXPANDED = "220px";
