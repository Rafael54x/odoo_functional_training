export type ScreenKind =
  | "login"
  | "apps"
  | "settings"
  | "list"
  | "form"
  | "kanban"
  | "wizard"
  | "report"
  | "dashboard";

export type FieldDemo = {
  label: string;
  value: string;
  required?: boolean;
  hint?: string;
  tab?: string;
};

/** Panduan isi field satu per satu (tampil sebagai tabel di lesson) */
export type FillField = {
  /** Nama field di layar Odoo */
  field: string;
  /** Nilai yang harus diisi */
  value: string;
  /** Tab / section tempat field berada */
  where?: string;
  /** Cara mengisi (ketik / pilih / centang / upload) */
  how?: string;
  required?: boolean;
  note?: string;
};

export type OdooScreenConfig = {
  kind: ScreenKind;
  app: string;
  menu: string;
  title: string;
  subtitle?: string;
  breadcrumb?: string[];
  status?: string;
  statusColor?: "draft" | "sent" | "done" | "cancel" | "progress" | "paid";
  buttons?: string[];
  columns?: string[];
  rows?: string[][];
  fields?: FieldDemo[];
  tabs?: string[];
  activeTab?: string;
  chatter?: string[];
  highlight?: string;
  note?: string;
};

export type LessonStep = {
  id: string;
  title: string;
  /** Jalur menu manusiawi, contoh: "Apps → Purchase → Orders → New" */
  menuPath: string;
  /** Potongan klik untuk ditampilkan sebagai breadcrumb pill */
  clickPath?: string[];
  /** Ringkas 1 kalimat: hasil yang didapat setelah langkah ini */
  goal: string;
  /** Penjelasan sederhana kenapa langkah ini ada (bahasa non-teknis) */
  why: string;
  /** Instruksi klik demi klik, kalimat pendek */
  actions: string[];
  /** Tabel isi field — nilai konkret yang harus diketik/dipilih */
  fillFields?: FillField[];
  /** Apa yang harus terlihat di layar jika berhasil */
  expectToSee?: string;
  /** Istilah baru yang muncul di langkah ini */
  glossary?: Array<{ term: string; meaning: string }>;
  tips?: string[];
  pitfalls?: string[];
  screen: OdooScreenConfig;
};

export type FlowNode = {
  id: string;
  label: string;
  type?: "start" | "process" | "decision" | "doc" | "end";
};

export type FlowEdge = {
  from: string;
  to: string;
  label?: string;
};

export type LessonFlow = {
  title: string;
  description: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
};

export type Lesson = {
  slug: string;
  title: string;
  duration: string;
  summary: string;
  /** Intro ramah pemula sebelum masuk langkah */
  beginnerIntro?: string;
  objectives: string[];
  prerequisites?: string[];
  flow?: LessonFlow;
  steps: LessonStep[];
  checklist?: string[];
};

export type SyllabusModule = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  icon: string;
  color: string;
  description: string;
  /** Satu kalimat “dalam bahasa manusia” */
  plainSummary?: string;
  apps: string[];
  outcomes: string[];
  lessons: Lesson[];
};
