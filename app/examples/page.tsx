import { PageHero } from "@/components/ui/page-hero";
import { SectionBlock } from "@/components/ui/section-block";
import { examples } from "@/data/examples";

export default function ExamplesPage() {
  return (
    <div className="page-section">
      <div className="page-stack">
        <PageHero
          eyebrow="Examples Library"
          title="Show realistic Jellyfish situations before asking users to connect real data."
          intro="Examples are the bridge between education and confidence. They show what to notice, how to explain it, and what to do next."
        />

        <SectionBlock
          title="Scenario examples"
          copy="These sample cases model how a polished examples library should read."
        >
          <div className="grid cols-2">
            {examples.map((example) => (
              <div key={example.id} className="card">
                <h3>{example.title}</h3>
                <p>{example.scenario}</p>
                <h4>What to notice</h4>
                <ul className="list-reset">
                  {example.whatToNotice.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <h4>Next actions</h4>
                <ul className="list-reset">
                  {example.nextActions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SectionBlock>
      </div>
    </div>
  );
}
