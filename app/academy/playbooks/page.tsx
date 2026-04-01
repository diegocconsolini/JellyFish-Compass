"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { PlaybookCard } from "@/components/ui/playbook-card";
import { playbooks } from "@/data/playbooks";
import type { PlaybookCategory } from "@/lib/types";

const categories: { key: PlaybookCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "sprint-delivery", label: "Sprint & Delivery" },
  { key: "capacity-planning", label: "Capacity & Planning" },
  { key: "devex-health", label: "DevEx & Health" },
  { key: "metrics", label: "Metrics" },
  { key: "executive", label: "Executive" },
  { key: "ai-innovation", label: "AI & Innovation" },
];

const personaFilters = [
  { key: "sm", label: "SM" },
  { key: "po", label: "PO" },
  { key: "em", label: "EM" },
  { key: "pm", label: "PM" },
];

export default function PlaybooksPage() {
  const [category, setCategory] = useState<PlaybookCategory | "all">("all");
  const [persona, setPersona] = useState<string | null>(null);

  const filtered = playbooks.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (persona && !p.personas.includes(persona)) return false;
    return true;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      <PageHero
        eyebrow="Academy"
        title="Interactive Playbooks"
        subtitle="Guided workflows powered by Jellyfish data"
        intro="Step-by-step playbooks with inline visualizations, API exploration, and persona-specific guidance. All content grounded in official Jellyfish materials."
      />

      {/* Filter pills */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                category === c.key
                  ? "bg-blue-dim text-blue"
                  : "bg-surface-raised text-text-ghost hover:text-text-dim"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {personaFilters.map((p) => (
            <button
              key={p.key}
              onClick={() => setPersona(persona === p.key ? null : p.key)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                persona === p.key
                  ? "bg-blue-dim text-blue"
                  : "bg-surface-raised text-text-ghost hover:text-text-dim"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <PlaybookCard key={p.id} playbook={p} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-ghost text-center py-12">
          No playbooks match the selected filters.
        </p>
      )}
    </div>
  );
}
