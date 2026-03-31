"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { GuideBox } from "@/components/ui/guide-box";
import { ApiExplorer } from "@/components/ui/api-explorer";
import { endpointGroups } from "@/data/endpoints-full";
import { JellyfishEndpoint } from "@/lib/types";

const peopleEndpoints =
  endpointGroups.find((g) => g.domain === "People")?.endpoints ?? [];

const teamsEndpoints =
  endpointGroups.find((g) => g.domain === "Teams")?.endpoints ?? [];

const allPeopleTeamsEndpoints = [...peopleEndpoints, ...teamsEndpoints];

const mockListEngineers = {
  as_of: "2026-03-31",
  engineers: [
    {
      id: "person-001",
      name: "Alice Chen",
      email: "alice.chen@example.com",
      title: "Senior Software Engineer",
      team_id: "team-alpha",
      team_name: "Team Alpha",
      fte: 1.0,
    },
    {
      id: "person-002",
      name: "Bob Martinez",
      email: "bob.martinez@example.com",
      title: "Software Engineer",
      team_id: "team-beta",
      team_name: "Team Beta",
      fte: 1.0,
    },
    {
      id: "person-003",
      name: "Carol Nguyen",
      email: "carol.nguyen@example.com",
      title: "Staff Engineer",
      team_id: "team-alpha",
      team_name: "Team Alpha",
      fte: 1.0,
    },
  ],
  total: 3,
};

const mockListTeams = {
  hierarchy_level: 1,
  teams: [
    {
      id: "team-alpha",
      name: "Team Alpha",
      hierarchy_level: 1,
      parent_team_id: null,
      member_count: 6,
      child_team_count: 2,
    },
    {
      id: "team-beta",
      name: "Team Beta",
      hierarchy_level: 1,
      parent_team_id: null,
      member_count: 8,
      child_team_count: 0,
    },
    {
      id: "team-platform",
      name: "Platform",
      hierarchy_level: 1,
      parent_team_id: null,
      member_count: 5,
      child_team_count: 1,
    },
  ],
  total: 3,
};

function getParams(ep: JellyfishEndpoint): Record<string, string> {
  switch (ep.name) {
    case "list_engineers":
      return { as_of: "2026-03-31" };
    case "search_people":
      return { q: "" };
    case "list_teams":
      return { hierarchy_level: "1", include_children: "false" };
    case "search_teams":
      return { q: "" };
    default:
      return {};
  }
}

export default function PeopleTeamsPage() {
  const [token, setToken] = useState("");

  function handleTryIt(_ep: JellyfishEndpoint) {
    setTimeout(() => {
      document.getElementById("api-explorer-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  return (
    <div className="max-w-[1440px] mx-auto px-7 py-7">
      <PageHero
        eyebrow="People & Teams"
        title="People & teams"
        subtitle="directory"
      />

      <GuideBox title="Scrum Master Guide: People & Teams">
        <p>
          The People &amp; Teams endpoints give Scrum Masters programmatic access
          to the <strong>roster</strong> and <strong>hierarchy</strong> that
          underpin all Jellyfish data. Understanding who is allocatable and how
          teams are structured is a prerequisite for interpreting any metric or
          allocation report.
        </p>
        <ul className="mt-2 space-y-1.5 list-disc list-inside">
          <li>
            <code>list_engineers</code> returns every active, allocatable person
            as of a given date — ideal for building a point-in-time roster
            snapshot or detecting headcount changes.
          </li>
          <li>
            <code>search_people</code> accepts a name, email, or internal ID via
            the <code>q</code> param — use it to look up a specific individual
            before pulling their metrics or allocations.
          </li>
          <li>
            <code>list_teams</code> uses the <code>hierarchy_level</code> param
            (integer, starting at <code>1</code> for top-level) to scope which
            tier of the org you see. Pass{" "}
            <code>include_children=true</code> to expand sub-teams in a single
            call.
          </li>
          <li>
            <code>search_teams</code> locates a team by name or team ID — useful
            when feeding a <code>team_id</code> into downstream metrics or
            allocation endpoints.
          </li>
        </ul>
      </GuideBox>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {/* People Endpoints Card */}
        <div className="bg-surface rounded-xl border border-border p-5">
          <h2 className="text-sm font-bold mb-3">People Endpoints</h2>
          <div className="space-y-2">
            {peopleEndpoints.map((ep) => (
              <div
                key={ep.name}
                className="flex items-start justify-between gap-3 rounded-lg border border-border-vivid bg-bg p-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-mono font-bold text-[12.5px] text-text-primary">
                    {ep.name}
                  </div>
                  <div className="text-[11.5px] text-text-dim mt-0.5">
                    {ep.desc}
                  </div>
                </div>
                <button
                  onClick={() => handleTryIt(ep)}
                  className="shrink-0 px-3 py-1.5 rounded-md bg-blue-dim border border-blue/30 text-blue text-[11.5px] font-semibold hover:bg-blue hover:text-white transition-colors cursor-pointer"
                >
                  Try it
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Team Endpoints Card */}
        <div className="bg-surface rounded-xl border border-border p-5">
          <h2 className="text-sm font-bold mb-3">Team Endpoints</h2>
          <div className="space-y-2">
            {teamsEndpoints.map((ep) => (
              <div
                key={ep.name}
                className="flex items-start justify-between gap-3 rounded-lg border border-border-vivid bg-bg p-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-mono font-bold text-[12.5px] text-text-primary">
                    {ep.name}
                  </div>
                  <div className="text-[11.5px] text-text-dim mt-0.5">
                    {ep.desc}
                  </div>
                </div>
                <button
                  onClick={() => handleTryIt(ep)}
                  className="shrink-0 px-3 py-1.5 rounded-md bg-blue-dim border border-blue/30 text-blue text-[11.5px] font-semibold hover:bg-blue hover:text-white transition-colors cursor-pointer"
                >
                  Try it
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-5" id="api-explorer-section">
        <label htmlFor="api-token" className="block text-[11px] font-semibold uppercase tracking-widest text-text-ghost mb-1.5">
          Jellyfish API Token
        </label>
        <input
          id="api-token"
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your token to enable live mode"
          className="w-full max-w-md px-3 py-2 rounded-md border border-border bg-surface text-sm font-mono text-text-primary outline-none focus:border-blue placeholder:text-text-ghost"
        />
      </div>

      <ApiExplorer
        token={token}
        endpoints={allPeopleTeamsEndpoints}
        getParams={getParams}
        mockResponses={{
          list_engineers: mockListEngineers,
          list_teams: mockListTeams,
        }}
      />

      <GuideBox title="Use Cases for Scrum Masters">
        <p className="font-semibold text-text-primary mb-2">
          Three workflows where People &amp; Teams endpoints deliver immediate
          value:
        </p>
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-text-dim">
              1. New Member Onboarding
            </p>
            <p>
              When a new engineer joins, use <code>search_people</code> with
              their email to confirm they appear in Jellyfish as allocatable.
              Follow up with <code>list_engineers</code> using today&apos;s date
              as <code>as_of</code> to verify headcount has updated before
              running any allocation or metrics pull for the sprint.
            </p>
          </div>
          <div>
            <p className="font-semibold text-text-dim">
              2. Cross-Team Coordination
            </p>
            <p>
              Use <code>list_teams</code> with <code>hierarchy_level=1</code> and{" "}
              <code>include_children=true</code> to map the full org structure
              before pulling metrics across multiple teams. Knowing which teams
              are sub-teams of a parent group lets you aggregate data correctly
              and avoid double-counting effort in cross-team deliverables.
            </p>
          </div>
          <div>
            <p className="font-semibold text-text-dim">3. Roster Changes</p>
            <p>
              Compare <code>list_engineers</code> snapshots from two different{" "}
              <code>as_of</code> dates to detect roster changes between planning
              cycles. Engineers who appear in an older snapshot but not a current
              one may have left or moved teams — a signal to audit any open
              allocations or sprint assignments tied to that person&apos;s ID.
            </p>
          </div>
        </div>
      </GuideBox>
    </div>
  );
}
