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
            <Link key={item.href} href={item.href} className={`px-3 py-1.5 rounded-lg text-[12.5px] font-medium whitespace-nowrap transition-all ${pathname === item.href ? "text-text-primary bg-surface-raised shadow-sm" : "text-text-ghost hover:text-text-dim hover:bg-white/[0.04]"}`}>
              {item.label}
            </Link>
          ))}
          <div className="w-px h-4 bg-border-vivid mx-1.5" />
          {secondaryNav.map((item) => (
            <Link key={item.href} href={item.href} className={`px-3 py-1.5 rounded-lg text-[12.5px] font-medium whitespace-nowrap transition-all ${pathname === item.href ? "text-text-primary bg-surface-raised shadow-sm" : "text-text-ghost hover:text-text-dim hover:bg-white/[0.04]"}`}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="w-8 h-8 rounded-lg border border-border-vivid bg-transparent text-text-dim flex items-center justify-center text-sm cursor-pointer hover:border-text-ghost transition-colors">
            {theme === "dark" ? "\u2600" : "\u263E"}
          </button>
        </div>
      </div>
    </header>
  );
}
