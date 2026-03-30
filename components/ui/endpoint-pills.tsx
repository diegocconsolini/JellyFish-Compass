"use client";
import { JellyfishEndpoint } from "@/lib/types";
type EndpointPillsProps = { endpoints: JellyfishEndpoint[]; selected: string | null; onSelect: (ep: JellyfishEndpoint) => void };
export function EndpointPills({ endpoints, selected, onSelect }: EndpointPillsProps) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-3.5">
      {endpoints.map((ep) => (
        <button key={ep.name} onClick={() => onSelect(ep)} className={`px-3 py-1.5 rounded-md font-mono text-[11.5px] font-medium border transition-all cursor-pointer ${selected === ep.name ? "bg-blue-dim border-blue/30 text-blue" : "bg-surface-raised border-border text-text-ghost hover:text-text-dim hover:border-border-vivid"}`}>{ep.name}</button>
      ))}
    </div>
  );
}
