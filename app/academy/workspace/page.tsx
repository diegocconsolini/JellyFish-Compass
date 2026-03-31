"use client";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { Badge } from "@/components/ui/badge";
import { GuideBox } from "@/components/ui/guide-box";

const ARTIFACT_TYPES = [
  { label: "Bookmarks", key: "jf-workspace-bookmarks" },
  { label: "Saved Summaries", key: "jf-workspace-saved-summaries" },
  { label: "Playbook Outputs", key: "jf-workspace-playbook-outputs" },
  { label: "Reusable Templates", key: "jf-workspace-reusable-templates" },
  { label: "Notes", key: "jf-workspace-notes" },
  { label: "Favorite Examples", key: "jf-workspace-favorite-examples" },
] as const;

type ArtifactKey = (typeof ARTIFACT_TYPES)[number]["key"];

const ARTIFACT_COLORS = [
  "from-blue to-cyan",
  "from-green to-emerald-300",
  "from-amber to-yellow-300",
  "from-violet to-purple-300",
  "from-blue to-cyan",
  "from-green to-emerald-300",
];

export default function AcademyWorkspacePage() {
  const [items, setItems] = useState<Record<string, string[]>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    const loaded: Record<string, string[]> = {};
    for (const { key } of ARTIFACT_TYPES) {
      try {
        const raw = localStorage.getItem(key);
        loaded[key] = raw ? (JSON.parse(raw) as string[]) : [];
      } catch {
        loaded[key] = [];
      }
    }
    setItems(loaded);
  }, []);

  function addItem(key: ArtifactKey, value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setItems((prev) => {
      const updated = { ...prev, [key]: [...(prev[key] ?? []), trimmed] };
      localStorage.setItem(key, JSON.stringify(updated[key]));
      return updated;
    });
    setInputs((prev) => ({ ...prev, [key]: "" }));
  }

  function removeItem(key: ArtifactKey, index: number) {
    setItems((prev) => {
      const updated = {
        ...prev,
        [key]: (prev[key] ?? []).filter((_, i) => i !== index),
      };
      localStorage.setItem(key, JSON.stringify(updated[key]));
      return updated;
    });
  }

  function clearType(key: ArtifactKey) {
    setItems((prev) => {
      const updated = { ...prev, [key]: [] };
      localStorage.setItem(key, JSON.stringify([]));
      return updated;
    });
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      <PageHero
        eyebrow="Academy"
        title="Workspace"
        subtitle="Your saved artifacts"
        intro="Store summaries, notes, templates, and artifacts collected from Modules and Playbooks."
      />

      <GuideBox title="How Workspace works">
        Your workspace stores summaries, notes, templates, and artifacts
        collected from other pages. Use items from the{" "}
        <code>Modules</code> and <code>Playbooks</code> tabs to save items
        here — they persist locally so your work is always ready when you
        return.
      </GuideBox>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
        {ARTIFACT_TYPES.map(({ label, key }, artifactIndex) => {
          const typeItems = items[key] ?? [];
          const inputValue = inputs[key] ?? "";
          const hasItems = typeItems.length > 0;
          const color = ARTIFACT_COLORS[artifactIndex] ?? "from-blue to-cyan";

          return (
            <div
              key={key}
              className="relative overflow-hidden bg-surface rounded-xl border border-border p-5 flex flex-col gap-4"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${color}`}
              />
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{label}</h3>
                {hasItems ? (
                  <Badge variant="blue">{typeItems.length}</Badge>
                ) : (
                  <Badge variant="ghost">empty</Badge>
                )}
              </div>

              <div className="flex-1">
                {hasItems ? (
                  <ul className="flex flex-col gap-1.5">
                    {typeItems.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between gap-2 text-xs text-text-dim bg-surface-raised rounded-lg px-3 py-2"
                      >
                        <span className="truncate">{item}</span>
                        <button
                          type="button"
                          onClick={() => removeItem(key as ArtifactKey, index)}
                          className="shrink-0 min-w-[44px] min-h-[44px] -my-2 -mr-1 flex items-center justify-center text-text-ghost hover:text-red transition-colors"
                          aria-label={`Remove "${item}" from ${label}`}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-text-ghost leading-relaxed">
                    No items yet. Add from the Modules and Playbooks tabs.
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <label htmlFor={`input-${key}`} className="sr-only">
                  New item for {label}
                </label>
                <input
                  id={`input-${key}`}
                  type="text"
                  value={inputValue}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      addItem(key as ArtifactKey, inputValue);
                  }}
                  placeholder={`Add to ${label}…`}
                  className="flex-1 min-w-0 min-h-[44px] rounded-lg border border-border bg-surface-raised px-3 py-2.5 text-xs placeholder:text-text-ghost focus:outline-none focus:ring-2 focus:ring-blue/40"
                />
                <button
                  type="button"
                  onClick={() => addItem(key as ArtifactKey, inputValue)}
                  aria-label={`Add item to ${label}`}
                  className="shrink-0 min-h-[44px] rounded-lg bg-blue-interactive px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  Add
                </button>
              </div>

              {hasItems && (
                <button
                  type="button"
                  onClick={() => clearType(key as ArtifactKey)}
                  className="text-xs min-h-[44px] px-2 text-text-ghost hover:text-red transition-colors text-left"
                  aria-label={`Clear all items from ${label}`}
                >
                  Clear all
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
