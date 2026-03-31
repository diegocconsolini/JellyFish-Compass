import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { ReactNode } from "react";

import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ThemeProvider } from "@/components/ui/theme-provider";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Jellyfish Compass",
  description: "Modern dashboard for Scrum Masters — metrics, API explorer, and guided workflows powered by Jellyfish.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
  manifest: "/site.webmanifest",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0f18" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${jetBrainsMono.variable}`}>
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-bg focus:text-text-primary focus:px-4 focus:py-2 focus:rounded-lg focus:border focus:border-blue focus:text-sm focus:font-semibold"
          >
            Skip to main content
          </a>
          <AppSidebar />
          {/* Content area — shifted right by sidebar width on desktop */}
          <div className="md:pl-12 flex flex-col min-h-screen">
            <main id="main-content" className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
