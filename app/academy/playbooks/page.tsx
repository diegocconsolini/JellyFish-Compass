"use client";
import { PageHero } from "@/components/ui/page-hero";
import { SectionBlock } from "@/components/ui/section-block";
import { Badge } from "@/components/ui/badge";
import { GuideBox } from "@/components/ui/guide-box";
import { playbooks } from "@/data/playbooks";

const endpointMap: Record<string, Record<number, string>> = {
  retro: {
    0: "team_sprint_summary, team_metrics",
    1: "unlinked_pull_requests",
    2: "devex_insights_by_team",
  },
  capacity: {
    1: "allocations_by_investment_category, allocations_by_person",
  },
  stakeholder: {
    0: "company_metrics, team_metrics",
  },
};

const playbookCardColor: Record<string, string> = {
  retro: "from-blue to-cyan",
  capacity: "from-green to-emerald-300",
  stakeholder: "from-violet to-purple-300",
};

export default function AcademyPlaybooksPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      <PageHero
        eyebrow="Academy"
        title="Playbooks"
        subtitle="Guided workflows"
        intro="Step-by-step guides for ceremonies and communication workflows using Jellyfish data."
      />

      <GuideBox title="How playbooks work">
        Playbooks guide you through a structured sequence of steps tied to a
        specific ceremony or communication need. Each playbook starts with
        context-setting, moves through signal inspection, and ends with a
        concrete output — a summary, a brief, or a set of talking points —
        that you can save and reuse.
      </GuideBox>

      <SectionBlock title="Available playbooks">
        <div className="grid grid-cols-1 gap-3">
          {playbooks.map((playbook) => (
            <div
              key={playbook.id}
              className="relative overflow-hidden bg-surface rounded-xl border border-border p-5"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${playbookCardColor[playbook.id] ?? "from-blue to-cyan"}`}
              />
              <h3 className="font-bold text-base mb-2">{playbook.title}</h3>
              <p className="text-text-dim text-sm mb-4">{playbook.goal}</p>

              <div className="mb-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-text-ghost mb-2">
                  Outputs:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {playbook.outputs.map((output) => (
                    <Badge key={output} variant="blue">
                      {output}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-text-ghost mb-2">
                  Steps:
                </div>
                <ol className="list-decimal list-inside text-sm text-text-dim">
                  {playbook.steps.map((step, index) => (
                    <li key={index} className="mb-1.5">
                      {step}
                      {endpointMap[playbook.id]?.[index] && (
                        <code className="ml-1.5 font-mono text-xs bg-blue-dim text-blue px-1.5 py-0.5 rounded">
                          {endpointMap[playbook.id][index]}
                        </code>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock title="Implementation principles">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="relative overflow-hidden bg-surface rounded-xl border border-border p-5">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue to-cyan" />
            <h3 className="font-bold text-base mb-2">Structured and calm</h3>
            <p className="text-text-dim text-sm">
              Users should move through a guided sequence, see what matters,
              and leave with a clean summary rather than a pile of
              disconnected tips.
            </p>
          </div>
          <div className="relative overflow-hidden bg-surface rounded-xl border border-border p-5">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green to-emerald-300" />
            <h3 className="font-bold text-base mb-2">Action-oriented</h3>
            <p className="text-text-dim text-sm">
              Every playbook connects a Jellyfish concept to a real
              ceremony, decision, or stakeholder conversation, then saves
              the output to the Workspace.
            </p>
          </div>
        </div>
      </SectionBlock>
    </div>
  );
}
