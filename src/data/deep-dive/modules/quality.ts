import type { DeepDiveModule } from "../types";
import { seed } from "../../seed";

const company = seed.company;
const vendor = seed.vendors.bahan;
const kopi = seed.products.kopi;
const dus = seed.products.dus;

/** Deep Dive — Quality (Wave 3) */
export const qualityDeepDive: DeepDiveModule = {
  slug: "quality",
  name: "Quality — Control Points & Checks",
  shortTitle: "Quality",
  icon: "BadgeCheck",
  category: "quality-ops",
  wave: 3,
  availability: "available",
  apps: ["Quality", "Inventory", "Manufacturing", "Purchase"],
  overview: {
    function:
      "Modul Quality mendefinisikan Control Points (kapan & apa yang dicek) lalu mengeksekusi Quality Checks pada receipt, transfer, atau manufacturing. Di Odoo 19 Enterprise, quality.point memicu quality.check yang harus Pass/Fail sebelum operasi lanjut.",
    businessProblem:
      "Tanpa QC terstruktur, barang cacat masuk gudang/produksi, recall sulit ditelusuri, dan vendor/proses buruk tidak terukur.",
    typicalUsers: ["Quality Inspector", "Warehouse Operator", "Production Supervisor", "Purchase (vendor score)"],
    whenNeeded:
      "Produk pangan/kemasan/komponen kritis membutuhkan inspeksi masuk atau in-process.",
    relatedModules: ["Inventory", "Manufacturing", "Purchase", "Barcode"],
    businessScenario: `Receipt ${kopi.name} dari ${vendor.name} memicu Quality Check "Visual & Aroma". Inspector Pass/Fail; Fail membuat Quality Alert dan blok stok sampai keputusan.`,
  },
  prerequisites: {
    modules: ["Quality", "Inventory", "Purchase/Manufacturing sesuai titik cek"],
    masterData: [
      `Produk: ${kopi.name}, ${dus.name}`,
      "Quality Teams",
      "Control Points (quality.point)",
      "Operations (receipts / MO)",
    ],
    configuration: [
      "Quality → Configuration → Settings",
      "Quality Control → Control Points",
      "Quality Teams",
    ],
    access: ["Quality User: eksekusi check", "Quality Manager: control points & alerts"],
    relationships:
      "quality.point menargetkan product/operation; saat picking/MO cocok, quality.check dibuat; Fail dapat memblokir validate.",
  },
  installation: {
    how: ["Apps → Quality → Install", "Buka Quality → Overview"],
    dependencies: ["Inventory", "Mail"],
    afterInstall: [
      "Buat Quality Team",
      "Buat Control Point untuk incoming receipt",
      "Uji receipt produk terkait",
    ],
    newMenus: [
      "Quality → Overview",
      "Quality Control → Quality Checks",
      "Control Points",
      "Quality Alerts",
      "Reporting",
    ],
    newSettings: ["Settings → Quality", "Quality Control frequency / workspace"],
  },
  configurations: [
    {
      id: "qc-points",
      name: "Control Points",
      location: "Quality → Quality Control → Control Points",
      what: "Aturan kapan check dibuat (produk, operasi, tipe Pass/Fail/Measure).",
      whyEnable: "Standarisasi inspeksi tanpa mengandalkan ingatan operator.",
      whenEnable: "Ada produk/operasi yang wajib dicek.",
      whenNot: "SKU non-kritis tanpa regulasi — jangan over-check.",
      businessExample: `Point "Incoming ${kopi.name}" pada Receipts.`,
      impact: "Quality Check otomatis muncul saat operasi cocok.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality-points.png",
        caption: "Control Points — daftar quality.point",
        whatYouSee: "Reference, Title, Products, Operations, Type",
      },
    },
    {
      id: "qc-type",
      name: "Control Type (Pass-Fail / Measure)",
      location: "Control Point → Type",
      what: "Jenis kontrol: qualitative Pass/Fail atau pengukuran numerik.",
      whyEnable: "Menyesuaikan metode inspeksi dengan karakteristik produk.",
      whenEnable: "Visual vs berat/kadar berbeda tipenya.",
      whenNot: "Jangan pakai Measure jika tidak ada alat ukur.",
      businessExample: "Pass/Fail untuk kemasan; Measure untuk berat net.",
      impact: "Form check menampilkan tombol Pass/Fail atau input value.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality-point-form.png",
        caption: "Form Control Point baru",
      },
    },
    {
      id: "qc-team",
      name: "Quality Team",
      location: "Quality → Configuration → Quality Teams",
      what: "Tim inspector yang menerima check/alert.",
      whyEnable: "Ownership inspeksi jelas.",
      whenEnable: "Selalu jika lebih dari satu inspector.",
      whenNot: "—",
      businessExample: "Main Quality Team pada overview.",
      impact: "Overview & assignment mengikuti team.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality-app.png",
        caption: "Quality Overview — Main Quality Team",
      },
    },
    {
      id: "qc-alerts",
      name: "Quality Alerts",
      location: "Quality → Quality Alerts",
      what: "Record isu kualitas untuk investigasi CAPA sederhana.",
      whyEnable: "Fail check perlu tindak lanjut, bukan hanya ditolak diam-diam.",
      whenEnable: "Ada Fail atau temuan berulang.",
      whenNot: "Jangan buat alert untuk setiap catatan minor tanpa proses.",
      businessExample: `Alert aroma off pada lot ${kopi.name}.`,
      impact: "Tracking corrective action & statistik vendor/proses.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality.png",
        caption: "Quality Checks list — status dan checked by",
      },
    },
    {
      id: "qc-ops",
      name: "Operation Triggers",
      location: "Control Point → Operations",
      what: "Mengaitkan point ke Receipts, Delivery, atau Manufacturing.",
      whyEnable: "Check muncul di momen proses yang tepat.",
      whenEnable: "Incoming materials / FG critical.",
      whenNot: "Operasi tidak relevan — jangan pilih semua.",
      businessExample: "Receipts WH/IN untuk bahan baku.",
      impact: "Validate picking bisa menunggu check.",
      screenshot: {
        src: "/screenshots/odoo19e/13-inventory-receipts.png",
        caption: "Inventory Receipts — titik umum QC incoming",
      },
    },
  ],
  masterData: [
    {
      id: "md-qc-point",
      name: "quality.point",
      purpose: "Definisi kontrol.",
      required: true,
      whyNeeded: "Tanpa point, check tidak ter-generate otomatis.",
      fields: [
        { field: "Title", type: "Char", required: true, purpose: "Nama kontrol", why: "Identitas", example: "Visual Incoming Kopi", impactIfEmpty: "Invalid" },
        { field: "Products", type: "Many2many", required: false, purpose: "SKU target", why: "Filter", example: kopi.name, impactIfEmpty: "Terlalu luas jika kosong" },
        { field: "Operations", type: "Many2many", required: true, purpose: "Trigger", why: "Kapan cek", example: "Receipts", impactIfEmpty: "Tidak pernah trigger" },
        { field: "Type", type: "Selection", required: true, purpose: "Metode", why: "UI check", example: "Pass - Fail", impactIfEmpty: "Invalid" },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality-point-form.png",
        caption: "Form New Control Point",
        whatToFill: `Title, Products ${kopi.name}, Operations Receipts`,
      },
    },
    {
      id: "md-qc-check",
      name: "quality.check",
      purpose: "Eksekusi inspeksi aktual.",
      required: true,
      whyNeeded: "Bukti Pass/Fail per dokumen.",
      fields: [
        { field: "Title", type: "Char", required: true, purpose: "Dari point", why: "Konteks", example: "Visual Incoming", impactIfEmpty: "—" },
        { field: "Product", type: "Many2one", required: false, purpose: "SKU", why: "Trace", example: kopi.name, impactIfEmpty: "Kurang jejak" },
        { field: "Status", type: "Selection", required: true, purpose: "Hasil", why: "Gate", example: "Pass", impactIfEmpty: "Blok proses" },
        { field: "Checked By", type: "Many2one", required: false, purpose: "Inspector", why: "Audit", example: "Mitchell Admin", impactIfEmpty: "Accountability lemah" },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality.png",
        caption: "Quality Checks — reference & status",
      },
    },
    {
      id: "md-qc-team",
      name: "quality.alert.team / quality team",
      purpose: "Organisasi inspector.",
      required: true,
      whyNeeded: "Overview & notifikasi butuh team.",
      fields: [
        { field: "Name", type: "Char", required: true, purpose: "Nama tim", why: "Identitas", example: "Main Quality Team", impactIfEmpty: "Invalid" },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality-app.png",
        caption: "Overview menampilkan Quality Team",
      },
    },
  ],
  dependencies: {
    nodes: [
      { id: "point", label: "Control Point" },
      { id: "picking", label: "Receipt / MO" },
      { id: "check", label: "Quality Check" },
      { id: "alert", label: "Quality Alert" },
      { id: "stock", label: "Stock Decision" },
    ],
    edges: [
      { from: "point", to: "check", why: "Point men-generate check" },
      { from: "picking", to: "check", why: "Operasi memicu point" },
      { from: "check", to: "alert", why: "Fail dapat buat alert" },
      { from: "check", to: "stock", why: "Pass mengizinkan lanjut validate" },
    ],
    summary: "Control Point + operasi → Check → Pass lanjutkan stok/MO, Fail → alert & blok.",
  },
  forms: [
    {
      id: "form-point",
      name: "Control Point",
      menuPath: "Quality → Control Points → New",
      fields: [
        { field: "Title", required: true, purpose: "Nama", why: "Identitas", example: "Visual Incoming Kopi" },
        { field: "Products", required: false, purpose: "SKU", why: "Scope", example: kopi.name },
        { field: "Operations", required: true, purpose: "Trigger", why: "Kapan", example: "Receipts" },
        { field: "Team", required: false, purpose: "Owner", why: "Assignment", example: "Main Quality Team" },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality-point-form.png",
        caption: "Form Control Point",
      },
    },
    {
      id: "form-check",
      name: "Quality Check",
      menuPath: "Quality → Quality Checks",
      fields: [
        { field: "Product", required: false, purpose: "SKU", why: "Trace", example: kopi.name },
        { field: "Status", required: true, purpose: "Hasil", why: "Gate", example: "Pass" },
        { field: "Checked By", required: false, purpose: "Inspector", why: "Audit", example: "Mitchell Admin" },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality.png",
        caption: "List Quality Checks",
      },
    },
  ],
  procedures: [
    {
      id: "proc-qc-point",
      title: "Buat Control Point incoming",
      goal: `Wajibkan cek saat terima ${kopi.name}.`,
      preparation: ["Quality terpasang", "Produk ada"],
      steps: [
        "Quality → Control Points → New",
        "Isi Title & Products",
        "Pilih Operations = Receipts",
        "Type Pass-Fail → Save",
      ],
      expectedResult: "Point aktif di list Control Points.",
      verification: ["Point muncul di list", "Team terisi jika dipakai"],
      fillFields: [
        { field: "Title", value: "Visual Incoming Kopi", where: "Header", how: "Ketik", required: true },
        { field: "Products", value: kopi.name, where: "Header", how: "Pilih", required: true },
        { field: "Operations", value: "Receipts", where: "Header", how: "Pilih", required: true },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality-point-form.png",
        caption: "Form New Control Point",
      },
    },
    {
      id: "proc-qc-receive",
      title: "Eksekusi check pada receipt",
      goal: "Pass/Fail sebelum stok tersedia penuh.",
      preparation: ["Control point aktif", "Ada receipt draft/ready"],
      steps: [
        "Buat/Validate alur Receipt untuk produk",
        "Buka Quality Checks terkait",
        "Pass atau Fail + catatan",
        "Lanjut validate picking jika Pass",
      ],
      expectedResult: "Check berstatus Pass/Fail; Fail memicu follow-up.",
      verification: ["Checked By & Date terisi", "Status bukan none"],
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality.png",
        caption: "Quality Checks setelah inspeksi",
      },
    },
    {
      id: "proc-qc-overview",
      title: "Monitor Overview Quality",
      goal: "Lihat alert & check in progress.",
      preparation: ["Beberapa check ada"],
      steps: ["Quality → Overview", "Cek Checks In Progress", "Tindak alert"],
      expectedResult: "Tidak ada check menumpuk tanpa owner.",
      verification: ["Angka overview masuk akal"],
      screenshot: {
        src: "/screenshots/odoo19e/w3-quality-app.png",
        caption: "Quality Overview",
      },
    },
  ],
  scenarios: [
    { id: "sc-qc-pass", title: "Incoming Pass", whenToUse: "Barang baik.", flow: ["Receipt", "Check Pass", "Validate", "Stok available"] },
    { id: "sc-qc-fail", title: "Incoming Fail + Alert", whenToUse: "Cacat terlihat.", flow: ["Receipt", "Fail", "Alert", "Return/Scrap", "Vendor claim"] },
    { id: "sc-qc-mrp", title: "In-process pada MO", whenToUse: "QC di produksi.", flow: ["Control point pada MO op", "Check", "Lanjut WO/MO"] },
  ],
  integrations: [
    { id: "int-qc-inv", withModule: "Inventory", relationship: "check on picking", whatHappens: "Validate receipt bisa menunggu Pass." },
    { id: "int-qc-mrp", withModule: "Manufacturing", relationship: "check on MO/WO", whatHappens: "Produksi punya gate kualitas." },
    { id: "int-qc-purchase", withModule: "Purchase", relationship: "vendor receipts", whatHappens: "Fail mendukung evaluasi vendor." },
  ],
  mistakes: [
    { id: "m-qc-too-broad", problem: "Control point tanpa filter produk", why: "Semua receipt dicek → bottleneck", detect: "Antrian check besar", fix: "Batasi products/categories", prevent: "Desain point sempit" },
    { id: "m-qc-skip", problem: "Validate tanpa Pass", why: "Barang cacat masuk stok", detect: "Check still none", fix: "Blok validate / force check", prevent: "Training WH + setting" },
    { id: "m-qc-no-alert", problem: "Fail tanpa alert", why: "Tidak ada CAPA", detect: "Fail count naik, alert 0", fix: "Buat alert & assign", prevent: "SOP Fail→Alert" },
    { id: "m-qc-wrong-op", problem: "Operations salah", why: "Check tidak pernah muncul", detect: "Point ada tapi check 0", fix: "Pilih operation benar", prevent: "Uji end-to-end sekali" },
  ],
  troubleshooting: [
    { id: "t-qc-no-check", problem: "Check tidak terbuat", causes: ["Product tidak match", "Operation beda", "Point inactive"], diagnosis: ["Buka point domain", "Cek picking type"], solution: ["Sesuaikan products/ops", "Archive→unarchive test"], prevention: "Checklist uji setelah create point" },
    { id: "t-qc-block", problem: "Tidak bisa validate picking", causes: ["Check pending", "Fail unresolved"], diagnosis: ["Smart button Quality", "Status check"], solution: ["Pass/Fail dengan keputusan stok", "Manager override jika ada"], prevention: "Inspector standby saat goods receipt" },
    { id: "t-qc-access", problem: "User tidak bisa Pass", causes: ["Bukan Quality User"], diagnosis: ["Access Rights"], solution: ["Tambah group Quality"], prevention: "Role matrix WH vs QC" },
  ],
  behind: {
    models: ["quality.point", "quality.check", "quality.alert", "stock.picking", "mrp.production"],
    relations: ["check.point_id → point", "check.picking_id / production_id", "alert dari fail"],
    automations: ["On operation match → create checks", "Fail → optional alert wizard"],
    securityNotes: ["quality.group_quality_user / manager"],
    note: "Enterprise Quality terintegrasi kuat ke Inventory & MRP operations.",
  },
  reporting: [
    { name: "Quality Checks", path: "Quality → Reporting / Checks", kpi: "Pass rate", decision: "Perbaiki vendor/proses" },
    { name: "Overview", path: "Quality → Overview", kpi: "Checks in progress & alerts", decision: "Alokasi inspector" },
    { name: "Control Points", path: "Control Points list", kpi: "Coverage SKU kritis", decision: "Tambah/kurangi point" },
  ],
  security: {
    roles: [
      { role: "Quality User", can: ["Eksekusi check", "Buat alert"], cannot: ["Ubah semua control points jika dibatasi"], whyDifferent: "Inspector vs process engineer." },
      { role: "Quality Manager", can: ["Control points", "Teams", "Reporting"], cannot: ["Posting Accounting"], whyDifferent: "Desain sistem QC." },
    ],
    notes: ["Pisahkan hak validate WH vs Pass QC jika perlu segregasi"],
  },
  levels: {
    beginner: ["Buka Quality Checks", "Pass/Fail", "Lihat Overview"],
    intermediate: ["Buat Control Point", "Link Receipts", "Buat Alert"],
    advanced: ["Measure type", "MO in-process", "Vendor score dari Fail"],
    expert: ["Matriks point per kategori", "Integrasi Barcode QC", "CAPA bulanan"],
  },
  exercises: [
    {
      id: "ex-qc-point",
      title: "Control Point incoming kopi",
      objective: "Point aktif untuk receipts",
      prerequisites: ["Quality installed"],
      task: ["New Control Point", `Products ${kopi.name}`, "Operations Receipts"],
      expectedResult: "Point terlihat di list",
      checklist: ["Title jelas", "Operation benar"],
    },
    {
      id: "ex-qc-pass",
      title: "Pass sebuah check",
      objective: "Menyelesaikan inspeksi",
      prerequisites: ["Ada quality.check"],
      task: ["Buka check", "Pass", "Isi checked by/date"],
      expectedResult: "Status Pass",
      checklist: ["Checked By terisi"],
    },
    {
      id: "ex-qc-fail",
      title: "Simulasi Fail",
      objective: "Latihan alert",
      prerequisites: ["Check pending"],
      task: ["Fail", "Buat/isi alert", "Putuskan return/scrap"],
      expectedResult: "Alert tercatat",
      checklist: ["Alasan Fail ada di note"],
    },
  ],
  coreFlowLinks: [
    { label: "Deep Dive Inventory", href: "/materi/inventory" },
    { label: "Deep Dive Manufacturing", href: "/materi/manufacturing" },
    { label: "Deep Dive Purchase", href: "/materi/purchase" },
  ],
};
