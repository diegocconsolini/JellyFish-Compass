"use client";
import { platformFeatures } from "@/data/platform-features";
import { Badge } from "@/components/ui/badge";

export function PlatformFeaturesSection() {
  return (
    <div className="space-y-6">
      {platformFeatures.map((cat, catIdx) => (
        <div key={cat.category} className="space-y-3">
          <h2 className="font-semibold text-[15px]">{cat.category}</h2>
          <div className="flex flex-wrap gap-2">
            {cat.features.map((f, fIdx) => (
              <Badge key={f} variant={(catIdx + fIdx) % 2 === 0 ? "blue" : "violet"}>{f}</Badge>
            ))}
          </div>
        </div>
      ))}
      <div className="mt-6 space-y-3">
        <h2 className="font-semibold text-[15px]">Additional Platform Features</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-surface p-5 space-y-2">
            <h3 className="text-sm font-bold">Jellyfish Assistant</h3>
            <p className="text-[13px] text-text-dim">AI-powered assistant for natural language queries against engineering data.</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5 space-y-2">
            <h3 className="text-sm font-bold">Jellyfish Academy</h3>
            <p className="text-[13px] text-text-dim">Training platform at <a href="https://academy.jellyfish.co/app" target="_blank" rel="noopener noreferrer" className="text-blue hover:underline">academy.jellyfish.co</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
