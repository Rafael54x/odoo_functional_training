/**
 * Gap analysis terhadap silabus existing (Core Flow 00–09).
 * Sumber: src/data/modules/*.ts · Odoo 19 Enterprise lab :8072 / DB odoo
 */

export type GapSeverity = "critical" | "high" | "medium" | "low";

export type GapItem = {
  id: string;
  area: string;
  severity: GapSeverity;
  finding: string;
  recommendation: string;
};

export const existingInventory = {
  version: "Odoo 19 Enterprise",
  labUrl: "http://172.16.2.123:8072",
  database: "odoo",
  layerToday: "Core Business Flow only (single linear path)",
  modules: [
    {
      number: "00",
      slug: "pengenalan",
      title: "Mulai dari Nol: Mengenal Odoo",
      coverage: ["Apps/UI basics", "Login", "Install Contacts/Sales/Purchase/Inventory/Accounting"],
      depth: "beginner",
    },
    {
      number: "01",
      slug: "setup-perusahaan",
      title: "Setup Perusahaan & Konfigurasi Dasar",
      coverage: ["Company profile", "Fiscal localization", "Currency/lang/timezone", "Feature flags ringkas"],
      depth: "beginner",
    },
    {
      number: "02",
      slug: "master-contacts",
      title: "Master Data Contacts",
      coverage: ["Vendor/customer create", "Sales & Purchase tab", "Accounting tab", "Child addresses"],
      depth: "beginner-intermediate",
    },
    {
      number: "03",
      slug: "master-accounting",
      title: "Master Data Accounting & Pajak",
      coverage: ["CoA", "Taxes", "Journals", "Payment Terms", "Fiscal Position"],
      depth: "beginner-intermediate",
    },
    {
      number: "04",
      slug: "master-inventory",
      title: "Master Data Inventory & Produk",
      coverage: ["WH/Locations/Operation Types", "UoM", "Categories", "Storable/service products"],
      depth: "beginner-intermediate",
    },
    {
      number: "05",
      slug: "flow-purchase",
      title: "Purchase (P2P awal)",
      coverage: ["RFQ→PO", "Receipt", "Vendor Bill", "Payment"],
      depth: "beginner",
    },
    {
      number: "06",
      slug: "flow-inventory",
      title: "Operasi Inventory Harian",
      coverage: ["Internal transfer", "Adjustment", "Traceability ringkas"],
      depth: "beginner",
    },
    {
      number: "07",
      slug: "flow-sales",
      title: "Sales (O2C awal)",
      coverage: ["Quotation→SO", "Delivery", "Create Invoice"],
      depth: "beginner",
    },
    {
      number: "08",
      slug: "flow-invoicing",
      title: "Invoicing, Payment & Rekonsiliasi",
      coverage: ["Post invoice", "Journal items", "Payment", "Credit note", "Bank/AR-AP reports"],
      depth: "intermediate",
    },
    {
      number: "09",
      slug: "flow-end-to-end",
      title: "E2E & Ujian Praktik",
      coverage: ["Weekly P2P+O2C script", "Troubleshooting checklist"],
      depth: "intermediate",
    },
  ],
  strengths: [
    "Alur bisnis linear yang jelas untuk pemula (setup → master → beli → jual → bayar)",
    "Step punya jalur klik, fillFields konkret, expectToSee, tips/pitfalls",
    "Screenshot UI Odoo 19 Enterprise terhubung ke hampir semua step core",
    "Seed data konsisten (vendor/customer/produk) memudahkan latihan ulang",
  ],
  stats: {
    coreModules: 10,
    lessonsApprox: 20,
    stepsApprox: 61,
    realScreenshotsOnDisk: 18,
    deepDiveModules: 0,
  },
} as const;

export const gaps: GapItem[] = [
  {
    id: "g1",
    area: "Architecture",
    severity: "critical",
    finding: "Hanya ada satu layer (Core Flow). Belum ada Module-by-Module Deep Dive.",
    recommendation: "Tambah Layer B Deep Dive tanpa menghapus Core Flow 00–09.",
  },
  {
    id: "g2",
    area: "Users & Access",
    severity: "critical",
    finding: "Users, Groups, Access Rights, Record Rules hampir tidak dibahas.",
    recommendation: "Sisipkan di Core Flow setelah Company; deep-dive Settings/Security.",
  },
  {
    id: "g3",
    area: "Module coverage",
    severity: "critical",
    finding:
      "CRM, Manufacturing, Project, Timesheets, HR, Website/eCommerce, POS, Helpdesk, dll. belum ada.",
    recommendation: "Bangun matrix modul per kategori + status Available / Verify / N/A.",
  },
  {
    id: "g4",
    area: "Configuration depth",
    severity: "high",
    finding: "Settings dibahas ringkas (on/off), belum format What/Why/When/Impact per option.",
    recommendation: "Template Configuration Card wajib di setiap Deep Dive.",
  },
  {
    id: "g5",
    area: "Master data & fields",
    severity: "high",
    finding: "Ada fillFields praktis, belum ada katalog field-by-field + dependency graph formal.",
    recommendation: "Section Master Data + Field Reference + Dependency diagram per modul.",
  },
  {
    id: "g6",
    area: "Integration",
    severity: "high",
    finding: "Integrasi muncul di transaksi, belum ada peta Sales↔Inventory↔Accounting eksplisit.",
    recommendation: "Section End-to-End Integration + diagram antar-modul.",
  },
  {
    id: "g7",
    area: "Exercises & Final Project",
    severity: "medium",
    finding: "E2E ada skenario, belum exercise bertingkat + final project retail terstruktur.",
    recommendation: "Exercise packs Beginner→Expert + Final Project checklist.",
  },
  {
    id: "g8",
    area: "Screenshots",
    severity: "high",
    finding:
      "18 screenshot Enterprise ada untuk Core; Deep Dive akan butuh banyak shot baru dari lab :8072.",
    recommendation: "Pipeline capture dari lab; tandai [SCREENSHOT REQUIRED] jika belum ada.",
  },
  {
    id: "g9",
    area: "Reporting / Security / Behind the scene",
    severity: "medium",
    finding: "Report & security hanya sesekali; Behind the Scene (model/relasi) belum ada.",
    recommendation: "Section wajib Reporting, Security, Behind the Scene per Deep Dive.",
  },
  {
    id: "g10",
    area: "Navigation",
    severity: "high",
    finding: "Nav hanya Silabus linear + Peta alur; belum entrypoint Dual-Layer.",
    recommendation: "Nav: Core Flow | Module Deep Dive | Kurikulum Map | Final Project.",
  },
];

export const implementationPhases = [
  {
    phase: 0,
    title: "Architecture Freeze (SEkarang)",
    goal: "Curriculum map + matrix + learning path dievaluasi sebelum rewrite besar.",
    deliverables: [
      "Halaman /kurikulum",
      "CURRICULUM.md",
      "Data architecture/matrix di src/data/curriculum/",
    ],
    status: "in_progress" as const,
  },
  {
    phase: 1,
    title: "Platform Shell Dual-Layer",
    goal: "Navigasi & skeleton Deep Dive tanpa menghapus Core 00–09.",
    deliverables: [
      "Routes /core, /deep-dive, /deep-dive/[module]",
      "Template section standar modul",
      "Core Flow tetap di /silabus (alias Layer A)",
    ],
    status: "planned" as const,
  },
  {
    phase: 2,
    title: "Deep Dive Priority Wave 1",
    goal: "Sales, Purchase, Inventory, Accounting, Contacts — modul yang sudah disentuh Core.",
    deliverables: [
      "Overview→Config→Master→Transactions→Integration→Report→Troubleshoot→Exercise",
      "Screenshot baru dari lab untuk config & form kunci",
    ],
    status: "planned" as const,
  },
  {
    phase: 3,
    title: "Core Flow Hardening",
    goal: "Isi gap Users/Access + perjelas integration nodes di Core.",
    deliverables: ["Lesson Users & Access Rights", "Diagram P2P/O2C diperluas"],
    status: "planned" as const,
  },
  {
    phase: 4,
    title: "Deep Dive Wave 2 — Adjacent Ops",
    goal: "CRM, Manufacturing, Project, Timesheets, HR basics, Website/eCommerce overview.",
    deliverables: ["Mini-courses per modul", "Availability flags dari environment lab"],
    status: "planned" as const,
  },
  {
    phase: 5,
    title: "Deep Dive Wave 3 — Extended Suite",
    goal: "POS, Subscriptions, Helpdesk, Quality, Barcode, Marketing, dll.",
    deliverables: ["Konten + N/A yang jujur jika app tidak terpasang di lab"],
    status: "planned" as const,
  },
  {
    phase: 6,
    title: "Final Project + Consultant Pack",
    goal: "Retail E2E project, reporting pack, security pack, handbook closing.",
    deliverables: ["Final project rubric", "Validation checklist", "Capture pass penuh"],
    status: "planned" as const,
  },
];
