"use client";
import { DataTable } from "@/components/ui/data-table";

const webhookEndpoints = [
  { method: "POST", path: "https://webhooks.jellyfish.co/deployment", auth: "X-jf-api-token: {token}", desc: "Deployment event ingestion (used by Buildkite plugin)" },
  { method: "POST", path: "https://app.jellyfish.co/ingest-webhooks/ado/", auth: "Authorization: Bearer {token}", desc: "Azure DevOps webhook ingestion (workitem.created/deleted/restored/updated)" },
];

const deploymentPayload = `{
  "reference_id": "string",        // unique deployment identifier
  "is_successful": true,           // boolean
  "name": "string",                // deployment name
  "deployed_at": "ISO8601 UTC",    // e.g. "2026-03-31T12:00:00Z"
  "repo_name": "org/repo",         // org/repo format
  "commit_shas": ["sha1", "sha2"], // array of commit SHAs
  "labels": ["key:value"],         // array of label strings
  "source_url": "https://..."      // URL to build/deployment source
}`;

export function WebhooksSection() {
  return (
    <div className="space-y-6">
      <DataTable
        caption="Webhook endpoints"
        headers={["Method", "Endpoint", "Auth Header", "Description"]}
        rows={webhookEndpoints.map((wh) => [
          <span key="method" className="inline-block px-2 py-0.5 rounded text-[10.5px] font-bold bg-violet-dim text-violet">{wh.method}</span>,
          <code key="path" className="font-mono text-[12px] text-blue">{wh.path}</code>,
          <code key="auth" className="font-mono text-xs text-text-dim">{wh.auth}</code>,
          <span key="desc" className="text-[13px] text-text-dim">{wh.desc}</span>,
        ])}
      />
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-ghost">Deployment Webhook Payload Schema</h3>
        <pre tabIndex={0} className="bg-surface-raised border border-border rounded-xl p-4 overflow-x-auto text-[12px] font-mono text-text-dim leading-relaxed">
          <code>{deploymentPayload}</code>
        </pre>
      </div>
    </div>
  );
}
