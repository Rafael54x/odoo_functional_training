import type { LearningLevel } from "./architecture";

export type PathStep = {
  title: string;
  target: string;
  level: LearningLevel;
  note?: string;
};

export type LearningPath = {
  id: string;
  title: string;
  audience: string;
  durationHint: string;
  description: string;
  steps: PathStep[];
};

export const learningPaths: LearningPath[] = [
  {
    id: "path-beginner-flow",
    title: "Path A — Business Flow First (Pemula)",
    audience: "User baru / end-user operasional",
    durationHint: "1–2 minggu praktik terbimbing",
    description:
      "Ikuti Core Flow yang sudah ada (00–09). Setelah lancar transaksi, baru masuk Deep Dive modul yang dipakai sehari-hari.",
    steps: [
      { title: "Cara pakai lab", target: "/cara-pakai", level: "beginner" },
      { title: "Core 00 Fundamentals", target: "/modul/pengenalan", level: "beginner" },
      { title: "Core 01 Company", target: "/modul/setup-perusahaan", level: "beginner" },
      {
        title: "Users & Access (baru — Phase 3)",
        target: "/kurikulum#core-additions",
        level: "beginner",
        note: "Belum ada lesson; dirancang sebagai penambahan Core.",
      },
      { title: "Contacts", target: "/modul/master-contacts", level: "beginner" },
      { title: "Accounting foundations", target: "/modul/master-accounting", level: "beginner" },
      { title: "Products & WH", target: "/modul/master-inventory", level: "beginner" },
      { title: "Purchase P2P", target: "/modul/flow-purchase", level: "beginner" },
      { title: "Inventory ops", target: "/modul/flow-inventory", level: "beginner" },
      { title: "Sales O2C", target: "/modul/flow-sales", level: "beginner" },
      { title: "Invoicing & payment", target: "/modul/flow-invoicing", level: "intermediate" },
      { title: "E2E cycle", target: "/modul/flow-end-to-end", level: "intermediate" },
      {
        title: "Deep Dive Sales",
        target: "/kurikulum#mod-sales",
        level: "intermediate",
      },
    ],
  },
  {
    id: "path-module-expert",
    title: "Path B — Module Deep Dive First (Specialist)",
    audience: "Key user yang sudah kenal transaksi dasar",
    durationHint: "Per modul 2–5 hari",
    description:
      "Masuk Deep Dive satu modul (mis. Sales), kuasai config→master→skenario→integrasi, lalu kembali ke Core E2E untuk menguji dampak lintas modul.",
    steps: [
      { title: "Pilih modul di Matrix", target: "/kurikulum#module-matrix", level: "intermediate" },
      {
        title: "Overview → Prerequisites → Install",
        target: "/kurikulum#deep-template",
        level: "intermediate",
      },
      {
        title: "Complete Configuration",
        target: "/kurikulum#deep-template",
        level: "intermediate",
      },
      { title: "Master Data + Dependencies", target: "/kurikulum#deep-template", level: "intermediate" },
      { title: "Field docs + Procedures", target: "/kurikulum#deep-template", level: "advanced" },
      { title: "Scenarios + Integration", target: "/kurikulum#deep-template", level: "advanced" },
      { title: "Reporting + Security", target: "/kurikulum#deep-template", level: "advanced" },
      { title: "Troubleshoot + Exercises", target: "/kurikulum#deep-template", level: "expert" },
      { title: "Validasi lewat Core E2E", target: "/modul/flow-end-to-end", level: "expert" },
    ],
  },
  {
    id: "path-consultant",
    title: "Path C — Implementation Consultant",
    audience: "Functional consultant / implementor",
    durationHint: "3–6 minggu (bertahap per modul)",
    description:
      "Core Flow lengkap → Deep Dive fondasi (Sales/Purchase/Inventory/Accounting/Contacts) → Users/Security → modul adjacent (CRM/MRP/Project/HR/Web) → Final Project retail.",
    steps: [
      { title: "Core Flow end-to-end", target: "/silabus", level: "beginner" },
      { title: "Deep Dive fondasi", target: "/kurikulum#deep-dive", level: "advanced" },
      { title: "Security & multi-user design", target: "/kurikulum#mod-users", level: "advanced" },
      { title: "Integration map mastery", target: "/kurikulum#cross-integration", level: "advanced" },
      { title: "Modul adjacent & suite", target: "/materi", level: "expert" },
      { title: "Final Project Retail Company", target: "/kurikulum#final-project", level: "expert" },
      {
        title: "Optimization & best practices pack",
        target: "/kurikulum#cross-troubleshoot",
        level: "expert",
      },
    ],
  },
];

export const finalProjectOutline = {
  id: "retail-company",
  title: "Final Project — Odoo Retail Company",
  objective:
    "Mengimplementasikan perusahaan retail sederhana dari setup sampai laporan, memakai banyak modul terintegrasi.",
  companyProfile: {
    name: "PT Nusantara Functional Demo",
    industry: "Retail bahan minuman & kemasan",
    currency: "IDR",
    warehouses: 1,
  },
  phases: [
    "Company + Users/Access + Localization",
    "Contacts (2 vendor, 2 customer)",
    "Products + categories + taxes",
    "Purchase + Receipt + Vendor Bill + Payment",
    "Sales + Delivery + Invoice + Payment",
    "Inventory adjustments / internal transfer",
    "AR/AP + stock reporting + closing checklist",
  ],
  validationChecklist: [
    "Stok On Hand sesuai receipt − delivery ± adjustment",
    "Vendor bills & customer invoices Posted",
    "Payments ter-reconcile / Paid",
    "User non-admin hanya melihat menu sesuai group",
    "Laporan Aged AR/AP & Sales Analysis bisa dijelaskan bisnisnya",
  ],
};

export const configurationCardTemplate = {
  title: "Configuration Card (wajib di Deep Dive)",
  fields: [
    "Configuration Name",
    "Location (menu path)",
    "What is it?",
    "Why should it be enabled?",
    "When should it be enabled?",
    "When should it NOT be enabled?",
    "Business Example",
    "Impact on workflow",
    "Screenshot (real UI or [SCREENSHOT REQUIRED])",
  ],
};

export const fieldDocTemplate = {
  title: "Field Documentation Row",
  columns: [
    "Field",
    "Type",
    "Required",
    "Purpose",
    "Why fill?",
    "Example",
    "Impact if empty",
    "Related config / module",
  ],
};
