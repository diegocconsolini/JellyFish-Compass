"use client";
import { DataTable } from "@/components/ui/data-table";
import { cn } from "@/lib/utils";

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

export function InfrastructureSection() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h2 className="font-semibold text-[15px]">Infrastructure Layers</h2>
        <DataTable
          caption="Infrastructure stack"
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
          <span className="ml-2 text-xs font-normal text-text-ghost">13 total — 6 original, 7 forked</span>
        </h2>
        <ul className="space-y-2">
          {repos.map((r) => (
            <li key={r.name} className="flex items-start gap-3 text-[13px]">
              <span className={cn(
                "mt-0.5 inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shrink-0",
                r.forked ? "bg-amber-dim text-amber" : "bg-blue-dim text-blue"
              )}>
                {r.forked ? "fork" : "orig"}
              </span>
              <code className="font-mono text-xs text-blue break-all">{r.name}</code>
              <span className="text-text-dim">{r.desc}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
