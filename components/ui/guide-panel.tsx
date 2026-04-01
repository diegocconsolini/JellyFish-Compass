"use client";

import { useState } from "react";

export type PersonaTab = {
  key: string;
  label: string;
  content: React.ReactNode;
};

export function GuidePanel({ tabs }: { tabs: PersonaTab[] }) {
  const [activeKey, setActiveKey] = useState(tabs[0]?.key ?? "");

  if (tabs.length === 0) return null;

  if (tabs.length === 1) {
    return <div className="text-sm text-text-dim leading-relaxed">{tabs[0].content}</div>;
  }

  const activeTab = tabs.find((t) => t.key === activeKey) ?? tabs[0];

  return (
    <div>
      {/* Mobile: dropdown */}
      <div className="sm:hidden mb-4">
        <select
          value={activeKey}
          onChange={(e) => setActiveKey(e.target.value)}
          aria-label="Select guide persona"
          className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs font-semibold text-text-primary outline-none focus:border-blue"
        >
          {tabs.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop: pill buttons */}
      <div className="hidden sm:flex gap-2 mb-4 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveKey(t.key)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              activeKey === t.key
                ? "bg-blue-dim text-blue"
                : "bg-surface-raised text-text-ghost hover:text-text-dim"
            }`}
            aria-pressed={activeKey === t.key}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="text-sm text-text-dim leading-relaxed">
        {activeTab.content}
      </div>
    </div>
  );
}
