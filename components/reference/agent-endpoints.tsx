"use client";
import { DataTable } from "@/components/ui/data-table";
import { cn } from "@/lib/utils";

const agentEndpoints = [
  { endpoint: "/endpoints/agent/pull-state", method: "GET", desc: "Agent configuration retrieval" },
  { endpoint: "/endpoints/agent/jira-issue-metadata", method: "GET", desc: "Paginated Jira issue metadata" },
  { endpoint: "/endpoints/agent/company", method: "GET", desc: "Company information retrieval" },
  { endpoint: "/endpoints/agent/unlinked-dev-issues", method: "GET", desc: "Orphaned/unlinked development issues" },
  { endpoint: "/endpoints/agent/healthcheck/signed-url", method: "GET", desc: "Health check upload via S3 signed URL" },
  { endpoint: "/endpoints/agent/upload_manifest", method: "POST", desc: "Data manifest upload" },
  { endpoint: "/endpoints/ingest/signed-url", method: "GET", desc: "S3 pre-signed URL for data ingestion" },
];

export function AgentEndpointsSection() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-text-dim">Internal API endpoints used by the <code className="font-mono text-[12px]">jf_agent</code> for data ingestion. These are not part of the public Export API.</p>
      <DataTable
        caption="Internal agent API endpoints"
        headers={["Endpoint", "Method", "Description"]}
        rows={agentEndpoints.map((ep) => [
          <code key="ep" className="font-mono text-[12px] text-blue">{ep.endpoint}</code>,
          <span key="method" className={cn(
            "inline-block px-2 py-0.5 rounded text-[10.5px] font-bold",
            ep.method === "GET" ? "bg-green-dim text-green" : "bg-violet-dim text-violet"
          )}>{ep.method}</span>,
          <span key="desc" className="text-[13px] text-text-dim">{ep.desc}</span>,
        ])}
      />
    </div>
  );
}
