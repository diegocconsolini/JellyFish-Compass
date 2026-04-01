"use client";

import { useState } from "react";

type Tab = "guides" | "api";

export function BottomPanel({
  guidesContent,
  apiExplorerContent,
  defaultOpen = false,
}: {
  guidesContent: React.ReactNode;
  apiExplorerContent: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<Tab | null>(
    defaultOpen ? "guides" : null
  );

  function handleTabClick(tab: Tab) {
    setActiveTab((prev) => (prev === tab ? null : tab));
  }

  const isOpen = activeTab !== null;

  return (
    <div className="mt-8 rounded-xl border border-border overflow-hidden">
      {/* Tab buttons */}
      <div className="flex bg-surface">
        <button
          onClick={() => handleTabClick("guides")}
          className={`flex-1 px-4 py-3 text-xs font-semibold text-center transition-colors ${
            activeTab === "guides"
              ? "text-blue border-b-2 border-blue"
              : "text-text-ghost hover:text-text-dim border-b border-border"
          }`}
          aria-expanded={activeTab === "guides"}
          aria-controls="bottom-panel-content"
        >
          Guides
        </button>
        <button
          onClick={() => handleTabClick("api")}
          className={`flex-1 px-4 py-3 text-xs font-semibold text-center transition-colors ${
            activeTab === "api"
              ? "text-blue border-b-2 border-blue"
              : "text-text-ghost hover:text-text-dim border-b border-border"
          }`}
          aria-expanded={activeTab === "api"}
          aria-controls="bottom-panel-content"
        >
          API Explorer
        </button>
      </div>

      {/* Content area */}
      <div
        id="bottom-panel-content"
        className={`transition-all duration-200 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-5 bg-bg">
          {activeTab === "guides" && guidesContent}
          {activeTab === "api" && apiExplorerContent}
        </div>
      </div>
    </div>
  );
}
