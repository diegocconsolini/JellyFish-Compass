"use client";

import { useState, useEffect } from "react";
import { useSidebar } from "@/components/layout/sidebar-context";
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

// ─── Types ────────────────────────────────────────────────────────────────────

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
};

type ExpandableItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  groups: {
    label: string;
    children: { href: string; label: string }[];
  }[];
};

// ─── Nav structure ────────────────────────────────────────────────────────────

const navGroups: {
  id: string;
  label: string;
  color: string;
  dotColor: string;
  hoverBg: string;
  activeBg: string;
  activeBorder: string;
  activeText: string;
  items: NavItem[];
  expandables?: ExpandableItem[];
}[] = [
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
    ],
    expandables: [
      {
        id: "reference",
        label: "Reference",
        href: "/reference",
        icon: BookOpen,
        groups: [
          {
            label: "API",
            children: [
              { href: "/reference/endpoints", label: "All 25 Endpoints" },
              { href: "/reference/agent", label: "Agent Endpoints" },
              { href: "/reference/webhooks", label: "Webhooks" },
              { href: "/reference/mcp", label: "MCP Tools" },
              { href: "/reference/jf-agent", label: "jf_agent" },
              { href: "/reference/agent-config", label: "Agent Config" },
              { href: "/reference/urls", label: "Key URLs" },
              { href: "/reference/infra", label: "Infrastructure" },
            ],
          },
          {
            label: "Platform",
            children: [
              { href: "/reference/dora", label: "DORA Metrics" },
              { href: "/reference/frameworks", label: "Frameworks" },
              { href: "/reference/features", label: "Platform Features" },
              { href: "/reference/integrations", label: "Integrations" },
              { href: "/reference/personas", label: "Personas" },
              { href: "/reference/people-teams", label: "People & Teams" },
            ],
          },
          {
            label: "Knowledge",
            children: [
              { href: "/reference/resources", label: "Resources" },
              { href: "/reference/library", label: "Knowledge Library" },
              { href: "/reference/limitations", label: "Limitations" },
            ],
          },
        ],
      },
      {
        id: "academy",
        label: "Academy",
        href: "/academy",
        icon: GraduationCap,
        groups: [
          {
            label: "Learn",
            children: [
              { href: "/academy/modules", label: "Modules" },
              { href: "/academy/showcase", label: "Showcase" },
            ],
          },
          {
            label: "Practice",
            children: [
              { href: "/academy/playbooks", label: "Playbooks" },
              { href: "/academy/workspace", label: "Workspace" },
            ],
          },
        ],
      },
    ],
  },
];

function findActiveGroup(pathname: string): string {
  for (const group of navGroups) {
    if (group.items.some((item) => item.href === pathname)) return group.id;
    for (const exp of group.expandables ?? []) {
      if (pathname.startsWith(exp.href)) return group.id;
    }
  }
  return "metrics";
}

// ─── Desktop sidebar ──────────────────────────────────────────────────────────

function DesktopSidebar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { expanded, setExpanded } = useSidebar();
  const [openExpandables, setOpenExpandables] = useState<Set<string>>(new Set());

  useEffect(() => setMounted(true), []);

  // Auto-expand when pathname matches a child route
  useEffect(() => {
    const toOpen = new Set<string>();
    for (const group of navGroups) {
      for (const exp of group.expandables ?? []) {
        if (pathname.startsWith(exp.href)) toOpen.add(exp.id);
      }
    }
    setOpenExpandables((prev) => {
      const next = new Set(prev);
      toOpen.forEach((id) => next.add(id));
      return next;
    });
  }, [pathname]);

  function toggleExpandable(id: string) {
    setOpenExpandables((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

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

            {/* Flat items */}
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

            {/* Expandable items */}
            {(group.expandables ?? []).map((exp) => {
              const isOpen = openExpandables.has(exp.id);
              const isParentActive = pathname.startsWith(exp.href);
              const Icon = exp.icon;
              return (
                <div key={exp.id}>
                  {/* Parent row */}
                  <button
                    type="button"
                    onClick={() => toggleExpandable(exp.id)}
                    aria-expanded={isOpen}
                    title={expanded ? undefined : exp.label}
                    className={cn(
                      "w-full flex items-center gap-3 min-h-[44px] transition-colors border-l-2",
                      expanded ? "px-3" : "justify-center px-0",
                      isParentActive
                        ? cn(group.activeBg, group.activeBorder, group.activeText)
                        : cn("text-text-ghost hover:text-text-dim", group.hoverBg, "border-transparent")
                    )}
                  >
                    <Icon size={16} className={cn("shrink-0", isParentActive ? group.activeText : "text-current")} aria-hidden="true" />
                    {expanded && (
                      <>
                        <span className="text-xs font-medium truncate flex-1 text-left">{exp.label}</span>
                        <ChevronRight
                          size={12}
                          className={cn("shrink-0 transition-transform text-text-ghost", isOpen && "rotate-90")}
                        />
                      </>
                    )}
                  </button>

                  {/* Children */}
                  {isOpen && expanded && (
                    <div>
                      {exp.groups.map((grp) => (
                        <div key={grp.label}>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-text-ghost pl-6 py-1 mt-1">
                            {grp.label}
                          </div>
                          {grp.children.map((child) => {
                            const isChildActive = pathname === child.href;
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                aria-current={isChildActive ? "page" : undefined}
                                className={cn(
                                  "flex items-center min-h-[44px] pl-6 pr-3 text-xs transition-colors border-l-2",
                                  isChildActive
                                    ? cn(group.activeBg, group.activeBorder, group.activeText)
                                    : cn("text-text-ghost hover:text-text-dim", group.hoverBg, "border-transparent")
                                )}
                              >
                                <span className="truncate">{child.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
  const [openExpandables, setOpenExpandables] = useState<Set<string>>(new Set());

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);

  // Auto-expand active expandable on pathname change
  useEffect(() => {
    const toOpen = new Set<string>();
    for (const group of navGroups) {
      for (const exp of group.expandables ?? []) {
        if (pathname.startsWith(exp.href)) toOpen.add(exp.id);
      }
    }
    setOpenExpandables(toOpen);
  }, [pathname]);

  function toggleMobileExpandable(id: string) {
    setOpenExpandables((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

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
                  {/* Flat items */}
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

                  {/* Expandable items */}
                  {(group.expandables ?? []).map((exp) => {
                    const isExpOpen = openExpandables.has(exp.id);
                    const Icon = exp.icon;
                    return (
                      <div key={exp.id}>
                        <button
                          type="button"
                          onClick={() => toggleMobileExpandable(exp.id)}
                          aria-expanded={isExpOpen}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                            pathname.startsWith(exp.href)
                              ? cn(group.activeBg, group.activeText)
                              : "text-text-dim hover:text-text-primary hover:bg-surface-raised/50"
                          )}
                        >
                          <Icon size={16} aria-hidden="true" />
                          <span className="flex-1 text-left">{exp.label}</span>
                          <ChevronRight size={14} className={cn("transition-transform text-text-ghost", isExpOpen && "rotate-90")} />
                        </button>
                        {isExpOpen && (
                          <div className="pl-4 mt-1 space-y-1">
                            {exp.groups.map((grp) => (
                              <div key={grp.label}>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-text-ghost px-3 py-1">{grp.label}</div>
                                {grp.children.map((child) => {
                                  const isChildActive = pathname === child.href;
                                  return (
                                    <Link
                                      key={child.href}
                                      href={child.href}
                                      onClick={() => setOpen(false)}
                                      aria-current={isChildActive ? "page" : undefined}
                                      className={cn(
                                        "flex items-center px-3 py-2 rounded-lg text-sm transition-all",
                                        isChildActive
                                          ? cn(group.activeBg, group.activeText)
                                          : "text-text-dim hover:text-text-primary hover:bg-surface-raised/50"
                                      )}
                                    >
                                      {child.label}
                                    </Link>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
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
