import { ExampleDefinition } from "@/lib/types";

export const examples: ExampleDefinition[] = [
  {
    id: "sprint-health-example",
    title: "Sprint Health: strong completion, hidden work pressure",
    scenario:
      "A team appears healthy on completion rate, but Jellyfish reveals hidden work through unlinked PRs and rising KTLO pressure.",
    whatToNotice: [
      "Completion looks stable while delivery hygiene is slipping.",
      "Unlinked work can explain why ceremonies feel more chaotic than Jira suggests.",
      "Allocation context matters before changing team commitments.",
    ],
    nextActions: [
      "Coach issue-linking habits.",
      "Raise KTLO pressure in planning.",
      "Save a retro summary with delivery hygiene actions.",
    ],
  },
  {
    id: "devex-example",
    title: "DevEx friction behind falling velocity",
    scenario:
      "Velocity drops over several sprints while DevEx signals show workflow friction and context-switching overhead.",
    whatToNotice: [
      "DevEx helps explain systemic drag instead of blaming estimation quality.",
      "Delivery metrics and experience metrics should be read together.",
      "A Scrum Master can use this to improve the retro discussion quality.",
    ],
    nextActions: [
      "Run a blockers review playbook.",
      "Create a stakeholder-safe narrative for why throughput changed.",
      "Save the recommended actions as a template.",
    ],
  },
];
