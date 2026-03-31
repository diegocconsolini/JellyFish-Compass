"use client";

import { cn } from "@/lib/utils";

type DataSource = "mock" | "api" | "mcp";

type Props = {
  source: DataSource;
  token: string;
  mcpUrl: string;
  onSourceChange: (source: DataSource) => void;
  onTokenChange: (token: string) => void;
  onMcpUrlChange: (url: string) => void;
};

const options: { id: DataSource; label: string }[] = [
  { id: "mock", label: "Mock Data" },
  { id: "api", label: "API (Token)" },
  { id: "mcp", label: "MCP Server" },
];

export function DataSourceToggle({
  source,
  token,
  mcpUrl,
  onSourceChange,
  onTokenChange,
  onMcpUrlChange,
}: Props) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-0.5 bg-surface-raised rounded-lg p-0.5">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSourceChange(opt.id)}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer",
              source === opt.id
                ? "bg-blue/[0.08] text-blue"
                : "text-text-ghost hover:text-text-dim"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {source === "api" && (
        <input
          type="password"
          aria-label="Jellyfish API token"
          placeholder="Paste your Jellyfish API token"
          value={token}
          onChange={(e) => onTokenChange(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-mono text-text-primary placeholder:text-text-ghost outline-none focus:border-blue min-w-[240px]"
        />
      )}

      {source === "mcp" && (
        <input
          type="text"
          aria-label="MCP server URL"
          placeholder="http://localhost:3100"
          value={mcpUrl}
          onChange={(e) => onMcpUrlChange(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-mono text-text-primary placeholder:text-text-ghost outline-none focus:border-blue min-w-[240px]"
        />
      )}
    </div>
  );
}
