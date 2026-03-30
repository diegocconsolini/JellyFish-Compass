import { IntegrationCategory } from "@/lib/types";

export const integrations: IntegrationCategory[] = [
  { category: "AI Coding Tools", tools: ["GitHub Copilot", "Cursor", "Claude Code", "Windsurf", "Amazon Q Developer", "Gemini Code Assist", "Augment", "Baz", "Graphite", "Greptile"] },
  { category: "Issue Tracking", tools: ["Jira", "Linear", "Azure Boards", "Productboard", "Aha!", "ProductPlan"] },
  { category: "Source & CI/CD", tools: ["GitHub (Cloud & Enterprise)", "GitLab", "Bitbucket Cloud", "Bitbucket Server", "Azure DevOps", "Azure Repos", "Jenkins", "CircleCI", "Buildkite"] },
  { category: "Monitoring", tools: ["PagerDuty", "Opsgenie", "SonarQube", "CodeRabbit", "Sourcegraph"] },
  { category: "Collaboration", tools: ["Slack", "Google Sheets", "Google Calendar"] },
];
