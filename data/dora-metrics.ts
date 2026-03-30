import { DoraMetric } from "@/lib/types";

export const doraMetrics: DoraMetric[] = [
  { name: "Deployment Frequency", desc: "Track how often the team pushes deployments. See the impact of process and tooling changes to ensure continuous improvement." },
  { name: "Lead Time for Changes", desc: "Understand the duration of your full value delivery cycle, from the moment a change is selected for development to its deployment." },
  { name: "Mean Time to Resolution", desc: "Measure the time from the start of an incident to its resolution, and minimize system downtime." },
  { name: "Change Failure Rate", desc: "Monitor the frequency of incidents or deployment failures to guarantee uninterrupted delivery of value to your customers." },
];
