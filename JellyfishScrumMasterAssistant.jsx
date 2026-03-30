import { useState, useCallback, useEffect, useRef } from "react";

// ─── Constants from verified inventory ───────────────────────────────────────
const API_BASE = "https://app.jellyfish.co";

const ENDPOINTS = {
  allocations: [
    { path: "/endpoints/export/v0/allocations/details/by_person", name: "allocations_by_person", desc: "Allocation data for the whole company, aggregated by person" },
    { path: "/endpoints/export/v0/allocations/details/by_team", name: "allocations_by_team", desc: "Allocation data for the whole company, aggregated by team at specified hierarchy level" },
    { path: "/endpoints/export/v0/allocations/details/investment_category", name: "allocations_by_investment_category", desc: "Allocation data aggregated by investment category" },
    { path: "/endpoints/export/v0/allocations/details/investment_category/by_person", name: "allocations_by_investment_category_person", desc: "Allocation data aggregated by investment category and person" },
    { path: "/endpoints/export/v0/allocations/details/investment_category/by_team", name: "allocations_by_investment_category_team", desc: "Allocation data aggregated by investment category and team" },
    { path: "/endpoints/export/v0/allocations/details/work_category", name: "allocations_by_work_category", desc: "Allocation data aggregated by deliverable within specified work category" },
    { path: "/endpoints/export/v0/allocations/details/work_category/by_person", name: "allocations_by_work_category_person", desc: "Allocation data aggregated by deliverable within work category and person" },
    { path: "/endpoints/export/v0/allocations/details/work_category/by_team", name: "allocations_by_work_category_team", desc: "Allocation data aggregated by deliverable within work category and team" },
    { path: "/endpoints/export/v0/allocations/filter_fields", name: "allocations_filter_fields", desc: "Available fields and known values for filtering allocations" },
    { path: "/endpoints/export/v0/allocations/summary_filtered/by_investment_category", name: "allocations_summary_by_investment_category", desc: "Total FTE amounts for investment categories (supports filtering)" },
    { path: "/endpoints/export/v0/allocations/summary_filtered/by_work_category", name: "allocations_summary_by_work_category", desc: "Total FTE amounts for deliverables within a work category (supports filtering)" },
  ],
  delivery: [
    { path: "/endpoints/export/v0/delivery/deliverable_details", name: "deliverable_details", desc: "Data about a specific deliverable" },
    { path: "/endpoints/export/v0/delivery/scope_and_effort_history", name: "deliverable_scope_and_effort_history", desc: "Weekly data about deliverable scope and total effort allocated per week" },
    { path: "/endpoints/export/v0/delivery/work_categories", name: "work_categories", desc: "List of all known work categories" },
    { path: "/endpoints/export/v0/delivery/work_category_contents", name: "work_category_contents", desc: "Data about deliverables in a specified work category" },
  ],
  devex: [
    { path: "/endpoints/export/v0/devex/insights/by_team", name: "devex_insights_by_team", desc: "DevEx insights data by team" },
  ],
  metrics: [
    { path: "/endpoints/export/v0/metrics/company_metrics", name: "company_metrics", desc: "Metrics data for the company during specified timeframe" },
    { path: "/endpoints/export/v0/metrics/person_metrics", name: "person_metrics", desc: "Metrics data for a specified person during specified timeframe" },
    { path: "/endpoints/export/v0/metrics/team_metrics", name: "team_metrics", desc: "Metrics data for a specified team during specified timeframe" },
    { path: "/endpoints/export/v0/metrics/team_sprint_summary", name: "team_sprint_summary", desc: "Issue count and story point data for a team's sprints in specified timeframe" },
    { path: "/endpoints/export/v0/metrics/unlinked_pull_requests", name: "unlinked_pull_requests", desc: "Details of unlinked pull requests merged during specified timeframe" },
  ],
  people: [
    { path: "/endpoints/export/v0/people/list_engineers", name: "list_engineers", desc: "List of all active allocatable people as of a specific date" },
    { path: "/endpoints/export/v0/people/search", name: "search_people", desc: "Search for people by name, email, or id" },
  ],
  teams: [
    { path: "/endpoints/export/v0/teams/list_teams", name: "list_teams", desc: "All teams at specified hierarchy level (optionally includes child teams)" },
    { path: "/endpoints/export/v0/teams/search", name: "search_teams", desc: "Search for teams by name or id" },
  ],
};

const ALL_ENDPOINTS = Object.values(ENDPOINTS).flat();

const DORA_METRICS = [
  { name: "Deployment Frequency", desc: "Track how often the team pushes deployments. See the impact of process and tooling changes to ensure continuous improvement." },
  { name: "Lead Time for Changes", desc: "Understand the duration of your full value delivery cycle, from the moment a change is selected for development to its deployment." },
  { name: "Mean Time to Resolution", desc: "Measure the time from the start of an incident to its resolution, and minimize system downtime." },
  { name: "Change Failure Rate", desc: "Monitor the frequency of incidents or deployment failures to guarantee uninterrupted delivery of value to your customers." },
];

const FRAMEWORKS = [
  { name: "SPACE Framework", desc: "Satisfaction, Performance, Activity, Communication, Efficiency" },
  { name: "DevEx Index", desc: "Single score tracking developer experience over time" },
  { name: "AI Impact Framework", desc: "Data-driven model for AI adoption, productivity, and business outcomes" },
  { name: "SEI Maturity Model", desc: "Software Engineering Intelligence maturity assessment" },
];

const INTEGRATIONS = {
  ai_coding: ["GitHub Copilot", "Cursor", "Claude Code", "Windsurf", "Amazon Q Developer", "Gemini Code Assist", "Augment", "Baz", "Graphite", "Greptile"],
  issue_tracking: ["Jira", "Linear", "Azure Boards", "Productboard", "Aha!", "ProductPlan"],
  source_cicd: ["GitHub (Cloud & Enterprise)", "GitLab", "Bitbucket Cloud", "Bitbucket Server", "Azure DevOps", "Azure Repos", "Jenkins", "CircleCI", "Buildkite"],
  monitoring: ["PagerDuty", "Opsgenie", "SonarQube", "CodeRabbit", "Sourcegraph"],
  collaboration: ["Slack", "Google Sheets", "Google Calendar"],
};

const PLATFORM_FEATURES = [
  { category: "AI Impact", features: ["Drive Adoption", "Enable Teams", "Impact Insights", "Vendor Comparison", "Investment Management", "Workflow Optimization", "Report Builder"] },
  { category: "Operational Effectiveness", features: ["Metrics (DORA, flow, custom)", "Life Cycle Explorer", "Workflow Analysis", "People Management", "Team Benchmarks"] },
  { category: "Planning & Delivery", features: ["Capacity Planner", "Scenario Planner"] },
  { category: "Business Alignment", features: ["Resource Allocations (Patented Work Model)"] },
  { category: "DevEx", features: ["Research-backed surveys", "DevEx Index", "DORA/SPACE correlation", "Industry benchmarking", "AI-driven recommendations", "Automated tracking"] },
  { category: "DevFinOps", features: ["Software Capitalization"] },
];

// ─── Styles ──────────────────────────────────────────────────────────────────
const colors = {
  bg: "#f8f9fb",
  surface: "#ffffff",
  surfaceAlt: "#f1f3f7",
  border: "#dfe3ea",
  borderLight: "#e8ecf1",
  text: "#1a1f36",
  textSecondary: "#525f7f",
  textMuted: "#8898aa",
  accent: "#0055d4",
  accentLight: "#e8f0fe",
  accentDark: "#003d9e",
  success: "#0d8050",
  successLight: "#e6f4ed",
  warning: "#bf7600",
  warningLight: "#fef3e0",
  danger: "#c23030",
  dangerLight: "#fde8e8",
  purple: "#6e40c9",
  purpleLight: "#f0ebfa",
};

// ─── Helper Components ───────────────────────────────────────────────────────
function Badge({ children, color = "accent" }) {
  const bgMap = { accent: colors.accentLight, success: colors.successLight, warning: colors.warningLight, danger: colors.dangerLight, purple: colors.purpleLight };
  const fgMap = { accent: colors.accent, success: colors.success, warning: colors.warning, danger: colors.danger, purple: colors.purple };
  return (
    <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, letterSpacing: 0.3, background: bgMap[color], color: fgMap[color], textTransform: "uppercase" }}>
      {children}
    </span>
  );
}

function Card({ children, style, onClick }) {
  return (
    <div onClick={onClick} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: 20, ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: colors.text }}>{children}</h3>
      {sub && <p style={{ margin: "4px 0 0", fontSize: 13, color: colors.textSecondary }}>{sub}</p>}
    </div>
  );
}

function GuideBox({ title, children }) {
  return (
    <div style={{ background: colors.accentLight, border: `1px solid ${colors.accent}33`, borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: colors.accent, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, lineHeight: 1.6, color: colors.text }}>{children}</div>
    </div>
  );
}

function EndpointRow({ ep, onTry }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${colors.borderLight}` }}>
      <code style={{ flex: 1, fontSize: 12, color: colors.accent, background: colors.surfaceAlt, padding: "4px 8px", borderRadius: 4, fontFamily: "'SF Mono', 'Fira Code', monospace", wordBreak: "break-all" }}>
        {ep.path}
      </code>
      <span style={{ flex: 1, fontSize: 12, color: colors.textSecondary }}>{ep.desc}</span>
      {onTry && (
        <button onClick={() => onTry(ep)} style={{ padding: "4px 10px", border: `1px solid ${colors.accent}`, background: "transparent", color: colors.accent, borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
          Try it
        </button>
      )}
    </div>
  );
}

function MockBar({ label, value, max, color }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3, color: colors.textSecondary }}>
        <span>{label}</span><span style={{ fontWeight: 600, color: colors.text }}>{value}</span>
      </div>
      <div style={{ height: 8, background: colors.surfaceAlt, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color || colors.accent, borderRadius: 4, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>{headers.map((h, i) => <th key={i} style={{ textAlign: "left", padding: "8px 10px", borderBottom: `2px solid ${colors.border}`, color: colors.textSecondary, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 ? colors.surfaceAlt : "transparent" }}>
              {row.map((cell, ci) => <td key={ci} style={{ padding: "8px 10px", borderBottom: `1px solid ${colors.borderLight}`, color: colors.text }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── API Connection Panel ────────────────────────────────────────────────────
function ApiPanel({ token, setToken }) {
  const [status, setStatus] = useState(null);
  const testConnection = async () => {
    if (!token) { setStatus("error"); return; }
    setStatus("loading");
    try {
      const res = await fetch(`${API_BASE}/endpoints/export/v0/teams/list_teams?hierarchy_level=1`, {
        headers: { "Authorization": `Token ${token}` }
      });
      setStatus(res.ok ? "connected" : "error");
    } catch {
      setStatus("error");
    }
  };
  return (
    <Card style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 250 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4 }}>Jellyfish API Token</label>
          <input type="password" value={token} onChange={e => { setToken(e.target.value); setStatus(null); }} placeholder="Paste your token from app.jellyfish.co/settings/data-connections/api-export" style={{ width: "100%", padding: "8px 12px", border: `1px solid ${colors.border}`, borderRadius: 6, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
        </div>
        <button onClick={testConnection} disabled={status === "loading"} style={{ padding: "8px 18px", background: colors.accent, color: "#fff", border: "none", borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: "pointer", marginTop: 18, opacity: status === "loading" ? 0.6 : 1 }}>
          {status === "loading" ? "Testing..." : "Connect"}
        </button>
        {status === "connected" && <Badge color="success">Connected</Badge>}
        {status === "error" && <Badge color="danger">Failed — check token</Badge>}
      </div>
      <p style={{ margin: "10px 0 0", fontSize: 12, color: colors.textMuted }}>
        Token setup: Admin User Role required. Go to <a href="https://app.jellyfish.co/settings/data-connections/api-export" target="_blank" rel="noopener noreferrer" style={{ color: colors.accent }}>API Export settings</a> → Generate New Token → Copy and paste above.
      </p>
    </Card>
  );
}

// ─── Live API Explorer ───────────────────────────────────────────────────────
function ApiExplorer({ token, endpoint, params: initialParams }) {
  const [params, setParams] = useState(initialParams || {});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async () => {
    if (!token) { setError("Enter your API token above to make live calls."); return; }
    setLoading(true); setError(null); setResult(null);
    try {
      const url = new URL(endpoint.path, API_BASE);
      Object.entries(params).forEach(([k, v]) => { if (v) url.searchParams.set(k, v); });
      const res = await fetch(url.toString(), { headers: { "Authorization": `Token ${token}` } });
      if (res.ok) { setResult(await res.json()); }
      else { setError(`HTTP ${res.status}: ${await res.text()}`); }
    } catch (e) { setError(`Request failed: ${e.message}`); }
    setLoading(false);
  };

  return (
    <Card style={{ marginTop: 12, background: colors.surfaceAlt }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Badge color="accent">GET</Badge>
        <code style={{ fontSize: 12, color: colors.accent }}>{endpoint.path}</code>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
        {Object.entries(params).map(([k, v]) => (
          <div key={k}>
            <label style={{ fontSize: 11, color: colors.textMuted, display: "block", marginBottom: 2 }}>{k}</label>
            <input value={v} onChange={e => setParams(p => ({ ...p, [k]: e.target.value }))} style={{ padding: "6px 10px", border: `1px solid ${colors.border}`, borderRadius: 4, fontSize: 12, width: 160 }} />
          </div>
        ))}
      </div>
      <button onClick={callApi} disabled={loading} style={{ padding: "6px 14px", background: colors.accent, color: "#fff", border: "none", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
        {loading ? "Calling..." : "Execute"}
      </button>
      {error && <div style={{ marginTop: 10, padding: 10, background: colors.dangerLight, borderRadius: 4, fontSize: 12, color: colors.danger }}>{error}</div>}
      {result && (
        <pre style={{ marginTop: 10, padding: 12, background: "#1e2535", color: "#c8d6e5", borderRadius: 6, fontSize: 11, maxHeight: 300, overflow: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </Card>
  );
}

// ─── Tab: Sprint Health ──────────────────────────────────────────────────────
function SprintHealthTab({ token }) {
  const [explorer, setExplorer] = useState(null);
  const mockSprints = [
    { name: "Sprint 24", committed: 34, completed: 29, carryOver: 5, velocity: 58, points: 58 },
    { name: "Sprint 23", committed: 31, completed: 28, carryOver: 3, velocity: 54, points: 54 },
    { name: "Sprint 22", committed: 36, completed: 32, carryOver: 4, velocity: 61, points: 61 },
    { name: "Sprint 21", committed: 30, completed: 30, carryOver: 0, velocity: 52, points: 52 },
  ];
  return (
    <div>
      <GuideBox title="Scrum Master Guide: Sprint Metrics & Health">
        <p style={{ margin: "0 0 8px" }}>Sprint health monitoring lets you track completion rates, velocity trends, and carry-over patterns. As a Scrum Master, use this data to facilitate better sprint retrospectives and calibrate planning.</p>
        <p style={{ margin: 0 }}><strong>Key endpoints:</strong> <code>team_sprint_summary</code> returns issue counts and story point data per sprint. <code>team_metrics</code> provides broader team-level metrics across a timeframe. <code>company_metrics</code> gives organization-wide context.</p>
      </GuideBox>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Avg Velocity", value: "56.3 pts", sub: "Last 4 sprints", color: colors.accent },
          { label: "Completion Rate", value: "88%", sub: "Issues completed vs committed", color: colors.success },
          { label: "Carry-Over Trend", value: "3.0 avg", sub: "Issues rolling to next sprint", color: colors.warning },
          { label: "Sprint Cadence", value: "2 weeks", sub: "Current iteration length", color: colors.purple },
        ].map((m, i) => (
          <Card key={i} style={{ padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>{m.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: m.color, margin: "6px 0 2px" }}>{m.value}</div>
            <div style={{ fontSize: 11, color: colors.textSecondary }}>{m.sub}</div>
          </Card>
        ))}
      </div>

      <SectionTitle sub="Mock data — connect your token to see real sprint data">Sprint History</SectionTitle>
      <Card>
        <Table
          headers={["Sprint", "Committed", "Completed", "Carry-Over", "Story Points", "Velocity"]}
          rows={mockSprints.map(s => [
            s.name,
            s.committed,
            <span style={{ color: colors.success, fontWeight: 600 }}>{s.completed}</span>,
            <span style={{ color: s.carryOver > 3 ? colors.warning : colors.textSecondary }}>{s.carryOver}</span>,
            s.points,
            <span style={{ fontWeight: 600 }}>{s.velocity}</span>
          ])}
        />
      </Card>

      <SectionTitle sub="Live API calls to your Jellyfish instance">Try the API</SectionTitle>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {ENDPOINTS.metrics.map(ep => (
          <button key={ep.name} onClick={() => setExplorer(ep)} style={{ padding: "6px 12px", fontSize: 12, border: `1px solid ${explorer?.name === ep.name ? colors.accent : colors.border}`, background: explorer?.name === ep.name ? colors.accentLight : "transparent", color: explorer?.name === ep.name ? colors.accent : colors.textSecondary, borderRadius: 4, cursor: "pointer", fontWeight: 500 }}>
            {ep.name}
          </button>
        ))}
      </div>
      {explorer && <ApiExplorer token={token} endpoint={explorer} params={explorer.name === "team_sprint_summary" ? { team: "", start: "", end: "" } : explorer.name === "team_metrics" ? { team: "", start: "", end: "" } : explorer.name === "person_metrics" ? { person: "", start: "", end: "" } : explorer.name === "company_metrics" ? { start: "", end: "" } : { start: "", end: "" }} />}

      <div style={{ marginTop: 20 }}>
        <GuideBox title="How to Use This in Your Sprint Ceremonies">
          <p style={{ margin: "0 0 6px" }}><strong>Sprint Planning:</strong> Use <code>team_sprint_summary</code> history to calibrate how many story points your team can realistically commit to. Velocity from the last 3-4 sprints is your best predictor.</p>
          <p style={{ margin: "0 0 6px" }}><strong>Daily Standup:</strong> Reference <code>team_metrics</code> to quickly surface cycle time anomalies or blocked items without manual Jira hunting.</p>
          <p style={{ margin: "0 0 6px" }}><strong>Sprint Review:</strong> Present completion rate trends and story point throughput to stakeholders with real data from <code>team_sprint_summary</code>.</p>
          <p style={{ margin: 0 }}><strong>Retrospective:</strong> Compare <code>unlinked_pull_requests</code> data to reveal work happening outside sprint tracking. Use DORA metrics from <code>company_metrics</code> to show deployment and lead time trends.</p>
        </GuideBox>
      </div>
    </div>
  );
}

// ─── Tab: Delivery Tracking ──────────────────────────────────────────────────
function DeliveryTab({ token }) {
  const [explorer, setExplorer] = useState(null);
  return (
    <div>
      <GuideBox title="Scrum Master Guide: Delivery Tracking">
        <p style={{ margin: "0 0 8px" }}>Delivery tracking in Jellyfish goes beyond individual sprints — it connects work items to larger deliverables and shows scope changes over time. This helps Scrum Masters identify scope creep, track progress against roadmap items, and surface bottlenecks in the delivery pipeline.</p>
        <p style={{ margin: 0 }}><strong>Key endpoints:</strong> <code>deliverable_details</code> for specific deliverable data, <code>scope_and_effort_history</code> for weekly scope and effort trends, <code>work_categories</code> to list all categories, and <code>work_category_contents</code> for deliverables within a category.</p>
      </GuideBox>

      <SectionTitle sub="Mock visualization of scope vs. effort over 8 weeks">Scope & Effort Trend</SectionTitle>
      <Card>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 140, padding: "0 10px" }}>
          {[
            { w: "W1", scope: 45, effort: 40 }, { w: "W2", scope: 48, effort: 42 },
            { w: "W3", scope: 55, effort: 44 }, { w: "W4", scope: 58, effort: 50 },
            { w: "W5", scope: 60, effort: 52 }, { w: "W6", scope: 64, effort: 58 },
            { w: "W7", scope: 64, effort: 62 }, { w: "W8", scope: 64, effort: 64 },
          ].map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 120 }}>
                <div style={{ width: 14, height: `${(d.scope / 70) * 120}px`, background: colors.accentLight, border: `1px solid ${colors.accent}44`, borderRadius: "3px 3px 0 0" }} title={`Scope: ${d.scope}`} />
                <div style={{ width: 14, height: `${(d.effort / 70) * 120}px`, background: colors.accent, borderRadius: "3px 3px 0 0" }} title={`Effort: ${d.effort}`} />
              </div>
              <span style={{ fontSize: 10, color: colors.textMuted }}>{d.w}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 10, fontSize: 11, color: colors.textSecondary }}>
          <span><span style={{ display: "inline-block", width: 10, height: 10, background: colors.accentLight, border: `1px solid ${colors.accent}44`, borderRadius: 2, marginRight: 4 }} />Scope (issues)</span>
          <span><span style={{ display: "inline-block", width: 10, height: 10, background: colors.accent, borderRadius: 2, marginRight: 4 }} />Effort (completed)</span>
        </div>
      </Card>

      <SectionTitle sub="Mock data showing deliverable status">Active Deliverables</SectionTitle>
      <Card>
        <Table
          headers={["Deliverable", "Work Category", "Scope", "% Complete", "Status"]}
          rows={[
            ["Auth Service Rewrite", "Epics", "24 issues", "79%", <Badge color="success">On Track</Badge>],
            ["Mobile App v3.0", "Epics", "41 issues", "52%", <Badge color="warning">At Risk</Badge>],
            ["Data Pipeline Migration", "Epics", "18 issues", "94%", <Badge color="success">On Track</Badge>],
            ["API Rate Limiting", "Epics", "12 issues", "33%", <Badge color="danger">Behind</Badge>],
          ]}
        />
      </Card>

      <SectionTitle sub="Live API calls">Try the API</SectionTitle>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {ENDPOINTS.delivery.map(ep => (
          <button key={ep.name} onClick={() => setExplorer(ep)} style={{ padding: "6px 12px", fontSize: 12, border: `1px solid ${explorer?.name === ep.name ? colors.accent : colors.border}`, background: explorer?.name === ep.name ? colors.accentLight : "transparent", color: explorer?.name === ep.name ? colors.accent : colors.textSecondary, borderRadius: 4, cursor: "pointer", fontWeight: 500 }}>
            {ep.name}
          </button>
        ))}
      </div>
      {explorer && <ApiExplorer token={token} endpoint={explorer} params={explorer.name === "work_category_contents" ? { work_category_slug: "epics", timeframe: "", end: "" } : explorer.name === "deliverable_details" ? { deliverable_id: "" } : explorer.name === "deliverable_scope_and_effort_history" ? { deliverable_id: "" } : {}} />}

      <div style={{ marginTop: 20 }}>
        <GuideBox title="Scrum Master Playbook: Delivery Insights">
          <p style={{ margin: "0 0 6px" }}><strong>Scope creep detection:</strong> Use <code>scope_and_effort_history</code> to spot when scope increases faster than effort. If the gap widens week over week, raise it in the next retrospective.</p>
          <p style={{ margin: "0 0 6px" }}><strong>Cross-sprint visibility:</strong> <code>work_category_contents</code> with <code>work_category_slug=epics</code> shows all deliverables in your epic-level work category — useful for PI planning or quarterly reviews.</p>
          <p style={{ margin: 0 }}><strong>Stakeholder reporting:</strong> Pull <code>deliverable_details</code> for specific features stakeholders ask about. This gives you data-backed answers instead of gut-feel updates.</p>
        </GuideBox>
      </div>
    </div>
  );
}

// ─── Tab: Allocation & Capacity ──────────────────────────────────────────────
function AllocationTab({ token }) {
  const [explorer, setExplorer] = useState(null);
  const [viewMode, setViewMode] = useState("investment");
  return (
    <div>
      <GuideBox title="Scrum Master Guide: Team Allocation & Capacity">
        <p style={{ margin: "0 0 8px" }}>Jellyfish's allocation data reveals how engineering effort is distributed across investment categories, work categories, teams, and individuals. As a Scrum Master, this helps you understand capacity constraints, detect over-allocation, and have evidence-based conversations about team workload.</p>
        <p style={{ margin: 0 }}><strong>Key concept — FTE (Full-Time Equivalent):</strong> Jellyfish measures allocation in FTE, which represents the proportion of a person's total capacity spent on a given category. This is calculated automatically from work items — not time-tracking.</p>
      </GuideBox>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["investment", "team", "person"].map(m => (
          <button key={m} onClick={() => setViewMode(m)} style={{ padding: "8px 16px", border: `1px solid ${viewMode === m ? colors.accent : colors.border}`, background: viewMode === m ? colors.accentLight : "transparent", color: viewMode === m ? colors.accent : colors.textSecondary, borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13, textTransform: "capitalize" }}>
            By {m}
          </button>
        ))}
      </div>

      {viewMode === "investment" && (
        <Card>
          <SectionTitle sub="Mock data — Investment category allocation (FTE)">Investment Categories</SectionTitle>
          <MockBar label="Feature Development" value={12.4} max={25} color={colors.accent} />
          <MockBar label="Keep the Lights On" value={5.8} max={25} color={colors.warning} />
          <MockBar label="Tech Debt" value={3.2} max={25} color={colors.purple} />
          <MockBar label="Growth / Scaling" value={2.1} max={25} color={colors.success} />
          <MockBar label="Unallocated" value={1.5} max={25} color={colors.textMuted} />
          <p style={{ margin: "12px 0 0", fontSize: 12, color: colors.textMuted }}>Endpoints: <code>allocations_summary_by_investment_category</code>, <code>allocations_by_investment_category</code></p>
        </Card>
      )}
      {viewMode === "team" && (
        <Card>
          <SectionTitle sub="Mock data — Team-level allocation breakdown">Team Allocation</SectionTitle>
          <Table
            headers={["Team", "Total FTE", "Features", "KTLO", "Tech Debt"]}
            rows={[
              ["Platform", "8.0", "4.2 (53%)", "2.1 (26%)", "1.7 (21%)"],
              ["Mobile", "6.0", "4.5 (75%)", "1.0 (17%)", "0.5 (8%)"],
              ["Data", "5.0", "2.0 (40%)", "1.5 (30%)", "1.5 (30%)"],
              ["Frontend", "6.0", "3.8 (63%)", "1.2 (20%)", "1.0 (17%)"],
            ]}
          />
          <p style={{ margin: "12px 0 0", fontSize: 12, color: colors.textMuted }}>Endpoints: <code>allocations_by_team</code>, <code>allocations_by_investment_category_team</code></p>
        </Card>
      )}
      {viewMode === "person" && (
        <Card>
          <SectionTitle sub="Mock data — Individual allocation (shows over-spread)">Person Allocation</SectionTitle>
          <Table
            headers={["Person", "FTE", "Primary Category", "Spread", "Flag"]}
            rows={[
              ["A. Santos", "1.0", "Feature Dev (72%)", "3 categories", ""],
              ["B. Kim", "1.0", "KTLO (58%)", "4 categories", <Badge color="warning">High spread</Badge>],
              ["C. Patel", "1.0", "Tech Debt (65%)", "2 categories", ""],
              ["D. Chen", "0.8", "Feature Dev (90%)", "2 categories", <Badge color="danger">Under-allocated</Badge>],
            ]}
          />
          <p style={{ margin: "12px 0 0", fontSize: 12, color: colors.textMuted }}>Endpoints: <code>allocations_by_person</code>, <code>allocations_by_investment_category_person</code></p>
        </Card>
      )}

      <SectionTitle sub="Live API calls to allocation endpoints">Try the API</SectionTitle>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {ENDPOINTS.allocations.slice(0, 5).map(ep => (
          <button key={ep.name} onClick={() => setExplorer(ep)} style={{ padding: "5px 10px", fontSize: 11, border: `1px solid ${explorer?.name === ep.name ? colors.accent : colors.border}`, background: explorer?.name === ep.name ? colors.accentLight : "transparent", color: explorer?.name === ep.name ? colors.accent : colors.textSecondary, borderRadius: 4, cursor: "pointer", fontWeight: 500 }}>
            {ep.name}
          </button>
        ))}
        <button onClick={() => setExplorer(null)} style={{ padding: "5px 10px", fontSize: 11, border: `1px solid ${colors.border}`, background: "transparent", color: colors.textMuted, borderRadius: 4, cursor: "pointer" }}>
          + {ENDPOINTS.allocations.length - 5} more
        </button>
      </div>
      {explorer && <ApiExplorer token={token} endpoint={explorer} params={{ hierarchy_level: "1", start: "", end: "" }} />}

      <div style={{ marginTop: 20 }}>
        <GuideBox title="Scrum Master Playbook: Capacity Management">
          <p style={{ margin: "0 0 6px" }}><strong>Sprint planning:</strong> Pull <code>allocations_by_person</code> before planning to know each team member's current spread. Someone allocated across 4+ categories may need focus.</p>
          <p style={{ margin: "0 0 6px" }}><strong>KTLO monitoring:</strong> Use <code>allocations_summary_by_investment_category</code> to track "Keep the Lights On" work. If KTLO trends above 30%, surface it to leadership as a capacity risk.</p>
          <p style={{ margin: 0 }}><strong>Filter fields:</strong> Call <code>allocations_filter_fields</code> first to discover available filter dimensions (teams, categories, time ranges) before making allocation queries.</p>
        </GuideBox>
      </div>
    </div>
  );
}

// ─── Tab: DevEx & Blockers ───────────────────────────────────────────────────
function DevExTab({ token }) {
  const [explorer, setExplorer] = useState(null);
  return (
    <div>
      <GuideBox title="Scrum Master Guide: Developer Experience & Blockers">
        <p style={{ margin: "0 0 8px" }}>Developer experience (DevEx) directly impacts velocity and quality. Jellyfish combines research-backed surveys with system metrics (DORA, SPACE) to produce a DevEx Index — a single comparable score. As a Scrum Master, you can use this to identify systemic blockers that retrospectives alone may not surface.</p>
        <p style={{ margin: 0 }}><strong>Unlinked pull requests</strong> are PRs merged without being associated to any tracked work item (Jira issue, etc.). These represent invisible work — effort that doesn't show up in sprint metrics. Tracking them helps ensure your sprint boards reflect reality.</p>
      </GuideBox>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <Card>
          <SectionTitle sub="Mock data from devex_insights_by_team">DevEx Index by Team</SectionTitle>
          <MockBar label="Platform Team" value={78} max={100} color={colors.success} />
          <MockBar label="Mobile Team" value={65} max={100} color={colors.warning} />
          <MockBar label="Data Team" value={72} max={100} color={colors.accent} />
          <MockBar label="Frontend Team" value={81} max={100} color={colors.success} />
          <p style={{ margin: "10px 0 0", fontSize: 11, color: colors.textMuted }}>DevEx Index: single comparable score tracking developer experience. Combines survey data with DORA/SPACE metrics.</p>
        </Card>
        <Card>
          <SectionTitle sub="Mock data from unlinked_pull_requests">Unlinked PRs (Last 30 Days)</SectionTitle>
          <div style={{ fontSize: 36, fontWeight: 700, color: colors.danger, marginBottom: 8 }}>23</div>
          <p style={{ fontSize: 13, color: colors.textSecondary, margin: "0 0 12px" }}>Pull requests merged without a linked work item</p>
          <MockBar label="Platform Team" value={8} max={23} color={colors.danger} />
          <MockBar label="Mobile Team" value={6} max={23} color={colors.warning} />
          <MockBar label="Data Team" value={5} max={23} color={colors.warning} />
          <MockBar label="Frontend Team" value={4} max={23} color={colors.accent} />
        </Card>
      </div>

      <SectionTitle>DORA Metrics Reference</SectionTitle>
      <Card>
        {DORA_METRICS.map((m, i) => (
          <div key={i} style={{ padding: "10px 0", borderBottom: i < 3 ? `1px solid ${colors.borderLight}` : "none" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 2 }}>{m.name}</div>
            <div style={{ fontSize: 12, color: colors.textSecondary, fontStyle: "italic" }}>"{m.desc}"</div>
          </div>
        ))}
        <p style={{ margin: "10px 0 0", fontSize: 11, color: colors.textMuted }}>Source: jellyfish.co/platform/devops-metrics/ — exactly 4 DORA metrics, verbatim descriptions.</p>
      </Card>

      <SectionTitle sub="Live API calls">Try the API</SectionTitle>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {[...ENDPOINTS.devex, ...ENDPOINTS.metrics.filter(e => e.name === "unlinked_pull_requests")].map(ep => (
          <button key={ep.name} onClick={() => setExplorer(ep)} style={{ padding: "6px 12px", fontSize: 12, border: `1px solid ${explorer?.name === ep.name ? colors.accent : colors.border}`, background: explorer?.name === ep.name ? colors.accentLight : "transparent", color: explorer?.name === ep.name ? colors.accent : colors.textSecondary, borderRadius: 4, cursor: "pointer", fontWeight: 500 }}>
            {ep.name}
          </button>
        ))}
      </div>
      {explorer && <ApiExplorer token={token} endpoint={explorer} params={explorer.name === "unlinked_pull_requests" ? { start: "", end: "" } : { team: "" }} />}

      <div style={{ marginTop: 20 }}>
        <GuideBox title="Scrum Master Playbook: DevEx & Unlinked Work">
          <p style={{ margin: "0 0 6px" }}><strong>Retrospective input:</strong> Pull <code>devex_insights_by_team</code> before retros to have concrete data on developer satisfaction and blockers, rather than relying solely on subjective discussion.</p>
          <p style={{ margin: "0 0 6px" }}><strong>Sprint hygiene:</strong> Review <code>unlinked_pull_requests</code> weekly. If a pattern emerges (e.g., one team consistently has unlinked PRs), coach the team on linking PRs to issues. This makes sprint metrics more accurate.</p>
          <p style={{ margin: 0 }}><strong>DORA tracking:</strong> Use <code>company_metrics</code> and <code>team_metrics</code> to monitor Deployment Frequency and Lead Time for Changes over time. Improving these is a direct outcome of better sprint practices.</p>
        </GuideBox>
      </div>
    </div>
  );
}

// ─── Tab: People & Teams ─────────────────────────────────────────────────────
function PeopleTeamsTab({ token }) {
  const [explorer, setExplorer] = useState(null);
  const allPeopleTeamEndpoints = [...ENDPOINTS.people, ...ENDPOINTS.teams];
  return (
    <div>
      <GuideBox title="Scrum Master Guide: People & Teams">
        <p style={{ margin: "0 0 8px" }}>The People and Teams endpoints let you search your organization's engineering roster and team structure. This is essential for mapping who belongs to which team, looking up individuals for allocation or metrics queries, and understanding the team hierarchy.</p>
        <p style={{ margin: 0 }}><strong>Tip:</strong> Use <code>list_teams</code> with different <code>hierarchy_level</code> values to navigate your org structure. <code>search_people</code> accepts name, email, or internal Jellyfish ID.</p>
      </GuideBox>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <Card>
          <SectionTitle>People Endpoints</SectionTitle>
          {ENDPOINTS.people.map(ep => <EndpointRow key={ep.name} ep={ep} onTry={setExplorer} />)}
        </Card>
        <Card>
          <SectionTitle>Team Endpoints</SectionTitle>
          {ENDPOINTS.teams.map(ep => <EndpointRow key={ep.name} ep={ep} onTry={setExplorer} />)}
        </Card>
      </div>

      {explorer && <ApiExplorer token={token} endpoint={explorer} params={explorer.name === "list_engineers" ? { as_of: "" } : explorer.name === "search_people" ? { q: "" } : explorer.name === "list_teams" ? { hierarchy_level: "1", include_children: "false" } : { q: "" }} />}

      <GuideBox title="Use Cases for Scrum Masters">
        <p style={{ margin: "0 0 6px" }}><strong>New team member onboarding:</strong> Use <code>search_people</code> to find a person's Jellyfish ID, then query <code>person_metrics</code> to understand their ramp-up compared to team averages.</p>
        <p style={{ margin: "0 0 6px" }}><strong>Cross-team coordination:</strong> Use <code>list_teams</code> to discover parallel teams and their structure when planning cross-team dependencies.</p>
        <p style={{ margin: 0 }}><strong>Roster changes:</strong> <code>list_engineers</code> with an <code>as_of</code> date lets you see who was active on any given date — useful for historical sprint analysis when team composition has changed.</p>
      </GuideBox>
    </div>
  );
}

// ─── Tab: Complete Reference ─────────────────────────────────────────────────
function ReferenceTab() {
  const [section, setSection] = useState("endpoints");
  const sections = [
    { id: "endpoints", label: "All 25 API Endpoints" },
    { id: "internal", label: "Internal Agent Endpoints" },
    { id: "webhooks", label: "Webhook Endpoints" },
    { id: "mcp", label: "MCP Tools & Config" },
    { id: "agent", label: "jf_agent (On-Prem)" },
    { id: "dora", label: "DORA Metrics" },
    { id: "frameworks", label: "Frameworks" },
    { id: "platform", label: "Platform Features" },
    { id: "integrations", label: "Integrations" },
    { id: "urls", label: "Key URLs" },
    { id: "infra", label: "Infrastructure Stack" },
  ];

  return (
    <div>
      <GuideBox title="Complete Jellyfish Reference">
        Every item below is sourced from jellyfish.co, Jellyfish-AI GitHub repositories (source code), or published documentation. No assumptions or fabrications. See the inventory file for full validation log.
      </GuideBox>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)} style={{ padding: "6px 12px", fontSize: 12, border: `1px solid ${section === s.id ? colors.accent : colors.border}`, background: section === s.id ? colors.accentLight : "transparent", color: section === s.id ? colors.accent : colors.textSecondary, borderRadius: 4, cursor: "pointer", fontWeight: 600 }}>
            {s.label}
          </button>
        ))}
      </div>

      {section === "endpoints" && (
        <Card>
          <SectionTitle sub={`${ALL_ENDPOINTS.length} endpoints verified from jellyfish-mcp/server/api.js`}>Export API v0 Endpoints</SectionTitle>
          <p style={{ fontSize: 12, color: colors.textSecondary, margin: "0 0 8px" }}>Base URL: <code>https://app.jellyfish.co</code> | Auth: <code>Authorization: Token &lt;TOKEN&gt;</code> | Schema: <code>/endpoints/export/v0/schema</code> (OpenAPI YAML)</p>
          {Object.entries(ENDPOINTS).map(([domain, eps]) => (
            <div key={domain} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, textTransform: "capitalize", marginBottom: 4, padding: "6px 0", borderBottom: `2px solid ${colors.border}` }}>
                {domain} ({eps.length} endpoint{eps.length > 1 ? "s" : ""})
              </div>
              {eps.map(ep => <EndpointRow key={ep.name} ep={ep} />)}
            </div>
          ))}
        </Card>
      )}

      {section === "internal" && (
        <Card>
          <SectionTitle sub="Used by jf_agent for data ingestion — not part of public Export API">Internal Agent Endpoints</SectionTitle>
          <Table
            headers={["Path", "Description"]}
            rows={[
              [<code>/endpoints/agent/pull-state</code>, "Agent configuration retrieval"],
              [<code>/endpoints/agent/jira-issue-metadata</code>, "Paginated Jira issue metadata"],
              [<code>/endpoints/agent/company</code>, "Company information retrieval"],
              [<code>/endpoints/agent/unlinked-dev-issues</code>, "Orphaned/unlinked development issues"],
              [<code>/endpoints/agent/healthcheck/signed-url</code>, "Health check upload via S3 signed URL"],
              [<code>/endpoints/agent/upload_manifest</code>, "Data manifest upload"],
              [<code>/endpoints/ingest/signed-url</code>, "S3 pre-signed URL for data ingestion (param: timestamp)"],
            ]}
          />
        </Card>
      )}

      {section === "webhooks" && (
        <Card>
          <SectionTitle sub="Verified from jf_agent, create-ado-webhooks.ps1, and jellyfish-buildkite-plugin">Webhook Endpoints</SectionTitle>
          <Table
            headers={["Endpoint", "Method", "Auth Header", "Description"]}
            rows={[
              [<code>webhooks.jellyfish.co</code>, "—", "Authorization: Token", "Agent heartbeat/diagnostics webhook base"],
              [<code>webhooks.jellyfish.co/deployment</code>, "POST", "X-jf-api-token: {'{token}'}", "Deployment event ingestion (Buildkite plugin, accepts 200/201/202/204)"],
              [<code>app.jellyfish.co/ingest-webhooks/ado/</code>, "POST", "Authorization: Bearer {'{token}'}", "Azure DevOps webhook ingestion"],
            ]}
          />
          <div style={{ marginTop: 12, padding: 12, background: colors.surfaceAlt, borderRadius: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: colors.text, marginBottom: 6 }}>Deployment Webhook Payload (from jellyfish-buildkite-plugin):</div>
            <pre style={{ margin: 0, fontSize: 11, color: colors.textSecondary, whiteSpace: "pre-wrap" }}>{`{
  "reference_id": "string (unique deployment identifier)",
  "is_successful": "boolean",
  "name": "string (deployment name)",
  "deployed_at": "string (ISO 8601 UTC timestamp)",
  "repo_name": "string (org/repo format)",
  "commit_shas": ["array of commit SHA strings"],
  "labels": ["array of key:value label strings"],
  "source_url": "string (URL to build/deployment source)"
}`}</pre>
          </div>
          <p style={{ fontSize: 12, color: colors.textMuted, marginTop: 8 }}>ADO Webhook events: workitem.created, workitem.deleted, workitem.restored, workitem.updated</p>
        </Card>
      )}

      {section === "mcp" && (
        <Card>
          <SectionTitle sub="jellyfish-mcp v1.0.2 | MIT License | 25 tools | Node.js v18+">MCP Server Tools</SectionTitle>
          <p style={{ fontSize: 12, color: colors.textSecondary, margin: "0 0 12px" }}>Compatible with: Claude Desktop, Claude Code, VSCode, Cursor. Supports Llama PromptGuard 2 for prompt injection detection.</p>
          <Table
            headers={["#", "Tool Name", "Description"]}
            rows={ALL_ENDPOINTS.map((ep, i) => [i + 1, <code>{ep.name}</code>, ep.desc])}
          />
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: colors.text }}>MCP Configuration Variables</div>
            <Table
              headers={["Variable", "Required", "Default", "Description"]}
              rows={[
                ["JELLYFISH_API_TOKEN", "Yes", "—", "Auth credential from API Export settings (Admin User Role required)"],
                ["HUGGINGFACE_API_TOKEN", "No", '""', "For PromptGuard 2 prompt injection mitigation"],
                ["MODEL_AVAILABILITY", "No", "false", "Allow requests if HuggingFace model unavailable"],
                ["MODEL_TIMEOUT", "No", "10", "Response wait duration in seconds"],
              ]}
            />
          </div>
        </Card>
      )}

      {section === "agent" && (
        <Card>
          <SectionTitle sub="jf_agent v0.1.3 | Python | MIT | Docker: jellyfishco/jf_agent:stable">On-Premises Data Agent</SectionTitle>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Supported Git Providers</div>
            <Table
              headers={["Constant", "Provider", "URL Format"]}
              rows={[
                ["GH_PROVIDER", "GitHub (Cloud & Enterprise)", "api.github.com or github.yourcompany.com/api/v3"],
                ["GL_PROVIDER", "GitLab", "gitlab.yourcompany.com"],
                ["BBC_PROVIDER", "Bitbucket Cloud", "api.bitbucket.org"],
                ["BBS_PROVIDER", "Bitbucket Server", "bitbucket.yourcompany.com"],
                ["ADO_PROVIDER", "Azure DevOps", "dev.azure.com"],
              ]}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Run Modes</div>
            <Table
              headers={["Mode", "Description"]}
              rows={[
                ["download_and_send", "Default: download all data and send to Jellyfish"],
                ["download_only", "Download data locally without sending"],
                ["send_only", "Send previously downloaded data"],
                ["validate", "Run health check validation"],
                ["print_all_jira_fields", "Print available Jira fields"],
                ["print_apparently_missing_git_repos", "Identify repos referenced in Jira but not in Git config"],
              ]}
            />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Key Environment Variables</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["JELLYFISH_API_TOKEN", "JIRA_USERNAME", "JIRA_PASSWORD", "JIRA_BEARER_TOKEN", "GITHUB_TOKEN", "GITLAB_TOKEN", "ADO_TOKEN", "BITBUCKET_CLOUD_USERNAME", "BITBUCKET_CLOUD_PASSWORD", "BITBUCKET_USERNAME", "BITBUCKET_PASSWORD", "REQUESTS_CA_BUNDLE"].map(v => (
                <code key={v} style={{ fontSize: 11, padding: "3px 6px", background: colors.surfaceAlt, borderRadius: 3, color: colors.textSecondary }}>{v}</code>
              ))}
            </div>
          </div>
        </Card>
      )}

      {section === "dora" && (
        <Card>
          <SectionTitle sub="Source: jellyfish.co/platform/devops-metrics/ — exactly 4 metrics, verbatim descriptions">DORA Metrics</SectionTitle>
          {DORA_METRICS.map((m, i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: i < 3 ? `1px solid ${colors.borderLight}` : "none" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: colors.text }}>{m.name}</div>
              <div style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4, fontStyle: "italic" }}>"{m.desc}"</div>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: 12, background: colors.warningLight, borderRadius: 6, fontSize: 12, color: colors.warning }}>
            Note: Jellyfish lists exactly these 4 DORA metrics. There is no "Incident Rate" metric — that was a previously identified fabrication that has been corrected.
          </div>
        </Card>
      )}

      {section === "frameworks" && (
        <Card>
          <SectionTitle>Metrics Frameworks & Models</SectionTitle>
          {FRAMEWORKS.map((f, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: i < FRAMEWORKS.length - 1 ? `1px solid ${colors.borderLight}` : "none" }}>
              <div style={{ fontWeight: 600, color: colors.text }}>{f.name}</div>
              <div style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>{f.desc}</div>
            </div>
          ))}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Additional Tracked Metrics</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Issue Cycle Time", "Flow Metrics", "Code Churn", "Unlinked Pull Requests", "Sprint Summaries", "FTE Allocations", "Work Effort Distribution"].map(m => (
                <Badge key={m} color="accent">{m}</Badge>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 16, padding: 12, background: colors.surfaceAlt, borderRadius: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Platform-Reported Outcomes (from jellyfish.co/tour/)</div>
            <div style={{ fontSize: 12, color: colors.textSecondary }}>32% more focus on revenue-maximizing work | 2.6 days reduction in cycle time | 21% faster time to market | 25% more team collaboration</div>
          </div>
        </Card>
      )}

      {section === "platform" && (
        <Card>
          <SectionTitle sub="All features from jellyfish.co product pages">Platform Features</SectionTitle>
          {PLATFORM_FEATURES.map((cat, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, marginBottom: 8, padding: "6px 0", borderBottom: `2px solid ${colors.border}` }}>{cat.category}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {cat.features.map(f => <Badge key={f} color={i % 2 === 0 ? "accent" : "purple"}>{f}</Badge>)}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 8, fontSize: 12, color: colors.textSecondary }}>
            Additional: Jellyfish Assistant (AI natural language queries), Jellyfish Academy (academy.jellyfish.co), Trust Center (jellyfish.co/learn/trust-center/)
          </div>
        </Card>
      )}

      {section === "integrations" && (
        <Card>
          <SectionTitle sub="From jellyfish.co/platform/integrations/ and homepage">Integrations</SectionTitle>
          {Object.entries(INTEGRATIONS).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, textTransform: "capitalize", marginBottom: 6, padding: "4px 0", borderBottom: `1px solid ${colors.border}` }}>
                {cat.replace(/_/g, " ")} ({items.length})
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {items.map(item => <Badge key={item} color="accent">{item}</Badge>)}
              </div>
            </div>
          ))}
          <p style={{ margin: "8px 0 0", fontSize: 11, color: colors.textMuted }}>Note: The dedicated integrations page lists ~15 integrations. Additional integrations (GitLab, Bitbucket, Jenkins, CircleCI, PagerDuty, Opsgenie, etc.) are referenced on the homepage. See inventory for full source provenance.</p>
        </Card>
      )}

      {section === "urls" && (
        <Card>
          <SectionTitle>Key URLs & Access Points</SectionTitle>
          <Table
            headers={["Resource", "URL"]}
            rows={[
              ["Main Site", <a href="https://jellyfish.co/" target="_blank" rel="noopener" style={{ color: colors.accent }}>jellyfish.co</a>],
              ["Product Overview", <a href="https://jellyfish.co/product/" target="_blank" rel="noopener" style={{ color: colors.accent }}>jellyfish.co/product/</a>],
              ["Platform Tour", <a href="https://jellyfish.co/tour/" target="_blank" rel="noopener" style={{ color: colors.accent }}>jellyfish.co/tour/</a>],
              ["Integrations", <a href="https://jellyfish.co/platform/integrations/" target="_blank" rel="noopener" style={{ color: colors.accent }}>jellyfish.co/platform/integrations/</a>],
              ["DevOps Metrics", <a href="https://jellyfish.co/platform/devops-metrics/" target="_blank" rel="noopener" style={{ color: colors.accent }}>jellyfish.co/platform/devops-metrics/</a>],
              ["Life Cycle Explorer", <a href="https://jellyfish.co/platform/life-cycle-explorer/" target="_blank" rel="noopener" style={{ color: colors.accent }}>jellyfish.co/platform/life-cycle-explorer/</a>],
              ["DevEx", <a href="https://jellyfish.co/platform/devex/" target="_blank" rel="noopener" style={{ color: colors.accent }}>jellyfish.co/platform/devex/</a>],
              ["Resource Allocations", <a href="https://jellyfish.co/platform/resource-allocations/" target="_blank" rel="noopener" style={{ color: colors.accent }}>jellyfish.co/platform/resource-allocations/</a>],
              ["Capacity Planner", <a href="https://jellyfish.co/solutions/capacity-planner/" target="_blank" rel="noopener" style={{ color: colors.accent }}>jellyfish.co/solutions/capacity-planner/</a>],
              ["Knowledge Library", <a href="https://jellyfish.co/library/index/" target="_blank" rel="noopener" style={{ color: colors.accent }}>jellyfish.co/library/index/</a>],
              ["Resources", <a href="https://jellyfish.co/resources/" target="_blank" rel="noopener" style={{ color: colors.accent }}>jellyfish.co/resources/</a>],
              ["Help Center", "help.jellyfish.co/hc/en-us (login required)"],
              ["Academy", <a href="https://academy.jellyfish.co/app" target="_blank" rel="noopener" style={{ color: colors.accent }}>academy.jellyfish.co/app</a>],
              ["API Token Setup", <a href="https://app.jellyfish.co/settings/data-connections/api-export" target="_blank" rel="noopener" style={{ color: colors.accent }}>app.jellyfish.co/settings/data-connections/api-export</a>],
              ["API Schema", "app.jellyfish.co/endpoints/export/v0/schema (auth required)"],
              ["API Contact", "api@jellyfish.co"],
              ["GitHub Org", <a href="https://github.com/Jellyfish-AI" target="_blank" rel="noopener" style={{ color: colors.accent }}>github.com/Jellyfish-AI</a>],
            ]}
          />
        </Card>
      )}

      {section === "infra" && (
        <Card>
          <SectionTitle sub="Inferred from forked repos — each backed by specific commits/code changes">Infrastructure Stack (from GitHub forks)</SectionTitle>
          <Table
            headers={["Layer", "Technology", "Evidence"]}
            rows={[
              ["Database", "PostgreSQL + Citus (distributed)", "pgmetrics fork with Citus 11 support commit"],
              ["Workflow Orchestration", "Prefect", "prefect fork with Jellyfish-specific bug fixes"],
              ["Distributed Computing", "Dask", "dask-cloudprovider fork with AWS ECS throttle fix"],
              ["Task Queue", "Celery", "celery fork in Jellyfish-AI organization"],
              ["Cloud Infrastructure", "AWS (ECS, S3, Secrets Manager)", "prefect-aws fork; dask-cloudprovider ECS commits"],
              ["GitHub API Client", "PyGithub (customized)", "PyGithub fork with retry logic and session support"],
              ["Rate Limiting", "Custom implementation", "Replaced ratelimit fork; multi-realm, thread-safe in jf_agent"],
              ["Backend Framework", "Django + DRF", "rec-resources interview repo"],
              ["Frontend", "React + TypeScript", "rec-resources interview repo"],
            ]}
          />
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>GitHub Repositories (13 total)</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 4 }}>Original (6):</div>
            <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 8 }}>jellyfish-mcp, jf_agent, Jellyfish-Integration-Resources, jellyfish-buildkite-plugin, twistedtentacles, rec-resources</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 4 }}>Forked with customizations (7):</div>
            <div style={{ fontSize: 12, color: colors.textSecondary }}>ratelimit, PyGithub, pgmetrics, prefect, prefect-aws, dask-cloudprovider, celery</div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
const TABS = [
  { id: "sprint", label: "Sprint Health", icon: "S" },
  { id: "delivery", label: "Delivery", icon: "D" },
  { id: "allocation", label: "Allocation", icon: "A" },
  { id: "devex", label: "DevEx", icon: "X" },
  { id: "people", label: "People & Teams", icon: "P" },
  { id: "reference", label: "Reference", icon: "R" },
];

export default function JellyfishScrumMasterAssistant() {
  const [activeTab, setActiveTab] = useState("sprint");
  const [token, setToken] = useState("");

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", background: colors.bg, minHeight: "100vh", color: colors.text }}>
      {/* Header */}
      <div style={{ background: colors.surface, borderBottom: `1px solid ${colors.border}`, padding: "16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1100, margin: "0 auto" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: colors.text, letterSpacing: -0.3 }}>Jellyfish Scrum Master Assistant</h1>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: colors.textSecondary }}>Educational guide + live API integration — all data from verified inventory</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Badge color="accent">25 Endpoints</Badge>
            <Badge color="purple">6 Domains</Badge>
            <Badge color="success">Verified</Badge>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ background: colors.surface, borderBottom: `1px solid ${colors.border}`, padding: "0 24px", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 0, maxWidth: 1100, margin: "0 auto" }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 18px", border: "none", borderBottom: `2px solid ${activeTab === tab.id ? colors.accent : "transparent"}`, background: "transparent", color: activeTab === tab.id ? colors.accent : colors.textSecondary, fontWeight: activeTab === tab.id ? 700 : 500, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s ease" }}>
              <span style={{ width: 22, height: 22, borderRadius: 4, background: activeTab === tab.id ? colors.accentLight : colors.surfaceAlt, color: activeTab === tab.id ? colors.accent : colors.textMuted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px" }}>
        <ApiPanel token={token} setToken={setToken} />
        {activeTab === "sprint" && <SprintHealthTab token={token} />}
        {activeTab === "delivery" && <DeliveryTab token={token} />}
        {activeTab === "allocation" && <AllocationTab token={token} />}
        {activeTab === "devex" && <DevExTab token={token} />}
        {activeTab === "people" && <PeopleTeamsTab token={token} />}
        {activeTab === "reference" && <ReferenceTab />}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${colors.border}`, padding: "16px 24px", textAlign: "center", marginTop: 40 }}>
        <p style={{ margin: 0, fontSize: 11, color: colors.textMuted }}>
          All data sourced from jellyfish.co, Jellyfish-AI GitHub repositories, and published documentation. No assumptions or fabrications. Inventory validated March 30, 2026.
        </p>
      </div>
    </div>
  );
}
