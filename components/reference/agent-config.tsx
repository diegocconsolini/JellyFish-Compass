"use client";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";

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

export function AgentConfigSection() {
  return (
    <div className="space-y-8">
      <p className="text-sm text-text-dim">
        Configuration for the <code className="font-mono text-[12px]">jf_agent</code> on-premises data collection agent.
        Version 0.1.3 | Python | MIT License | Docker: <code className="font-mono text-[12px]">jellyfishco/jf_agent:stable</code>
      </p>
      <div className="space-y-3">
        <h2 className="font-semibold text-[15px]">Data Types Collected</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          caption="Jira configuration options"
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
          caption="Git configuration options"
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
          caption="CLI arguments"
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
          caption="Buildkite plugin parameters"
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
  );
}
