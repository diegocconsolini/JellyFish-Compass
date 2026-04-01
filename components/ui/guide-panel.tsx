"use client";

import { useState } from "react";

export function GuidePanel({
  scrumMaster,
  productOwner,
}: {
  scrumMaster: React.ReactNode;
  productOwner?: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<"sm" | "po">("sm");

  // If only one persona has content, show it directly without tabs
  if (!productOwner) {
    return <div className="text-sm text-text-dim leading-relaxed">{scrumMaster}</div>;
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("sm")}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
            activeTab === "sm"
              ? "bg-blue-dim text-blue"
              : "bg-surface-raised text-text-ghost hover:text-text-dim"
          }`}
          aria-pressed={activeTab === "sm"}
        >
          Scrum Master
        </button>
        <button
          onClick={() => setActiveTab("po")}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
            activeTab === "po"
              ? "bg-blue-dim text-blue"
              : "bg-surface-raised text-text-ghost hover:text-text-dim"
          }`}
          aria-pressed={activeTab === "po"}
        >
          Product Owner
        </button>
      </div>
      <div className="text-sm text-text-dim leading-relaxed">
        {activeTab === "sm" ? scrumMaster : productOwner}
      </div>
    </div>
  );
}
