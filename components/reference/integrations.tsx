"use client";
import { integrations } from "@/data/integrations";
import { Badge } from "@/components/ui/badge";

export function IntegrationsSection() {
  return (
    <div className="space-y-6">
      {integrations.map((cat) => (
        <div key={cat.category} className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-[15px]">{cat.category}</h2>
            <span className="text-xs text-text-ghost bg-surface-raised border border-border rounded-full px-2 py-0.5">
              {cat.tools.length} tool{cat.tools.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {cat.tools.map((t) => (
              <Badge key={t} variant="ghost">{t}</Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
