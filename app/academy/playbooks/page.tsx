"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHero } from "@/components/ui/page-hero";
import { Badge } from "@/components/ui/badge";
import { playbooks } from "@/data/playbooks";
import type { PlaybookCategory, PlaybookDefinition } from "@/lib/types";

const categoryConfig: {
  key: PlaybookCategory;
  label: string;
  color: string;
  dotColor: string;
  textColor: string;
  bgColor: string;
}[] = [
  { key: "sprint-delivery", label: "Sprint & Delivery", color: "bg-blue", dotColor: "bg-blue", textColor: "text-blue", bgColor: "bg-blue/10" },
  { key: "capacity-planning", label: "Capacity & Planning", color: "bg-green", dotColor: "bg-green", textColor: "text-green", bgColor: "bg-green/10" },
  { key: "devex-health", label: "DevEx & Health", color: "bg-amber", dotColor: "bg-amber", textColor: "text-amber", bgColor: "bg-amber/10" },
  { key: "metrics", label: "Metrics", color: "bg-violet", dotColor: "bg-violet", textColor: "text-violet", bgColor: "bg-violet/10" },
  { key: "executive", label: "Executive", color: "bg-red", dotColor: "bg-red", textColor: "text-red", bgColor: "bg-red/10" },
  { key: "ai-innovation", label: "AI & Innovation", color: "bg-cyan", dotColor: "bg-cyan", textColor: "text-cyan", bgColor: "bg-cyan/10" },
];

const personaLabels: Record<string, string> = {
  sm: "SM",
  po: "PO",
  em: "EM",
  pm: "PM",
};

const personaFilters = [
  { key: "sm", label: "Scrum Master" },
  { key: "po", label: "Product Owner" },
  { key: "em", label: "Eng Manager" },
  { key: "pm", label: "Prod Manager" },
];

function PlaybookPill({ playbook, accentColor }: { playbook: PlaybookDefinition; accentColor: string }) {
  return (
    <Link
      href={`/academy/playbooks/${playbook.slug}`}
      className={`group flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 transition-all hover:border-border-vivid hover:bg-surface-raised`}
    >
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-text-primary group-hover:text-blue transition-colors truncate">
          {playbook.title}
        </div>
        <div className="text-xs text-text-ghost mt-0.5 truncate">
          {playbook.goal}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex gap-1">
          {playbook.personas.map((p) => (
            <span key={p} className={`text-[10px] font-bold ${accentColor} opacity-60`}>
              {personaLabels[p]}
            </span>
          ))}
        </div>
        <span className="text-xs text-text-ghost">{playbook.steps.length}s</span>
        <svg className="w-4 h-4 text-text-ghost group-hover:text-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

export default function PlaybooksPage() {
  const [persona, setPersona] = useState<string | null>(null);

  const filteredPlaybooks = persona
    ? playbooks.filter((p) => p.personas.includes(persona))
    : playbooks;

  const categoriesWithPlaybooks = categoryConfig
    .map((cat) => ({
      ...cat,
      playbooks: filteredPlaybooks.filter((p) => p.category === cat.key),
    }))
    .filter((cat) => cat.playbooks.length > 0);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      <PageHero
        eyebrow="Academy"
        title="Interactive Playbooks"
        subtitle="Guided workflows powered by Jellyfish data"
        intro="Step-by-step playbooks with inline visualizations, API exploration, and persona-specific guidance. All content grounded in official Jellyfish materials."
      />

      {/* Persona filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        <button
          onClick={() => setPersona(null)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
            persona === null
              ? "bg-blue-dim text-blue"
              : "bg-surface-raised text-text-ghost hover:text-text-dim"
          }`}
        >
          All Personas
        </button>
        {personaFilters.map((p) => (
          <button
            key={p.key}
            onClick={() => setPersona(persona === p.key ? null : p.key)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
              persona === p.key
                ? "bg-blue-dim text-blue"
                : "bg-surface-raised text-text-ghost hover:text-text-dim"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Category Journey Timeline */}
      <div className="relative pl-8 sm:pl-10">
        {/* Vertical gradient line */}
        <div
          className="absolute left-3 sm:left-4 top-0 bottom-0 w-0.5 rounded-full"
          style={{
            background: "linear-gradient(to bottom, #4f8ff7, #34d399, #fbbf24, #a78bfa, #f87171, #22d3ee)",
          }}
          aria-hidden="true"
        />

        {categoriesWithPlaybooks.map((cat, catIndex) => (
          <div key={cat.key} className={catIndex < categoriesWithPlaybooks.length - 1 ? "mb-10" : ""}>
            {/* Category dot + heading */}
            <div className="relative flex items-center gap-3 mb-4">
              <div
                className={`absolute -left-8 sm:-left-10 w-3 h-3 rounded-full ${cat.dotColor} ring-4 ring-bg`}
                aria-hidden="true"
              />
              <div className={`flex items-center gap-2`}>
                <h2 className={`text-xs font-bold uppercase tracking-widest ${cat.textColor}`}>
                  {cat.label}
                </h2>
                <Badge variant="ghost">{cat.playbooks.length}</Badge>
              </div>
            </div>

            {/* Playbook pills */}
            <div className="space-y-2">
              {cat.playbooks.map((p) => (
                <PlaybookPill key={p.id} playbook={p} accentColor={cat.textColor} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredPlaybooks.length === 0 && (
        <p className="text-sm text-text-ghost text-center py-12">
          No playbooks match the selected persona.
        </p>
      )}

      {/* Summary */}
      <div className="mt-12 pt-6 border-t border-border text-center">
        <p className="text-xs text-text-ghost">
          {playbooks.length} playbooks across {categoryConfig.length} categories · All content sourced from{" "}
          <a href="https://jellyfish.co" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue">
            jellyfish.co
          </a>
        </p>
      </div>
    </div>
  );
}
