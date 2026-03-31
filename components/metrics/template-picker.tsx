"use client";

import { templates } from "@/data/slide-templates";
import { cn } from "@/lib/utils";

type Props = {
  selected: string | null;
  onSelect: (templateId: string) => void;
};

export function TemplatePicker({ selected, onSelect }: Props) {
  const ceremony = templates.filter((t) => t.group === "ceremony");
  const audience = templates.filter((t) => t.group === "audience");

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-text-ghost mb-2">Ceremony</p>
        <div className="flex flex-wrap gap-1.5">
          {ceremony.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer",
                selected === t.id
                  ? "bg-surface-raised text-blue border-blue/50"
                  : "bg-surface-raised border-border text-text-ghost hover:text-text-dim"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-text-ghost mb-2">Audience</p>
        <div className="flex flex-wrap gap-1.5">
          {audience.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer",
                selected === t.id
                  ? "bg-surface-raised text-blue border-blue/50"
                  : "bg-surface-raised border-border text-text-ghost hover:text-text-dim"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
