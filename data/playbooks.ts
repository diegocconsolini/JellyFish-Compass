import { PlaybookDefinition } from "@/lib/types";

export const playbooks: PlaybookDefinition[] = [
  {
    id: "retro",
    title: "Sprint Retrospective",
    goal: "Turn Jellyfish metrics into a structured retro narrative that balances delivery, flow, blockers, and focus.",
    outputs: ["Retro summary", "Action items", "Leadership talking points"],
    steps: [
      "Review sprint health signals and delivery outcomes.",
      "Inspect unlinked work, carry-over, and trend outliers.",
      "Pull DevEx and blocker signals into the retrospective discussion.",
      "Generate a concise summary with actions and owners.",
    ],
  },
  {
    id: "capacity",
    title: "Capacity and Allocation Review",
    goal: "Use Jellyfish allocation concepts to explain focus, KTLO pressure, and delivery tradeoffs.",
    outputs: ["Capacity review brief", "Risk callouts", "Planning recommendations"],
    steps: [
      "Start with FTE and allocation concepts.",
      "Review investment categories and spread across teams or people.",
      "Call out capacity drift, under-allocation, or KTLO pressure.",
      "Save an output for planning and stakeholder review.",
    ],
  },
  {
    id: "stakeholder",
    title: "Stakeholder Status Summary",
    goal: "Turn Jellyfish signals into a concise update for partners and leadership.",
    outputs: ["Status summary", "Risk narrative", "Next-step recommendations"],
    steps: [
      "Frame the work in delivery and business terms.",
      "Highlight trend movement and known risks.",
      "Translate metrics into clear stakeholder language.",
      "Save and reuse the summary template.",
    ],
  },
];
