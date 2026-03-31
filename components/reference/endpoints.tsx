"use client";
import { DataTable } from "@/components/ui/data-table";
import { endpointGroups } from "@/data/endpoints-full";

export function EndpointsSection() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-6 text-sm">
        <div>
          <span className="text-text-ghost text-xs font-semibold uppercase tracking-wider">Base URL</span>
          <code className="ml-2 font-mono text-blue text-[13px]">https://app.jellyfish.co</code>
        </div>
        <div>
          <span className="text-text-ghost text-xs font-semibold uppercase tracking-wider">Auth</span>
          <code className="ml-2 font-mono text-blue text-[13px]">Authorization: Token &lt;token&gt;</code>
        </div>
      </div>
      {endpointGroups.map((group) => (
        <div key={group.domain} className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-[15px]">{group.domain}</h2>
            <span className="text-xs text-text-ghost bg-surface-raised border border-border rounded-full px-2 py-0.5">
              {group.endpoints.length} endpoint{group.endpoints.length !== 1 ? "s" : ""}
            </span>
          </div>
          <DataTable
            caption={`${group.domain} API endpoints`}
            headers={["Name", "Path", "Description"]}
            rows={group.endpoints.map((ep) => [
              <code key="name" className="font-mono text-[12px] text-blue">{ep.name}</code>,
              <code key="path" className="font-mono text-[12px] text-text-dim">{ep.path}</code>,
              <span key="desc" className="text-[13px] text-text-dim">{ep.desc}</span>,
            ])}
          />
        </div>
      ))}
    </div>
  );
}
