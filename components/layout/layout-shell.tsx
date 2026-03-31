// components/layout/layout-shell.tsx
"use client";

import { ReactNode } from "react";
import { SidebarProvider, useSidebar } from "@/components/layout/sidebar-context";
import { AppSidebar } from "@/components/layout/app-sidebar";

function ShellInner({ children }: { children: ReactNode }) {
  const { expanded } = useSidebar();

  return (
    <>
      <AppSidebar />
      <div
        className={[
          "flex flex-col min-h-screen",
          "transition-[padding-left] duration-200 ease-in-out",
          // Mobile: top padding offsets the sticky 48px MobileNav header; no left padding
          // Desktop: shift right by sidebar width
          "pt-12 md:pt-0",
          expanded ? "md:pl-[220px]" : "md:pl-12",
        ].join(" ")}
      >
        {children}
      </div>
    </>
  );
}

export function LayoutShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <ShellInner>{children}</ShellInner>
    </SidebarProvider>
  );
}
