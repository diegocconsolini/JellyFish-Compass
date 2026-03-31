"use client";
import { DataTable } from "@/components/ui/data-table";

const keyUrls = [
  { name: "Main Site", url: "https://jellyfish.co/", purpose: "Company homepage" },
  { name: "Product Overview", url: "https://jellyfish.co/product/", purpose: "Product feature overview" },
  { name: "Platform Tour", url: "https://jellyfish.co/tour/", purpose: "Guided product walkthrough" },
  { name: "Integrations", url: "https://jellyfish.co/platform/integrations/", purpose: "Full integrations catalog" },
  { name: "DevOps Metrics", url: "https://jellyfish.co/platform/devops-metrics/", purpose: "DORA metrics detail page" },
  { name: "Life Cycle Explorer", url: "https://jellyfish.co/platform/life-cycle-explorer/", purpose: "Issue-level operational analysis" },
  { name: "DevEx", url: "https://jellyfish.co/platform/devex/", purpose: "Developer experience insights" },
  { name: "Resource Allocations", url: "https://jellyfish.co/platform/resource-allocations/", purpose: "FTE-based allocation model" },
  { name: "Capacity Planner", url: "https://jellyfish.co/solutions/capacity-planner/", purpose: "Workload capacity prediction" },
  { name: "Platform Engineering", url: "https://jellyfish.co/solutions/platform-engineering/", purpose: "Platform engineering solution" },
  { name: "Eng & Product Ops", url: "https://jellyfish.co/solutions/engineering-product-operations/", purpose: "Engineering operations solution" },
  { name: "Knowledge Library", url: "https://jellyfish.co/library/index/", purpose: "80+ articles across 17 categories" },
  { name: "Resources", url: "https://jellyfish.co/resources/", purpose: "eBooks, guides, and reports" },
  { name: "Webinars", url: "https://jellyfish.co/webinars/", purpose: "On-demand webinars (7 pages)" },
  { name: "Help Center", url: "https://help.jellyfish.co/hc/en-us", purpose: "Product documentation (login required)" },
  { name: "Academy", url: "https://academy.jellyfish.co/app", purpose: "Training platform" },
  { name: "Trust Center", url: "https://jellyfish.co/learn/trust-center/", purpose: "Security and compliance" },
  { name: "Request Demo", url: "https://jellyfish.co/request-a-demo/", purpose: "Demo request form" },
  { name: "API Token Setup", url: "https://app.jellyfish.co/settings/data-connections/api-export", purpose: "API token configuration (login required)" },
  { name: "API Schema", url: "https://app.jellyfish.co/endpoints/export/v0/schema", purpose: "OpenAPI schema (auth required)" },
  { name: "API Contact", url: "mailto:api@jellyfish.co", purpose: "API support email" },
  { name: "AI Contact", url: "mailto:ai@jellyfish.co", purpose: "AI-related inquiries" },
  { name: "GitHub Organization", url: "https://github.com/Jellyfish-AI", purpose: "Open source repositories" },
];

export function KeyUrlsSection() {
  return (
    <div className="space-y-4">
      <DataTable
        caption="Key URLs and access points"
        headers={["Name", "URL", "Purpose"]}
        rows={keyUrls.map((u) => [
          <span key="name" className="text-[13px] font-medium">{u.name}</span>,
          <a
            key="url"
            href={u.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-blue hover:underline break-all"
          >
            {u.url}
          </a>,
          <span key="purpose" className="text-[13px] text-text-dim">{u.purpose}</span>,
        ])}
      />
    </div>
  );
}
