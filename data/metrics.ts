import { MetricDefinition } from "@/lib/types";

export const metrics: MetricDefinition[] = [
  {
    id: "deployment-frequency",
    name: "Deployment Frequency",
    category: "DORA",
    summary: "Tracks how often teams ship changes and helps Scrum Masters connect process changes to delivery cadence.",
    whyItMatters: "It reveals whether the team can move work through delivery reliably, not just complete tickets inside a sprint board.",
    scrumUse: "Use it in reviews and retros to connect sprint process changes to actual delivery outcomes.",
    related: ["Lead Time for Changes", "Sprint Health", "Delivery Tracking"],
  },
  {
    id: "devex-index",
    name: "DevEx Index",
    category: "Developer Experience",
    summary: "A comparable score that combines research-backed surveys and delivery signals to surface friction in the developer experience.",
    whyItMatters: "It helps Scrum Masters discuss blockers using evidence instead of only anecdotal retro feedback.",
    scrumUse: "Bring it into retros to identify recurring sources of drag and prioritize systemic improvements.",
    related: ["SPACE Framework", "Blockers Review", "Unlinked Pull Requests"],
  },
  {
    id: "resource-allocation",
    name: "Resource Allocation",
    category: "Business Alignment",
    summary: "Shows how engineering effort is distributed across work categories, product lines, and priorities using FTE-based allocation.",
    whyItMatters: "It helps teams explain why sprint capacity feels constrained and whether KTLO work is crowding out roadmap delivery.",
    scrumUse: "Use it before planning and after retros to ground conversations about focus, spread, and capacity risk.",
    related: ["FTE", "Capacity Review", "Planning"],
  },
  {
    id: "unlinked-prs",
    name: "Unlinked Pull Requests",
    category: "Delivery",
    summary: "Highlights work merged without a linked tracked item, surfacing invisible work that distorts sprint reporting.",
    whyItMatters: "It reveals effort happening outside the delivery workflow, which can erode trust in sprint metrics.",
    scrumUse: "Review it weekly to coach better workflow hygiene and explain metric anomalies.",
    related: ["Sprint Health", "DevEx Index", "Stakeholder Summary"],
  },
];
