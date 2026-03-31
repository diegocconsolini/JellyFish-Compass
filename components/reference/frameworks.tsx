"use client";
import { frameworks } from "@/data/frameworks";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";

const additionalMetrics = [
  "Issue Cycle Time", "Flow Metrics", "Code Churn", "Unlinked Pull Requests",
  "Sprint Summaries", "FTE Allocations", "Work Effort Distribution",
];

export function FrameworksSection() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {frameworks.map((f) => (
          <div key={f.name} className="rounded-xl border border-border bg-surface p-5 space-y-1">
            <div className="font-semibold text-[14px]">{f.name}</div>
            <p className="text-[13px] text-text-dim">{f.desc}</p>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <h2 className="font-semibold text-[15px]">Additional Tracked Metrics</h2>
        <div className="flex flex-wrap gap-2">
          {additionalMetrics.map((m) => (
            <Badge key={m} variant="ghost">{m}</Badge>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="font-semibold text-[15px]">Platform Outcomes</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Revenue Focus" value="32%" note="More focus on revenue-maximizing work" color="blue" trend="jellyfish.co/tour" trendDirection="up" />
          <StatCard label="Cycle Time" value="2.6d" note="Reduction in cycle time" color="green" trend="jellyfish.co/tour" trendDirection="up" />
          <StatCard label="Time to Market" value="21%" note="Faster time to market" color="violet" trend="jellyfish.co/tour" trendDirection="up" />
          <StatCard label="Collaboration" value="25%" note="More team collaboration" color="amber" trend="jellyfish.co/tour" trendDirection="up" />
        </div>
      </div>
    </div>
  );
}
