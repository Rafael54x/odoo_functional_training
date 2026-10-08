import type { DeepDiveModule } from "../types";
import { seed } from "../../seed";

const kopi = seed.products.kopi;
const teh = seed.products.teh;
const dus = seed.products.dus;
const vendor = seed.vendors.bahan;
const customer = seed.customers.toko;
const company = seed.company;

export const inventoryDeepDive: DeepDiveModule = {
  slug: "inventory",
  name: "Inventory — Stok, Gudang & Transfer",
  shortTitle: "Inventory",
  icon: "Warehouse",
  category: "Operasional",
  wave: 1,
  availability: "available",
  apps: ["Inventory"],
  overview: {
    function:
      "Modul Inventory (Stock) mengelola gudang, lokasi, produk storable, penerimaan, pengiriman, transfer internal, penyesuaian stok, dan valuasi. Di Odoo 19 Enterprise, setiap pergerakan dicatat sebagai stock.picking / stock.move yang terhubung ke Purchase dan Sales.",
    businessProblem:
      "Tanpa Inventory, perusahaan tidak tahu On Hand vs Forecasted, receipt/delivery tidak tervalidasi, dan Sales/Purchase kehilangan jejak fisik barang.",
    typicalUsers: [
      "Warehouse Operator",
      "Inventory Manager",
      "Purchasing (receipt follow-up)",
      "Sales Ops (delivery follow-up)",
    ],
    whenNeeded:
      "Saat ada barang fisik yang harus dilacak qty-nya di satu atau lebih lokasi, termasuk bahan baku, barang jadi, dan packaging.",
    relatedModules: ["Purchase", "Sales", "Accounting (valuation)", "Contacts"],
    businessScenario: `${company.name} menyimpan ${kopi.name}, ${teh.name}, dan ${dus.name} di WH/Stock. Barang masuk dari receipt PO ${vendor.name}; barang keluar lewat delivery SO ${customer.name}. Tim gudang memantau Overview Inventory, memvalidasi Transfers, dan melakukan Inventory Adjustment jika ada selisih fisik.`,
  },
  prerequisites: {
    modules: ["Contacts (disarankan)", "Purchase & Sales untuk flow penuh"],
    masterData: [
      "Warehouse WH dengan lokasi Stock, Input, Output (standar)",
      `Produk storable: ${kopi.name}, ${teh.name}, ${dus.name}`,
      "UoM Units / kategori UoM",
      "Product categories dengan property accounts (untuk valuation)",
    ],
    configuration: [
      "Inventory → Settings: Storage Locations (jika multi-lokasi)",
      "Inventory → Settings: Multi-Step Routes (opsional)",
      "Tracking: By Unique Serial / Lots (opsional)",
      "Valuation: Periodic atau Automated (Accounting)",
    ],
    access: [
      "Inventory / User: validate transfers, adjustments terbatas",
      "Inventory / Manager: konfigurasi gudang, locations, routes",
      "Accountant: untuk inventory valuation journals",
    ],
    relationships:
      "Purchase Confirm → incoming picking; Sales Confirm → outgoing picking. Adjustment mengubah quant tanpa dokumen PO/SO. Accounting membaca valuation layer saat move done (jika automated).",
  },
  installation: {
    how: [
      "Home → Apps",
      "Cari 'Inventory'",
      "Klik Install",
      "Menu Inventory muncul di App Switcher",
    ],
    dependencies: [
      "Contacts (ringan)",
      "Sales/Purchase akan menambah tipe operasi receipt/delivery",
      "Invoicing/Accounting untuk inventory valuation",
    ],
    afterInstall: [
      "Periksa Configuration → Warehouses: WH default",
      "Configuration → Operations Types: Receipts, Delivery Orders, Internal",
      "Settings: aktifkan Locations / Product Packagings sesuai kebutuhan",
    ],
    newMenus: [
      "Inventory → Overview",
      "Inventory → Operations → Transfers",
      "Inventory → Operations → Adjustments",
      "Inventory → Products → Products",
      "Inventory → Configuration → Warehouses",
      "Inventory → Reporting",
    ],
    newSettings: [
      "Settings → Inventory → Warehouse",
      "Settings → Inventory → Traceability",
      "Settings → Inventory → Valuation",
      "Settings → Inventory → Shipping",
    ],
  },
  configurations: [
    {
      id: "inv-locations",
      name: "Storage Locations",
      location: "Settings → Inventory → Warehouse → Storage Locations",
      what: "Mengaktifkan hierarki lokasi di dalam gudang (Shelf, Zone, dll).",
      whyEnable:
        "Memungkinkan putaway lebih rinci dan pencarian barang lebih cepat.",
      whenEnable:
        "Gudang punya zona fisik (bahan baku vs packaging) atau multi-rak.",
      whenNot:
        "Gudang kecil satu ruangan — lokasi WH/Stock saja sudah cukup untuk pemula.",
      businessExample: `Pisahkan WH/Stock/Bahan untuk ${kopi.name} dan WH/Stock/Pack untuk ${dus.name}.`,
      impact:
        "Field Location menjadi wajib di banyak operasi; quant per lokasi.",
      screenshot: {
        src: "/screenshots/odoo19e/11-settings.png",
        caption: "Settings Inventory — opsi Warehouse & Locations",
      },
    },
    {
      id: "inv-multi-step",
      name: "Multi-Step Routes",
      location: "Settings → Inventory → Warehouse → Multi-Step Routes",
      what: "Receipt/Delivery multi-langkah (Input→Quality→Stock, Pick→Pack→Ship).",
      whyEnable:
        "Mencerminkan proses gudang nyata dengan quality check atau packing station.",
      whenEnable:
        "Ada QC inbound atau packing sebelum kirim customer.",
      whenNot:
        "Database latihan pemula — one-step receipt/delivery lebih jelas.",
      businessExample:
        "Two-step receipt: barang ke Input dulu, baru Internal Transfer ke Stock.",
      impact:
        "Operation types bertambah; satu PO bisa menghasilkan lebih dari satu picking.",
    },
    {
      id: "inv-lots",
      name: "Lots & Serial Numbers",
      location: "Settings → Inventory → Traceability → Lots & Serial Numbers",
      what: "Melacak batch (lot) atau serial unik per unit.",
      whyEnable:
        "Recall produk, FEFO, dan audit traceability bahan pangan/minuman.",
      whenEnable:
        `Untuk ${kopi.name} jika ingin lacak batch roasting/supplier.`,
      whenNot:
        "Item murah tanpa kebutuhan recall — overhead scan lot tinggi.",
      businessExample: `Lot KA-2026-10 untuk receipt ${kopi.name} × ${seed.po.kopiQty}.`,
      impact:
        "Move lines meminta Lot/Serial; reporting traceability aktif.",
    },
    {
      id: "inv-expiration",
      name: "Expiration Dates",
      location: "Settings → Inventory → Traceability → Expiration Dates",
      what: "Tanggal kadaluarsa pada lot.",
      whyEnable:
        "Mencegah kirim barang expired ke customer.",
      whenEnable:
        "Produk food & beverage dengan shelf life.",
      whenNot:
        "Barang non-perishable seperti ${dus.name} murni packaging.",
      businessExample: `Lot kopi expired date +12 bulan dari receipt.`,
      impact:
        "Field Expiration pada lot; removal strategy FEFO tersedia.",
    },
    {
      id: "inv-packaging",
      name: "Product Packagings",
      location: "Settings → Inventory → Products → Product Packagings",
      what: "Kemasan jual/beli (box, pack) di atas UoM dasar.",
      whyEnable:
        "Order dalam dus sambil stok tetap Units.",
      whenEnable:
        "Vendor/customer order dalam kemasan standar.",
      whenNot:
        "Semua transaksi selalu Units.",
      businessExample: `Packaging "Dus 12" untuk ${teh.name}.`,
      impact:
        "Field Packaging di transfer/SO/PO; konversi qty otomatis.",
    },
    {
      id: "inv-valuation",
      name: "Inventory Valuation",
      location: "Settings → Inventory → Valuation / Product Category accounting tabs",
      what: "Periodic vs Automated valuation; costing method AVCO/FIFO/Standard.",
      whyEnable:
        "Menyelaraskan nilai stok dengan jurnal akuntansi.",
      whenEnable:
        "Automated saat butuh COGS real-time; Periodic untuk closing manual.",
      whenNot:
        "Jangan ganti costing method di tengah jalan tanpa migrasi layer.",
      businessExample: `Kategori Bahan Minuman: AVCO + Automated untuk ${kopi.name}.`,
      impact:
        "stock.valuation.layer terbentuk; journal stock otomatis saat move.",
      screenshot: {
        src: "/screenshots/odoo19e/10-accounting.png",
        caption: "Accounting terkait valuation — pastikan akun stok siap",
      },
    },
    {
      id: "inv-quality",
      name: "Quality (Enterprise)",
      location: "Settings → Inventory → Quality (jika Quality app terpasang)",
      what: "Quality checks pada receipt/delivery.",
      whyEnable:
        "Menolak barang rusak sebelum masuk Stock.",
      whenEnable:
        "Vendor sering kirim cacat; ada tim QC.",
      whenNot:
        "Wave 1 demo tanpa Quality app — lewati dulu.",
      businessExample: `QC check visual pada receipt ${vendor.name}.`,
      impact:
        "Quality checks muncul di picking; fail bisa block putaway.",
      screenshot: {
        required: true,
        caption: "[SCREENSHOT REQUIRED] Quality check pada incoming receipt (Enterprise)",
      },
    },
  ],
  masterData: [
    {
      id: "md-warehouse",
      name: "Warehouse (stock.warehouse)",
      purpose: "Entitas gudang dengan route dan operation types default.",
      required: true,
      whyNeeded:
        "Semua receipt/delivery mengacu warehouse; tanpa WH, operasi stok tidak terarah.",
      fields: [
        {
          field: "Name",
          type: "Char",
          required: true,
          purpose: "Nama gudang",
          why: "Identitas operasional",
          example: "WH — PT Nusantara Functional Demo",
          impactIfEmpty: "Warehouse tidak tersimpan",
        },
        {
          field: "Short Name",
          type: "Char",
          required: true,
          purpose: "Kode lokasi (WH)",
          why: "Prefix lokasi WH/Stock",
          example: "WH",
          impactIfEmpty: "Lokasi default gagal digenerate",
        },
        {
          field: "Address",
          type: "Many2one",
          required: false,
          purpose: "Alamat fisik gudang",
          why: "Dokumen pengiriman",
          example: `${company.street}, ${company.city}`,
          impactIfEmpty: "Slip memakai alamat perusahaan saja",
          related: "res.partner",
        },
        {
          field: "Incoming / Outgoing Shipments",
          type: "Selection",
          required: true,
          purpose: "One/two/three steps",
          why: "Menentukan jumlah picking per dokumen",
          example: "Receive goods directly (one step)",
          impactIfEmpty: "Default one-step",
        },
        {
          field: "Company",
          type: "Many2one",
          required: true,
          purpose: "Pemilik gudang",
          why: "Multi-company isolation",
          example: company.name,
          impactIfEmpty: "Akses lintas company kacau",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/17-warehouses.png",
        caption: "Konfigurasi Warehouses di Inventory",
      },
    },
    {
      id: "md-product-stock",
      name: "Storable Product",
      purpose: "Produk yang qty-nya dilacak di stock.quant.",
      required: true,
      whyNeeded:
        "Hanya Goods (Storable) yang punya On Hand/Forecasted dan move stok.",
      fields: [
        {
          field: "Name",
          type: "Char",
          required: true,
          purpose: "Nama produk",
          why: "Tampil di transfer",
          example: kopi.name,
          impactIfEmpty: "Invalid",
        },
        {
          field: "Product Type",
          type: "Selection",
          required: true,
          purpose: "Goods storable",
          why: "Mengaktifkan inventory tracking",
          example: kopi.type,
          impactIfEmpty: "Bisa jadi consumable/service tanpa stok",
        },
        {
          field: "Unit of Measure",
          type: "Many2one",
          required: true,
          purpose: "Satuan stok",
          why: "Dasar konversi",
          example: kopi.uom,
          impactIfEmpty: "Default Units; risiko konversi salah",
          related: "uom.uom",
        },
        {
          field: "Category",
          type: "Many2one",
          required: true,
          purpose: "Kategori akuntansi & costing",
          why: "Valuation accounts dari kategori",
          example: kopi.category,
          impactIfEmpty: "Akun stok default generik",
          related: "product.category",
        },
        {
          field: "Routes",
          type: "Many2many",
          required: false,
          purpose: "Buy / Manufacture / Replenish",
          why: "Cara memenuhi kekurangan stok",
          example: "Buy",
          impactIfEmpty: "Reordering tidak tahu harus PO",
        },
        {
          field: "Responsible",
          type: "Many2one",
          required: false,
          purpose: "Pic inventory produk",
          why: "Activity & notifikasi",
          example: "Inventory Manager",
          impactIfEmpty: "Escalation kurang jelas",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/07-products-list.png",
        caption: "Products — fokus tipe Goods Storable",
      },
    },
    {
      id: "md-operation-type",
      name: "Operation Type (stock.picking.type)",
      purpose: "Jenis operasi: Receipts, Delivery Orders, Internal Transfers, Adjustments.",
      required: true,
      whyNeeded:
        "Menentukan sequence nomor, lokasi default source/dest, dan barcode rules.",
      fields: [
        {
          field: "Operation Type",
          type: "Char",
          required: true,
          purpose: "Nama tipe",
          why: "Menu Overview tiles",
          example: "Receipts",
          impactIfEmpty: "Tidak tersimpan",
        },
        {
          field: "Code / Sequence",
          type: "Char / Many2one",
          required: true,
          purpose: "Prefix nomor picking",
          why: "Trace dokumen WH/IN/OUT",
          example: "WH/IN/",
          impactIfEmpty: "Nomor generik bentrok",
        },
        {
          field: "Default Source Location",
          type: "Many2one",
          required: false,
          purpose: "Lokasi asal default",
          why: "Receipt dari Vendors; Delivery dari Stock",
          example: "Partners/Vendors atau WH/Stock",
          impactIfEmpty: "Harus diisi manual tiap transfer",
          related: "stock.location",
        },
        {
          field: "Default Destination Location",
          type: "Many2one",
          required: false,
          purpose: "Lokasi tujuan default",
          why: "Receipt ke WH/Stock",
          example: "WH/Stock",
          impactIfEmpty: "Barang bisa masuk lokasi salah",
          related: "stock.location",
        },
        {
          field: "Reservation Method",
          type: "Selection",
          required: false,
          purpose: "At / Before scheduled date / Manual",
          why: "Kapan stok direservasi untuk delivery",
          example: "At Confirmation",
          impactIfEmpty: "Default confirmation",
        },
      ],
    },
  ],
  dependencies: {
    nodes: [
      { id: "products", label: "Products (Storable)" },
      { id: "warehouse", label: "Warehouse & Locations" },
      { id: "purchase", label: "Purchase (Incoming)" },
      { id: "inventory", label: "Inventory Transfers" },
      { id: "sales", label: "Sales (Outgoing)" },
      { id: "account", label: "Accounting Valuation" },
    ],
    edges: [
      {
        from: "products",
        to: "inventory",
        why: "Tanpa produk storable tidak ada quant untuk dilacak",
      },
      {
        from: "warehouse",
        to: "inventory",
        why: "Picking type & lokasi sumber/tujuan berasal dari warehouse",
      },
      {
        from: "purchase",
        to: "inventory",
        why: "Confirm PO membuat incoming stock.picking",
      },
      {
        from: "inventory",
        to: "sales",
        why: "On Hand hasil receipt memungkinkan Validate Delivery SO",
      },
      {
        from: "sales",
        to: "inventory",
        why: "Confirm SO membuat outgoing picking yang harus divalidasi gudang",
      },
      {
        from: "inventory",
        to: "account",
        why: "Move done memicu valuation layer & journal stok (automated)",
      },
    ],
    summary:
      "Inventory adalah jembatan fisik antara Purchase (masuk) dan Sales (keluar), dengan Warehouse sebagai kerangka lokasi dan Accounting sebagai pencatat nilai.",
  },
  forms: [
    {
      id: "form-transfer",
      name: "Transfer / Picking (stock.picking)",
      menuPath: "Inventory → Operations → Transfers → New",
      fields: [
        {
          field: "Operation Type",
          required: true,
          purpose: "Jenis operasi",
          why: "Menentukan sequence & lokasi default",
          example: "Receipts / Delivery Orders / Internal Transfers",
        },
        {
          field: "Contact",
          required: false,
          purpose: "Vendor atau Customer terkait",
          why: "Dokumen & partner moves",
          example: `${vendor.name} (receipt) / ${customer.name} (delivery)`,
        },
        {
          field: "Source Location",
          required: true,
          purpose: "Asal barang",
          why: "Dari mana quant berkurang",
          example: "Partners/Vendors atau WH/Stock",
        },
        {
          field: "Destination Location",
          required: true,
          purpose: "Tujuan barang",
          why: "Ke mana quant bertambah",
          example: "WH/Stock atau Partners/Customers",
        },
        {
          field: "Scheduled Date",
          required: true,
          purpose: "Rencana eksekusi",
          why: "Planning workload gudang",
          example: "2026-10-20",
        },
        {
          field: "Operations — Product",
          required: true,
          purpose: "Item dipindah",
          why: "Inti transfer",
          example: kopi.name,
        },
        {
          field: "Operations — Demand / Done",
          required: true,
          purpose: "Qty diminta vs aktual",
          why: "Backorder & accuracy",
          example: seed.po.kopiQty,
        },
        {
          field: "Source Document",
          required: false,
          purpose: "Origin PO/SO",
          why: "Traceability cross-module",
          example: "P00001 / S00001",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/13-inventory-receipts.png",
        caption: "Receipts / Transfers — form operasi gudang",
      },
    },
    {
      id: "form-adjustment",
      name: "Inventory Adjustment (stock.quant count)",
      menuPath: "Inventory → Operations → Physical Inventory / Adjustments",
      fields: [
        {
          field: "Product",
          required: true,
          purpose: "Item dihitung ulang",
          why: "Menentukan quant mana yang dikoreksi",
          example: kopi.name,
        },
        {
          field: "Location",
          required: true,
          purpose: "Lokasi stock opname",
          why: "Selisih per lokasi",
          example: "WH/Stock",
        },
        {
          field: "Counted Quantity",
          required: true,
          purpose: "Hasil hitung fisik",
          why: "Dasar inventory loss/gain",
          example: "18",
        },
        {
          field: "On Hand",
          required: false,
          purpose: "Qty sistem sebelum koreksi",
          why: "Melihat variance",
          example: "20",
        },
        {
          field: "Inventory Date",
          required: true,
          purpose: "Tanggal opname",
          why: "Audit trail",
          example: "2026-10-21",
        },
        {
          field: "Accounting Date",
          required: false,
          purpose: "Tanggal jurnal penyesuaian",
          why: "Period closing",
          example: "2026-10-21",
        },
        {
          field: "User",
          required: false,
          purpose: "Petugas opname",
          why: "Akuntabilitas",
          example: "Warehouse Operator",
        },
      ],
      screenshot: {
        required: true,
        caption: "[SCREENSHOT REQUIRED] Physical Inventory / Apply adjustment screen",
      },
    },
  ],
  procedures: [
    {
      id: "proc-overview-receipt",
      title: "Monitor Overview dan Validate Receipt",
      goal: `Menerima barang PO dari ${vendor.name} ke WH/Stock.`,
      preparation: [
        "PO confirmed dengan Receipt waiting",
        "Login Inventory User",
      ],
      steps: [
        "Home → Inventory → Overview",
        "Klik tile Receipts (Waiting / Ready)",
        "Buka picking terkait PO",
        `Isi Quantity Done: ${kopi.name} ${seed.po.kopiQty}, ${teh.name} ${seed.po.tehQty}`,
        "Validate → Apply",
        "Kembali ke Overview: Receipt selesai",
      ],
      expectedResult: "Picking Done; On Hand naik; PO Fully Received.",
      verification: [
        `Products → ${kopi.name}: On Hand bertambah`,
        "Transfers filter Done menampilkan receipt",
        "Tidak ada backorder tak terduga",
      ],
      fillFields: [
        {
          field: "Quantity Done — Kopi",
          value: seed.po.kopiQty,
          where: "Operations",
          how: "Ketik",
          required: true,
        },
        {
          field: "Quantity Done — Teh",
          value: seed.po.tehQty,
          where: "Operations",
          how: "Ketik",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/06-inventory-overview.png",
        caption: "Inventory Overview — tile Receipts dan operasi gudang",
      },
    },
    {
      id: "proc-validate-delivery",
      title: "Validate Delivery Order Sales",
      goal: `Mengirim ${kopi.name} × ${seed.so.kopiQty} ke ${customer.name}.`,
      preparation: [
        `On Hand ${kopi.name} ≥ ${seed.so.kopiQty}`,
        "SO confirmed dengan Delivery Ready",
      ],
      steps: [
        "Inventory → Overview → Delivery Orders",
        "Buka picking outgoing dari SO",
        `Pastikan Demand ${kopi.name} = ${seed.so.kopiQty}`,
        "Check Availability jika status Waiting",
        "Validate",
        "Cek On Hand turun",
      ],
      expectedResult: "Delivery Done; SO delivered qty terisi.",
      verification: [
        "Outgoing picking Done",
        "Forecasted/On Hand konsisten",
        "Sales Invoice Status siap (delivered policy)",
      ],
      fillFields: [
        {
          field: "Quantity Done",
          value: seed.so.kopiQty,
          where: "Operations",
          how: "Ketik/otomatis",
          required: true,
        },
        {
          field: "Customer",
          value: customer.name,
          where: "Header",
          how: "Otomatis dari SO",
        },
      ],
      screenshot: {
        required: true,
        caption: "[SCREENSHOT REQUIRED] Delivery Order form Ready to Validate untuk Toko Maju Jaya",
      },
    },
    {
      id: "proc-adjustment",
      title: "Inventory Adjustment selisih fisik",
      goal: "Menyesuaikan On Hand jika hitung fisik berbeda dari sistem.",
      preparation: [
        "Lakukan stock opname di WH/Stock",
        "Catat qty fisik aktual",
      ],
      steps: [
        "Inventory → Operations → Physical Inventory (atau Adjustments)",
        `Cari ${kopi.name} di lokasi WH/Stock`,
        "Isi Counted Quantity sesuai fisik",
        "Apply / Relocate inventory",
        "Konfirmasi inventory loss/gain move",
      ],
      expectedResult: "On Hand = counted; ada move inventory adjustment.",
      verification: [
        "Quant On Hand = counted",
        "History move menampilkan Inventory Adjustment",
        "Valuation berubah jika automated",
      ],
      fillFields: [
        {
          field: "Product",
          value: kopi.name,
          where: "Adjustment line",
          how: "Pilih",
          required: true,
        },
        {
          field: "Location",
          value: "WH/Stock",
          where: "Adjustment line",
          how: "Pilih",
          required: true,
        },
        {
          field: "Counted Quantity",
          value: "18",
          where: "Adjustment line",
          how: "Ketik",
          required: true,
          note: "Contoh: sistem 20, fisik 18 → loss 2",
        },
      ],
    },
  ],
  scenarios: [
    {
      id: "sc-inbound-outbound",
      title: "Siklus masuk–keluar mingguan",
      whenToUse: "Operasi rutin gudang setelah PO dan sebelum SO.",
      flow: [
        "Validate Receipt PO",
        "Cek Overview On Hand",
        "Validate Delivery SO",
        "Review Stock Report",
      ],
    },
    {
      id: "sc-internal-transfer",
      title: "Transfer internal antar lokasi",
      whenToUse: "Memindahkan packaging ke zona packing.",
      flow: [
        "Aktifkan Storage Locations",
        "Buat Internal Transfer",
        `Pindahkan ${dus.name} dari WH/Stock ke WH/Stock/Pack`,
        "Validate",
      ],
    },
    {
      id: "sc-backorder-receipt",
      title: "Receipt parsial",
      whenToUse: "Vendor kirim kurang dari PO.",
      flow: [
        "Validate qty kurang",
        "Create Backorder",
        "Terima sisa kemudian",
        "Bill mengikuti received qty",
      ],
    },
    {
      id: "sc-stocktake",
      title: "Stock opname bulanan",
      whenToUse: "Closing bulan / audit.",
      flow: [
        "Freeze transaksi singkat (opsional)",
        "Physical Inventory semua SKU minuman",
        "Apply adjustments",
        "Review inventory loss journal",
      ],
    },
  ],
  integrations: [
    {
      id: "int-inv-purchase",
      withModule: "Purchase",
      relationship: "Incoming pickings dari PO",
      whatHappens:
        "Setiap PO confirmed menghasilkan stock.picking type incoming; qty_received di PO mengikuti Validate.",
    },
    {
      id: "int-inv-sales",
      withModule: "Sales",
      relationship: "Outgoing pickings dari SO",
      whatHappens:
        "SO confirmed me-reserve quant; Validate Delivery mengisi qty_delivered di sale.order.line.",
    },
    {
      id: "int-inv-accounting",
      withModule: "Accounting",
      relationship: "Valuation & COGS",
      whatHappens:
        "Automated valuation membuat account.move dari stock.valuation.layer saat barang masuk/keluar.",
    },
  ],
  mistakes: [
    {
      id: "m-wrong-location",
      problem: "Validate receipt ke lokasi salah",
      why: "On Hand di WH/Stock 0 padahal barang fisik ada di Input",
      detect: "Quant di lokasi non-Stock; delivery gagal reserve",
      fix: "Internal Transfer ke WH/Stock",
      prevent: "One-step receipt untuk pemula; cek destination sebelum Validate",
    },
    {
      id: "m-force-available",
      problem: "Validate delivery tanpa stok (force)",
      why: "Negative stock / inkonsistensi (tergantung config)",
      detect: "On Hand negatif atau move tanpa quant",
      fix: "Receipt dulu atau batalkan delivery; koreksi quant",
      prevent: "Jangan bypass availability; pantau Forecasted",
    },
    {
      id: "m-adjust-instead-of-receipt",
      problem: "Naikkan stok hanya lewat Adjustment, bypass PO",
      why: "Hilang jejak vendor & AP; valuation tidak dari harga beli",
      detect: "Stok naik tanpa picking IN dari PO",
      fix: "Buat PO+Receipt retroaktif atau dokumentasikan exception",
      prevent: "SOP: stok beli harus lewat Purchase",
    },
    {
      id: "m-consumable-as-stock",
      problem: "Produk jadi Consumable padahal perlu dilacak",
      why: "Tidak ada On Hand; tidak bisa reserve",
      detect: "Product Type bukan Storable; Inventory tab kosong",
      fix: "Ubah ke Goods Storable (hati-hati data historis)",
      prevent: "Definisi tipe produk di master data workshop",
    },
    {
      id: "m-ignore-backorder",
      problem: "No backorder saat qty kurang",
      why: "Sisa demand hilang",
      detect: "PO/SO Fully done padahal fisik belum lengkap",
      fix: "Manual transfer tambahan",
      prevent: "Selalu Create Backorder jika kurang",
    },
  ],
  troubleshooting: [
    {
      id: "t-waiting-availability",
      problem: "Delivery status Waiting Availability terus",
      causes: [
        "On Hand 0",
        "Stok di lokasi bukan source location picking",
        "Reservasi order lain",
      ],
      diagnosis: [
        "Product Forecasted report",
        "Cek quant locations",
        "Cek reserved quantity",
      ],
      solution: [
        "Selesaikan Receipt",
        "Internal transfer ke source location",
        "Unreserve SO prioritas lebih rendah",
      ],
      prevention: "Reordering rules & pantau Forecasted sebelum Confirm SO besar",
    },
    {
      id: "t-cannot-validate",
      problem: "Tombol Validate abu-abu / error qty",
      causes: [
        "Quantity Done 0",
        "Lot wajib belum diisi",
        "User tanpa hak",
      ],
      diagnosis: [
        "Cek kolom Done",
        "Cek tracking product",
        "Cek access rights",
      ],
      solution: [
        "Isi Done qty",
        "Assign lot",
        "Minta Inventory User rights",
      ],
      prevention: "Checklist picking Ready sebelum assign ke operator",
    },
    {
      id: "t-overview-empty",
      problem: "Overview tidak menampilkan tile operasi",
      causes: [
        "Tidak ada picking waiting",
        "Filter My / Late aktif",
        "Warehouse salah company",
      ],
      diagnosis: [
        "Operations → Transfers tanpa filter",
        "Cek company di pojok kanan",
      ],
      solution: [
        "Buat/Confirm PO atau SO",
        "Clear filter",
        "Pilih company yang benar",
      ],
      prevention: "Pahami bahwa Overview adalah agregat picking open",
    },
    {
      id: "t-valuation-gap",
      problem: "Stok bergerak tapi tidak ada journal valuation",
      causes: [
        "Valuation Periodic",
        "Akun kategori produk kosong",
        "Move belum Done",
      ],
      diagnosis: [
        "Cek product category accounting",
        "Cek Inventory Valuation report",
        "Cek state picking",
      ],
      solution: [
        "Lengkapi Stock Input/Output/Valuation accounts",
        "Atau jalankan periodic valuation di closing",
      ],
      prevention: "Setup kategori produk sebelum transaksi live",
    },
  ],
  behind: {
    models: [
      "stock.warehouse",
      "stock.location",
      "stock.picking",
      "stock.picking.type",
      "stock.move",
      "stock.move.line",
      "stock.quant",
      "stock.valuation.layer",
      "product.product",
      "product.template",
    ],
    relations: [
      "stock.picking.move_ids → stock.move",
      "stock.move.product_id → product.product",
      "stock.move.picking_id → stock.picking",
      "stock.quant.location_id → stock.location",
      "stock.valuation.layer.stock_move_id → stock.move",
    ],
    automations: [
      "_action_confirm / _action_assign: reservation",
      "button_validate: create backorder wizard, set move done",
      "valuation: create SVL & account.move when configured",
    ],
    securityNotes: [
      "stock.group_stock_user vs stock.group_stock_manager",
      "Adjustment sering dibatasi Manager karena berdampak valuation",
    ],
    note: "Inti Inventory Odoo 19 tetap stock.picking + stock.move + stock.quant; Overview adalah dashboard picking types.",
  },
  reporting: [
    {
      name: "Inventory Overview",
      path: "Inventory → Overview",
      kpi: "Jumlah picking Ready/Waiting/Late",
      decision: "Prioritas tenaga gudang hari ini",
    },
    {
      name: "Stock On Hand",
      path: "Inventory → Reporting → Stock",
      kpi: "Qty & value per produk/lokasi",
      decision: `Apakah perlu reorder ${kopi.name}?`,
    },
    {
      name: "Moves History",
      path: "Inventory → Reporting → Moves History",
      kpi: "Jejak semua pergerakan",
      decision: "Investigasi selisih / audit trail",
    },
    {
      name: "Inventory Valuation",
      path: "Inventory → Reporting → Valuation",
      kpi: "Nilai aset stok",
      decision: "Closing & COGS review dengan Accounting",
    },
  ],
  security: {
    roles: [
      {
        role: "Inventory / User",
        can: [
          "Process transfers Ready",
          "Lihat produk & quant",
          "Input qty Done",
        ],
        cannot: [
          "Ubah warehouse configuration",
          "Hapus locations kritis",
          "Ubah Settings Inventory",
        ],
        whyDifferent:
          "Operator fokus eksekusi; konfigurasi diserahkan ke Manager agar struktur gudang stabil.",
      },
      {
        role: "Inventory / Manager",
        can: [
          "Setup WH, locations, routes",
          "Force availability / unlock",
          "Inventory adjustments penuh",
        ],
        cannot: [
          "Post pembayaran customer/vendor tanpa Accounting",
          "Ubah COA bebas",
        ],
        whyDifferent:
          "Manager menjaga master struktur stok; finance tetap pada Accounting.",
      },
    ],
    notes: [
      "Pisahkan hak adjustment dari operator harian untuk kurangi fraud stok",
      "Multi-company: pastikan WH terikat company yang benar",
    ],
  },
  levels: {
    beginner: [
      "Baca Inventory Overview",
      "Validate Receipt dari PO seed",
      "Validate Delivery dari SO seed",
      "Cek On Hand produk",
    ],
    intermediate: [
      "Partial transfer + backorder",
      "Internal transfer antar lokasi",
      "Physical inventory adjustment",
      "Pahami Forecasted vs On Hand",
    ],
    advanced: [
      "Multi-step routes",
      "Lots/serial & FEFO",
      "Reordering rules",
      "Valuation report vs Accounting",
    ],
    expert: [
      "Desain putaway & removal strategies",
      "Optimasi reservation method",
      "Integrasi Quality checks",
      "KPI warehouse cycle time & accuracy",
    ],
  },
  exercises: [
    {
      id: "ex-receipt",
      title: "Validate Receipt PO bahan",
      objective: "Stok masuk dari Purchase",
      prerequisites: ["PO confirmed dari vendor seed"],
      task: [
        "Buka Receipts di Overview",
        `Validate ${kopi.name} & ${teh.name} penuh`,
      ],
      expectedResult: "On Hand naik sesuai PO",
      checklist: ["Picking Done", "Tidak ada backorder"],
    },
    {
      id: "ex-delivery",
      title: "Validate Delivery SO retail",
      objective: "Stok keluar ke customer",
      prerequisites: [`On Hand cukup untuk ${seed.so.kopiQty}`],
      task: ["Buka Delivery Orders", "Validate", "Cek On Hand turun"],
      expectedResult: "Outgoing Done",
      checklist: ["Qty benar", "Partner = Toko Maju Jaya"],
    },
    {
      id: "ex-internal",
      title: "Internal Transfer kemasan",
      objective: `Pindahkan ${dus.name} antar lokasi`,
      prerequisites: ["Storage Locations aktif", "Stok dus ada"],
      task: [
        "Buat Internal Transfer",
        "Validate pemindahan",
      ],
      expectedResult: "Quant berpindah lokasi; total On Hand sama",
      checklist: ["Source ≠ Destination", "Qty konsisten"],
    },
    {
      id: "ex-adjust",
      title: "Adjustment selisih 2 unit kopi",
      objective: "Koreksi opname",
      prerequisites: ["On Hand kopi diketahui"],
      task: [
        "Physical Inventory",
        "Counted = On Hand − 2",
        "Apply",
      ],
      expectedResult: "On Hand turun 2; ada inventory loss",
      checklist: ["Lokasi WH/Stock", "Product benar"],
    },
    {
      id: "ex-forecast",
      title: "Baca Forecasted sebelum Confirm SO",
      objective: "Cegah oversell",
      prerequisites: ["Ada SO draft & PO incoming"],
      task: [
        `Buka ${kopi.name} → Forecasted`,
        "Bandingkan Incoming vs Outgoing",
        "Putuskan apakah SO bisa Confirm",
      ],
      expectedResult: "Keputusan berbasis Forecasted, bukan hanya On Hand",
      checklist: ["Memahami virtual available", "Catat angka sebelum/sesudah"],
    },
  ],
  coreFlowLinks: [
    { label: "Master Inventory", href: "/modul/master-inventory" },
    { label: "Warehouse & Locations", href: "/modul/master-inventory/warehouse-locations" },
    { label: "Flow Inventory Ops", href: "/modul/flow-inventory" },
    { label: "Transfers & Adjustments", href: "/modul/flow-inventory/transfers-adjustments" },
    { label: "Flow Purchase", href: "/modul/flow-purchase" },
    { label: "Flow Sales", href: "/modul/flow-sales" },
  ],
};
