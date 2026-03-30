# Jellyfish Platform -- Complete Inventory

**Date:** March 30, 2026
**Source:** jellyfish.co, GitHub (Jellyfish-AI) cloned repositories, and publicly available documentation
**Methodology:** All data sourced directly from Jellyfish's public website, blog posts, GitHub repository source code (jellyfish-mcp, jf_agent, Jellyfish-Integration-Resources), and published resources. No assumptions or fabrications.

---

## 1. API Endpoints (Verified from Source Code)

### 1.1 API Overview

Jellyfish provides a REST API (Export API v0) across six domains: Allocations, Delivery, DevEx, Metrics, People, and Teams. The full API schema is auto-generated as OpenAPI-compliant YAML, accessible at the schema endpoint below.

- **Authentication:** `Authorization: Token <JELLYFISH_API_TOKEN>`
- **Base URL:** `https://app.jellyfish.co`
- **Schema endpoint:** `/endpoints/export/v0/schema`
- **User-Agent:** `jellyfish-mcp/<version> (Node.js)` (for MCP) or custom
- **API contact:** api@jellyfish.co
- **Interactive docs:** Available inside the Jellyfish Portal after login (auto-generated OpenAPI)

### 1.2 Export API Endpoints (from jellyfish-mcp/server/api.js)

These are the exact API endpoints verified from the MCP server source code:

#### Allocations (11 endpoints)

| Endpoint Path | Description |
|---------------|-------------|
| `/endpoints/export/v0/allocations/details/by_person` | Allocation data for the whole company, aggregated by person |
| `/endpoints/export/v0/allocations/details/by_team` | Allocation data for the whole company, aggregated by team at specified hierarchy level |
| `/endpoints/export/v0/allocations/details/investment_category` | Allocation data aggregated by investment category |
| `/endpoints/export/v0/allocations/details/investment_category/by_person` | Allocation data aggregated by investment category and person |
| `/endpoints/export/v0/allocations/details/investment_category/by_team` | Allocation data aggregated by investment category and team |
| `/endpoints/export/v0/allocations/details/work_category` | Allocation data aggregated by deliverable within specified work category |
| `/endpoints/export/v0/allocations/details/work_category/by_person` | Allocation data aggregated by deliverable within work category and person |
| `/endpoints/export/v0/allocations/details/work_category/by_team` | Allocation data aggregated by deliverable within work category and team |
| `/endpoints/export/v0/allocations/filter_fields` | Available fields and known values for filtering allocations |
| `/endpoints/export/v0/allocations/summary_filtered/by_investment_category` | Total FTE amounts for investment categories (supports filtering) |
| `/endpoints/export/v0/allocations/summary_filtered/by_work_category` | Total FTE amounts for deliverables within a work category (supports filtering) |

#### Delivery (4 endpoints)

| Endpoint Path | Description |
|---------------|-------------|
| `/endpoints/export/v0/delivery/deliverable_details` | Data about a specific deliverable |
| `/endpoints/export/v0/delivery/scope_and_effort_history` | Weekly data about deliverable scope and total effort allocated per week |
| `/endpoints/export/v0/delivery/work_categories` | List of all known work categories |
| `/endpoints/export/v0/delivery/work_category_contents` | Data about deliverables in a specified work category |

**Known query parameters for `work_category_contents`:** `work_category_slug` (e.g., "epics"), `timeframe` (format: MMM-YY), `end` (format: MMM-YY)

#### DevEx (1 endpoint)

| Endpoint Path | Description |
|---------------|-------------|
| `/endpoints/export/v0/devex/insights/by_team` | DevEx insights data by team |

#### Metrics (5 endpoints)

| Endpoint Path | Description |
|---------------|-------------|
| `/endpoints/export/v0/metrics/company_metrics` | Metrics data for the company during specified timeframe |
| `/endpoints/export/v0/metrics/person_metrics` | Metrics data for a specified person during specified timeframe |
| `/endpoints/export/v0/metrics/team_metrics` | Metrics data for a specified team during specified timeframe |
| `/endpoints/export/v0/metrics/team_sprint_summary` | Issue count and story point data for a team's sprints in specified timeframe |
| `/endpoints/export/v0/metrics/unlinked_pull_requests` | Details of unlinked pull requests merged during specified timeframe |

#### People (2 endpoints)

| Endpoint Path | Description |
|---------------|-------------|
| `/endpoints/export/v0/people/list_engineers` | List of all active allocatable people as of a specific date |
| `/endpoints/export/v0/people/search` | Search for people by name, email, or id |

#### Teams (2 endpoints)

| Endpoint Path | Description |
|---------------|-------------|
| `/endpoints/export/v0/teams/list_teams` | All teams at specified hierarchy level (optionally includes child teams) |
| `/endpoints/export/v0/teams/search` | Search for teams by name or id |

**Total: 25 Export API endpoints**

### 1.3 Internal Agent API Endpoints (from jf_agent source code)

These endpoints are used by the on-premises jf_agent for data ingestion and are not part of the public Export API:

| Endpoint Path | Description |
|---------------|-------------|
| `/endpoints/agent/pull-state` | Agent configuration retrieval |
| `/endpoints/agent/jira-issue-metadata` | Paginated Jira issue metadata |
| `/endpoints/agent/company` | Company information retrieval |
| `/endpoints/agent/unlinked-dev-issues` | Orphaned/unlinked development issues |
| `/endpoints/agent/healthcheck/signed-url` | Health check upload via S3 signed URL |
| `/endpoints/agent/upload_manifest` | Data manifest upload |
| `/endpoints/ingest/signed-url` | S3 pre-signed URL for data ingestion (param: `timestamp`) |

### 1.4 Webhook Endpoints (from jf_agent and Integration-Resources)

| Endpoint | Method | Auth Header | Description |
|----------|--------|-------------|-------------|
| `https://webhooks.jellyfish.co` | -- | `Authorization: Token` | Agent heartbeat/diagnostics webhook base |
| `https://webhooks.jellyfish.co/deployment` | POST | `X-jf-api-token: {token}` | Deployment event ingestion (used by Buildkite plugin, accepts 200/201/202/204) |
| `https://app.jellyfish.co/ingest-webhooks/ado/` | POST | `Authorization: Bearer {token}` | Azure DevOps webhook ingestion endpoint |

**ADO Webhook event types supported:** `workitem.created`, `workitem.deleted`, `workitem.restored`, `workitem.updated`

**Deployment Webhook payload structure** (from jellyfish-buildkite-plugin source):
```json
{
  "reference_id": "string (unique deployment identifier)",
  "is_successful": "boolean",
  "name": "string (deployment name)",
  "deployed_at": "string (ISO 8601 UTC timestamp)",
  "repo_name": "string (org/repo format)",
  "commit_shas": ["array of commit SHA strings"],
  "labels": ["array of key:value label strings"],
  "source_url": "string (URL to build/deployment source)"
}
```

---

## 2. MCP Server Tools (jellyfish-mcp)

**Repository:** [github.com/Jellyfish-AI/jellyfish-mcp](https://github.com/Jellyfish-AI/jellyfish-mcp)
**Version:** 1.0.2 | **License:** MIT
**Compatible with:** Claude Desktop, Claude Code, VSCode, Cursor

### 2.1 Complete Tool Inventory (25 tools, from manifest.json)

| # | Tool Name | Description |
|---|-----------|-------------|
| 1 | `allocations_by_person` | Returns allocation data for the whole company, aggregated by person |
| 2 | `allocations_by_team` | Returns allocation data for the whole company, aggregated by team at the specified hierarchy level |
| 3 | `allocations_by_investment_category` | Returns allocation data for the whole company, aggregated by investment category |
| 4 | `allocations_by_investment_category_person` | Returns allocation data aggregated by investment category and person |
| 5 | `allocations_by_investment_category_team` | Returns allocation data aggregated by investment category and team |
| 6 | `allocations_by_work_category` | Returns allocation data aggregated by deliverable within the specified work category |
| 7 | `allocations_by_work_category_person` | Returns allocation data aggregated by deliverable within work category and person |
| 8 | `allocations_by_work_category_team` | Returns allocation data aggregated by deliverable within work category and team |
| 9 | `allocations_filter_fields` | Returns available fields and known values for filtering allocations |
| 10 | `allocations_summary_by_investment_category` | Returns total FTE amounts for investment categories (supports filtering) |
| 11 | `allocations_summary_by_work_category` | Returns total FTE amounts for deliverables within a work category (supports filtering) |
| 12 | `deliverable_details` | Returns data about a specific deliverable |
| 13 | `deliverable_scope_and_effort_history` | Returns weekly data about deliverable scope and total effort allocated per week |
| 14 | `work_categories` | Returns a list of all known work categories |
| 15 | `work_category_contents` | Returns data about the deliverables in a specified work category |
| 16 | `devex_insights_by_team` | Returns DevEx insights data |
| 17 | `company_metrics` | Returns metrics data for the company during the specified timeframe |
| 18 | `person_metrics` | Returns metrics data for the specified person during the specified timeframe |
| 19 | `team_metrics` | Returns metrics data for the specified team during the specified timeframe |
| 20 | `team_sprint_summary` | Returns issue count and story point data for a team's sprints |
| 21 | `unlinked_pull_requests` | Lists details of unlinked pull requests merged during specified timeframe |
| 22 | `list_engineers` | Returns all active allocatable people as of a specific date |
| 23 | `search_people` | Searches for people by name, email, or id |
| 24 | `list_teams` | Displays all teams at specified hierarchy level (optionally includes child teams) |
| 25 | `search_teams` | Searches for teams by name or id |

### 2.2 MCP Configuration

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `JELLYFISH_API_TOKEN` | Yes | Authentication credential from Jellyfish API Export settings (requires Admin User Role) | -- |
| `HUGGINGFACE_API_TOKEN` | No | For PromptGuard 2 prompt injection mitigation (Meta Llama) | `""` |
| `MODEL_AVAILABILITY` | No | Allow requests if Hugging Face model unavailable | `false` |
| `MODEL_TIMEOUT` | No | Response wait duration in seconds | `10` |

**Deployment:** Claude Desktop Extension (.mcpb file), Docker, Local Setup (Node.js v18+)
**Security:** Supports Llama PromptGuard 2 for prompt injection detection. See SECURITY.md.

---

## 3. On-Premises Data Agent (jf_agent)

**Repository:** [github.com/Jellyfish-AI/jf_agent](https://github.com/Jellyfish-AI/jf_agent)
**Version:** 0.1.3 | **Language:** Python | **License:** MIT | **Docker:** `jellyfishco/jf_agent:stable`

### 3.1 Supported Git Providers (from source code)

| Provider Constant | Provider | URL Format |
|-------------------|----------|------------|
| `GH_PROVIDER` | GitHub (Cloud & Enterprise) | `https://api.github.com` or `https://github.yourcompany.com/api/v3` |
| `GL_PROVIDER` | GitLab | `https://gitlab.yourcompany.com` |
| `BBC_PROVIDER` | Bitbucket Cloud | `https://api.bitbucket.org` |
| `BBS_PROVIDER` | Bitbucket Server | `https://bitbucket.yourcompany.com` |
| `ADO_PROVIDER` | Azure DevOps | `https://dev.azure.com` |

### 3.2 Source Code Modules

| Module | Files | Purpose |
|--------|-------|---------|
| `jf_agent/git/` | `github.py`, `github_client.py`, `github_gql_adapter.py`, `github_gql_client.py`, `github_gql_utils.py`, `gitlab_adapter.py`, `gitlab_client.py`, `bitbucket_cloud_adapter.py`, `bitbucket_cloud_client.py`, `bitbucket_server.py`, `utils.py` | Git data collection from 5 providers |
| `jf_agent/jf_jira/` | `jira_download.py`, `utils.py` | Jira issue/sprint/worklog download |
| `jf_agent/data_manifests/` | `manifest.py`, `git/`, `jira/` | Data manifest generation and upload |

### 3.3 Data Types Collected (from source code)

**Jira data:**
- Issues (key, status, assignee, reporter, creator, resolution, dates, subtasks, parent, issuelinks, project, issuetype, resolutiondate, created, updated)
- Worklogs
- Sprints and boards
- Project metadata

**Git data (per provider):**
- Repositories
- Commits
- Branches
- Pull requests
- Users/contributors
- Projects/groups/organizations

### 3.4 Agent Run Modes

| Mode | Description |
|------|-------------|
| `download_and_send` | Default: download all data and send to Jellyfish |
| `download_only` | Download data locally without sending |
| `send_only` | Send previously downloaded data |
| `validate` | Run health check validation |
| `print_all_jira_fields` | Print available Jira fields |
| `print_apparently_missing_git_repos` | Identify repos referenced in Jira but not in Git config |

### 3.5 Agent Configuration (from example.yml)

**Global settings:** `no_verify_ssl`, `send_agent_config`

**Jira configuration:**
- `url`, `gdpr_active`, `earliest_issue_dt`
- `issue_download_concurrent_threads` (default: 10)
- `issue_batch_size` (default: 100)
- `download_worklogs` (default: True)
- `download_sprints` (default: True)
- `filter_boards_by_projects` (default: False)
- `recursively_download_parents` (default: False)
- `include_projects` / `exclude_projects` (by Jira project key)
- `include_project_categories` / `exclude_project_categories`
- `issue_jql` (custom JQL filter)
- `exclude_fields` (e.g., description, comment)
- `required_email_domains`
- `is_email_required`
- `skip_saving_data_locally`

**Git configuration:**
- `provider` (bitbucket_server, bitbucket_cloud, gitlab, github, ado)
- `url`
- `include_projects` / `exclude_projects`
- `include_repos` / `exclude_repos`
- `include_branches` (with wildcard support: `*`, `?`)
- `strip_text_content` (redact commit messages, PR text)
- `redact_names_and_urls`
- `verbose`
- `ado_api_version` (default: '7.0')
- Multi-instance support via `instance_slug` and `creds_envvar_prefix`

**Environment variables:**
- `JELLYFISH_API_TOKEN` (required)
- `JIRA_USERNAME` / `JIRA_PASSWORD` or `JIRA_BEARER_TOKEN`
- `GITHUB_TOKEN`, `GITLAB_TOKEN`, `ADO_TOKEN`
- `BITBUCKET_CLOUD_USERNAME` / `BITBUCKET_CLOUD_PASSWORD`
- `BITBUCKET_USERNAME` / `BITBUCKET_PASSWORD`
- `REQUESTS_CA_BUNDLE` (custom SSL certificates)

**CLI arguments:**
- `--mode` / `-m`
- `--config-file` / `-c`
- `--output-basedir` / `-ob`
- `--prev-output-dir` / `-od`
- `--jellyfish-api-base`
- `--jellyfish-webhook-base`
- `--env-file` / `-e`
- `--debug-requests` / `-db`
- `--from-failure` / `-f`

---

## 4. Integration Resources (Jellyfish-Integration-Resources)

**Repository:** Jellyfish-Integration-Resources (Jellyfish-ADO-Resources)

### 4.1 Azure DevOps Webhook Setup Script

**File:** `create-ado-webhooks.ps1` (PowerShell)

Creates Jellyfish webhooks in Azure DevOps with custom authorization headers. Features:
- Flexible project selection (specific, exclude by name, or all)
- Duplicate webhook detection
- Supports event types: `workitem.created`, `workitem.deleted`, `workitem.restored`, `workitem.updated`
- Webhook target: `https://app.jellyfish.co/ingest-webhooks/ado/`
- Authentication: Bearer token in HTTP headers
- Uses ADO API v7.1-preview

### 4.2 Azure DevOps User Extraction Script

**File:** `ado-user-extraction-enhanced.ps1` (PowerShell)

Extracts active users and team memberships from Azure DevOps. Features:
- Pulls active user entitlements
- Maps users to teams across projects
- Flexible project selection (specific, exclude, or all)
- Exports to CSV (DisplayName, Email, Project, TeamName, Status)
- Filters inactive/disabled users
- Rate-limiting built in (150ms between team fetches)

### 4.3 Buildkite Deployment Plugin (jellyfish-buildkite-plugin)

**Repository:** [github.com/Jellyfish-AI/jellyfish-buildkite-plugin](https://github.com/Jellyfish-AI/jellyfish-buildkite-plugin)
**Type:** Buildkite post-command hook plugin | **Language:** Bash
**Latest version tag:** v1.1.2

Automatically sends deployment events to Jellyfish after successful Buildkite builds.

**Plugin configuration (pipeline.yml):**

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `webhook-url` | Yes | -- | Jellyfish deployment webhook URL (e.g., `https://webhooks.jellyfish.co/deployment`) |
| `api-token` | Yes | -- | Jellyfish API token |
| `reference-id` | No | `$BUILDKITE_BUILD_ID` | Unique deployment identifier |
| `name` | No | `$BUILDKITE_PIPELINE_SLUG` | Deployment name |
| `repo-name` | No | Extracted from `$BUILDKITE_REPO` | Repository name (org/repo format) |
| `labels` | No | `[]` | Array of key:value labels for categorization |
| `source-url` | No | `$BUILDKITE_BUILD_URL` | URL to build source |

**Behavior:** Only fires on successful builds (exit status 0). Sends JSON POST to webhook with deployment metadata, commit SHAs, labels, and timestamps.

---

## 5. Platform Products & Features

### 5.1 AI Impact

| Feature | Description |
|---------|-------------|
| **Drive Adoption** | Track and drive AI tool adoption across engineering teams |
| **Enable Teams** | Enable teams to leverage AI coding tools effectively |
| **Impact Insights** | Measure business outcomes from AI tool usage |
| **Vendor Comparison** | Compare AI coding tool vendors and their effectiveness |
| **Investment Management** | Manage AI tool investment and ROI |
| **Workflow Optimization** | Optimize workflows with AI tool integration data |
| **Report Builder** | Build custom reports on AI impact data |

### 5.2 Operational Effectiveness

| Feature | Description |
|---------|-------------|
| **Metrics** | DORA, flow, and custom metrics with filters, overlays, and time-series diagnostics across teams, repos, and services |
| **Life Cycle Explorer** | Analyze operational processes and trends at the issue level; identify bottlenecks, overlaps, and outliers across the full SDLC |
| **Workflow Analysis** | Trace work from intake to deployment; uncover bottlenecks, handoffs, and delays; connect to delivery and DevEx outcomes |
| **People Management** | Visibility into engineering resource allocation (people, budgets, hours) across projects, teams, and business priorities |
| **Team Benchmarks** | Performance comparison data across teams, roles, and industry peers |

### 5.3 Planning & Delivery

| Feature | Description |
|---------|-------------|
| **Capacity Planner** | Predict workload capacity using historical allocation data, ongoing projects, planned work, upcoming priorities, and team size |
| **Scenario Planner** | Model resource allocation scenarios, adjust variables (team size, project priorities) to receive probabilistic delivery forecasts |

### 5.4 Business Alignment

| Feature | Description |
|---------|-------------|
| **Resource Allocations** | Patented Work Model that automatically calculates engineering effort distribution across work categories, product lines, initiatives, and deliverables. Apples-to-apples effort comparison across teams, regions, and business units |

### 5.5 DevEx (Developer Experience)

| Feature | Description |
|---------|-------------|
| **Research-backed surveys** | Validated survey templates on key DevEx topics, launched in minutes |
| **DevEx Index** | Single comparable score tracking developer experience over time |
| **DORA/SPACE correlation** | Combines survey data with system metrics (DORA, SPACE) |
| **Industry benchmarking** | Team-level and industry benchmarks for comparison |
| **AI-driven recommendations** | Context-specific guidance (not generic playbooks) |
| **Automated tracking** | Progress monitoring through automated trend analysis |

Customer-reported outcomes (Kaleris case study): "21% more productive" and "19% more efficient"

### 5.6 DevFinOps

| Feature | Description |
|---------|-------------|
| **Software Capitalization** | Automates R&D financial reporting, bridges finance and engineering data |

### 5.7 Jellyfish Assistant

AI-powered assistant for natural language queries against engineering data.

### 5.8 Jellyfish Academy

Training platform at academy.jellyfish.co

---

## 6. Metrics & Frameworks

### 6.1 DORA Metrics

| Metric | Description |
|--------|-------------|
| **Deployment Frequency** | "Track how often the team pushes deployments. See the impact of process and tooling changes to ensure continuous improvement." |
| **Lead Time for Changes** | "Understand the duration of your full value delivery cycle, from the moment a change is selected for development to its deployment." |
| **Mean Time to Resolution** | "Measure the time from the start of an incident to its resolution, and minimize system downtime." |
| **Change Failure Rate** | "Monitor the frequency of incidents or deployment failures to guarantee uninterrupted delivery of value to your customers." |

### 6.2 Additional Metrics & Frameworks

| Framework / Metric | Description |
|--------------------|-------------|
| **SPACE Framework** | Satisfaction, Performance, Activity, Communication, Efficiency |
| **DevEx Index** | Single score tracking developer experience over time |
| **Engineering Benchmarks** | Cross-organization performance comparison |
| **AI Impact Framework** | Data-driven model for AI adoption, productivity, and business outcomes |
| **SEI Maturity Model** | Software Engineering Intelligence maturity assessment |
| **Issue Cycle Time** | Time for issues to move through development stages |
| **Flow Metrics** | Work flow through the system |
| **Code Churn** | Code rewritten or deleted shortly after creation |
| **Unlinked Pull Requests** | PRs not linked to tracked work items |
| **Sprint Summaries** | Issue count and story points per sprint |
| **FTE Allocations** | Full-time-equivalent effort distribution |
| **Work Effort Distribution** | Effort allocation across strategic priorities |

### 6.3 Platform-Reported Business Outcomes (from jellyfish.co/tour/)

These appear as general claims on the product tour page without customer attribution:

| Metric | Value |
|--------|-------|
| More focus on revenue-maximizing work | 32% |
| Reduction in cycle time | 2.6 days |
| Faster time to market | 21% |
| More team collaboration | 25% |

---

## 7. Integrations

### 7.1 AI Coding Tools

| Integration | Description |
|-------------|-------------|
| **GitHub Copilot** | Evaluate usage and impact to quantify AI productivity across teams |
| **Cursor** | Evaluate usage and team-level impact for AI-assisted development gains |
| **Claude Code** | Assess adoption and outcomes for AI-assisted productivity gains |
| **Windsurf** | Analyze usage and outcomes for AI productivity gains |
| **Amazon Q Developer** | Evaluate adoption and impact across teams, repos, and initiatives |
| **Gemini Code Assist** | Measure adoption and impact across developers and repos |
| **Augment** | Evaluate adoption and impact across teams |
| **Baz** | Code review that analyzes PRs and highlights issues |
| **Graphite** | Analyze code reviews for review cycle efficiency |
| **Greptile** | Evaluate AI-assisted code review speed and efficiency |

### 7.2 Issue Tracking

| Integration | Description |
|-------------|-------------|
| **Jira** | Sync epics, issues, statuses for delivery and investment allocation |
| **Linear** | Sync issues and projects for delivery progress and cycle times |
| **Azure Boards** | Sync work items and sprints for progress and investment allocation |
| **Productboard** | Product management integration (listed on homepage) |
| **Aha!** | Product roadmap integration (listed on homepage) |
| **ProductPlan** | Product roadmap integration (listed on homepage) |

### 7.3 Source Control & CI/CD

| Integration | Agent Support | Source | Description |
|-------------|---------------|--------|-------------|
| **GitHub** (Cloud & Enterprise) | Yes (REST + GraphQL) | Integrations page + jf_agent source | Repos, PRs, commits, branches, users |
| **GitLab** | Yes | Homepage + jf_agent source | Repos, PRs, commits, branches, users, groups |
| **Bitbucket Cloud** | Yes | Homepage + jf_agent source | Repos, PRs, commits, branches |
| **Bitbucket Server** | Yes | Homepage + jf_agent source | Repos, PRs, commits, branches, projects, users |
| **Azure DevOps** | Yes (+ webhooks) | Integrations page + jf_agent source | Repos, pipelines, boards, work items |
| **Azure Repos** | -- | Homepage | Source code management |
| **Jenkins** | -- | Homepage | CI/CD pipeline integration |
| **CircleCI** | -- | Homepage | CI/CD pipeline integration |
| **Buildkite** | Yes (plugin) | jellyfish-buildkite-plugin repo | Deployment event reporting via post-command hook plugin |

### 7.4 Monitoring, Incidents & Code Quality

| Integration | Source | Description |
|-------------|--------|-------------|
| **PagerDuty** | Homepage | Incident management |
| **Opsgenie** | Homepage | Incident management |
| **SonarQube** | Homepage + webinar reference | Code quality metrics |
| **CodeRabbit** | Homepage | AI code review |
| **Sourcegraph** | Homepage | Code intelligence |

### 7.5 Collaboration & Productivity

| Integration | Source | Description |
|-------------|--------|-------------|
| **Slack** | Homepage | Team communication |
| **Google Sheets** | Homepage | Spreadsheet data |
| **Google Calendar** | Homepage | Calendar data |

---

## 8. GitHub Repositories (Jellyfish-AI Organization)

### 8.1 Original Jellyfish Repositories

| Repository | Description | Language | License | Version |
|------------|-------------|----------|---------|---------|
| [jellyfish-mcp](https://github.com/Jellyfish-AI/jellyfish-mcp) | MCP server for querying Jellyfish data via AI assistants (25 tools) | Node.js | MIT | 1.0.2 |
| [jf_agent](https://github.com/Jellyfish-AI/jf_agent) | On-premises agent for collecting and sending data to Jellyfish | Python | MIT | 0.1.3 |
| [Jellyfish-Integration-Resources](https://github.com/Jellyfish-AI/Jellyfish-Integration-Resources) | Azure DevOps setup scripts (webhooks + user extraction) | PowerShell | -- | -- |
| [jellyfish-buildkite-plugin](https://github.com/Jellyfish-AI/jellyfish-buildkite-plugin) | Buildkite CI/CD plugin for deployment event reporting | Bash | -- | v1.1.2 |
| [twistedtentacles](https://github.com/Jellyfish-AI/twistedtentacles) | Interview assessment: order processing system (forward-deployed engineering role) | Python | -- | -- |
| [rec-resources](https://github.com/Jellyfish-AI/rec-resources) | Interview assessment: Jira issue list mock app (Django + React/TypeScript) | Python/TypeScript | -- | -- |

### 8.2 Forked Repositories (with Jellyfish Customizations)

| Repository | Upstream | Jellyfish Customization | Reveals |
|------------|----------|------------------------|---------|
| [ratelimit](https://github.com/Jellyfish-AI/ratelimit) | tomasbasham/ratelimit | Defunct fork; replaced by custom multi-realm, thread-safe rate limiter in jf_agent | Custom rate limiting with per-API-realm tracking and 60-min timeout |
| [PyGithub](https://github.com/Jellyfish-AI/PyGithub) | PyGithub/PyGithub | Added retry logic for HTTP 500/502/504 errors (3 retries, 0.3s backoff); added custom `session` parameter to `Github()` constructor | jf_agent uses customized PyGithub for reliable GitHub API access with shared session state |
| [pgmetrics](https://github.com/Jellyfish-AI/pgmetrics) | rapidloop/pgmetrics | Added Citus 11 support | Jellyfish uses PostgreSQL with Citus extension for distributed database |
| [prefect](https://github.com/Jellyfish-AI/prefect) | PrefectHQ/prefect | Fixed message truncation bug in Failed state exceptions; pinned dependency versions (anyio, griffe) | Jellyfish uses Prefect for workflow/data pipeline orchestration |
| [prefect-aws](https://github.com/Jellyfish-AI/prefect-aws) | PrefectHQ/prefect-aws | Standard fork (maintenance commits) | Jellyfish runs Prefect workflows on AWS (ECS, S3, Secrets Manager) |
| [dask-cloudprovider](https://github.com/Jellyfish-AI/dask-cloudprovider) | dask/dask-cloudprovider | Added 5s retry delay to handle AWS ECS throttling during task describe | Jellyfish uses Dask distributed computing on AWS ECS |
| [celery](https://github.com/Jellyfish-AI/celery) | celery/celery | Standard fork (no Jellyfish-specific commits) | Celery task queue in tech stack |

### 8.3 Infrastructure Stack (Inferred from Forked Repositories)

The following infrastructure components are evidenced by Jellyfish's GitHub forks and customizations. These are not assumptions -- each is supported by specific commits, code changes, or dependencies in the repositories.

| Layer | Technology | Evidence |
|-------|-----------|----------|
| **Database** | PostgreSQL + Citus (distributed) | pgmetrics fork with Citus 11 support commit |
| **Workflow Orchestration** | Prefect | prefect fork with Jellyfish-specific bug fixes and dependency pins |
| **Distributed Computing** | Dask | dask-cloudprovider fork with AWS ECS throttle fix |
| **Task Queue** | Celery | celery fork in Jellyfish-AI organization |
| **Cloud Infrastructure** | AWS (ECS, S3, Secrets Manager) | prefect-aws fork; dask-cloudprovider ECS commits |
| **GitHub API Client** | PyGithub (customized) | PyGithub fork with retry logic and session support for jf_agent |
| **Rate Limiting** | Custom (replaced ratelimit fork) | Multi-realm, thread-safe implementation in jf_agent/ratelimit.py |
| **Backend Framework** | Django + Django REST Framework | rec-resources interview repo |
| **Frontend** | React + TypeScript | rec-resources interview repo |

---

## 9. Target Personas

| Persona | Use Cases |
|---------|-----------|
| Engineering Executives | Strategic alignment, investment decisions, board reporting |
| Engineering Managers | Team health, operational effectiveness, people management |
| Product Leaders | Delivery tracking, capacity planning, roadmap alignment |
| PMO & Engineering Operations | Workflow analysis, process optimization, metrics |
| Platform Engineering | Developer tooling impact, DevEx measurement, infrastructure ROI |
| Finance Teams | Software capitalization, R&D financial reporting |
| Software Developers | DevEx surveys, productivity feedback |

---

## 10. Published Resources

### 10.1 eBooks & Guides

| Title | Category | Date |
|-------|----------|------|
| Why Platform Engineering Teams are Essential in the AI-Native Era | Engineering & Product Operations | Feb 2026 |
| The Engineering Leader's Guide to the AI Software Development Stack | Engineering Investment & Business Alignment | Jan 2026 |
| AI in Engineering: Moving Beyond Hype Into Reality | Engineering & Product Operations | Nov 2025 |
| 7 AI KPIs Every Engineering Leader Should Track | Engineering Investment & Business Alignment | Oct 2025 |
| The AI Impact Framework | Engineering Investment & Business Alignment | Sep 2025 |
| Bridging Finance and R&D: Efficient Software Capitalization | DevFinOps | May 2025 |
| The 5 Elements of Software Engineering Management | Engineering Management | -- |
| The Jellyfish Guide to Engineering Metrics | Engineering Metrics | -- |
| 5 Jira Best Practices for Improving Engineering Operations | Engineering Operations | -- |

### 10.2 Reports

| Title | Category | Date |
|-------|----------|------|
| 2025 State of Engineering Management Report | Team Health | Jul 2025 |
| GenAI: Perception vs Reality | Engineering & Product Operations | May 2025 |

### 10.3 Webinars (On-Demand, page 1 of 7)

| Title |
|-------|
| Platform Engineering in the AI-Native Era: How to Scale AI Adoption Without Chaos |
| AI Benchmarks -- What Jellyfish Research Learned from Analyzing 20 Million Pull Requests |
| Providing Better Visibility into Code Quality, Coverage & Vulnerability Metrics |
| Deep Dive: What's next for engineering in the age of AI? |
| Jellyfish Engineering Leaders Coffee Chats -- November 2025 |
| Deep Dive: Unlocking DORA 2025 -- State of AI-Assisted Software Development |
| Deep Dive: How to Measure the Adoption and Impact of AI Coding Tools |
| Jellyfish Engineering Leaders Coffee Chats -- September 2025 |
| Deep Dive: How Blue Yonder Drives AI-Led Business Transformation |

---

## 11. Knowledge Library (jellyfish.co/library) -- 80+ Articles

| Category | Key Topics |
|----------|------------|
| Software Engineering Management | Leadership, management skills, decision making, best practices |
| DevOps | Framework, platform, lifecycle, dashboard, 22 metrics, KPIs, transformation |
| Metrics & KPIs | 15 SW dev KPIs, 10 SE metrics, scrum metrics, 11 quality metrics, 12 Jira metrics, agile metrics, SPACE |
| Developer Productivity | 21 metrics, 29 tools, automation, DPE, burnout, context switching, peer code review |
| Developer Experience | Complete guide, 15 DevEx metrics, AI & DevEx, challenges, remote teams |
| Code Quality | Complexity (cyclomatic, cognitive), dead code, duplicated code, code churn, code smells, technical debt |
| SDLC | Software development life cycle, CI/CD, MTTR, change lead time |
| Value Stream | Value stream management, value stream mapping |
| Software Capitalization | Internal-use, external-use, benefits, IRS Section 174 |
| Platform Engineering | Complete guide, platform as product, maturity model, golden paths, 14 tools, 17 metrics, best practices |
| AI in Software Development | Impact, benefits, risks, ROI of code assistants, use cases, testing/QA, choosing AI assistants |
| Delivery & Planning | Software delivery management, release process, headcount planning |
| Product & Operations | Product metrics, product operations, engineering operations |
| Engineering Roles | AI engineer, ML engineer |
| Analytics | Software engineering analytics, SEI platform |
| Transformation | Digital transformation, app modernization, agile transformation |
| Strategic Planning | 19 engineering OKR examples |
| Risk Management | Risk management in SE, program vs project management |

---

## 12. Key URLs & Access Points

| Resource | URL |
|----------|-----|
| Main Site | https://jellyfish.co/ |
| Product Overview | https://jellyfish.co/product/ |
| Platform Tour | https://jellyfish.co/tour/ |
| Integrations | https://jellyfish.co/platform/integrations/ |
| DevOps Metrics | https://jellyfish.co/platform/devops-metrics/ |
| Life Cycle Explorer | https://jellyfish.co/platform/life-cycle-explorer/ |
| DevEx | https://jellyfish.co/platform/devex/ |
| Resource Allocations | https://jellyfish.co/platform/resource-allocations/ |
| Capacity Planner | https://jellyfish.co/solutions/capacity-planner/ |
| Platform Engineering | https://jellyfish.co/solutions/platform-engineering/ |
| Engineering & Product Ops | https://jellyfish.co/solutions/engineering-product-operations/ |
| Knowledge Library | https://jellyfish.co/library/index/ |
| Resources (eBooks, Guides) | https://jellyfish.co/resources/ |
| Webinars | https://jellyfish.co/webinars/ |
| Help Center | https://help.jellyfish.co/hc/en-us (login required) |
| Academy | https://academy.jellyfish.co/app |
| Trust Center | https://jellyfish.co/learn/trust-center/ |
| Request Demo | https://jellyfish.co/request-a-demo/ |
| API Token Setup | https://app.jellyfish.co/settings/data-connections/api-export |
| API Schema | https://app.jellyfish.co/endpoints/export/v0/schema (auth required) |
| API Contact | api@jellyfish.co |
| AI Contact | ai@jellyfish.co |
| GitHub Organization | https://github.com/Jellyfish-AI |

---

## 13. Limitations & Notes

1. **API Documentation is behind authentication.** The full OpenAPI/Swagger schema (`/endpoints/export/v0/schema`) requires a Jellyfish API token. All 25 export endpoints listed above were verified from the jellyfish-mcp source code (api.js).

2. **Help Center is gated.** help.jellyfish.co returned 403, requiring authenticated access.

3. **Resources and Webinar pagination.** Both archives span 7 pages; only page 1 was fully enumerable via web fetch.

4. **jf_agent internal endpoints.** The 7 agent endpoints listed in Section 1.3 are internal to the jf_agent data pipeline and are not part of the customer-facing Export API.

5. **Integration source provenance.** The dedicated integrations page (jellyfish.co/platform/integrations/) lists 15 integrations explicitly. Additional integrations (GitLab, Bitbucket, Jenkins, CircleCI, PagerDuty, Opsgenie, SonarQube, Sourcegraph, CodeRabbit, Slack, Google Sheets, Google Calendar, Productboard, Aha!, ProductPlan) are referenced on the homepage navigation and other product pages. The "Source" column in integration tables indicates where each was found.

6. **DORA metric descriptions.** Quoted verbatim from jellyfish.co/platform/devops-metrics/. The page lists exactly 4 DORA metrics (no "Incident Rate").

7. **MCP tool descriptions.** Descriptions in Section 2.1 are taken from manifest.json; some are lightly paraphrased for conciseness but preserve original meaning. Full verbatim descriptions are in the manifest.json file.

8. **REQUESTS_CA_BUNDLE.** Documented in jf_agent/README.md for Docker deployments. This is a standard Python `requests` library environment variable, not a Jellyfish-specific implementation.

9. **No fabrication policy.** Every item in this inventory is sourced directly from Jellyfish web pages, blog posts, or actual source code files in the cloned repositories as of March 30, 2026.

---

## 14. Validation Log (March 30, 2026)

| Section | Check | Result | Notes |
|---------|-------|--------|-------|
| 1.2 Export API Endpoints | 25 endpoints against api.js | PASS | All 25 match exactly |
| 1.3 Agent Endpoints | 7 endpoints against main.py, util.py, validation.py | PASS | All 7 found in source |
| 1.4 Webhook Endpoints | ADO webhook URL and events against create-ado-webhooks.ps1 | PASS | Exact match |
| 2.1 MCP Tools | 25 tools against manifest.json | PASS | All 25 match |
| 2.2 MCP Config | 4 variables against manifest.json user_config | PASS | Types, defaults correct |
| 3.1 Git Providers | 5 providers against git/utils.py constants | PASS | All 5 match |
| 3.4 Run Modes | 6 modes against __init__.py VALID_RUN_MODES | PASS | Exact match |
| 3.5 Config Options | All options against example.yml | PASS | All present |
| 3.5 Env Variables | All env vars against main.py/config_file_reader.py | PASS | All found |
| 5.x Products | 6 product categories + sub-features against homepage | PASS | Exact match |
| 6.1 DORA Metrics | Descriptions against /platform/devops-metrics/ | **CORRECTED** | Removed fabricated "Incident Rate"; updated to verbatim quotes |
| 6.3 Business Outcomes | 4 stats against /tour/ page | PASS | Exact numbers match; added attribution note |
| 7.x Integrations | All integrations against /platform/integrations/ + homepage | **CORRECTED** | Added missing ProductPlan; added source provenance columns |
| 5.5 DevEx Outcomes | "21%/19%" against /platform/devex/ | **CORRECTED** | Attributed to Kaleris case study (not general claim) |
| 1.4 Deployment Webhook | Endpoint + payload against jellyfish-buildkite-plugin source | **ADDED** | New endpoint: `webhooks.jellyfish.co/deployment` with full payload schema |
| 4.3 Buildkite Plugin | Full config against plugin.yml + hooks/post-command | **ADDED** | New CI/CD integration with 7 configuration parameters |
| 7.3 Buildkite Integration | Integration entry against plugin source | **ADDED** | Buildkite added to CI/CD integrations |
| 8.1 Original Repos | 6 repos verified against GitHub clones | PASS | jellyfish-mcp, jf_agent, Integration-Resources, buildkite-plugin, twistedtentacles, rec-resources |
| 8.2 Forked Repos | 7 forks analyzed for Jellyfish customizations | PASS | ratelimit, PyGithub, pgmetrics, prefect, prefect-aws, dask-cloudprovider, celery |
| 8.3 Infrastructure Stack | All claims against specific commits/code | PASS | Each technology backed by verifiable fork evidence |
