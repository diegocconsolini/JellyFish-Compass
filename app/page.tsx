import Link from "next/link";

import { HighlightCard } from "@/components/ui/highlight-card";
import { SectionBlock } from "@/components/ui/section-block";
import { StatCard } from "@/components/ui/stat-card";
import { examples } from "@/data/examples";
import { homePaths } from "@/data/highlights";
import { metrics } from "@/data/metrics";
import { playbooks } from "@/data/playbooks";

export default function HomePage() {
  return (
    <>
      <section className="page-section">
        <div className="hero">
          <div className="hero-card">
            <p className="eyebrow">Learning-first V1</p>
            <h1 className="hero-title">
              A polished Jellyfish learning studio for Scrum Masters and teams that want to
              use the platform well.
            </h1>
            <p className="hero-copy">
              Jellyfish Compass turns product breadth into practical guidance. Users can learn
              the platform, see realistic examples, follow guided playbooks, create reusable
              summaries, and save their work in one place.
            </p>
            <div className="hero-actions">
              <Link className="button-primary" href="/academy">
                Start with Academy
              </Link>
              <Link className="button-secondary" href="/playbooks">
                Explore Playbooks
              </Link>
            </div>
          </div>

          <aside className="hero-card hero-side">
            <span className="kicker">What V1 already does</span>
            <div className="stat-list">
              <StatCard
                label="Platform Coverage"
                value="Full breadth"
                note="Academy, examples, reference, showcase, and guided outputs cover the whole Jellyfish story."
              />
              <StatCard
                label="Primary User"
                value="Scrum Masters"
                note="The workflows are tuned for retros, sprint health, delivery, blockers, and capacity discussions."
              />
              <StatCard
                label="Saved Work"
                value="Workspace-ready"
                note="Bookmarks, summaries, templates, notes, and favorite examples are first-class concepts."
              />
            </div>
          </aside>
        </div>
      </section>

      <SectionBlock
        title="Choose your path"
        copy="Each area of the app supports a different kind of Jellyfish adoption, from learning to guided workflows to saved outputs."
      >
        <div className="grid cols-3">
          {homePaths.map((item) => (
            <HighlightCard key={item.href} item={item} />
          ))}
        </div>
      </SectionBlock>

      <SectionBlock
        title="Core capabilities"
        copy="The first release is designed to help users understand Jellyfish, apply it in ceremonies, and keep the outputs that matter."
      >
        <div className="grid cols-3">
          <div className="card">
            <h3>Academy and platform reference</h3>
            <p>
              Educational modules teach the meaning of DORA, DevEx, allocations, delivery,
              AI impact, integrations, and the Jellyfish operating model.
            </p>
          </div>
          <div className="card">
            <h3>Guided playbooks</h3>
            <p>
              Playbooks show how to run retros, capacity reviews, stakeholder updates, and
              blocker reviews using Jellyfish concepts and examples.
            </p>
          </div>
          <div className="card">
            <h3>Examples and reusable outputs</h3>
            <p>
              Example scenarios, interpretation panels, and generated summaries make it easy
              to go from learning to practical communication.
            </p>
          </div>
        </div>
      </SectionBlock>

      <SectionBlock
        title="Featured metrics and workflows"
        copy="These are the first content pillars migrated from the prototype and inventory."
      >
        <div className="split-panel">
          <div className="panel card">
            <h3>Featured metrics</h3>
            <div className="grid">
              {metrics.map((metric) => (
                <div key={metric.id}>
                  <h4>{metric.name}</h4>
                  <p>{metric.summary}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel card">
            <h3>Featured playbooks</h3>
            <div className="grid">
              {playbooks.map((playbook) => (
                <div key={playbook.id}>
                  <h4>{playbook.title}</h4>
                  <p>{playbook.goal}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionBlock>

      <SectionBlock
        title="Example scenarios"
        copy="The examples library teaches users how to read Jellyfish signals before real connectivity lands in V2."
      >
        <div className="grid cols-2">
          {examples.map((example) => (
            <div key={example.id} className="card">
              <h3>{example.title}</h3>
              <p>{example.scenario}</p>
              <ul className="list-reset">
                {example.whatToNotice.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionBlock>
    </>
  );
}
