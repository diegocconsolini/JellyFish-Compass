"use client";
import { DataTable } from "@/components/ui/data-table";
import { cn } from "@/lib/utils";
import { allEndpoints } from "@/data/endpoints-full";

const mcpConfigVars = [
  { name: "JELLYFISH_API_TOKEN", required: "Required", defaultVal: "—", desc: "Authentication credential from Jellyfish API Export settings (requires Admin User Role)" },
  { name: "HUGGINGFACE_API_TOKEN", required: "Optional", defaultVal: '""', desc: "For PromptGuard 2 prompt injection mitigation (Meta Llama)" },
  { name: "MODEL_AVAILABILITY", required: "Optional", defaultVal: "false", desc: "Allow requests if Hugging Face model unavailable. Set true to allow data if PromptGuard cannot be reached." },
  { name: "MODEL_TIMEOUT", required: "Optional", defaultVal: "10", desc: "How long to wait for the PromptGuard model to respond, in seconds" },
];

export function McpToolsSection() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h2 className="font-semibold text-[15px]">25 MCP Tools</h2>
        <DataTable
          caption="MCP tools inventory"
          headers={["#", "Tool Name", "Description"]}
          rows={allEndpoints.map((ep, i) => [
            <span key="num" className="text-xs text-text-ghost font-mono">{String(i + 1).padStart(2, "0")}</span>,
            <code key="name" className="font-mono text-[12px] text-blue">{ep.name}</code>,
            <span key="desc" className="text-[13px] text-text-dim">{ep.desc}</span>,
          ])}
        />
      </div>
      <div className="space-y-3">
        <h2 className="font-semibold text-[15px]">MCP Configuration Variables</h2>
        <DataTable
          caption="MCP configuration variables"
          headers={["Variable", "Required", "Default", "Description"]}
          rows={mcpConfigVars.map((v) => [
            <code key="name" className="font-mono text-[12px] text-blue">{v.name}</code>,
            <span key="req" className={cn(
              "inline-block px-2 py-0.5 rounded text-[10.5px] font-semibold",
              v.required === "Required" ? "bg-amber-dim text-amber" : "bg-surface-raised text-text-ghost"
            )}>{v.required}</span>,
            <code key="def" className="font-mono text-[12px] text-text-dim">{v.defaultVal}</code>,
            <span key="desc" className="text-[13px] text-text-dim">{v.desc}</span>,
          ])}
        />
      </div>
    </div>
  );
}
