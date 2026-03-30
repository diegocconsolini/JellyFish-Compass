import { PageHero } from "@/components/ui/page-hero";
import { SectionBlock } from "@/components/ui/section-block";
import { endpoints } from "@/data/endpoints";

export default function ReferencePage() {
  return (
    <div className="page-section">
      <div className="page-stack">
        <PageHero
          eyebrow="Reference"
          title="A clean, structured source of truth for Jellyfish concepts, metrics, and APIs."
          intro="The Reference area turns the inventory work into browsable product knowledge. In V1 it is content-first, searchable, and tightly linked to examples and playbooks."
        />

        <SectionBlock
          title="Seed endpoint catalog"
          copy="These entries represent the content-driven replacement for hardcoded endpoint lists in the original prototype."
        >
          <div className="grid cols-2">
            {endpoints.map((endpoint) => (
              <div key={endpoint.name} className="card">
                <span className="kicker">{endpoint.domain}</span>
                <h3>{endpoint.name}</h3>
                <p>{endpoint.description}</p>
                <p>
                  <strong>Path:</strong> <code>{endpoint.path}</code>
                </p>
              </div>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock
          title="Reference targets"
          copy="This section will grow into the full platform knowledge base."
        >
          <div className="grid cols-3">
            <div className="card">
              <h3>Export API and MCP</h3>
              <p>Document endpoints, tools, relationships, and example use cases in one place.</p>
            </div>
            <div className="card">
              <h3>Feature catalog</h3>
              <p>Show how AI impact, DevEx, delivery, planning, allocations, and business alignment connect.</p>
            </div>
            <div className="card">
              <h3>Glossary and frameworks</h3>
              <p>Clarify DORA, SPACE, DevEx Index, FTE, and related concepts without jargon overload.</p>
            </div>
          </div>
        </SectionBlock>
      </div>
    </div>
  );
}
