"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/data/navigation";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand-lockup">
          <span className="brand-kicker">Jellyfish Learning Studio</span>
          <Link className="brand-title" href="/">
            Jellyfish Compass
          </Link>
          <span className="brand-subtitle">
            Educational reference, examples, and guided workflows for Jellyfish users.
          </span>
        </div>

        <nav className="primary-nav" aria-label="Primary">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                className={`nav-link${active ? " active" : ""}`}
                href={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
