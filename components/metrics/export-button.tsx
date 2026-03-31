"use client";

import { useState } from "react";
import { Download, ChevronDown } from "lucide-react";

type ExportTheme = "dark" | "light";

type Props = {
  onExport: (theme: ExportTheme) => void;
  loading: boolean;
  slideCount: number;
};

export function ExportButton({ onExport, loading, slideCount }: Props) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => onExport("dark")}
          disabled={loading || slideCount === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-l-lg bg-blue text-white text-xs font-semibold disabled:opacity-50 cursor-pointer transition-opacity hover:opacity-90"
        >
          <Download size={14} />
          {loading ? "Generating..." : `Export PPTX (${slideCount} slides)`}
        </button>
        <button
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          disabled={loading || slideCount === 0}
          className="px-2 py-2 rounded-r-lg bg-blue/80 text-white disabled:opacity-50 cursor-pointer border-l border-blue/50"
          aria-label="Export theme options"
        >
          <ChevronDown size={14} />
        </button>
      </div>

      {showMenu && (
        <div className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-lg shadow-lg py-1 z-10 min-w-[160px]">
          <button
            type="button"
            onClick={() => {
              onExport("dark");
              setShowMenu(false);
            }}
            className="w-full text-left px-3 py-2 text-xs text-text-dim hover:bg-surface-raised transition-colors"
          >
            Jellyfish Dark
          </button>
          <button
            type="button"
            onClick={() => {
              onExport("light");
              setShowMenu(false);
            }}
            className="w-full text-left px-3 py-2 text-xs text-text-dim hover:bg-surface-raised transition-colors"
          >
            Jellyfish Light
          </button>
        </div>
      )}
    </div>
  );
}
