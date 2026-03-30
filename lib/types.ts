export type SectionId =
  | "academy"
  | "playbooks"
  | "examples"
  | "reference"
  | "workspace"
  | "showcase";

export type NavItem = {
  href: string;
  label: string;
  section: SectionId;
};

export type HighlightCard = {
  title: string;
  description: string;
  href: string;
  tags?: string[];
};

export type MetricDefinition = {
  id: string;
  name: string;
  category: string;
  summary: string;
  whyItMatters: string;
  scrumUse: string;
  related: string[];
};

export type PlaybookDefinition = {
  id: string;
  title: string;
  goal: string;
  outputs: string[];
  steps: string[];
};

export type ExampleDefinition = {
  id: string;
  title: string;
  scenario: string;
  whatToNotice: string[];
  nextActions: string[];
};

export type EndpointDefinition = {
  name: string;
  path: string;
  domain: string;
  description: string;
};
