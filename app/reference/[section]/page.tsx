import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/page-hero";
import { REFERENCE_SLUGS, REFERENCE_LABELS, type ReferenceSlug } from "@/data/reference-sections";

import { EndpointsSection } from "@/components/reference/endpoints";
import { AgentEndpointsSection } from "@/components/reference/agent-endpoints";
import { WebhooksSection } from "@/components/reference/webhooks";
import { McpToolsSection } from "@/components/reference/mcp-tools";
import { JfAgentSection } from "@/components/reference/jf-agent";
import { AgentConfigSection } from "@/components/reference/agent-config";
import { KeyUrlsSection } from "@/components/reference/key-urls";
import { InfrastructureSection } from "@/components/reference/infrastructure";
import { DoraMetricsSection } from "@/components/reference/dora-metrics";
import { FrameworksSection } from "@/components/reference/frameworks";
import { PlatformFeaturesSection } from "@/components/reference/platform-features";
import { IntegrationsSection } from "@/components/reference/integrations";
import { PersonasSection } from "@/components/reference/personas";
import { PeopleTeamsSection } from "@/components/reference/people-teams";
import { ResourcesSection } from "@/components/reference/resources";
import { KnowledgeLibrarySection } from "@/components/reference/knowledge-library";
import { LimitationsSection } from "@/components/reference/limitations";

export function generateStaticParams() {
  return REFERENCE_SLUGS.map((section) => ({ section }));
}

const SECTION_COMPONENTS: Record<ReferenceSlug, React.ComponentType> = {
  endpoints: EndpointsSection,
  agent: AgentEndpointsSection,
  webhooks: WebhooksSection,
  mcp: McpToolsSection,
  "jf-agent": JfAgentSection,
  "agent-config": AgentConfigSection,
  urls: KeyUrlsSection,
  infra: InfrastructureSection,
  dora: DoraMetricsSection,
  frameworks: FrameworksSection,
  features: PlatformFeaturesSection,
  integrations: IntegrationsSection,
  personas: PersonasSection,
  "people-teams": PeopleTeamsSection,
  resources: ResourcesSection,
  library: KnowledgeLibrarySection,
  limitations: LimitationsSection,
};

export default async function ReferenceSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!REFERENCE_SLUGS.includes(section as ReferenceSlug)) notFound();

  const slug = section as ReferenceSlug;
  const SectionComponent = SECTION_COMPONENTS[slug];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      <PageHero eyebrow="Reference" title={REFERENCE_LABELS[slug]} subtitle="Platform reference" />
      <SectionComponent />
    </div>
  );
}
