"use client";
import { Badge } from "@/components/ui/badge";

const publishedResources = {
  ebooks: [
    "Why Platform Engineering Teams are Essential in the AI-Native Era (Feb 2026)",
    "The Engineering Leader's Guide to the AI Software Development Stack (Jan 2026)",
    "AI in Engineering: Moving Beyond Hype Into Reality (Nov 2025)",
    "7 AI KPIs Every Engineering Leader Should Track (Oct 2025)",
    "The AI Impact Framework (Sep 2025)",
    "6 Slides R&D Leaders Should Show at Board Meetings in an AI-Driven World (Sep 2025)",
    "Bridging Finance and R&D: Efficient Software Capitalization (May 2025)",
    "The 5 Elements of Software Engineering Management",
    "The Jellyfish Guide to Engineering Metrics",
    "5 Jira Best Practices for Improving Engineering Operations",
  ],
  reports: [
    "2025 State of Engineering Management Report (Jul 2025)",
    "GenAI: Perception vs Reality (May 2025)",
  ],
};

export function ResourcesSection() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h2 className="font-semibold text-[15px]">eBooks & Guides <Badge variant="ghost">{publishedResources.ebooks.length}</Badge></h2>
        <ul className="space-y-2">
          {publishedResources.ebooks.map((e) => <li key={e} className="text-[13px] text-text-dim">• {e}</li>)}
        </ul>
      </div>
      <div className="space-y-3">
        <h2 className="font-semibold text-[15px]">Reports <Badge variant="ghost">{publishedResources.reports.length}</Badge></h2>
        <ul className="space-y-2">
          {publishedResources.reports.map((r) => <li key={r} className="text-[13px] text-text-dim">• {r}</li>)}
        </ul>
      </div>
      <p className="text-xs text-text-ghost">Note: Webinar archive spans 7 pages with 9+ on-demand sessions. See jellyfish.co/webinars/ for the full list.</p>
    </div>
  );
}
