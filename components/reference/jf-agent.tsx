"use client";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";

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
  "JELLYFISH_API_TOKEN", "JIRA_USERNAME", "JIRA_PASSWORD", "JIRA_BEARER_TOKEN",
  "GITHUB_TOKEN", "GITLAB_TOKEN", "ADO_TOKEN", "BITBUCKET_CLOUD_USERNAME",
  "BITBUCKET_CLOUD_APP_PASSWORD", "BITBUCKET_USERNAME", "BITBUCKET_PASSWORD", "REQUESTS_CA_BUNDLE",
];

export function JfAgentSection() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h2 className="font-semibold text-[15px]">Supported Git Providers</h2>
        <DataTable
          caption="Supported git providers"
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
          caption="Agent run modes"
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
          {jfAgentEnvVars.map((v) => <Badge key={v} variant="blue">{v}</Badge>)}
        </div>
      </div>
    </div>
  );
}
