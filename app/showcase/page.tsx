import { PageHero } from "@/components/ui/page-hero";
import { SectionBlock } from "@/components/ui/section-block";

const showcaseAreas = [
  {
    title: "For Scrum Masters",
    body: "Retro support, sprint health, blockers, invisible work, planning preparation, and clearer stakeholder communication.",
  },
  {
    title: "For engineering leadership",
    body: "Delivery trend understanding, business alignment, team comparisons, and outcome-oriented reporting.",
  },
  {
    title: "For DevEx and AI impact",
    body: "Show how workflow friction, survey insights, and AI tooling investment fit into a broader operating model.",
  },
  {
    title: "For platform breadth",
    body: "Surface MCP, integrations, planning, DevFinOps, and feature connections without losing the user in system detail.",
  },
];

export default function ShowcasePage() {
  return (
    <div className="page-section">
      <div className="page-stack">
        <PageHero
          eyebrow="Showcase"
          title="Show all the possibilities Jellyfish offers without turning the app into a product brochure."
          intro="Showcase demonstrates breadth in a way that still teaches. It should feel inspiring, credible, and grounded in practical workflows."
        />

        <SectionBlock
          title="Capability stories"
          copy="These become polished narrative pages that explain what Jellyfish can unlock across roles and use cases."
        >
          <div className="grid cols-2">
            {showcaseAreas.map((area) => (
              <div key={area.title} className="card">
                <h3>{area.title}</h3>
                <p>{area.body}</p>
              </div>
            ))}
          </div>
        </SectionBlock>
      </div>
    </div>
  );
}
