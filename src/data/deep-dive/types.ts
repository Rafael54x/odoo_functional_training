import type { FillField } from "../types";

export type ShotRef = {
  src?: string;
  caption: string;
  /** true jika belum ada file screenshot nyata */
  required?: boolean;
  whatYouSee?: string;
  whatToFill?: string;
  why?: string;
  expectedResult?: string;
};

export type ConfigOption = {
  id: string;
  name: string;
  location: string;
  what: string;
  whyEnable: string;
  whenEnable: string;
  whenNot: string;
  businessExample: string;
  impact: string;
  screenshot?: ShotRef;
};

export type MasterField = {
  field: string;
  type: string;
  required: boolean;
  purpose: string;
  why: string;
  example: string;
  impactIfEmpty: string;
  related?: string;
};

export type MasterDataItem = {
  id: string;
  name: string;
  purpose: string;
  required: boolean;
  whyNeeded: string;
  fields: MasterField[];
  screenshot?: ShotRef;
};

export type DependencyNode = {
  id: string;
  label: string;
};

export type DependencyEdge = {
  from: string;
  to: string;
  why: string;
};

export type FormFieldDoc = {
  field: string;
  required: boolean;
  purpose: string;
  why: string;
  example: string;
};

export type FormDoc = {
  id: string;
  name: string;
  menuPath: string;
  fields: FormFieldDoc[];
  screenshot?: ShotRef;
};

export type Procedure = {
  id: string;
  title: string;
  goal: string;
  preparation: string[];
  steps: string[];
  expectedResult: string;
  verification: string[];
  fillFields?: FillField[];
  screenshot?: ShotRef;
};

export type Scenario = {
  id: string;
  title: string;
  whenToUse: string;
  flow: string[];
  notes?: string;
};

export type IntegrationLink = {
  id: string;
  withModule: string;
  relationship: string;
  whatHappens: string;
};

export type Mistake = {
  id: string;
  problem: string;
  why: string;
  detect: string;
  fix: string;
  prevent: string;
};

export type TroubleItem = {
  id: string;
  problem: string;
  causes: string[];
  diagnosis: string[];
  solution: string[];
  prevention: string;
};

export type BehindTheScene = {
  models: string[];
  relations: string[];
  automations: string[];
  securityNotes: string[];
  note: string;
};

export type ReportItem = {
  name: string;
  path: string;
  kpi: string;
  decision: string;
};

export type RoleAccess = {
  role: string;
  can: string[];
  cannot: string[];
  whyDifferent: string;
};

export type LevelContent = {
  beginner: string[];
  intermediate: string[];
  advanced: string[];
  expert: string[];
};

export type Exercise = {
  id: string;
  title: string;
  objective: string;
  prerequisites: string[];
  task: string[];
  expectedResult: string;
  checklist: string[];
};

export type DeepDiveModule = {
  slug: string;
  name: string;
  shortTitle: string;
  icon: string;
  category: string;
  wave: 1 | 2 | 3 | 4;
  availability: "available" | "verify" | "not_available";
  availabilityNote?: string;
  apps: string[];
  overview: {
    function: string;
    businessProblem: string;
    typicalUsers: string[];
    whenNeeded: string;
    relatedModules: string[];
    businessScenario: string;
  };
  prerequisites: {
    modules: string[];
    masterData: string[];
    configuration: string[];
    access: string[];
    relationships: string;
  };
  installation: {
    how: string[];
    dependencies: string[];
    afterInstall: string[];
    newMenus: string[];
    newSettings: string[];
  };
  configurations: ConfigOption[];
  masterData: MasterDataItem[];
  dependencies: {
    nodes: DependencyNode[];
    edges: DependencyEdge[];
    summary: string;
  };
  forms: FormDoc[];
  procedures: Procedure[];
  scenarios: Scenario[];
  integrations: IntegrationLink[];
  mistakes: Mistake[];
  troubleshooting: TroubleItem[];
  behind: BehindTheScene;
  reporting: ReportItem[];
  security: {
    roles: RoleAccess[];
    notes: string[];
  };
  levels: LevelContent;
  exercises: Exercise[];
  coreFlowLinks?: Array<{ label: string; href: string }>;
};
