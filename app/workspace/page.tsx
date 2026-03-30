import { PageHero } from "@/components/ui/page-hero";
import { SectionBlock } from "@/components/ui/section-block";

const savedObjectTypes = [
  "Bookmarks",
  "Saved summaries",
  "Playbook outputs",
  "Reusable templates",
  "Notes",
  "Favorite examples",
];

export default function WorkspacePage() {
  return (
    <div className="page-section">
      <div className="page-stack">
        <PageHero
          eyebrow="Workspace"
          title="A saved layer for the parts of Jellyfish learning and practice users want to keep."
          intro="Workspace is where users return after exploring. It stores the summaries, notes, templates, and favorite artifacts that make the app useful over time."
        />

        <SectionBlock
          title="Saved artifact types"
          copy="These are first-class workspace concepts in V1."
        >
          <div className="grid cols-3">
            {savedObjectTypes.map((item) => (
              <div key={item} className="card">
                <h3>{item}</h3>
                <p>
                  This object type should be creatable from Academy, Examples, Playbooks, or
                  Reference pages and easy to revisit later.
                </p>
              </div>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock
          title="Implementation note"
          copy="V1 can start with lightweight local persistence, but the model should be compatible with a later backend-backed account workspace."
        >
          <div className="card">
            <p>
              The workspace model should avoid being an afterthought. Saved items need stable
              types, metadata, edit flows, and room for tags or folders so the learning app
              becomes a reusable tool over time.
            </p>
          </div>
        </SectionBlock>
      </div>
    </div>
  );
}
