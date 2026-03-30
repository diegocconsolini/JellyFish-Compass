import { PageHero } from "@/components/ui/page-hero";
import { SectionBlock } from "@/components/ui/section-block";
import { metrics } from "@/data/metrics";

const modules = [
  {
    title: "Jellyfish fundamentals",
    body: "Explain what Jellyfish measures, how platform areas connect, and why Scrum Masters should read metrics as workflow signals rather than isolated dashboards.",
  },
  {
    title: "Delivery and scope",
    body: "Teach deliverables, scope and effort history, sprint health, and how to spot bottlenecks or creeping scope in practice.",
  },
  {
    title: "Allocations and FTE",
    body: "Ground allocation concepts in focus, KTLO pressure, and realistic planning conversations.",
  },
  {
    title: "DevEx and AI impact",
    body: "Show how experience, workflow friction, and AI tooling adoption fit into a broader operating model.",
  },
];

export default function AcademyPage() {
  return (
    <div className="page-section">
      <div className="page-stack">
        <PageHero
          eyebrow="Academy"
          title="Learn Jellyfish in a way that is useful during real ceremonies."
          intro="The Academy is the educational backbone of the app. It translates the full platform into practical language, with special attention to how Scrum Masters interpret and apply each capability."
        />

        <SectionBlock
          title="Learning modules"
          copy="These modules become the core of the learning-first experience and connect directly into examples, reference, and playbooks."
        >
          <div className="grid cols-2">
            {modules.map((module) => (
              <div key={module.title} className="card">
                <h3>{module.title}</h3>
                <p>{module.body}</p>
              </div>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock
          title="Metrics currently seeded"
          copy="These metric definitions were migrated first because they matter most to the initial Scrum Master workflows."
        >
          <div className="grid cols-2">
            {metrics.map((metric) => (
              <div key={metric.id} className="card">
                <span className="kicker">{metric.category}</span>
                <h3>{metric.name}</h3>
                <p>{metric.whyItMatters}</p>
                <p>
                  <strong>Scrum Master angle:</strong> {metric.scrumUse}
                </p>
              </div>
            ))}
          </div>
        </SectionBlock>
      </div>
    </div>
  );
}
