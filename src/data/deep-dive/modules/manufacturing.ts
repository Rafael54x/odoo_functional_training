import type { DeepDiveModule } from "../types";
import { seed } from "../../seed";

const vendorBahan = seed.vendors.bahan;
const vendorKemasan = seed.vendors.kemasan;
const customer = seed.customers.toko;
const distributor = seed.customers.distributor;
const kopi = seed.products.kopi;
const teh = seed.products.teh;
const dus = seed.products.dus;
const company = seed.company;

/**
 * Deep Dive — Manufacturing / MRP (Wave 2)
 * BoM, Manufacturing Order, konsumsi komponen, finished goods.
 * Slug katalog deep dive: manufacturing (app Odoo: Manufacturing / mrp).
 */
export const manufacturingDeepDive: DeepDiveModule = {
  slug: "manufacturing",
  name: "Manufacturing — BoM to Finished Goods",
  shortTitle: "Manufacturing",
  icon: "Factory",
  category: "mfg",
  wave: 2,
  availability: "available",
  apps: ["Manufacturing", "Inventory", "Purchase", "Sales"],
  overview: {
    function:
      "Modul Manufacturing (MRP) mengelola Bill of Materials (mrp.bom), Manufacturing Order (mrp.production), konsumsi komponen, dan penerimaan finished goods ke stok. Di Odoo 19 Enterprise, MRP terintegrasi Inventory (stock.move), opsional Work Orders/Work Centers, dan costing ke Accounting.",
    businessProblem:
      "Tanpa MRP, resep produksi hanya di kepala operator, pemakaian bahan tidak tercatat, finished goods muncul 'dari udara', dan COGS/stok tidak selaras dengan kenyataan pabrik.",
    typicalUsers: [
      "Production Planner / PPC",
      "Shop Floor Operator",
      "Warehouse (komponen & FG)",
      "Cost Accountant",
      "Quality (jika Quality app aktif)",
    ],
    whenNeeded:
      "Saat perusahaan merakit/memproses bahan menjadi produk jadi (bukan hanya trading), butuh BoM, MO, dan jejak konsumsi.",
    relatedModules: ["Inventory", "Purchase", "Sales", "PLM", "Quality", "Maintenance"],
    businessScenario: `${company.name} meracik paket retail: finished good "Paket Oleh-Oleh Kopi" dari komponen ${kopi.name}, ${teh.name}, dan ${dus.name} yang dibeli dari ${vendorBahan.name} / ${vendorKemasan.name}. Planner membuat BoM, launch MO, konsumsi komponen dari WH/Stock, lalu FG siap dijual ke ${customer.name} atau ${distributor.name}.`,
  },
  prerequisites: {
    modules: ["Inventory", "Manufacturing", "Purchase (untuk komponen)", "Accounting chart untuk valuation"],
    masterData: [
      `Komponen storable: ${kopi.name}, ${teh.name}, ${dus.name}`,
      "Finished good storable (produk hasil BoM)",
      "Bill of Materials (mrp.bom)",
      "Warehouse & locations (WH/Stock)",
      "Routing/Work Centers jika Work Orders dipakai",
    ],
    configuration: [
      "Manufacturing → Configuration → Settings: Work Orders / By-Products / Quality sesuai kebutuhan",
      "Product routes: Manufacture",
      "Inventory valuation & categories untuk komponen/FG",
    ],
    access: [
      "Manufacturing / User: proses MO",
      "Manufacturing / Administrator: BoM, routing, settings",
      "Inventory / User: stok komponen & FG",
    ],
    relationships:
      "mrp.bom.product_tmpl_id → finished product; bom lines → components; mrp.production menghasilkan stock.move konsumsi & finished; shortage memicu Purchase/replenishment.",
  },
  installation: {
    how: [
      "Home → Apps",
      "Cari 'Manufacturing' atau 'MRP'",
      "Install aplikasi Manufacturing",
      "Pastikan Inventory sudah terpasang",
    ],
    dependencies: [
      "Inventory (wajib)",
      "Purchase disarankan untuk pengadaan komponen",
      "Sales untuk MTO dari SO (opsional)",
      "PLM/Quality opsional Enterprise",
    ],
    afterInstall: [
      "Settings → Manufacturing: aktifkan opsi yang dibutuhkan lab",
      "Buat produk FG + BoM sederhana",
      "Pastikan route Manufacture aktif di FG",
      "Uji MO kecil end-to-end",
    ],
    newMenus: [
      "Manufacturing → Operations → Manufacturing Orders",
      "Manufacturing → Products → Bills of Materials",
      "Manufacturing → Planning",
      "Manufacturing → Reporting",
      "Manufacturing → Configuration → Settings",
      "Manufacturing → Configuration → Work Centers (jika WO aktif)",
    ],
    newSettings: [
      "Settings → Manufacturing → Operations",
      "Settings → Manufacturing → Planning",
      "Settings → Manufacturing → Traceability",
    ],
  },
  configurations: [
    {
      id: "mrp-workorders",
      name: "Work Orders",
      location: "Settings → Manufacturing → Operations → Work Orders",
      what: "Memecah MO menjadi operasi di Work Center dengan waktu & operator.",
      whyEnable:
        "Lini produksi multi-stasiun perlu jadwal & capacity per center.",
      whenEnable:
        "Ada proses berurutan (timbang → packing → label) dengan resource berbeda.",
      whenNot:
        "Perakitan sederhana satu langkah — WO menambah admin tanpa nilai.",
      businessExample:
        "WO1 Timbang kopi+teh; WO2 Packing ke dus di Packing Center.",
      impact:
        "BoM/Routing punya Operations; MO menampilkan Work Orders tab.",
      screenshot: {
        required: true,
        caption:
          "[SCREENSHOT REQUIRED] Settings Manufacturing — opsi Work Orders aktif",
      },
    },
    {
      id: "mrp-byproducts",
      name: "By-Products",
      location: "Settings → Manufacturing → Operations → By-Products",
      what: "MO dapat menghasilkan produk samping selain FG utama.",
      whyEnable:
        "Sisa proses punya nilai stok/cost yang perlu dicatat.",
      whenEnable:
        "Ada scrap berharga atau co-product.",
      whenNot:
        "Hanya satu FG — by-product membingungkan costing awal.",
      businessExample: "Trim kemasan rusak dicatat sebagai scrap product.",
      impact: "Tab By-products di BoM/MO.",
    },
    {
      id: "mrp-subcontracting",
      name: "Subcontracting",
      location: "Settings → Manufacturing → Operations → Subcontracting",
      what: "Produksi dikerjakan vendor; komponen dikirim ke subcontractor.",
      whyEnable:
        "Kapasitas internal penuh; packing eksternal.",
      whenEnable:
        "Ada kontrak maklon dengan ${vendorKemasan.name} atau sejenis.",
      whenNot:
        "Semua produksi in-house — jangan aktifkan dulu.",
      businessExample: "FG dipacking di vendor; komponen dikirim via delivery subcontract.",
      impact:
        "BoM type Subcontracting; PO jasa produksi terintegrasi.",
      screenshot: {
        required: true,
        caption:
          "[SCREENSHOT REQUIRED] BoM bertipe Subcontracting atau flow subcontract di Odoo 19",
      },
    },
    {
      id: "mrp-mps",
      name: "Master Production Schedule (MPS)",
      location: "Settings → Manufacturing → Planning → Master Production Schedule",
      what: "Perencanaan demand & launch produksi per periode.",
      whyEnable:
        "Menyelaraskan forecast sales dengan kapasitas produksi.",
      whenEnable:
        "Produksi berulang mingguan dengan horizon planning.",
      whenNot:
        "Job shop sporadis — cukup MO manual/MTO.",
      businessExample: `MPS mingguan Paket Oleh-Oleh untuk suplai ${distributor.name}.`,
      impact: "Menu MPS; saran kuantitas produksi.",
    },
    {
      id: "mrp-traceability",
      name: "Lots / Serial Traceability",
      location: "Settings → Manufacturing / Inventory → Traceability; tracking di produk",
      what: "Melacak lot komponen → lot FG.",
      whyEnable:
        "Recall produk pangan/minuman membutuhkan jejak batch.",
      whenEnable:
        "Produk food & beverage seperti ${kopi.name} dengan lot wajib.",
      whenNot:
        "Komponen non-kritis tanpa regulasi batch.",
      businessExample: `Lot ${kopi.name} L-2410 masuk BoM → lot FG PKG-2410.`,
      impact:
        "MO meminta lot/serial saat consume & produce; Traceability report.",
      screenshot: {
        src: "/screenshots/odoo19e/w2-mrp.png",
        caption: "Aplikasi Manufacturing — operasi produksi & jejak MO",
        whatYouSee: "Overview Manufacturing Odoo 19",
      },
    },
    {
      id: "mrp-mto",
      name: "Manufacture route / MTO",
      location: "Product → Inventory → Routes → Manufacture (+ MTO opsional)",
      what: "Confirm SO dapat memicu procurement Manufacturing.",
      whyEnable:
        "FG tidak digudang besar; diproduksi saat ada order.",
      whenEnable:
        "Make-to-order untuk paket custom distributor.",
      whenNot:
        "Make-to-stock dengan buffer gudang — pakai reorder rules + MO planned.",
      businessExample: `SO ${distributor.name} memicu MO Paket Oleh-Oleh.`,
      impact:
        "MO generated from SO; dual link Sales↔Manufacturing.",
    },
  ],
  masterData: [
    {
      id: "md-mrp-fg",
      name: "Finished Product (product.template)",
      purpose: "Produk jadi hasil produksi yang punya BoM.",
      required: true,
      whyNeeded:
        "MO & BoM menargetkan FG; tanpa FG storable, hasil produksi tidak masuk stok.",
      fields: [
        {
          field: "Name",
          type: "Char",
          required: true,
          purpose: "Nama FG",
          why: "Identitas jual & stok",
          example: "Paket Oleh-Oleh Kopi",
          impactIfEmpty: "Produk invalid",
        },
        {
          field: "Product Type",
          type: "Selection",
          required: true,
          purpose: "Goods storable",
          why: "Harus bisa masuk quant",
          example: "Goods (Storable)",
          impactIfEmpty: "Tidak ada stock move FG",
        },
        {
          field: "Routes — Manufacture",
          type: "Many2many",
          required: true,
          purpose: "Jalur produksi",
          why: "Aktifkan MRP untuk produk",
          example: "Manufacture",
          impactIfEmpty: "MO/replenish manufacture tidak jalan",
        },
        {
          field: "Sales Price",
          type: "Monetary",
          required: false,
          purpose: "Harga jual FG",
          why: "SO setelah produksi",
          example: "250000",
          impactIfEmpty: "Harga 0 di quotation",
        },
        {
          field: "Cost",
          type: "Monetary",
          required: false,
          purpose: "Cost estimasi / dari BoM",
          why: "Margin & valuation",
          example: "Computed from BoM components",
          impactIfEmpty: "Margin tidak akurat",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/07-products-list.png",
        caption: "Products list — FG dan komponen harus ada sebagai master",
      },
    },
    {
      id: "md-mrp-bom",
      name: "Bill of Materials (mrp.bom)",
      purpose: "Resep: FG + qty + daftar komponen (dan operations jika WO).",
      required: true,
      whyNeeded:
        "Tanpa BoM, Manufacturing Order tidak tahu apa yang dikonsumsi.",
      fields: [
        {
          field: "Product",
          type: "Many2one",
          required: true,
          purpose: "FG yang dihasilkan",
          why: "Header BoM",
          example: "Paket Oleh-Oleh Kopi",
          impactIfEmpty: "BoM tidak valid",
          related: "product.template / product.product",
        },
        {
          field: "Product Qty",
          type: "Float",
          required: true,
          purpose: "Qty FG per batch BoM",
          why: "Skala konsumsi komponen",
          example: "1",
          impactIfEmpty: "Default 1 atau error",
        },
        {
          field: "BoM Type",
          type: "Selection",
          required: true,
          purpose: "Manufacture this product / Kit / Subcontract",
          why: "Menentukan perilaku stok",
          example: "Manufacture this product",
          impactIfEmpty: "Default manufacture",
        },
        {
          field: "Components (BoM lines)",
          type: "One2many",
          required: true,
          purpose: "Bahan & qty",
          why: "Inti resep",
          example: `${kopi.name} 1; ${teh.name} 1; ${dus.name} 1`,
          impactIfEmpty: "MO tanpa konsumsi — FG 'gratis'",
          related: "mrp.bom.line",
        },
        {
          field: "Operations",
          type: "One2many",
          required: false,
          purpose: "Langkah WO",
          why: "Jika Work Orders aktif",
          example: "Packing 15 menit @ Packing Center",
          impactIfEmpty: "MO single-step",
          related: "mrp.routing.workcenter",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-mrp-bom-form.png",
        caption: "Form Bill of Materials — komponen dan qty FG",
        whatYouSee: "Form mrp.bom",
        whatToFill: `FG Paket, lines ${kopi.name}, ${teh.name}, ${dus.name}`,
      },
    },
    {
      id: "md-mrp-components",
      name: "Component Products",
      purpose: "Bahan baku / packing yang dikonsumsi MO.",
      required: true,
      whyNeeded:
        "Stok komponen harus ada sebelum Produce; biasanya dari Purchase.",
      fields: [
        {
          field: "Name",
          type: "Char",
          required: true,
          purpose: "Nama komponen",
          why: "BoM line reference",
          example: kopi.name,
          impactIfEmpty: "Invalid",
        },
        {
          field: "Type",
          type: "Selection",
          required: true,
          purpose: "Storable goods",
          why: "Quant & move",
          example: kopi.type,
          impactIfEmpty: "Konsumsi tidak mengurangi stok",
        },
        {
          field: "Cost / Purchase Price",
          type: "Monetary",
          required: false,
          purpose: "Dasar costing BoM",
          why: "COGS FG",
          example: kopi.purchasePrice,
          impactIfEmpty: "Cost FG understated",
        },
        {
          field: "Vendor (Purchase)",
          type: "Many2one",
          required: false,
          purpose: "Sumber pengadaan",
          why: "RFQ otomatis saat shortage",
          example: vendorBahan.name,
          impactIfEmpty: "Replenish manual",
          related: "res.partner",
        },
        {
          field: "Tracking",
          type: "Selection",
          required: false,
          purpose: "By lot/serial/none",
          why: "Traceability",
          example: "By Lots",
          impactIfEmpty: "Tidak ada jejak batch",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-mrp-bom-list.png",
        caption: "Daftar BoM — tiap BoM mereferensi komponen produk",
      },
    },
  ],
  dependencies: {
    nodes: [
      { id: "products", label: "Products (FG + Components)" },
      { id: "bom", label: "Bill of Materials" },
      { id: "purchase", label: "Purchase (komponen)" },
      { id: "mrp", label: "Manufacturing Orders" },
      { id: "stock", label: "Inventory quants" },
      { id: "sales", label: "Sales (MTO / jual FG)" },
    ],
    edges: [
      {
        from: "products",
        to: "bom",
        why: "BoM mereferensi FG dan komponen",
      },
      {
        from: "purchase",
        to: "stock",
        why: "Receipt komponen menambah On Hand",
      },
      {
        from: "bom",
        to: "mrp",
        why: "MO memakai BoM untuk explode kebutuhan",
      },
      {
        from: "mrp",
        to: "stock",
        why: "Consume komponen & receive FG via stock.move",
      },
      {
        from: "sales",
        to: "mrp",
        why: "MTO/Manufacture route memicu MO dari SO",
      },
      {
        from: "stock",
        to: "sales",
        why: "FG On Hand memungkinkan delivery SO",
      },
    ],
    summary:
      "Komponen diadakan Purchase→Inventory, diracik lewat BoM pada MO, FG masuk stok, lalu dijual Sales — Manufacturing adalah jembatan bahan ke barang jadi.",
  },
  forms: [
    {
      id: "form-bom",
      name: "Bill of Materials (mrp.bom)",
      menuPath: "Manufacturing → Products → Bills of Materials → New",
      fields: [
        {
          field: "Product",
          required: true,
          purpose: "Finished good",
          why: "Target produksi",
          example: "Paket Oleh-Oleh Kopi",
        },
        {
          field: "Product Qty",
          required: true,
          purpose: "Qty FG per BoM",
          why: "Skala",
          example: "1",
        },
        {
          field: "BoM Type",
          required: true,
          purpose: "Tipe BoM",
          why: "Manufacture vs Kit",
          example: "Manufacture this product",
        },
        {
          field: "Component lines — Product",
          required: true,
          purpose: "Bahan",
          why: "Resep",
          example: kopi.name,
        },
        {
          field: "Component lines — Quantity",
          required: true,
          purpose: "Qty bahan per Product Qty",
          why: "Konsumsi",
          example: "1",
        },
        {
          field: "Routing / Operations",
          required: false,
          purpose: "Langkah WO",
          why: "Jika Work Orders on",
          example: "Packing",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-mrp-bom-form.png",
        caption: "Form BoM baru dengan komponen",
        whatToFill: `${kopi.name}, ${teh.name}, ${dus.name} sebagai components`,
      },
    },
    {
      id: "form-mo",
      name: "Manufacturing Order (mrp.production)",
      menuPath: "Manufacturing → Operations → Manufacturing Orders → New",
      fields: [
        {
          field: "Product",
          required: true,
          purpose: "FG diproduksi",
          why: "Pilih BoM otomatis",
          example: "Paket Oleh-Oleh Kopi",
        },
        {
          field: "Quantity",
          required: true,
          purpose: "Qty FG direncanakan",
          why: "Explode komponen",
          example: "5",
        },
        {
          field: "Bill of Materials",
          required: true,
          purpose: "Resep dipakai",
          why: "Bisa multi-BoM",
          example: "BoM Paket Oleh-Oleh Kopi",
        },
        {
          field: "Scheduled Date",
          required: false,
          purpose: "Rencana mulai/selesai",
          why: "Planning",
          example: "2026-10-10",
        },
        {
          field: "Components tab",
          required: true,
          purpose: "To consume",
          why: "Kebutuhan bahan",
          example: `${kopi.name}×5; ${teh.name}×5; ${dus.name}×5`,
        },
        {
          field: "Responsible",
          required: false,
          purpose: "Owner MO",
          why: "Akuntabilitas shop floor",
          example: "Administrator",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-mrp.png",
        caption: "Manufacturing Orders di aplikasi Manufacturing",
        whatYouSee: "List/overview MO",
      },
    },
  ],
  procedures: [
    {
      id: "proc-mrp-bom",
      title: "Membuat BoM Paket Oleh-Oleh",
      goal: "BoM manufacture dengan 3 komponen seed siap dipakai MO.",
      preparation: [
        "Buat produk FG 'Paket Oleh-Oleh Kopi' (Storable, route Manufacture)",
        `${kopi.name}, ${teh.name}, ${dus.name} sudah ada`,
        "On Hand komponen idealnya > 0 (selesaikan PO dulu)",
      ],
      steps: [
        "Manufacturing → Bills of Materials → New",
        "Product: Paket Oleh-Oleh Kopi; Qty: 1",
        "BoM Type: Manufacture this product",
        `Add component: ${kopi.name} qty 1`,
        `Add component: ${teh.name} qty 1`,
        `Add component: ${dus.name} qty 1`,
        "Save",
      ],
      expectedResult: "mrp.bom aktif; cost FG terestimasi dari komponen.",
      verification: [
        "BoM muncul di list",
        "3 lines komponen",
        "Product FG menampilkan smart button BoM",
      ],
      fillFields: [
        {
          field: "Product",
          value: "Paket Oleh-Oleh Kopi",
          where: "Header",
          how: "Pilih",
          required: true,
        },
        {
          field: "Product Qty",
          value: "1",
          where: "Header",
          how: "Ketik",
          required: true,
        },
        {
          field: "Component 1",
          value: `${kopi.name} × 1`,
          where: "Components",
          how: "Pilih + ketik qty",
          required: true,
        },
        {
          field: "Component 2",
          value: `${teh.name} × 1`,
          where: "Components",
          how: "Pilih + ketik qty",
          required: true,
        },
        {
          field: "Component 3",
          value: `${dus.name} × 1`,
          where: "Components",
          how: "Pilih + ketik qty",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-mrp-bom-form.png",
        caption: "BoM terisi tiga komponen seed",
      },
    },
    {
      id: "proc-mrp-mo-produce",
      title: "Launch MO dan Produce",
      goal: "MO qty 5 selesai; FG On Hand +5; komponen berkurang.",
      preparation: [
        "BoM siap",
        `On Hand tiap komponen ≥ 5 (PO ke ${vendorBahan.name} / ${vendorKemasan.name} jika perlu)`,
      ],
      steps: [
        "Manufacturing → Manufacturing Orders → New",
        "Product: Paket Oleh-Oleh Kopi; Quantity: 5",
        "Confirm (status Confirmed/Progress)",
        "Cek Components: reserved/available",
        "Produce / Mark as Done (isi qty produced 5)",
        "Validate konsumsi & FG receipt",
      ],
      expectedResult: "MO Done; stock.move komponen & FG selesai.",
      verification: [
        "Inventory: FG On Hand +5",
        `${kopi.name} On Hand −5 (dst.)`,
        "MO state = Done",
      ],
      fillFields: [
        {
          field: "Product",
          value: "Paket Oleh-Oleh Kopi",
          where: "MO Header",
          how: "Pilih",
          required: true,
        },
        {
          field: "Quantity",
          value: "5",
          where: "MO Header",
          how: "Ketik",
          required: true,
        },
        {
          field: "Quantity Produced",
          value: "5",
          where: "Produce wizard / MO",
          how: "Ketik",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-mrp.png",
        caption: "MO dalam proses / selesai di Manufacturing",
      },
    },
    {
      id: "proc-mrp-sell-fg",
      title: "Jual finished goods setelah produksi",
      goal: "SO FG ke retail ter-deliver dari hasil MO.",
      preparation: [
        "MO Done; FG On Hand ≥ 2",
        "Sales terpasang",
      ],
      steps: [
        "Sales → Quotation → New",
        `Customer: ${customer.name}`,
        "Line: Paket Oleh-Oleh Kopi qty 2",
        "Confirm SO → Validate Delivery",
        "Create Invoice",
      ],
      expectedResult: "Siklus Manufacture→Sell tertutup; stok FG turun 2.",
      verification: [
        "Delivery Done",
        "FG On Hand berkurang",
        "Invoice posted",
      ],
      fillFields: [
        {
          field: "Customer",
          value: customer.name,
          where: "SO Header",
          how: "Pilih",
          required: true,
        },
        {
          field: "Product",
          value: "Paket Oleh-Oleh Kopi",
          where: "Order Lines",
          how: "Pilih",
          required: true,
        },
        {
          field: "Quantity",
          value: "2",
          where: "Order Lines",
          how: "Ketik",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/09-sales-quotation-form.png",
        caption: "Quotation FG hasil produksi Manufacturing",
      },
    },
  ],
  scenarios: [
    {
      id: "sc-mrp-mts",
      title: "Make-to-Stock batch mingguan",
      whenToUse: "Buffer gudang untuk retail cepat kirim.",
      flow: [
        "Rencana qty MPS/MO manual",
        "Pastikan komponen via Purchase",
        "Produce batch",
        "SO pakai stok FG siap",
      ],
    },
    {
      id: "sc-mrp-mto",
      title: "Make-to-Order dari SO distributor",
      whenToUse: `Order ${distributor.name} memicu produksi.`,
      flow: [
        "FG route Manufacture + MTO",
        "Confirm SO",
        "MO auto/proposal",
        "Produce → Deliver → Invoice",
      ],
    },
    {
      id: "sc-mrp-shortage",
      title: "Komponen kurang di tengah MO",
      whenToUse: "Reservation gagal / available < to consume.",
      flow: [
        "Confirm MO",
        "Lihat shortage",
        "Buat RFQ komponen",
        "Receipt → Check availability → Produce",
      ],
    },
    {
      id: "sc-mrp-partial",
      title: "Partial production",
      whenToUse: "Hanya sebagian qty bisa diselesaikan hari ini.",
      flow: [
        "MO qty 10",
        "Produce 6",
        "Backorder / sisa MO",
        "Selesaikan sisa besok",
      ],
      notes: "Pahami impact ke reservation komponen.",
    },
  ],
  integrations: [
    {
      id: "int-mrp-inventory",
      withModule: "Inventory",
      relationship: "mrp.production → stock.move",
      whatHappens:
        "Consume mengurangi quants komponen; produce menambah quants FG di lokasi produksi/stock.",
    },
    {
      id: "int-mrp-purchase",
      withModule: "Purchase",
      relationship: "shortage → procurement RFQ/PO",
      whatHappens:
        `Komponen dari ${vendorBahan.name}/${vendorKemasan.name} diadakan agar MO bisa reserved.`,
    },
    {
      id: "int-mrp-sales",
      withModule: "Sales",
      relationship: "MTO / jual FG",
      whatHappens:
        "SO dapat memicu MO; setelah FG ready, delivery menutup order pelanggan.",
    },
    {
      id: "int-mrp-accounting",
      withModule: "Accounting",
      relationship: "inventory valuation / COGS",
      whatHappens:
        "Konsumsi & FG receipt menjurnal valuation sesuai kategori produk & costing method.",
    },
  ],
  mistakes: [
    {
      id: "m-mrp-no-bom",
      problem: "Confirm MO tanpa BoM / BoM kosong",
      why: "Tidak ada konsumsi; costing & stok komponen salah",
      detect: "Components tab kosong",
      fix: "Buat BoM lengkap; update MO",
      prevent: "FG tidak boleh Manufacture tanpa BoM reviewed",
    },
    {
      id: "m-mrp-produce-no-stock",
      problem: "Force produce saat komponen 0",
      why: "Negative stock atau inkonsistensi (tergantung konfigurasi)",
      detect: "Warning availability; inventory negatif",
      fix: "Receipt PO dulu; batalkan produce prematur",
      prevent: "Check availability wajib hijau sebelum Done",
    },
    {
      id: "m-mrp-wrong-qty-bom",
      problem: "Qty komponen BoM salah skala",
      why: "Over/under consume sistemik setiap batch",
      detect: "Variance stok fisik vs sistem setelah beberapa MO",
      fix: "Koreksi BoM; inventory adjustment terkendali",
      prevent: "Pilot MO qty 1 + hitung fisik",
    },
    {
      id: "m-mrp-kit-vs-mfg",
      problem: "Pakai Kit BoM padahal butuh MO stok FG",
      why: "Kit memecah komponen saat delivery, tidak create FG quant",
      detect: "Tidak ada MO; SO menarik komponen",
      fix: "Ganti BoM type Manufacture jika ingin FG tersimpan",
      prevent: "Pahami perbedaan Kit vs Manufacture di training",
    },
    {
      id: "m-mrp-skip-purchase",
      problem: "Lupa pengadaan komponen sebelum jadwal produksi",
      why: "MO menunggu; janji kirim ke ${customer.name} molor",
      detect: "Waiting components berkepanjangan",
      fix: "Expedite PO; reschedule SO",
      prevent: "Lead time komponen masuk planning MPS",
    },
  ],
  troubleshooting: [
    {
      id: "t-mrp-cannot-produce",
      problem: "Tombol Produce/Mark Done disabled atau error availability",
      causes: [
        "Komponen belum reserved",
        "Lot wajib belum diisi",
        "MO masih draft",
      ],
      diagnosis: [
        "Tab Components: reserved vs to consume",
        "Product tracking settings",
        "State MO",
      ],
      solution: [
        "Check Availability setelah Receipt",
        "Isi lot/serial",
        "Confirm MO dulu",
      ],
      prevention: "Checklist: BoM → stok komponen → Confirm → Produce",
    },
    {
      id: "t-mrp-no-manufacture-route",
      problem: "SO tidak membuat MO",
      causes: [
        "Route Manufacture/MTO tidak aktif di FG",
        "BoM tidak ada",
        "Stok FG sudah cukup (MTS)",
      ],
      diagnosis: [
        "Product → Inventory → Routes",
        "Smart button BoM",
        "Forecasted quantities",
      ],
      solution: [
        "Aktifkan Manufacture (+ MTO jika perlu)",
        "Buat BoM",
        "Uji SO baru",
      ],
      prevention: "Template produk FG dengan route standar",
    },
    {
      id: "t-mrp-cost-zero",
      problem: "Cost FG 0 setelah BoM",
      causes: [
        "Cost komponen 0",
        "BoM belum di-compute",
        "Kategori valuation salah",
      ],
      diagnosis: [
        "Cek Cost di komponen",
        "Tombol Compute di BoM/product",
        "Inventory valuation categories",
      ],
      solution: [
        `Isi purchase price ${kopi.name}/${teh.name}/${dus.name}`,
        "Recompute BoM cost",
        "Perbaiki kategori akuntansi produk",
      ],
      prevention: "Master cost komponen sebelum Go-Live produksi",
    },
    {
      id: "t-mrp-wrong-location",
      problem: "FG tidak muncul di WH/Stock yang diharapkan",
      causes: [
        "Lokasi finished products beda",
        "Warehouse salah di MO",
        "Virtual production location confusion",
      ],
      diagnosis: [
        "MO → Locations",
        "Inventory → Product moves",
        "Warehouse config",
      ],
      solution: [
        "Sesuaikan finished products location",
        "Internal transfer jika perlu",
      ],
      prevention: "Standarisasi lokasi produksi di settings warehouse",
    },
  ],
  behind: {
    models: [
      "mrp.bom",
      "mrp.bom.line",
      "mrp.production",
      "mrp.workorder",
      "mrp.workcenter",
      "stock.move",
      "stock.picking",
      "product.product",
      "product.template",
    ],
    relations: [
      "mrp.bom.product_tmpl_id → product.template",
      "mrp.bom.bom_line_ids → mrp.bom.line",
      "mrp.bom.line.product_id → product.product",
      "mrp.production.bom_id → mrp.bom",
      "mrp.production.move_raw_ids → stock.move (consume)",
      "mrp.production.move_finished_ids → stock.move (FG)",
      "mrp.production.workorder_ids → mrp.workorder",
    ],
    automations: [
      "action_confirm reserves components / creates moves",
      "button_mark_done consumes & produces, updates quants",
      "procurement rules create MO from SO/reorder",
    ],
    securityNotes: [
      "mrp.group_mrp_user vs mrp.group_mrp_manager",
      "Ubah BoM sebaiknya dibatasi manager — dampak costing massal",
    ],
    note: "Di Odoo 19, mrp.production tetap dokumen pusat shop floor; BoM (mrp.bom) adalah master resep yang di-explode ke stock.move.",
  },
  reporting: [
    {
      name: "Production Analysis",
      path: "Manufacturing → Reporting → Production Analysis",
      kpi: "Qty produced, duration, delay",
      decision: "Capacity & bottleneck",
    },
    {
      name: "Overall Equipment (jika WO)",
      path: "Manufacturing → Reporting → Work Centers",
      kpi: "Load & OEE-like metrics",
      decision: "Investasi mesin / shift",
    },
    {
      name: "Unbuilt / Waiting Components",
      path: "Manufacturing Orders filter Waiting",
      kpi: "Backlog MO kekurangan bahan",
      decision: "Prioritas Purchase expedite",
    },
    {
      name: "Traceability",
      path: "Inventory / Manufacturing Traceability",
      kpi: "Lot komponen ↔ FG",
      decision: "Scope recall jika ada issue kualitas",
    },
  ],
  security: {
    roles: [
      {
        role: "Manufacturing / User",
        can: [
          "Proses MO (confirm, produce)",
          "Isi lot & qty produced",
          "Lihat BoM (sering read)",
        ],
        cannot: [
          "Ubah Settings Manufacturing",
          "Edit BoM massal tanpa otorisasi",
        ],
        whyDifferent: "Shop floor eksekusi vs engineering/master data.",
      },
      {
        role: "Manufacturing / Administrator",
        can: [
          "BoM, Work Centers, MPS settings",
          "Semua MO",
          "Konfigurasi operations",
        ],
        cannot: [
          "Tutup buku akuntansi tanpa role Accounting",
        ],
        whyDifferent: "Kendali resep & kapasitas berdampak biaya & kualitas.",
      },
    ],
    notes: [
      "Inventory User tetap dibutuhkan untuk Receipt komponen & kadang transfer",
      "Pisahkan hak ubah Cost produk dari operator MO",
    ],
  },
  levels: {
    beginner: [
      "Buat BoM 2–3 komponen",
      "Confirm MO sederhana",
      "Produce & cek On Hand FG",
      "Pahami Draft→Confirmed→Done",
    ],
    intermediate: [
      "Reservasi & shortage handling",
      "Partial production",
      "Lot traceability",
      "Jual FG setelah MO",
    ],
    advanced: [
      "Work Orders & work centers",
      "MTO dari Sales",
      "By-products / subcontracting",
      "Costing BoM & valuation",
    ],
    expert: [
      "MPS & capacity planning",
      "Multi-level BoM",
      "Quality points on operations",
      "Optimasi lead time Manufacture↔Purchase↔Sales",
    ],
  },
  exercises: [
    {
      id: "ex-mrp-bom",
      title: "BoM tiga komponen seed",
      objective: "Resep Paket Oleh-Oleh valid",
      prerequisites: [
        "FG product created",
        `${kopi.name}, ${teh.name}, ${dus.name} ada`,
      ],
      task: [
        "Buat BoM manufacture qty 1",
        "Tambah 3 komponen qty 1",
        "Save & buka dari FG smart button",
      ],
      expectedResult: "BoM list menampilkan resep",
      checklist: ["Type Manufacture", "3 lines", "FG benar"],
    },
    {
      id: "ex-mrp-mo",
      title: "MO qty 5 Done",
      objective: "Produksi batch kecil sukses",
      prerequisites: ["Komponen On Hand ≥ 5"],
      task: [
        "Create & Confirm MO qty 5",
        "Check availability",
        "Mark Done",
        "Cek FG +5 dan komponen −5",
      ],
      expectedResult: "MO Done tanpa shortage",
      checklist: ["Moves selesai", "Tidak negatif tak sengaja"],
    },
    {
      id: "ex-mrp-shortage",
      title: "Simulasi shortage",
      objective: "Latihan pengadaan komponen",
      prerequisites: ["BoM ada", "On Hand komponen sengaja dikurangi"],
      task: [
        "MO dengan qty besar",
        "Identifikasi komponen kurang",
        "RFQ/PO & Receipt",
        "Produce setelah available",
      ],
      expectedResult: "MO selesai setelah replenish",
      checklist: ["PO linked ke kebutuhan", "Availability hijau"],
    },
    {
      id: "ex-mrp-sell",
      title: "Manufacture lalu jual",
      objective: `Kirim FG ke ${customer.name}`,
      prerequisites: ["MO Done minimal qty 2"],
      task: ["SO FG qty 2", "Deliver", "Invoice"],
      expectedResult: "O2C FG hasil pabrik selesai",
      checklist: ["Origin stok dari MO", "Delivery Fully Delivered"],
    },
  ],
  coreFlowLinks: [
    { label: "Deep Dive Inventory", href: "/materi/inventory" },
    { label: "Deep Dive Purchase", href: "/materi/purchase" },
    { label: "Core Flow Purchase", href: "/modul/flow-purchase" },
    { label: "Deep Dive Sales", href: "/materi/sales" },
    { label: "Flow Inventory Ops", href: "/modul/flow-inventory" },
    { label: "E2E Cycle", href: "/modul/flow-end-to-end" },
  ],
};
