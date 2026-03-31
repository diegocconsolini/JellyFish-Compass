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
  | "infra"
  | "agent_config"
  | "personas"
  | "resources"
  | "library"
  | "limitations";

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
  { id: "agent_config", label: "Agent Config" },
  { id: "personas", label: "Personas" },
  { id: "resources", label: "Resources" },
  { id: "library", label: "Knowledge Library" },
  { id: "limitations", label: "Limitations" },
];

const agentEndpoints = [
  { endpoint: "/endpoints/agent/pull-state", method: "GET", desc: "Agent configuration retrieval" },
  { endpoint: "/endpoints/agent/jira-issue-metadata", method: "GET", desc: "Paginated Jira issue metadata" },
  { endpoint: "/endpoints/agent/company", method: "GET", desc: "Company information retrieval" },
  { endpoint: "/endpoints/agent/unlinked-dev-issues", method: "GET", desc: "Orphaned/unlinked development issues" },
  { endpoint: "/endpoints/agent/healthcheck/signed-url", method: "GET", desc: "Health check upload via S3 signed URL" },
  { endpoint: "/endpoints/agent/upload_manifest", method: "POST", desc: "Data manifest upload" },
  { endpoint: "/endpoints/ingest/signed-url", method: "GET", desc: "S3 pre-signed URL for data ingestion" },
];

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

const mcpConfigVars = [
  { name: "JELLYFISH_API_TOKEN", required: "Required", defaultVal: "—", desc: "Authentication credential from Jellyfish API Export settings (requires Admin User Role)" },
  { name: "HUGGINGFACE_API_TOKEN", required: "Optional", defaultVal: '""', desc: "For PromptGuard 2 prompt injection mitigation (Meta Llama)" },
  { name: "MODEL_AVAILABILITY", required: "Optional", defaultVal: "false", desc: "Allow requests if Hugging Face model unavailable. Set true to allow data if PromptGuard cannot be reached." },
  { name: "MODEL_TIMEOUT", required: "Optional", defaultVal: "10", desc: "How long to wait for the PromptGuard model to respond, in seconds" },
];

const gitProviders = [
  { name: "GitHub (Cloud & Enterprise)", constant: "GH_PROVIDER", url: "https://api.github.com or https://github.yourcompany.com/api/v3" },
  { name: "GitLab", constant: "GL_PROVIDER", url: "https://gitlab.yourcompany.com" },
  { name: "Bitbucket Cloud", constant: "BBC_PROVIDER", url: "https://api.bitbucket.org" },
  { name: "Bitbucket Server", constant: "BBS_PROVIDER", url: "https://bitbucket.yourcompany.com" },
  { name: "Azure DevOps", constant: "ADO_PROVIDER", url: "https://dev.azure.com" },
];

const runModes = [
  { mode: "download_and_send", desc: "Default: download all data and send to Jellyfish" },
  { mode: "download_only", desc: "Download data locally without sending" },
  { mode: "send_only", desc: "Send previously downloaded data" },
  { mode: "validate", desc: "Run health check validation" },
  { mode: "print_all_jira_fields", desc: "Print available Jira fields for configuration" },
  { mode: "print_apparently_missing_git_repos", desc: "Identify repos referenced in Jira but not in Git config" },
];

const jfAgentEnvVars = [
  "JELLYFISH_API_TOKEN",
  "JIRA_USERNAME",
  "JIRA_PASSWORD",
  "JIRA_BEARER_TOKEN",
  "GITHUB_TOKEN",
  "GITLAB_TOKEN",
  "ADO_TOKEN",
  "BITBUCKET_CLOUD_USERNAME",
  "BITBUCKET_CLOUD_APP_PASSWORD",
  "BITBUCKET_USERNAME",
  "BITBUCKET_PASSWORD",
  "REQUESTS_CA_BUNDLE",
];

const keyUrls = [
  { name: "Main Site", url: "https://jellyfish.co/", purpose: "Company homepage" },
  { name: "Product Overview", url: "https://jellyfish.co/product/", purpose: "Product feature overview" },
  { name: "Platform Tour", url: "https://jellyfish.co/tour/", purpose: "Guided product walkthrough" },
  { name: "Integrations", url: "https://jellyfish.co/platform/integrations/", purpose: "Full integrations catalog" },
  { name: "DevOps Metrics", url: "https://jellyfish.co/platform/devops-metrics/", purpose: "DORA metrics detail page" },
  { name: "Life Cycle Explorer", url: "https://jellyfish.co/platform/life-cycle-explorer/", purpose: "Issue-level operational analysis" },
  { name: "DevEx", url: "https://jellyfish.co/platform/devex/", purpose: "Developer experience insights" },
  { name: "Resource Allocations", url: "https://jellyfish.co/platform/resource-allocations/", purpose: "FTE-based allocation model" },
  { name: "Capacity Planner", url: "https://jellyfish.co/solutions/capacity-planner/", purpose: "Workload capacity prediction" },
  { name: "Platform Engineering", url: "https://jellyfish.co/solutions/platform-engineering/", purpose: "Platform engineering solution" },
  { name: "Eng & Product Ops", url: "https://jellyfish.co/solutions/engineering-product-operations/", purpose: "Engineering operations solution" },
  { name: "Knowledge Library", url: "https://jellyfish.co/library/index/", purpose: "80+ articles across 17 categories" },
  { name: "Resources", url: "https://jellyfish.co/resources/", purpose: "eBooks, guides, and reports" },
  { name: "Webinars", url: "https://jellyfish.co/webinars/", purpose: "On-demand webinars (7 pages)" },
  { name: "Help Center", url: "https://help.jellyfish.co/hc/en-us", purpose: "Product documentation (login required)" },
  { name: "Academy", url: "https://academy.jellyfish.co/app", purpose: "Training platform" },
  { name: "Trust Center", url: "https://jellyfish.co/learn/trust-center/", purpose: "Security and compliance" },
  { name: "Request Demo", url: "https://jellyfish.co/request-a-demo/", purpose: "Demo request form" },
  { name: "API Token Setup", url: "https://app.jellyfish.co/settings/data-connections/api-export", purpose: "API token configuration (login required)" },
  { name: "API Schema", url: "https://app.jellyfish.co/endpoints/export/v0/schema", purpose: "OpenAPI schema (auth required)" },
  { name: "API Contact", url: "mailto:api@jellyfish.co", purpose: "API support email" },
  { name: "AI Contact", url: "mailto:ai@jellyfish.co", purpose: "AI-related inquiries" },
  { name: "GitHub Organization", url: "https://github.com/Jellyfish-AI", purpose: "Open source repositories" },
];

const infraLayers = [
  { layer: "Database", tech: "PostgreSQL + Citus (distributed)", evidence: "pgmetrics fork with Citus 11 support commit" },
  { layer: "Workflow Orchestration", tech: "Prefect", evidence: "prefect fork with Jellyfish-specific bug fixes and dependency pins" },
  { layer: "Distributed Computing", tech: "Dask", evidence: "dask-cloudprovider fork with AWS ECS throttle fix" },
  { layer: "Task Queue", tech: "Celery", evidence: "celery fork in Jellyfish-AI organization" },
  { layer: "Cloud Infrastructure", tech: "AWS (ECS, S3, Secrets Manager)", evidence: "prefect-aws fork; dask-cloudprovider ECS commits" },
  { layer: "GitHub API Client", tech: "PyGithub (customized)", evidence: "PyGithub fork with retry logic and session support for jf_agent" },
  { layer: "Rate Limiting", tech: "Custom (replaced ratelimit fork)", evidence: "Multi-realm, thread-safe implementation in jf_agent/ratelimit.py" },
  { layer: "Backend Framework", tech: "Django + Django REST Framework", evidence: "rec-resources interview repo" },
  { layer: "Frontend", tech: "React + TypeScript", evidence: "rec-resources interview repo" },
];

const repos = [
  { name: "jellyfish-mcp", forked: false, desc: "MCP server for querying Jellyfish data via AI assistants (25 tools)" },
  { name: "jf_agent", forked: false, desc: "On-premises agent for collecting and sending data to Jellyfish" },
  { name: "Jellyfish-Integration-Resources", forked: false, desc: "Azure DevOps setup scripts (webhooks + user extraction)" },
  { name: "jellyfish-buildkite-plugin", forked: false, desc: "Buildkite CI/CD plugin for deployment event reporting" },
  { name: "twistedtentacles", forked: false, desc: "Interview assessment: order processing system" },
  { name: "rec-resources", forked: false, desc: "Interview assessment: Jira issue list mock app (Django + React)" },
  { name: "ratelimit", forked: true, desc: "API Rate Limit Decorator (superseded by custom implementation)" },
  { name: "PyGithub", forked: true, desc: "GitHub API v3 client with retry logic and session support" },
  { name: "pgmetrics", forked: true, desc: "PostgreSQL stats collector with Citus 11 support" },
  { name: "prefect", forked: true, desc: "Workflow orchestration with Jellyfish-specific bug fixes" },
  { name: "prefect-aws", forked: true, desc: "Prefect AWS integrations (ECS, S3, Secrets Manager)" },
  { name: "dask-cloudprovider", forked: true, desc: "Cloud cluster management with AWS ECS throttle fix" },
  { name: "celery", forked: true, desc: "Distributed task queue (fork based on v4.3.0)" },
];

const additionalMetrics = [
  "Issue Cycle Time",
  "Flow Metrics",
  "Code Churn",
  "Unlinked Pull Requests",
  "Sprint Summaries",
  "FTE Allocations",
  "Work Effort Distribution",
];

const agentConfig = {
  global: ["no_verify_ssl", "send_agent_config"],
  jira: [
    { name: "url", desc: "Jira instance URL" },
    { name: "gdpr_active", desc: "Enable GDPR compliance mode" },
    { name: "earliest_issue_dt", desc: "Earliest issue date to fetch" },
    { name: "issue_download_concurrent_threads", desc: "Concurrent download threads (default: 10)" },
    { name: "issue_batch_size", desc: "Issues per batch (default: 100)" },
    { name: "download_worklogs", desc: "Download worklogs (default: True)" },
    { name: "download_sprints", desc: "Download sprints (default: True)" },
    { name: "filter_boards_by_projects", desc: "Filter boards by project (default: False)" },
    { name: "recursively_download_parents", desc: "Download parent issues recursively (default: False)" },
    { name: "include_projects / exclude_projects", desc: "Filter by Jira project key" },
    { name: "include_project_categories / exclude_project_categories", desc: "Filter by project category" },
    { name: "issue_jql", desc: "Custom JQL filter" },
    { name: "exclude_fields", desc: "Fields to exclude (e.g., description, comment)" },
    { name: "required_email_domains", desc: "Only include users from these domains" },
    { name: "is_email_required", desc: "Require email for user matching" },
    { name: "skip_saving_data_locally", desc: "Skip local file storage" },
  ],
  git: [
    { name: "provider", desc: "One of: bitbucket_server, bitbucket_cloud, gitlab, github, ado" },
    { name: "url", desc: "Git provider URL" },
    { name: "include_projects / exclude_projects", desc: "Filter by project/group" },
    { name: "include_repos / exclude_repos", desc: "Filter by repository name" },
    { name: "include_branches", desc: "Branch filter with wildcard support (*, ?)" },
    { name: "strip_text_content", desc: "Redact commit messages and PR text" },
    { name: "redact_names_and_urls", desc: "Redact personal names and URLs" },
    { name: "verbose", desc: "Enable verbose logging" },
    { name: "ado_api_version", desc: "Azure DevOps API version (default: 7.0)" },
    { name: "instance_slug / creds_envvar_prefix", desc: "Multi-instance support for multiple git providers" },
  ],
  cli: [
    { flag: "--mode / -m", desc: "Run mode (default: download_and_send)" },
    { flag: "--config-file / -c", desc: "Path to YAML config file" },
    { flag: "--output-basedir / -ob", desc: "Base directory for output files" },
    { flag: "--prev-output-dir / -od", desc: "Previous output directory for incremental runs" },
    { flag: "--jellyfish-api-base", desc: "Override API base URL" },
    { flag: "--jellyfish-webhook-base", desc: "Override webhook base URL" },
    { flag: "--env-file / -e", desc: "Path to environment file" },
    { flag: "--debug-requests / -db", desc: "Enable HTTP request debugging" },
    { flag: "--from-failure / -f", desc: "Resume from last failure point" },
  ],
  dataTypes: {
    jira: ["Issues (key, status, assignee, reporter, creator, resolution, dates, subtasks, parent, issuelinks, project, issuetype)", "Worklogs", "Sprints and boards", "Project metadata"],
    git: ["Repositories", "Commits", "Branches", "Pull requests", "Users/contributors", "Projects/groups/organizations"],
  },
};

const buildkiteConfig = [
  { param: "webhook-url", required: true, defaultVal: "—", desc: "Jellyfish deployment webhook URL" },
  { param: "api-token", required: true, defaultVal: "—", desc: "Jellyfish API token" },
  { param: "reference-id", required: false, defaultVal: "$BUILDKITE_BUILD_ID", desc: "Unique deployment identifier" },
  { param: "name", required: false, defaultVal: "$BUILDKITE_PIPELINE_SLUG", desc: "Deployment name" },
  { param: "repo-name", required: false, defaultVal: "Extracted from $BUILDKITE_REPO", desc: "Repository name (org/repo format)" },
  { param: "labels", required: false, defaultVal: "[]", desc: "Array of key:value labels for categorization" },
  { param: "source-url", required: false, defaultVal: "$BUILDKITE_BUILD_URL", desc: "URL to build source" },
];

const personas = [
  { role: "Engineering Executives", useCases: "Strategic alignment, investment decisions, board reporting" },
  { role: "Engineering Managers", useCases: "Team health, operational effectiveness, people management" },
  { role: "Product Leaders", useCases: "Delivery tracking, capacity planning, roadmap alignment" },
  { role: "PMO & Engineering Operations", useCases: "Workflow analysis, process optimization, metrics" },
  { role: "Platform Engineering", useCases: "Developer tooling impact, DevEx measurement, infrastructure ROI" },
  { role: "Finance Teams", useCases: "Software capitalization, R&D financial reporting" },
  { role: "Software Developers", useCases: "DevEx surveys, productivity feedback" },
];

const publishedResources = {
  ebooks: [
    "Why Platform Engineering Teams are Essential in the AI-Native Era (Feb 2026)",
    "The Engineering Leader's Guide to the AI Software Development Stack (Jan 2026)",
    "AI in Engineering: Moving Beyond Hype Into Reality (Nov 2025)",
    "7 AI KPIs Every Engineering Leader Should Track (Oct 2025)",
    "The AI Impact Framework (Sep 2025)",
    "6 Slides R&D Leaders Should Show at Board Meetings in an AI-Driven World (Sep 2025)",
    "Bridging Finance and R&D: Efficient Software Capitalization (May 2025)",
    "The 5 Elements of Software Engineering Management",
    "The Jellyfish Guide to Engineering Metrics",
    "5 Jira Best Practices for Improving Engineering Operations",
  ],
  reports: [
    "2025 State of Engineering Management Report (Jul 2025)",
    "GenAI: Perception vs Reality (May 2025)",
  ],
};

const libraryCategories = [
  "Software Engineering Management", "DevOps", "Metrics & KPIs",
  "Developer Productivity", "Developer Experience", "Code Quality",
  "SDLC", "Value Stream", "Software Capitalization",
  "Platform Engineering", "AI in Software Development",
  "Delivery & Planning", "Product & Operations", "Engineering Roles",
  "Analytics", "Transformation", "Strategic Planning",
];

const limitations = [
  "API Documentation is behind authentication. The full OpenAPI/Swagger schema requires a Jellyfish API token.",
  "Help Center (help.jellyfish.co) requires authenticated access.",
  "Resources and Webinar archives span 7 pages; only page 1 was fully enumerable.",
  "The 7 agent endpoints in Section 1.3 are internal to jf_agent and are not part of the customer-facing Export API.",
  "Integration source provenance varies: some are from the integrations page, others from the homepage or product pages.",
  "DORA metric descriptions are verbatim from jellyfish.co/platform/devops-metrics/. Exactly 4 metrics.",
  "MCP tool descriptions are from manifest.json, lightly paraphrased for conciseness.",
  "REQUESTS_CA_BUNDLE is a standard Python requests library variable, not Jellyfish-specific.",
  "All data in this reference is sourced from official Jellyfish materials. No fabrications.",
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
          <p className="text-sm text-text-dim">Internal API endpoints used by the <code className="font-mono text-[12px]">jf_agent</code> for data ingestion. These are not part of the public Export API.</p>
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
            headers={["Method", "Endpoint", "Auth Header", "Description"]}
            rows={webhookEndpoints.map((wh) => [
              <span key="method" className="inline-block px-2 py-0.5 rounded text-[10.5px] font-bold bg-violet-dim text-violet">{wh.method}</span>,
              <code key="path" className="font-mono text-[12px] text-blue">{wh.path}</code>,
              <code key="auth" className="font-mono text-[11px] text-text-dim">{wh.auth}</code>,
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
              headers={["Provider", "Constant", "URL Format"]}
              rows={gitProviders.map((p) => [
                <span key="name" className="text-[13px] font-medium">{p.name}</span>,
                <code key="constant" className="font-mono text-[12px] text-blue">{p.constant}</code>,
                <code key="url" className="font-mono text-[12px] text-text-dim">{p.url}</code>,
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
              <StatCard label="Revenue Focus" value="32%" note="More focus on revenue-maximizing work" color="blue" trend="jellyfish.co/tour" trendDirection="up" />
              <StatCard label="Cycle Time" value="2.6d" note="Reduction in cycle time" color="green" trend="jellyfish.co/tour" trendDirection="up" />
              <StatCard label="Time to Market" value="21%" note="Faster time to market" color="violet" trend="jellyfish.co/tour" trendDirection="up" />
              <StatCard label="Collaboration" value="25%" note="More team collaboration" color="amber" trend="jellyfish.co/tour" trendDirection="up" />
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
          <div className="mt-6 space-y-3">
            <h2 className="font-semibold text-[15px]">Additional Platform Features</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-surface p-5 space-y-2">
                <h3 className="text-sm font-bold">Jellyfish Assistant</h3>
                <p className="text-[13px] text-text-dim">AI-powered assistant for natural language queries against engineering data.</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-5 space-y-2">
                <h3 className="text-sm font-bold">Jellyfish Academy</h3>
                <p className="text-[13px] text-text-dim">Training platform at <a href="https://academy.jellyfish.co/app" target="_blank" rel="noopener noreferrer" className="text-blue hover:underline">academy.jellyfish.co</a></p>
              </div>
            </div>
          </div>
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

      {/* ── Agent Config ── */}
      {section === "agent_config" && (
        <div className="space-y-8">
          <p className="text-sm text-text-dim">
            Configuration for the <code className="font-mono text-[12px]">jf_agent</code> on-premises data collection agent.
            Version 0.1.3 | Python | MIT License | Docker: <code className="font-mono text-[12px]">jellyfishco/jf_agent:stable</code>
          </p>

          <div className="space-y-3">
            <h2 className="font-semibold text-[15px]">Data Types Collected</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-surface p-5 space-y-2">
                <h3 className="text-sm font-bold">Jira Data</h3>
                <ul className="space-y-1">{agentConfig.dataTypes.jira.map((d) => <li key={d} className="text-[13px] text-text-dim">• {d}</li>)}</ul>
              </div>
              <div className="rounded-xl border border-border bg-surface p-5 space-y-2">
                <h3 className="text-sm font-bold">Git Data (per provider)</h3>
                <ul className="space-y-1">{agentConfig.dataTypes.git.map((d) => <li key={d} className="text-[13px] text-text-dim">• {d}</li>)}</ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-semibold text-[15px]">Jira Configuration (example.yml)</h2>
            <DataTable
              headers={["Option", "Description"]}
              rows={agentConfig.jira.map((j) => [
                <code key="name" className="font-mono text-[12px] text-blue">{j.name}</code>,
                <span key="desc" className="text-[13px] text-text-dim">{j.desc}</span>,
              ])}
            />
          </div>

          <div className="space-y-3">
            <h2 className="font-semibold text-[15px]">Git Configuration (example.yml)</h2>
            <DataTable
              headers={["Option", "Description"]}
              rows={agentConfig.git.map((g) => [
                <code key="name" className="font-mono text-[12px] text-blue">{g.name}</code>,
                <span key="desc" className="text-[13px] text-text-dim">{g.desc}</span>,
              ])}
            />
          </div>

          <div className="space-y-3">
            <h2 className="font-semibold text-[15px]">CLI Arguments</h2>
            <DataTable
              headers={["Flag", "Description"]}
              rows={agentConfig.cli.map((c) => [
                <code key="flag" className="font-mono text-[12px] text-blue">{c.flag}</code>,
                <span key="desc" className="text-[13px] text-text-dim">{c.desc}</span>,
              ])}
            />
          </div>

          <div className="space-y-3">
            <h2 className="font-semibold text-[15px]">Buildkite Plugin Configuration (pipeline.yml)</h2>
            <DataTable
              headers={["Parameter", "Required", "Default", "Description"]}
              rows={buildkiteConfig.map((b) => [
                <code key="param" className="font-mono text-[12px] text-blue">{b.param}</code>,
                <Badge key="req" variant={b.required ? "amber" : "ghost"}>{b.required ? "Required" : "Optional"}</Badge>,
                <code key="def" className="font-mono text-[12px] text-text-dim">{b.defaultVal}</code>,
                <span key="desc" className="text-[13px] text-text-dim">{b.desc}</span>,
              ])}
            />
          </div>
        </div>
      )}

      {/* ── Personas ── */}
      {section === "personas" && (
        <div className="space-y-4">
          <p className="text-sm text-text-dim">Jellyfish serves 7 target personas across engineering, product, finance, and operations.</p>
          <DataTable
            headers={["Persona", "Use Cases"]}
            rows={personas.map((p) => [
              <span key="role" className="text-[13px] font-medium">{p.role}</span>,
              <span key="use" className="text-[13px] text-text-dim">{p.useCases}</span>,
            ])}
          />
        </div>
      )}

      {/* ── Resources ── */}
      {section === "resources" && (
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="font-semibold text-[15px]">eBooks & Guides <Badge variant="ghost">{publishedResources.ebooks.length}</Badge></h2>
            <ul className="space-y-2">
              {publishedResources.ebooks.map((e) => <li key={e} className="text-[13px] text-text-dim">• {e}</li>)}
            </ul>
          </div>
          <div className="space-y-3">
            <h2 className="font-semibold text-[15px]">Reports <Badge variant="ghost">{publishedResources.reports.length}</Badge></h2>
            <ul className="space-y-2">
              {publishedResources.reports.map((r) => <li key={r} className="text-[13px] text-text-dim">• {r}</li>)}
            </ul>
          </div>
          <p className="text-[11px] text-text-ghost">Note: Webinar archive spans 7 pages with 9+ on-demand sessions. See jellyfish.co/webinars/ for the full list.</p>
        </div>
      )}

      {/* ── Knowledge Library ── */}
      {section === "library" && (
        <div className="space-y-4">
          <p className="text-sm text-text-dim">
            The Jellyfish Knowledge Library at <a href="https://jellyfish.co/library/index/" target="_blank" rel="noopener noreferrer" className="text-blue hover:underline">jellyfish.co/library</a> contains 80+ articles across {libraryCategories.length} categories.
          </p>
          <div className="flex flex-wrap gap-2">
            {libraryCategories.map((cat, i) => (
              <Badge key={cat} variant={i % 2 === 0 ? "blue" : "violet"}>{cat}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* ── Limitations ── */}
      {section === "limitations" && (
        <div className="space-y-4">
          <p className="text-sm text-text-dim">Known limitations and notes about data sources in this reference.</p>
          <ol className="space-y-3">
            {limitations.map((l, i) => (
              <li key={i} className="flex gap-3 text-[13px]">
                <span className="text-text-ghost font-mono text-[11px] mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-text-dim">{l}</span>
              </li>
            ))}
          </ol>
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
