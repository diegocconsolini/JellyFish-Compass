import { MockSprint, MockDeliverable, MockTeamAllocation, MockPersonAllocation } from "@/lib/types";

export const mockSprints: MockSprint[] = [
  { name: "Sprint 24", committed: 18, completed: 16, carryOver: 2, velocity: 62, points: 62 },
  { name: "Sprint 23", committed: 15, completed: 14, carryOver: 1, velocity: 54, points: 54 },
  { name: "Sprint 22", committed: 20, completed: 16, carryOver: 4, velocity: 51, points: 51 },
  { name: "Sprint 21", committed: 17, completed: 15, carryOver: 2, velocity: 58, points: 58 },
];

export const mockScopeEffort = [
  { week: "W1", scope: 38, effort: 32 },
  { week: "W2", scope: 42, effort: 40 },
  { week: "W3", scope: 35, effort: 36 },
  { week: "W4", scope: 50, effort: 45 },
  { week: "W5", scope: 40, effort: 42 },
  { week: "W6", scope: 55, effort: 50 },
  { week: "W7", scope: 47, effort: 49 },
  { week: "W8", scope: 60, effort: 55 },
];

export const mockDeliverables: MockDeliverable[] = [
  { name: "Auth Service Rewrite", category: "Epics", issues: 24, percentComplete: 78, status: "on-track" },
  { name: "Mobile App v3.0", category: "Epics", issues: 42, percentComplete: 45, status: "at-risk" },
  { name: "Data Pipeline Migration", category: "Initiatives", issues: 18, percentComplete: 92, status: "on-track" },
  { name: "API Rate Limiting", category: "Features", issues: 8, percentComplete: 30, status: "behind" },
];

export const mockInvestmentAllocation = [
  { label: "Feature Development", value: 12.4, max: 25, color: "blue" as const },
  { label: "Keep the Lights On", value: 5.8, max: 25, color: "amber" as const },
  { label: "Tech Debt", value: 3.2, max: 25, color: "violet" as const },
  { label: "Growth / Scaling", value: 2.1, max: 25, color: "green" as const },
  { label: "Unallocated", value: 1.5, max: 25, color: "ghost" as const },
];

export const mockTeamAllocations: MockTeamAllocation[] = [
  { team: "Platform", totalFte: 8.2, features: 52, ktlo: 28, techDebt: 20 },
  { team: "Mobile", totalFte: 6.1, features: 45, ktlo: 35, techDebt: 20 },
  { team: "Data", totalFte: 5.4, features: 60, ktlo: 20, techDebt: 20 },
  { team: "Frontend", totalFte: 5.3, features: 48, ktlo: 32, techDebt: 20 },
];

export const mockPersonAllocations: MockPersonAllocation[] = [
  { name: "A. Santos", fte: 1.0, primaryCategory: "Features", spreadCount: 2 },
  { name: "B. Kim", fte: 0.9, primaryCategory: "KTLO", spreadCount: 4, flag: "High spread" },
  { name: "C. Patel", fte: 1.0, primaryCategory: "Features", spreadCount: 1 },
  { name: "D. Chen", fte: 0.6, primaryCategory: "Tech Debt", spreadCount: 3, flag: "Under-allocated" },
];

export const mockDevExScores = [
  { team: "Frontend", score: 81, color: "green" as const },
  { team: "Platform", score: 78, color: "blue" as const },
  { team: "Data", score: 72, color: "blue" as const },
  { team: "Mobile", score: 65, color: "amber" as const },
];

export const mockUnlinkedPrs = {
  total: 23,
  byTeam: [
    { team: "Platform", count: 9, color: "red" as const },
    { team: "Mobile", count: 7, color: "red" as const },
    { team: "Data", count: 4, color: "amber" as const },
    { team: "Frontend", count: 3, color: "blue" as const },
  ],
};

export const mockSprintKpis = {
  avgVelocity: { value: "56.3", unit: "story points / sprint", trend: "+12% vs last quarter", direction: "up" as const },
  completionRate: { value: "88%", unit: "committed vs completed", trend: "+5% improvement", direction: "up" as const },
  carryOver: { value: "3.0", unit: "avg items / sprint", trend: "watch threshold", direction: "down" as const },
  sprintCadence: { value: "2w", unit: "consistent cadence", trend: "stable", direction: "up" as const },
};
