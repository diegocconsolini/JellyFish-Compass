import { PageHero } from "@/components/ui/page-hero";
import { SectionBlock } from "@/components/ui/section-block";
import { Badge } from "@/components/ui/badge";
import { GuideBox } from "@/components/ui/guide-box";
import { playbooks } from "@/data/playbooks";

export default function PlaybooksPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-7 py-7">
      <PageHero
        eyebrow="Playbooks"
        title="Guided workflows"
        subtitle="for ceremonies & communication"
        intro="Playbooks are where the app becomes operational. Each one teaches a structured workflow, shows the signals to inspect, and produces a reusable output the user can save."
      />

      <GuideBox title="How playbooks work">
        Playbooks guide you through a structured sequence of steps tied to a specific ceremony or
        communication need. Each playbook starts with context-setting, moves through signal
        inspection, and ends with a concrete output — a summary, a brief, or a set of talking
        points — that you can save and reuse.
      </GuideBox>

      <SectionBlock title="Available playbooks">
        <div className="grid grid-cols-3 gap-3">
          {playbooks.map((playbook) => (
            <div key={playbook.id} className="bg-surface rounded-xl border p-5">
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
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock title="Implementation principles">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface rounded-xl border p-5">
            <h3 className="font-bold text-base mb-2">Structured and calm</h3>
            <p className="text-text-dim text-sm">
              Users should move through a guided sequence, see what matters, and leave with a clean
              summary rather than a pile of disconnected tips.
            </p>
          </div>
          <div className="bg-surface rounded-xl border p-5">
            <h3 className="font-bold text-base mb-2">Action-oriented</h3>
            <p className="text-text-dim text-sm">
              Every playbook connects a Jellyfish concept to a real ceremony, decision, or
              stakeholder conversation, then saves the output to the Workspace.
            </p>
          </div>
        </div>
      </SectionBlock>
    </div>
  );
}
