/**
 * Dual-layer curriculum architecture for Odoo Functional Learning Platform.
 * Layer A = existing Core Business Flow (preserved).
 * Layer B = Module-by-Module Deep Dive (new).
 */

export type LearningLevel = "beginner" | "intermediate" | "advanced" | "expert";

export const curriculumVision = {
  title: "Odoo Functional Learning Platform",
  subtitle: "Business process + module mastery + implementation reasoning",
  versionTarget: "Odoo 19 Enterprise",
  lab: {
    url: "http://172.16.2.123:8072",
    database: "odoo",
    user: "admin",
  },
  principles: [
    "Jangan hapus Core Flow yang sudah baik — perluas, jangan ganti.",
    "Business process dulu (Layer A), deep expertise per modul kemudian (Layer B).",
    "Setiap materi menjawab What / How / Why / What-if-wrong.",
    "Screenshot harus UI Odoo nyata; jika belum ada → [SCREENSHOT REQUIRED].",
    "Jangan mengarang fitur; tandai [VERIFY IN ODOO UI] atau Not Available.",
  ],
  learnerOutcomes: [
    "Bisa menjalankan transaksi harian Odoo (flow bisnis).",
    "Bisa mengonfigurasi modul dengan alasan bisnis yang jelas.",
    "Memahami dampak antar-modul (integrasi).",
    "Bisa mendiagnosis kesalahan umum implementasi.",
    "Siap menyusun implementasi perusahaan sederhana end-to-end.",
  ],
} as const;

/** Standard section template for every Deep Dive module */
export const deepDiveSectionTemplate = [
  { id: "overview", title: "Module Overview", required: true },
  { id: "prerequisites", title: "Prerequisites", required: true },
  { id: "installation", title: "Installation", required: true },
  { id: "configuration", title: "Complete Configuration", required: true },
  { id: "master-data", title: "Master Data", required: true },
  { id: "dependencies", title: "Master Data Dependency", required: true },
  { id: "fields", title: "Field-by-Field Documentation", required: true },
  { id: "procedures", title: "Step-by-Step Procedures", required: true },
  { id: "scenarios", title: "Business Scenarios", required: true },
  { id: "integration", title: "End-to-End Integration", required: true },
  { id: "mistakes", title: "Common Mistakes", required: true },
  { id: "troubleshooting", title: "Troubleshooting", required: true },
  { id: "behind", title: "Behind the Scene", required: true },
  { id: "reporting", title: "Reporting", required: true },
  { id: "security", title: "Security & Access Rights", required: true },
  { id: "levels", title: "Learning Levels (B/I/A/E)", required: true },
  { id: "exercises", title: "Practice / Exercises", required: true },
  { id: "screenshots", title: "Real UI Screenshots", required: true },
] as const;

export type CoreNode = {
  id: string;
  order: number;
  title: string;
  existingSlug?: string;
  status: "keep" | "enrich" | "add";
  summary: string;
  businessWhy: string;
};

/**
 * Layer A — Core Business Flow
 * Existing 00–09 preserved; a few enrichment nodes inserted without breaking slugs.
 */
export const coreBusinessFlow: CoreNode[] = [
  {
    id: "fundamentals",
    order: 1,
    title: "Odoo Fundamentals",
    existingSlug: "pengenalan",
    status: "keep",
    summary: "Apps, navigasi, login, install modul inti.",
    businessWhy: "Tanpa fondasi UI, user tersesat sebelum transaksi.",
  },
  {
    id: "company-setup",
    order: 2,
    title: "Company & Localization Setup",
    existingSlug: "setup-perusahaan",
    status: "enrich",
    summary: "Profil company, fiscal pack, currency, timezone, settings awal.",
    businessWhy: "Identitas legal & pajak menentukan semua dokumen.",
  },
  {
    id: "users-access",
    order: 3,
    title: "Users & Access Rights",
    status: "add",
    summary: "User, groups Sales/Purchase/Inventory/Accounting, least privilege.",
    businessWhy: "Implementasi nyata selalu multi-user; admin-only tidak scalable.",
  },
  {
    id: "contacts",
    order: 4,
    title: "Contacts (Customers & Vendors)",
    existingSlug: "master-contacts",
    status: "keep",
    summary: "Partner master untuk semua transaksi.",
    businessWhy: "Tidak ada SO/PO tanpa partner.",
  },
  {
    id: "accounting-master",
    order: 5,
    title: "Accounting Foundations",
    existingSlug: "master-accounting",
    status: "keep",
    summary: "CoA, taxes, journals, payment terms, fiscal positions.",
    businessWhy: "Tanpa fondasi akuntansi, invoice/bill gagal posting.",
  },
  {
    id: "inventory-master",
    order: 6,
    title: "Products, Warehouses & Locations",
    existingSlug: "master-inventory",
    status: "keep",
    summary: "Produk, UoM, kategori, gudang, operation types.",
    businessWhy: "Stok & harga butuh master yang konsisten.",
  },
  {
    id: "procure-to-pay",
    order: 7,
    title: "Procure-to-Pay",
    existingSlug: "flow-purchase",
    status: "keep",
    summary: "Vendor → RFQ/PO → Receipt → Vendor Bill → Payment.",
    businessWhy: "Alur belanja yang menghubungkan Purchase–Inventory–Accounting.",
  },
  {
    id: "inventory-ops",
    order: 8,
    title: "Inventory Operations",
    existingSlug: "flow-inventory",
    status: "enrich",
    summary: "Transfer internal, adjustment, control stok harian.",
    businessWhy: "Gudang nyata tidak hanya receipt/delivery otomatis.",
  },
  {
    id: "order-to-cash",
    order: 9,
    title: "Order-to-Cash",
    existingSlug: "flow-sales",
    status: "keep",
    summary: "Customer → Quotation/SO → Delivery → Invoice.",
    businessWhy: "Alur jual yang menghubungkan Sales–Inventory–Accounting.",
  },
  {
    id: "cash-application",
    order: 10,
    title: "Invoicing, Payment & Reconciliation",
    existingSlug: "flow-invoicing",
    status: "keep",
    summary: "Posting, payment, credit note, bank, AR/AP reports.",
    businessWhy: "Closing uang & piutang/hutang.",
  },
  {
    id: "e2e",
    order: 11,
    title: "End-to-End Business Cycle",
    existingSlug: "flow-end-to-end",
    status: "enrich",
    summary: "Siklus mingguan + troubleshooting kompetensi.",
    businessWhy: "Menguji integrasi, bukan silo modul.",
  },
  {
    id: "closing-analysis",
    order: 12,
    title: "Closing, Reporting & Analysis",
    status: "add",
    summary: "Laporan manajemen, KPI, checklist tutup periode latihan.",
    businessWhy: "Belajar mengambil keputusan dari data Odoo.",
  },
];

export const coreProcessChains = [
  {
    id: "setup-chain",
    title: "Setup Chain",
    nodes: [
      "Company Setup",
      "Users & Access",
      "Contacts",
      "Accounting Foundations",
      "Products & Warehouses",
    ],
  },
  {
    id: "p2p",
    title: "Procure-to-Pay",
    nodes: [
      "Vendor",
      "RFQ / Purchase Order",
      "Receipt",
      "Vendor Bill",
      "Payment",
      "Accounting",
    ],
  },
  {
    id: "o2c",
    title: "Order-to-Cash",
    nodes: [
      "Customer",
      "Quotation / Sales Order",
      "Delivery",
      "Customer Invoice",
      "Payment",
      "Accounting",
    ],
  },
  {
    id: "full-retail",
    title: "Full Retail Cycle (Final Project target)",
    nodes: [
      "Company",
      "Users",
      "Vendor & Customer",
      "Product",
      "Purchase + Receipt",
      "Sales + Delivery",
      "Invoice + Payment",
      "Stock & AR/AP Reports",
    ],
  },
];

export const navigationTree = [
  {
    id: "core",
    label: "Core Business Flow",
    href: "/silabus",
    children: coreBusinessFlow.map((n) => ({
      id: n.id,
      label: n.title,
      href: n.existingSlug ? `/modul/${n.existingSlug}` : "/kurikulum#core-additions",
    })),
  },
  {
    id: "deep",
    label: "Module Deep Dive",
    href: "/kurikulum#module-matrix",
    children: [
      { id: "crm-sales", label: "CRM & Sales", href: "/kurikulum#cat-crm-sales" },
      { id: "finance", label: "Finance", href: "/kurikulum#cat-finance" },
      { id: "supply", label: "Inventory & Supply Chain", href: "/kurikulum#cat-supply" },
      { id: "mfg", label: "Manufacturing", href: "/kurikulum#cat-mfg" },
      { id: "hr", label: "Human Resources", href: "/kurikulum#cat-hr" },
      { id: "services", label: "Project & Services", href: "/kurikulum#cat-services" },
      { id: "web", label: "Website & Marketing", href: "/kurikulum#cat-web" },
      { id: "prod", label: "Productivity", href: "/kurikulum#cat-productivity" },
      { id: "admin", label: "Administration / Technical", href: "/kurikulum#cat-admin" },
    ],
  },
  {
    id: "cross",
    label: "Cross-cutting",
    href: "/kurikulum#learning-paths",
    children: [
      { id: "master", label: "Master Data Hub", href: "/kurikulum#cross-master" },
      { id: "config", label: "Configuration Hub", href: "/kurikulum#cross-config" },
      { id: "integration", label: "Integration Map", href: "/kurikulum#cross-integration" },
      { id: "reporting", label: "Reporting", href: "/kurikulum#cross-reporting" },
      { id: "security", label: "Security", href: "/kurikulum#cross-security" },
      { id: "troubleshoot", label: "Troubleshooting", href: "/kurikulum#cross-troubleshoot" },
      { id: "exercises", label: "Exercises", href: "/kurikulum#cross-exercises" },
      { id: "final", label: "Final Project", href: "/kurikulum#final-project" },
    ],
  },
] as const;
