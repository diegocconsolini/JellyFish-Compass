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

/** @deprecated Use primaryNav + secondaryNav instead */
export const navItems = [...primaryNav, ...secondaryNav];
