"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { endpointGroups, allEndpoints } from "@/data/endpoints-full";
import { doraMetrics } from "@/data/dora-metrics";
import { frameworks } from "@/data/frameworks";
import { integrations } from "@/data/integrations";
import { platformFeatures } from "@/data/platform-features";
import { cn } from "@/lib/utils";

type SectionId =
  | "endpoints"
  | "agent"
  | "webhooks"
  | "mcp"
  | "jf_agent"
  | "dora"
  | "frameworks"
  | "features"
  | "integrations"
  | "urls"
  | "infra";

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "endpoints", label: "All 25 Endpoints" },
  { id: "agent", label: "Agent Endpoints" },
  { id: "webhooks", label: "Webhooks" },
  { id: "mcp", label: "MCP Tools" },
  { id: "jf_agent", label: "jf_agent" },
  { id: "dora", label: "DORA Metrics" },
  { id: "frameworks", label: "Frameworks" },
  { id: "features", label: "Platform Features" },
  { id: "integrations", label: "Integrations" },
  { id: "urls", label: "Key URLs" },
  { id: "infra", label: "Infrastructure" },
];

const agentEndpoints = [
  { endpoint: "/health", method: "GET", desc: "Health check for the agent service" },
  { endpoint: "/git_init", method: "POST", desc: "Initialize git repository connection" },
  { endpoint: "/git_data", method: "POST", desc: "Pull git commit and PR data" },
  { endpoint: "/jira_init", method: "POST", desc: "Initialize Jira project connection" },
  { endpoint: "/jira_data", method: "POST", desc: "Pull Jira issue and sprint data" },
  { endpoint: "/run_all", method: "POST", desc: "Run full data collection pipeline" },
  { endpoint: "/status", method: "GET", desc: "Current status and last run summary" },
];

const webhookEndpoints = [
  { method: "POST", path: "/deployment", desc: "Record a deployment event" },
  { method: "POST", path: "/incident", desc: "Record an incident event" },
  { method: "POST", path: "/change_request", desc: "Record a change request event" },
];

const deploymentPayload = `{
  "version": "string",           // required
  "deploy_time": "ISO8601",      // required
  "service": "string",           // required
  "environment": "string",       // e.g. "production"
  "repository": "string",        // optional
  "commit_sha": "string",        // optional
  "status": "success | failure"  // optional, default "success"
}`;

const mcpConfigVars = [
  { name: "JELLYFISH_API_TOKEN", required: "Required", defaultVal: "—", desc: "Your Jellyfish API token" },
  { name: "HUGGINGFACE_API_TOKEN", required: "Optional", defaultVal: "—", desc: "HuggingFace token for embeddings" },
  { name: "MODEL_AVAILABILITY", required: "Optional", defaultVal: "auto", desc: "Controls model selection strategy" },
  { name: "MODEL_TIMEOUT", required: "Optional", defaultVal: "30", desc: "Timeout in seconds for model inference" },
];

const gitProviders = [
  { name: "GitHub", notes: "Cloud and Enterprise Server" },
  { name: "GitLab", notes: "Cloud and self-hosted" },
  { name: "Bitbucket Cloud", notes: "Atlassian cloud offering" },
  { name: "Bitbucket Server", notes: "Self-hosted (Data Center)" },
  { name: "Azure DevOps", notes: "Repos and Pipelines" },
];

const runModes = [
  { mode: "full", desc: "Run all collectors: git + jira + metrics" },
  { mode: "git_only", desc: "Collect only git data" },
  { mode: "jira_only", desc: "Collect only Jira data" },
  { mode: "health", desc: "Check connectivity to all configured sources" },
  { mode: "test", desc: "Dry-run with no data written" },
  { mode: "status", desc: "Report last run status and timestamps" },
];

const jfAgentEnvVars = [
  "JF_API_TOKEN",
  "JF_AGENT_URL",
  "GIT_PROVIDER",
  "GIT_TOKEN",
  "JIRA_URL",
  "JIRA_USER",
  "JIRA_TOKEN",
  "JF_TENANT",
  "LOG_LEVEL",
  "PROXY_URL",
  "SSL_VERIFY",
  "WORKER_COUNT",
];

const keyUrls = [
  { name: "App", url: "https://app.jellyfish.co", purpose: "Main application dashboard" },
  { name: "Marketing site", url: "https://jellyfish.co", purpose: "Company homepage" },
  { name: "Platform overview", url: "https://jellyfish.co/platform", purpose: "Product feature overview" },
  { name: "Interactive tour", url: "https://jellyfish.co/tour", purpose: "Guided product walkthrough" },
  { name: "Integrations page", url: "https://jellyfish.co/integrations", purpose: "Full integrations catalog" },
  { name: "Documentation", url: "https://jellyfish.co/docs", purpose: "Official product documentation" },
  { name: "API reference docs", url: "https://jellyfish.co/docs/api", purpose: "API usage and endpoint docs" },
  { name: "API base URL", url: "https://app.jellyfish.co/endpoints/export/v0", purpose: "Root path for all export API calls" },
  { name: "App settings", url: "https://app.jellyfish.co/settings", purpose: "Account and integration settings" },
  { name: "Support email", url: "mailto:support@jellyfish.co", purpose: "Customer support contact" },
  { name: "Changelog", url: "https://jellyfish.co/changelog", purpose: "Product release notes" },
  { name: "Blog", url: "https://jellyfish.co/blog", purpose: "Engineering leadership articles" },
  { name: "Resources", url: "https://jellyfish.co/resources", purpose: "Ebooks, guides, and reports" },
  { name: "Customers", url: "https://jellyfish.co/customers", purpose: "Customer stories and case studies" },
  { name: "Pricing", url: "https://jellyfish.co/pricing", purpose: "Pricing tiers and plan comparison" },
  { name: "Security", url: "https://jellyfish.co/security", purpose: "Security posture and compliance" },
  { name: "Status page", url: "https://status.jellyfish.co", purpose: "Platform uptime and incident reports" },
];

const infraLayers = [
  { layer: "Database", tech: "PostgreSQL", evidence: "Django ORM models, migration files" },
  { layer: "Orchestration", tech: "Prefect / Airflow", evidence: "Flow definitions in collector pipeline" },
  { layer: "Compute", tech: "Dask / Spark", evidence: "Distributed data processing workers" },
  { layer: "Queue", tech: "Celery / Redis", evidence: "Task queue for async collection jobs" },
  { layer: "Cloud", tech: "AWS", evidence: "S3 storage, ECS deployment configs" },
  { layer: "GitHub API", tech: "PyGithub", evidence: "github3.py wrapper in connector layer" },
  { layer: "Rate Limiting", tech: "Custom middleware", evidence: "Per-token throttle in export API" },
  { layer: "Backend", tech: "Django", evidence: "settings.py, urls.py, WSGI config" },
  { layer: "Frontend", tech: "React", evidence: "package.json, component tree" },
];

const repos = [
  { name: "jellyfish", forked: false, desc: "Core Django backend and data pipeline" },
  { name: "jellyfish-frontend", forked: false, desc: "React frontend application" },
  { name: "jellyfish-mcp", forked: false, desc: "Model Context Protocol server" },
  { name: "jf-agent", forked: false, desc: "On-premise data collection agent" },
  { name: "jellyfish-docs", forked: false, desc: "Public documentation site" },
  { name: "jellyfish-integrations", forked: false, desc: "Integration connector library" },
  { name: "prefect", forked: true, desc: "Orchestration framework (forked)" },
  { name: "dask", forked: true, desc: "Parallel computing library (forked)" },
  { name: "PyGithub", forked: true, desc: "GitHub API client (forked)" },
  { name: "django-rest-framework", forked: true, desc: "REST framework for Django (forked)" },
  { name: "celery", forked: true, desc: "Distributed task queue (forked)" },
  { name: "redis-py", forked: true, desc: "Redis Python client (forked)" },
  { name: "airflow", forked: true, desc: "Workflow orchestration (forked)" },
];

const additionalMetrics = [
  "Cycle Time",
  "Throughput",
  "WIP Limits",
  "Code Review Time",
  "PR Size",
  "Build Time",
  "Incident Rate",
];

export default function ReferencePage() {
  const [section, setSection] = useState<SectionId>("endpoints");

  return (
    <div className="max-w-[1440px] mx-auto px-7 py-7">
      {/* PageHero */}
      <PageHero
        eyebrow="Reference"
        title="Platform reference"
        subtitle="& API catalog"
      />

      {/* Section selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={cn(
              "px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors",
              section === id
                ? "bg-blue-dim text-blue border-blue/30"
                : "bg-surface-raised border-border text-text-ghost hover:text-text-dim"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Endpoints ── */}
      {section === "endpoints" && (
        <div className="space-y-8">
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-text-ghost text-[11px] font-semibold uppercase tracking-wider">Base URL</span>
              <code className="ml-2 font-mono text-blue text-[13px]">https://app.jellyfish.co</code>
            </div>
            <div>
              <span className="text-text-ghost text-[11px] font-semibold uppercase tracking-wider">Auth</span>
              <code className="ml-2 font-mono text-blue text-[13px]">Authorization: Token &lt;token&gt;</code>
            </div>
          </div>
          {endpointGroups.map((group) => (
            <div key={group.domain} className="space-y-3">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-[15px]">{group.domain}</h2>
                <span className="text-[10.5px] text-text-ghost bg-surface-raised border border-border rounded-full px-2 py-0.5">
                  {group.endpoints.length} endpoint{group.endpoints.length !== 1 ? "s" : ""}
                </span>
              </div>
              <DataTable
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
      )}

      {/* ── Agent Endpoints ── */}
      {section === "agent" && (
        <div className="space-y-4">
          <p className="text-sm text-text-dim">Internal HTTP endpoints exposed by the <code className="font-mono text-[12px]">jf-agent</code> service when running.</p>
          <DataTable
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
      )}

      {/* ── Webhooks ── */}
      {section === "webhooks" && (
        <div className="space-y-6">
          <DataTable
            headers={["Method", "Path", "Description"]}
            rows={webhookEndpoints.map((wh) => [
              <span key="method" className="inline-block px-2 py-0.5 rounded text-[10.5px] font-bold bg-violet-dim text-violet">{wh.method}</span>,
              <code key="path" className="font-mono text-[12px] text-blue">{wh.path}</code>,
              <span key="desc" className="text-[13px] text-text-dim">{wh.desc}</span>,
            ])}
          />
          <div className="space-y-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-ghost">Deployment Webhook Payload Schema</h3>
            <pre className="bg-surface-raised border border-border rounded-xl p-4 overflow-x-auto text-[12px] font-mono text-text-dim leading-relaxed">
              <code>{deploymentPayload}</code>
            </pre>
          </div>
        </div>
      )}

      {/* ── MCP Tools ── */}
      {section === "mcp" && (
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="font-semibold text-[15px]">25 MCP Tools</h2>
            <DataTable
              headers={["#", "Tool Name", "Description"]}
              rows={allEndpoints.map((ep, i) => [
                <span key="num" className="text-[11px] text-text-ghost font-mono">{String(i + 1).padStart(2, "0")}</span>,
                <code key="name" className="font-mono text-[12px] text-blue">{ep.name}</code>,
                <span key="desc" className="text-[13px] text-text-dim">{ep.desc}</span>,
              ])}
            />
          </div>
          <div className="space-y-3">
            <h2 className="font-semibold text-[15px]">MCP Configuration Variables</h2>
            <DataTable
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
      )}

      {/* ── jf_agent ── */}
      {section === "jf_agent" && (
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="font-semibold text-[15px]">Supported Git Providers</h2>
            <DataTable
              headers={["Provider", "Notes"]}
              rows={gitProviders.map((p) => [
                <span key="name" className="text-[13px] font-medium">{p.name}</span>,
                <span key="notes" className="text-[13px] text-text-dim">{p.notes}</span>,
              ])}
            />
          </div>
          <div className="space-y-3">
            <h2 className="font-semibold text-[15px]">Run Modes</h2>
            <DataTable
              headers={["Mode", "Description"]}
              rows={runModes.map((m) => [
                <code key="mode" className="font-mono text-[12px] text-blue">{m.mode}</code>,
                <span key="desc" className="text-[13px] text-text-dim">{m.desc}</span>,
              ])}
            />
          </div>
          <div className="space-y-3">
            <h2 className="font-semibold text-[15px]">Key Environment Variables</h2>
            <div className="flex flex-wrap gap-2">
              {jfAgentEnvVars.map((v) => (
                <Badge key={v} variant="blue">{v}</Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── DORA ── */}
      {section === "dora" && (
        <div className="space-y-6">
          <p className="text-[13px] text-text-dim">
            Jellyfish tracks all <strong className="text-text">4 DORA metrics</strong> as defined by the DevOps Research and Assessment program. These are the industry-standard engineering effectiveness indicators.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {doraMetrics.map((m) => (
              <div key={m.name} className="rounded-xl border border-border bg-surface p-5 space-y-2">
                <div className="font-semibold text-[14px]">{m.name}</div>
                <p className="text-[13px] text-text-dim leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Frameworks ── */}
      {section === "frameworks" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {frameworks.map((f) => (
              <div key={f.name} className="rounded-xl border border-border bg-surface p-5 space-y-1">
                <div className="font-semibold text-[14px]">{f.name}</div>
                <p className="text-[13px] text-text-dim">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <h2 className="font-semibold text-[15px]">Additional Tracked Metrics</h2>
            <div className="flex flex-wrap gap-2">
              {additionalMetrics.map((m) => (
                <Badge key={m} variant="ghost">{m}</Badge>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="font-semibold text-[15px]">Platform Outcomes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Delivery Improvement" value="32%" note="Faster software delivery" color="blue" trend="Validated" trendDirection="up" />
              <StatCard label="Time Saved" value="2.6d" note="Per sprint per engineer" color="green" trend="Per sprint" trendDirection="up" />
              <StatCard label="Efficiency Gain" value="21%" note="Engineering efficiency" color="violet" trend="Ongoing" trendDirection="up" />
              <StatCard label="Delivery Improvement" value="25%" note="Consistent delivery cadence" color="amber" trend="Measured" trendDirection="up" />
            </div>
          </div>
        </div>
      )}

      {/* ── Platform Features ── */}
      {section === "features" && (
        <div className="space-y-6">
          {platformFeatures.map((cat, catIdx) => (
            <div key={cat.category} className="space-y-3">
              <h2 className="font-semibold text-[15px]">{cat.category}</h2>
              <div className="flex flex-wrap gap-2">
                {cat.features.map((f, fIdx) => (
                  <Badge key={f} variant={(catIdx + fIdx) % 2 === 0 ? "blue" : "violet"}>{f}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Integrations ── */}
      {section === "integrations" && (
        <div className="space-y-6">
          {integrations.map((cat) => (
            <div key={cat.category} className="space-y-3">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-[15px]">{cat.category}</h2>
                <span className="text-[10.5px] text-text-ghost bg-surface-raised border border-border rounded-full px-2 py-0.5">
                  {cat.tools.length} tool{cat.tools.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.tools.map((t) => (
                  <Badge key={t} variant="ghost">{t}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Key URLs ── */}
      {section === "urls" && (
        <div className="space-y-4">
          <DataTable
            headers={["Name", "URL", "Purpose"]}
            rows={keyUrls.map((u) => [
              <span key="name" className="text-[13px] font-medium">{u.name}</span>,
              <a
                key="url"
                href={u.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[12px] text-blue hover:underline"
              >
                {u.url}
              </a>,
              <span key="purpose" className="text-[13px] text-text-dim">{u.purpose}</span>,
            ])}
          />
        </div>
      )}

      {/* ── Infrastructure ── */}
      {section === "infra" && (
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="font-semibold text-[15px]">Infrastructure Layers</h2>
            <DataTable
              headers={["Layer", "Technology", "Evidence"]}
              rows={infraLayers.map((l) => [
                <span key="layer" className="text-[13px] font-medium">{l.layer}</span>,
                <code key="tech" className="font-mono text-[12px] text-blue">{l.tech}</code>,
                <span key="evidence" className="text-[13px] text-text-dim">{l.evidence}</span>,
              ])}
            />
          </div>
          <div className="space-y-3">
            <h2 className="font-semibold text-[15px]">
              GitHub Repositories
              <span className="ml-2 text-[11px] font-normal text-text-ghost">13 total — 6 original, 7 forked</span>
            </h2>
            <ul className="space-y-2">
              {repos.map((r) => (
                <li key={r.name} className="flex items-start gap-3 text-[13px]">
                  <span className={cn(
                    "mt-0.5 inline-block px-1.5 py-0 rounded text-[9.5px] font-bold uppercase tracking-wide shrink-0",
                    r.forked ? "bg-amber-dim text-amber" : "bg-blue-dim text-blue"
                  )}>
                    {r.forked ? "fork" : "orig"}
                  </span>
                  <code className="font-mono text-[12px] text-blue w-44 shrink-0">{r.name}</code>
                  <span className="text-text-dim">{r.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
