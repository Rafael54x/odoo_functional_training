/**
 * Peta belajar untuk halaman Kurikulum (learner-facing).
 * Tidak memakai label Wave — hanya jalur & hubungan modul.
 */
import {
  deepDiveCatalogGroups,
  deepDiveModules,
} from "@/data/deep-dive/modules";
import { modules as coreModules } from "@/data/modules";

export const learningMapIntro = {
  title: "Peta Belajar Odoo Functional",
  subtitle:
    "Gambaran singkat seluruh perjalanan: Core Flow dulu, lalu Deep Dive per modul, dan bagaimana modul saling terhubung.",
  principle:
    "Pemula: selesaikan Core Flow end-to-end. Setelah itu dalami satu aplikasi di Materi Modul — jangan loncat antar modul sebelum alur utama lancar.",
};

/** Urutan mindmap Layer A — Core Flow */
export const coreFlowMindNodes = coreModules.map((m) => ({
  slug: m.slug,
  number: m.number,
  title: m.title,
  href: `/modul/${m.slug}`,
  apps: m.apps,
  summary: m.plainSummary ?? m.description,
}));

/** Rantai proses bisnis yang sering diulang di lab */
export const processChains = [
  {
    id: "p2p",
    title: "Procure to Pay",
    nodes: ["Vendor (Contacts)", "RFQ → PO", "Receipt", "Vendor Bill", "Payment"],
    href: "/modul/flow-purchase",
  },
  {
    id: "o2c",
    title: "Order to Cash",
    nodes: ["Customer", "Quotation → SO", "Delivery", "Invoice", "Payment"],
    href: "/modul/flow-sales",
  },
  {
    id: "stock",
    title: "Stok & Gudang",
    nodes: ["Product", "Warehouse", "Receipt / Delivery", "Adjustment", "Valuation"],
    href: "/modul/flow-inventory",
  },
  {
    id: "lead",
    title: "Lead to Order",
    nodes: ["Lead / Opportunity (CRM)", "Quotation", "Sales Order", "Delivery / Invoice"],
    href: "/materi/crm",
  },
];

/** Hubungan antar modul — edge untuk mindmap integrasi */
export const moduleRelations: Array<{
  from: string;
  to: string;
  why: string;
}> = [
  { from: "Contacts", to: "Sales", why: "Customer di SO & Invoice" },
  { from: "Contacts", to: "Purchase", why: "Vendor di RFQ/PO & Bill" },
  { from: "Contacts", to: "CRM", why: "Partner pada Lead/Opportunity" },
  { from: "Sales", to: "Inventory", why: "Delivery Order dari SO" },
  { from: "Sales", to: "Accounting", why: "Customer Invoice dari SO" },
  { from: "Purchase", to: "Inventory", why: "Receipt dari PO" },
  { from: "Purchase", to: "Accounting", why: "Vendor Bill dari PO" },
  { from: "Inventory", to: "Accounting", why: "Valuation & stock journal" },
  { from: "CRM", to: "Sales", why: "New Quotation dari Opportunity" },
  { from: "Project", to: "Timesheets", why: "Jam kerja per task" },
  { from: "Timesheets", to: "Sales", why: "Invoice jasa berbasis jam" },
  { from: "Employees", to: "Timesheets", why: "Employee yang mengisi jam" },
  { from: "Employees", to: "Recruitment", why: "Hire → Employee" },
  { from: "Manufacturing", to: "Inventory", why: "Komponen & FG stock" },
  { from: "Quality", to: "Inventory", why: "QC pada receipt/operation" },
  { from: "Barcode", to: "Inventory", why: "Scan picking / receipt" },
  { from: "POS", to: "Inventory", why: "Stok retail real-time" },
  { from: "POS", to: "Accounting", why: "Sesion & pembayaran kasir" },
  { from: "Website", to: "eCommerce", why: "Shop di situs publik" },
  { from: "eCommerce", to: "Sales", why: "Order web → Sales Order" },
  { from: "Helpdesk", to: "CRM", why: "Convert ticket → Lead" },
  { from: "Subscriptions", to: "Sales", why: "Recurring SO / plan" },
  { from: "Subscriptions", to: "Invoicing", why: "Invoice berkala / MRR" },
  { from: "Email Marketing", to: "Contacts", why: "Mailing list dari partner" },
  { from: "Email Marketing", to: "CRM", why: "Kampanye → opportunity" },
  { from: "Studio", to: "Settings", why: "Kustomisasi form/view aman" },
  { from: "Users", to: "Settings", why: "Access rights & company" },
  { from: "Localization", to: "Accounting", why: "Pajak & CoA negara" },
];

export const deepDiveGroups = deepDiveCatalogGroups.map((g) => ({
  id: g.id,
  title: g.title,
  description: g.description,
  modules: g.modules.map((m) => ({
    slug: m.slug,
    name: m.shortTitle,
    href: `/materi/${m.slug}`,
    related: m.overview.relatedModules.slice(0, 4),
  })),
}));

export const learningJourneySteps = [
  {
    n: 1,
    title: "Siapkan lab",
    body: "Baca Cara pakai, login Odoo, kenali App Switcher.",
    href: "/cara-pakai",
  },
  {
    n: 2,
    title: "Core Flow",
    body: "Ikuti silabus berurutan: company → users → contacts → beli → stok → jual → tagih → E2E → closing.",
    href: "/silabus",
  },
  {
    n: 3,
    title: "Materi Modul",
    body: "Dalami satu app: konfigurasi, master data, prosedur, integrasi, exercise.",
    href: "/materi",
  },
  {
    n: 4,
    title: "Hubungkan modul",
    body: "Uji rantai P2P / O2C / Lead-to-Order memakai data seed yang sama.",
    href: "/alur",
  },
];

export { deepDiveModules, coreModules };
