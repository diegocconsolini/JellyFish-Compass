import { IntegrationCategory } from "@/lib/types";

// Source provenance per inventory Section 7 and Section 13 item 5:
// - Integrations page: AI tools, Jira, Linear, Azure Boards, GitHub, Azure DevOps, Buildkite
// - Homepage navigation: GitLab, Bitbucket, Jenkins, CircleCI, PagerDuty, Opsgenie, SonarQube, Sourcegraph, CodeRabbit, Slack, Google Sheets, Google Calendar, Productboard, Aha!, ProductPlan
// - jf_agent source: GitHub, GitLab, Bitbucket Cloud, Bitbucket Server, Azure DevOps (agent support)
// - jellyfish-buildkite-plugin: Buildkite (plugin support)

export const integrations: IntegrationCategory[] = [
  { category: "AI Coding Tools", tools: ["GitHub Copilot", "Cursor", "Claude Code", "Windsurf", "Amazon Q Developer", "Gemini Code Assist", "Augment", "Baz", "Graphite", "Greptile"] },
  { category: "Issue Tracking", tools: ["Jira", "Linear", "Azure Boards", "Productboard", "Aha!", "ProductPlan"] },
  { category: "Source & CI/CD", tools: ["GitHub (Cloud & Enterprise)", "GitLab", "Bitbucket Cloud", "Bitbucket Server", "Azure DevOps", "Azure Repos", "Jenkins", "CircleCI", "Buildkite"] },
  { category: "Monitoring & Code Quality", tools: ["PagerDuty", "Opsgenie", "SonarQube", "CodeRabbit", "Sourcegraph"] },
  { category: "Collaboration", tools: ["Slack", "Google Sheets", "Google Calendar"] },
];
