import { PageHero } from "@/components/ui/page-hero";
import { SectionBlock } from "@/components/ui/section-block";
import { playbooks } from "@/data/playbooks";

export default function PlaybooksPage() {
  return (
    <div className="page-section">
      <div className="page-stack">
        <PageHero
          eyebrow="Playbooks"
          title="Guided Jellyfish workflows for retros, planning, delivery, and communication."
          intro="Playbooks are where the app becomes operational. Each one teaches a workflow, shows the signals to inspect, and produces a reusable output the user can save."
        />

        <SectionBlock
          title="Seed playbooks"
          copy="These are the first workflow tracks to implement from the backlog."
        >
          <div className="grid cols-3">
            {playbooks.map((playbook) => (
              <div key={playbook.id} className="card">
                <h3>{playbook.title}</h3>
                <p>{playbook.goal}</p>
                <h4>Outputs</h4>
                <ul className="list-reset">
                  {playbook.outputs.map((output) => (
                    <li key={output}>{output}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock
          title="How playbooks should feel"
          copy="This guides the implementation quality bar."
        >
          <div className="grid cols-2">
            <div className="card">
              <h3>Structured and calm</h3>
              <p>
                Users should move through a guided sequence, see what matters, and leave with
                a clean summary rather than a pile of disconnected tips.
              </p>
            </div>
            <div className="card">
              <h3>Action-oriented</h3>
              <p>
                Every playbook should connect a Jellyfish concept to a real ceremony, decision,
                or stakeholder conversation, then save the output to the Workspace.
              </p>
            </div>
          </div>
        </SectionBlock>
      </div>
    </div>
  );
}
