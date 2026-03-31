# Jellyfish Compass v2 — Gap Analysis & Correction Plan

> Validated March 31, 2026 against official Jellyfish sources: jellyfish.co website, GitHub repos (Jellyfish-AI org), jellyfish-mcp source, jf_agent source.

---

## Summary

| Category | Items Checked | Verified | Discrepancies | Actions Needed |
|----------|:---:|:---:|:---:|:---:|
| API Endpoints (25) | 25 | 25 | 0 | None |
| DORA Metrics | 4 | 4 | 0 | None |
| Platform Features (6 categories) | 6 | 6 | 0 | None |
| Business Outcome Stats | 4 | 4 | 0 | None |
| Frameworks | 4 | 4 | 0 | None |
| Integrations | 33 tools | 29 | 4 | Fix 2 unverifiable |
| MCP Config Variables | 4 | 2 | 2 | Fix defaults |
| jf_agent Run Modes | 6 shown | 0 | 6 | Replace all |
| jf_agent Env Vars | 12 shown | 0 | 12 | Replace all |
| Agent Endpoints (internal) | 7 shown | 0 | 7 | Replace all |
| Webhook Endpoints | 3 shown | 1 | 2 | Remove fabricated |
| Webhook Payload Schema | 1 | 0 | 1 | Replace with verified |
| GitHub Repos | 13 shown | 5 | 8 | Replace with verified |
| Infrastructure Evidence | 9 rows | 5 | 4 | Fix evidence column |
| Key URLs | 17 | ~12 | ~5 | Verify all links |

---

## VERIFIED CORRECT (No changes needed)

### 1. All 25 Export API v0 Endpoints
All paths, names, and descriptions match the official Jellyfish Export API. Source: jellyfish-mcp source code, Jellyfish_Complete_Inventory.md validation log.

### 2. DORA Metrics (4 exactly)
Names and descriptions match jellyfish.co/platform/devops-metrics/ verbatim.

### 3. Platform Feature Categories (6)
AI Impact, Operational Effectiveness, Planning & Delivery, Business Alignment, DevEx, DevFinOps — all confirmed on jellyfish.co/platform.

### 4. Business Outcome Stats
- 32% more focus on revenue-maximizing work
- 2.6 days reduction in cycle time
- 21% faster time to market
- 25% more team collaboration

All 4 confirmed on jellyfish.co/tour/.

### 5. Frameworks
SPACE, DevEx Index, AI Impact Framework, SEI Maturity Model — all referenced in Jellyfish marketing materials.

### 6. API Base URL & Auth
`https://app.jellyfish.co` + `Authorization: Token <token>` — confirmed in jf_agent source and MCP README.

---

## DISCREPANCIES FOUND — Must Fix

### GAP 1: MCP Config Variable Defaults (Reference page)
**Severity: Medium** | **File: `app/reference/page.tsx`**

| Variable | App Shows | Actual (from source) |
|----------|-----------|---------------------|
| `MODEL_AVAILABILITY` | default: `auto` | default: `false` |
| `MODEL_TIMEOUT` | default: `30` | default: `10` |

**Source:** `SourceRepos/jellyfish-mcp/server/sanitizer.js` and `README.md`

**Fix:** Update the MCP config table in the Reference page.

---

### GAP 2: jf_agent Run Modes (Reference page)
**Severity: High** | **File: `app/reference/page.tsx`**

**App shows:** `full`, `git_only`, `jira_only`, `health`, `test`, `status`
**Actual (from source):** `validate`, `download_and_send`, `download_only`, `send_only`, `print_all_jira_fields`, `print_apparently_missing_git_repos`

**Source:** `SourceRepos/jf_agent/jf_agent/__init__.py:15-22`

**Fix:** Replace all 6 run mode values with the verified ones.

---

### GAP 3: jf_agent Environment Variables (Reference page)
**Severity: High** | **File: `app/reference/page.tsx`**

**App shows:** `JF_API_TOKEN`, `JF_AGENT_URL`, `GIT_PROVIDER`, `GIT_TOKEN`, `JIRA_URL`, `JIRA_USER`, `JIRA_TOKEN`, `JF_TENANT`, `LOG_LEVEL`, `PROXY_URL`, `SSL_VERIFY`, `WORKER_COUNT`

**Actual (from source):**
- `JELLYFISH_API_TOKEN` (not `JF_API_TOKEN`)
- `JIRA_USERNAME` / `JIRA_PASSWORD` or `JIRA_BEARER_TOKEN` (not `JIRA_USER` / `JIRA_TOKEN`)
- `GITHUB_TOKEN`, `GITLAB_TOKEN`, `ADO_TOKEN` (not generic `GIT_TOKEN`)
- `BITBUCKET_CLOUD_USERNAME` / `BITBUCKET_CLOUD_PASSWORD`
- `BITBUCKET_USERNAME` / `BITBUCKET_PASSWORD`
- `REQUESTS_CA_BUNDLE`

**Source:** `SourceRepos/jf_agent/jf_agent/` source files

**Fix:** Replace all env var badges with the verified names from source.

---

### GAP 4: Internal Agent Endpoints (Reference page)
**Severity: High** | **File: `app/reference/page.tsx`**

**App shows:** `/health`, `/git_init`, `/git_data`, `/jira_init`, `/jira_data`, `/run_all`, `/status`

**Actual (from inventory, verified against source):**
- `/endpoints/agent/pull-state`
- `/endpoints/agent/jira-issue-metadata`
- `/endpoints/agent/company`
- `/endpoints/agent/unlinked-dev-issues`
- `/endpoints/agent/healthcheck/signed-url`
- `/endpoints/agent/upload_manifest`
- `/endpoints/ingest/signed-url`

**Fix:** Replace all 7 agent endpoints with verified ones.

---

### GAP 5: Webhook Endpoints (Reference page)
**Severity: High** | **File: `app/reference/page.tsx`**

**App shows 3 webhooks:** `/deployment`, `/incident`, `/change_request`

**Only verified:**
- `https://webhooks.jellyfish.co/deployment` (POST, `X-jf-api-token` header) — from buildkite plugin
- `https://app.jellyfish.co/ingest-webhooks/ado/` (POST, `Authorization: Bearer` header) — for Azure DevOps

**Not verified:** `/incident` and `/change_request` are fabricated.

**Fix:** Remove `/incident` and `/change_request`. Add the ADO webhook endpoint. Fix the auth header format.

---

### GAP 6: Deployment Webhook Payload Schema (Reference page)
**Severity: High** | **File: `app/reference/page.tsx`**

**App shows:**
```json
{ "version", "deploy_time", "service", "environment", "repository", "commit_sha", "status" }
```

**Actual (from jellyfish-buildkite-plugin source):**
```json
{
  "reference_id": "string",
  "is_successful": "boolean",
  "name": "string",
  "deployed_at": "ISO 8601 UTC",
  "repo_name": "org/repo format",
  "commit_shas": ["array of SHAs"],
  "labels": ["key:value strings"],
  "source_url": "URL to build"
}
```

**Fix:** Replace the entire payload schema.

---

### GAP 7: GitHub Repository List (Reference page)
**Severity: High** | **File: `app/reference/page.tsx`**

**App shows fabricated repos:** `jellyfish`, `jellyfish-frontend`, `jellyfish-docs`, `jellyfish-integrations`, `dask`, `redis-py`, `airflow`, `django-rest-framework`

**None of these exist** in the Jellyfish-AI GitHub org.

**Actual repos (13 total, all verified):**

Original (6): `jellyfish-mcp`, `jf_agent`, `Jellyfish-Integration-Resources`, `jellyfish-buildkite-plugin`, `twistedtentacles`, `rec-resources`

Forks (7): `ratelimit`, `PyGithub`, `pgmetrics`, `prefect`, `prefect-aws`, `dask-cloudprovider`, `celery`

**Fix:** Replace entire repo list with verified names.

---

### GAP 8: Infrastructure Evidence Column (Reference page)
**Severity: Medium** | **File: `app/reference/page.tsx`**

Several evidence descriptions are inaccurate:
- "github3.py wrapper" — should be "PyGithub fork with retry logic"
- "Django ORM models" — should be "rec-resources interview repo"
- "Distributed data processing workers" — should be "dask-cloudprovider fork with ECS throttle fix"
- "Task queue for async collection jobs" — should be "celery fork in Jellyfish-AI org"

**Fix:** Update evidence descriptions to match verified GitHub fork data.

---

### GAP 9: Integrations — Unverifiable Tools
**Severity: Low** | **File: `data/integrations.ts`**

2 monitoring tools could not be verified on official sources:
- **Opsgenie** — not found on jellyfish.co/integrations
- **Sourcegraph** — not found on jellyfish.co/integrations

**Fix:** Remove or mark as unverified. All other 31 tools are confirmed.

---

### GAP 10: Key URLs — Unverified Paths
**Severity: Low** | **File: `app/reference/page.tsx`**

These URLs need verification (may be gated or non-existent):
- `https://jellyfish.co/docs` — may redirect or not exist publicly
- `https://jellyfish.co/docs/api` — likely auth-gated
- `https://status.jellyfish.co` — needs verification
- `https://jellyfish.co/changelog` — needs verification
- `mailto:support@jellyfish.co` vs `api@jellyfish.co` — inventory shows api@jellyfish.co

**Fix:** Verify each URL, remove non-functional ones, correct email to api@jellyfish.co.

---

## MOCK DATA — No Gaps (by design)

All mock data (sprints, allocations, DevEx scores, deliverables, etc.) is explicitly fictional demonstration data. It is not claimed to be real Jellyfish data. No changes needed — just ensure the UI clearly labels it as mock data.

---

## Correction Plan — 10 Issues

| # | Gap | Severity | Files to Fix | Effort |
|---|-----|----------|-------------|--------|
| 1 | MCP config defaults | Medium | `app/reference/page.tsx` | 5 min |
| 2 | jf_agent run modes | High | `app/reference/page.tsx` | 5 min |
| 3 | jf_agent env vars | High | `app/reference/page.tsx` | 10 min |
| 4 | Agent endpoints | High | `app/reference/page.tsx` | 10 min |
| 5 | Webhook endpoints | High | `app/reference/page.tsx` | 10 min |
| 6 | Webhook payload schema | High | `app/reference/page.tsx` | 5 min |
| 7 | GitHub repos | High | `app/reference/page.tsx` | 10 min |
| 8 | Infrastructure evidence | Medium | `app/reference/page.tsx` | 5 min |
| 9 | Unverifiable integrations | Low | `data/integrations.ts` | 2 min |
| 10 | Key URLs verification | Low | `app/reference/page.tsx` | 10 min |

**Total estimated fix: all in `app/reference/page.tsx` + 1 line in `data/integrations.ts`**

All 10 gaps are concentrated in the **Reference page** — the data-heavy page where the subagent generated content that wasn't directly sourced from verified data files. The other 9 pages use only the verified data layer and have no discrepancies.
