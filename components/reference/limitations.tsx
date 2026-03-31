"use client";

const limitations = [
  "API Documentation is behind authentication. The full OpenAPI/Swagger schema requires a Jellyfish API token.",
  "Help Center (help.jellyfish.co) requires authenticated access.",
  "Resources and Webinar archives span 7 pages; only page 1 was fully enumerable.",
  "The 7 agent endpoints in Section 1.3 are internal to jf_agent and are not part of the customer-facing Export API.",
  "Integration source provenance varies: some are from the integrations page, others from the homepage or product pages.",
  "DORA metric descriptions are verbatim from jellyfish.co/platform/devops-metrics/. Exactly 4 metrics.",
  "MCP tool descriptions are from manifest.json, lightly paraphrased for conciseness.",
  "REQUESTS_CA_BUNDLE is a standard Python requests library variable, not Jellyfish-specific.",
  "All data in this reference is sourced from official Jellyfish materials. No fabrications.",
];

export function LimitationsSection() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-text-dim">Known limitations and notes about data sources in this reference.</p>
      <ol className="space-y-3">
        {limitations.map((l, i) => (
          <li key={i} className="flex gap-3 text-[13px]">
            <span className="text-text-ghost font-mono text-xs mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-text-dim">{l}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
