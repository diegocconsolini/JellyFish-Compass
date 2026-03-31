import {
  MockSprint,
  MockDeliverable,
  MockTeamAllocation,
  MockPersonAllocation,
  MockIssueLifecycle,
  MockWorkflowStage,
  MockTeamBenchmark,
  MockCapacityPlan,
  MockAiAdoption,
  MockAiBeforeAfter,
  MockBurndown,
  MockProductFlow,
  MockRoadmapItem,
} from "@/lib/types";

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

// Life Cycle Explorer mock data
export const mockIssueLifecycle: MockIssueLifecycle[] = [
  { id: "PLAT-142", title: "Fix OAuth token refresh", stages: [{ name: "To Do", hours: 8 }, { name: "In Progress", hours: 24 }, { name: "In Review", hours: 12 }, { name: "QA", hours: 4 }, { name: "Done", hours: 0 }], totalHours: 48 },
  { id: "PLAT-158", title: "Add rate limit headers", stages: [{ name: "To Do", hours: 16 }, { name: "In Progress", hours: 8 }, { name: "In Review", hours: 32 }, { name: "QA", hours: 6 }, { name: "Done", hours: 0 }], totalHours: 62 },
  { id: "MOB-091", title: "Push notification rework", stages: [{ name: "To Do", hours: 4 }, { name: "In Progress", hours: 40 }, { name: "In Review", hours: 8 }, { name: "QA", hours: 16 }, { name: "Done", hours: 0 }], totalHours: 68 },
  { id: "DATA-203", title: "Migrate user table indexes", stages: [{ name: "To Do", hours: 24 }, { name: "In Progress", hours: 16 }, { name: "In Review", hours: 4 }, { name: "QA", hours: 2 }, { name: "Done", hours: 0 }], totalHours: 46 },
  { id: "FE-077", title: "Dashboard chart refactor", stages: [{ name: "To Do", hours: 48 }, { name: "In Progress", hours: 12 }, { name: "In Review", hours: 6 }, { name: "QA", hours: 3 }, { name: "Done", hours: 0 }], totalHours: 69 },
];

export const mockStageAverages = [
  { name: "To Do", avgHours: 20 },
  { name: "In Progress", avgHours: 20 },
  { name: "In Review", avgHours: 12.4 },
  { name: "QA", avgHours: 6.2 },
];

// Workflow Analysis mock data
export const mockWorkflowStages: MockWorkflowStage[] = [
  { from: "Intake", to: "Triage", avgHours: 4, handoffDelay: 2 },
  { from: "Triage", to: "Development", avgHours: 8, handoffDelay: 12 },
  { from: "Development", to: "Review", avgHours: 24, handoffDelay: 6 },
  { from: "Review", to: "QA", avgHours: 8, handoffDelay: 16 },
  { from: "QA", to: "Deploy", avgHours: 4, handoffDelay: 8 },
];

// Team Benchmarks mock data
export const mockTeamBenchmarks: MockTeamBenchmark[] = [
  { team: "Platform", velocity: 62, cycleTimeDays: 3.2, prReviewHours: 6, deploymentsPerWeek: 4, devexScore: 78 },
  { team: "Mobile", velocity: 45, cycleTimeDays: 4.8, prReviewHours: 12, deploymentsPerWeek: 2, devexScore: 65 },
  { team: "Data", velocity: 38, cycleTimeDays: 2.1, prReviewHours: 4, deploymentsPerWeek: 6, devexScore: 72 },
  { team: "Frontend", velocity: 54, cycleTimeDays: 2.8, prReviewHours: 5, deploymentsPerWeek: 5, devexScore: 81 },
];

// Capacity Planner mock data
export const mockCapacityPlan: MockCapacityPlan[] = [
  { team: "Platform", availableFte: 8.2, plannedFte: 9.1, gap: -0.9, status: "over" },
  { team: "Mobile", availableFte: 6.1, plannedFte: 5.8, gap: 0.3, status: "ok" },
  { team: "Data", availableFte: 5.4, plannedFte: 5.2, gap: 0.2, status: "ok" },
  { team: "Frontend", availableFte: 5.3, plannedFte: 5.5, gap: -0.2, status: "tight" },
];

export const mockSprintForecast = [
  { sprint: "Sprint 25", totalAvailable: 25.0, totalPlanned: 25.6, status: "tight" as const },
  { sprint: "Sprint 26", totalAvailable: 24.2, totalPlanned: 23.8, status: "ok" as const },
  { sprint: "Sprint 27", totalAvailable: 23.5, totalPlanned: 26.1, status: "over" as const },
];

// AI Impact mock data
export const mockAiAdoption: MockAiAdoption[] = [
  { team: "Platform", copilot: 82, cursor: 35, claudeCode: 18 },
  { team: "Mobile", copilot: 65, cursor: 52, claudeCode: 8 },
  { team: "Data", copilot: 45, cursor: 12, claudeCode: 42 },
  { team: "Frontend", copilot: 90, cursor: 68, claudeCode: 15 },
];

export const mockAiBeforeAfter: MockAiBeforeAfter[] = [
  { team: "Platform", before: { prsPerWeek: 18, cycleTimeDays: 4.2, reviewTimeHours: 8 }, after: { prsPerWeek: 24, cycleTimeDays: 3.1, reviewTimeHours: 5 } },
  { team: "Frontend", before: { prsPerWeek: 22, cycleTimeDays: 3.5, reviewTimeHours: 6 }, after: { prsPerWeek: 31, cycleTimeDays: 2.4, reviewTimeHours: 4 } },
  { team: "Data", before: { prsPerWeek: 12, cycleTimeDays: 2.8, reviewTimeHours: 5 }, after: { prsPerWeek: 16, cycleTimeDays: 2.0, reviewTimeHours: 3 } },
];

// Scenario Planner mock data
export const mockCurrentScenario = [
  { label: "Feature Development", value: 12.4, color: "blue" as const },
  { label: "Keep the Lights On", value: 5.8, color: "amber" as const },
  { label: "Tech Debt", value: 3.2, color: "violet" as const },
  { label: "Growth / Scaling", value: 2.1, color: "green" as const },
  { label: "Unallocated", value: 1.5, color: "ghost" as const },
];

export const mockAdjustedScenario = [
  { label: "Feature Development", value: 14.2, color: "blue" as const },
  { label: "Keep the Lights On", value: 4.0, color: "amber" as const },
  { label: "Tech Debt", value: 3.2, color: "violet" as const },
  { label: "Growth / Scaling", value: 2.1, color: "green" as const },
  { label: "Unallocated", value: 1.5, color: "ghost" as const },
];

// Product pages mock data

export const mockBurndown: MockBurndown[] = [
  { week: "W1", deliverable: "Auth Service Rewrite", percentComplete: 45 },
  { week: "W2", deliverable: "Auth Service Rewrite", percentComplete: 52 },
  { week: "W3", deliverable: "Auth Service Rewrite", percentComplete: 58 },
  { week: "W4", deliverable: "Auth Service Rewrite", percentComplete: 65 },
  { week: "W5", deliverable: "Auth Service Rewrite", percentComplete: 70 },
  { week: "W6", deliverable: "Auth Service Rewrite", percentComplete: 74 },
  { week: "W7", deliverable: "Auth Service Rewrite", percentComplete: 78 },
  { week: "W1", deliverable: "Mobile App v3.0", percentComplete: 15 },
  { week: "W2", deliverable: "Mobile App v3.0", percentComplete: 20 },
  { week: "W3", deliverable: "Mobile App v3.0", percentComplete: 25 },
  { week: "W4", deliverable: "Mobile App v3.0", percentComplete: 30 },
  { week: "W5", deliverable: "Mobile App v3.0", percentComplete: 34 },
  { week: "W6", deliverable: "Mobile App v3.0", percentComplete: 38 },
  { week: "W7", deliverable: "Mobile App v3.0", percentComplete: 45 },
  { week: "W1", deliverable: "Data Pipeline Migration", percentComplete: 72 },
  { week: "W2", deliverable: "Data Pipeline Migration", percentComplete: 78 },
  { week: "W3", deliverable: "Data Pipeline Migration", percentComplete: 82 },
  { week: "W4", deliverable: "Data Pipeline Migration", percentComplete: 85 },
  { week: "W5", deliverable: "Data Pipeline Migration", percentComplete: 88 },
  { week: "W6", deliverable: "Data Pipeline Migration", percentComplete: 90 },
  { week: "W7", deliverable: "Data Pipeline Migration", percentComplete: 92 },
];

export const mockShipEstimates = [
  { deliverable: "Auth Service Rewrite", percentComplete: 78, remainingPoints: 14, avgVelocity: 62, estimatedSprints: 1, estimatedDate: "2026-04-14", confidence: "high" as const },
  { deliverable: "Mobile App v3.0", percentComplete: 45, remainingPoints: 42, avgVelocity: 45, estimatedSprints: 3, estimatedDate: "2026-05-26", confidence: "medium" as const },
  { deliverable: "Data Pipeline Migration", percentComplete: 92, remainingPoints: 4, avgVelocity: 38, estimatedSprints: 1, estimatedDate: "2026-04-07", confidence: "high" as const },
  { deliverable: "API Rate Limiting", percentComplete: 30, remainingPoints: 18, avgVelocity: 54, estimatedSprints: 2, estimatedDate: "2026-04-28", confidence: "low" as const },
];

export const mockProductFlow: MockProductFlow[] = [
  { team: "Platform", cycleTimeDays: 3.2, leadTimeDays: 5.8, deployFrequency: 4.0 },
  { team: "Mobile", cycleTimeDays: 4.8, leadTimeDays: 8.2, deployFrequency: 2.0 },
  { team: "Data", cycleTimeDays: 2.1, leadTimeDays: 4.5, deployFrequency: 6.0 },
  { team: "Frontend", cycleTimeDays: 2.8, leadTimeDays: 5.1, deployFrequency: 5.0 },
];

export const mockProductQuality = [
  { product: "Core Platform", bugs: 12, criticalBugs: 2, avgResolutionDays: 3.5, uptime: 99.8 },
  { product: "Mobile App", bugs: 28, criticalBugs: 5, avgResolutionDays: 5.2, uptime: 99.2 },
  { product: "Data Pipeline", bugs: 6, criticalBugs: 0, avgResolutionDays: 1.8, uptime: 99.9 },
  { product: "Public API", bugs: 9, criticalBugs: 1, avgResolutionDays: 2.4, uptime: 99.7 },
];

export const mockRoadmapItems: MockRoadmapItem[] = [
  { initiative: "Auth Service Rewrite", plannedFte: 4.0, actualFte: 4.2, status: "on-track" },
  { initiative: "Mobile App v3.0", plannedFte: 6.0, actualFte: 3.8, status: "under-invested" },
  { initiative: "Data Pipeline Migration", plannedFte: 2.0, actualFte: 2.1, status: "on-track" },
  { initiative: "API Rate Limiting", plannedFte: 1.5, actualFte: 0.8, status: "under-invested" },
  { initiative: "Platform Monitoring", plannedFte: 1.0, actualFte: 2.4, status: "over-invested" },
];
