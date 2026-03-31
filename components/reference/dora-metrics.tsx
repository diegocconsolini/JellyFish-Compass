"use client";
import { doraMetrics } from "@/data/dora-metrics";

export function DoraMetricsSection() {
  return (
    <div className="space-y-6">
      <p className="text-[13px] text-text-dim">
        Jellyfish tracks all <strong className="text-text">4 DORA metrics</strong> as defined by the DevOps Research and Assessment program. These are the industry-standard engineering effectiveness indicators.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {doraMetrics.map((m) => (
          <div key={m.name} className="rounded-xl border border-border bg-surface p-5 space-y-2">
            <div className="font-semibold text-[14px]">{m.name}</div>
            <p className="text-[13px] text-text-dim leading-relaxed">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
