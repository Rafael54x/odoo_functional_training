import type { DeepDiveModule } from "../types";
import { seed } from "../../seed";

const kopi = seed.products.kopi;
const teh = seed.products.teh;
const dus = seed.products.dus;
const vendor = seed.vendors.bahan;
const vendorKemasan = seed.vendors.kemasan;
const customer = seed.customers.toko;
const distributor = seed.customers.distributor;
const company = seed.company;

/** Barcode produk latihan (demo sheet) — konsisten di seluruh prosedur */
const barcodes = {
  kopi: "8991002100001",
  teh: "8991002100002",
  dus: "8991002100003",
  locationStock: "LOC-WH-STOCK",
  locationPack: "LOC-WH-PACK",
  pickingReceipt: "WH/IN/",
  pickingDelivery: "WH/OUT/",
  pickingInternal: "WH/INT/",
} as const;

/**
 * Deep Dive — Barcode
 * Aplikasi Barcode Odoo 19 Enterprise: menu utama mobile/ops, scan receipt/delivery/internal,
 * barcode produk, lembar data demo, dan perbandingan vs Inventory klasik.
 */
export const barcodeDeepDive: DeepDiveModule = {
  slug: "barcode",
  name: "Barcode — Scan Gudang & Operasi Mobile",
  shortTitle: "Barcode",
  icon: "ScanBarcode",
  category: "Operasional",
  wave: 3,
  availability: "available",
  apps: ["Barcode", "Inventory", "Purchase", "Sales"],
  overview: {
    function:
      "Modul Barcode (Enterprise) adalah antarmuka operasi gudang berbasis scan: menerima barang, mengirim delivery, transfer internal, penyesuaian, dan pencarian produk lewat kamera/scanner tanpa mengisi form Inventory klasik baris per baris. Di Odoo 19 Enterprise, Barcode memakai operasi stock.picking / stock.move yang sama dengan Inventory, hanya UX-nya dioptimasi untuk perangkat genggam dan alur scan bertahap.",
    businessProblem:
      "Tanpa Barcode, operator gudang bergantung pada laptop, ketik qty manual, dan mudah salah SKU saat receipt/delivery padat. Selisih stok naik, siklus picking lambat, dan training operator baru lebih lama.",
    typicalUsers: [
      "Warehouse Operator (handheld / HP)",
      "Receiving Clerk",
      "Picker / Packer",
      "Inventory Supervisor (pantau + konfigurasi)",
    ],
    whenNeeded:
      "Saat volume receipt/delivery tinggi, multi-SKU, atau tim gudang bekerja di lantai dengan scanner/kamera — bukan hanya admin di meja.",
    relatedModules: [
      "Inventory",
      "Purchase (incoming)",
      "Sales (outgoing)",
      "Products (barcode field)",
      "Quality (opsional scan QC)",
    ],
    businessScenario: `${company.name} menerima PO dari ${vendor.name} (${kopi.name} × ${seed.po.kopiQty}, ${teh.name} × ${seed.po.tehQty}) dan mengirim SO ke ${customer.name} (${kopi.name} × ${seed.so.kopiQty}). Operator membuka app Barcode, scan dokumen picking lalu scan barcode produk (${barcodes.kopi}, ${barcodes.teh}) untuk mengisi Quantity Done, Validate dari layar mobile, lalu bandingkan hasilnya dengan Inventory Overview klasik.`,
  },
  prerequisites: {
    modules: [
      "Inventory (wajib — Barcode menumpang operasi stok)",
      "Barcode app (Enterprise) terpasang",
      "Purchase & Sales untuk flow receipt/delivery penuh",
    ],
    masterData: [
      `Produk storable dengan barcode: ${kopi.name}, ${teh.name}, ${dus.name}`,
      "Warehouse WH + operation types Receipts / Delivery / Internal",
      `Vendor ${vendor.name} & customer ${customer.name}`,
      "PO/SO confirmed agar picking Waiting/Ready tersedia",
      "Lembar demo barcode (lihat masterData demo sheet)",
    ],
    configuration: [
      "Settings → Inventory / Barcode: aktifkan Barcode Scanner",
      "Product → field Barcode terisi unik",
      "Operation Types: barcode source/destination (opsional lokasi)",
      "Hak akses Inventory User + akses app Barcode",
    ],
    access: [
      "Inventory / User: scan & validate transfer lewat Barcode",
      "Inventory / Manager: settings barcode, rules, demo data",
      "Operator mobile: login user gudang (bukan portal customer)",
    ],
    relationships:
      "Barcode UI memanggil stock.picking yang sama dengan Inventory → Operations → Transfers. Scan produk mengisi stock.move.line qty_done; Validate di Barcode = button_validate di picking klasik. Field product.barcode / packaging barcode dipakai untuk resolusi SKU.",
  },
  installation: {
    how: [
      "Home → Apps",
      "Cari 'Barcode'",
      "Install aplikasi Barcode (Enterprise)",
      "Pastikan Inventory sudah terpasang",
      "Menu Barcode muncul di App Switcher",
    ],
    dependencies: [
      "Inventory (wajib)",
      "Purchase/Sales untuk dokumen inbound/outbound nyata",
      "Kamera perangkat atau USB/Bluetooth scanner di browser",
    ],
    afterInstall: [
      "Buka Barcode → pastikan main menu menampilkan Operations (Receipts, Deliveries, Internal, dll.)",
      "Isi barcode pada produk seed",
      "Settings → Barcode / Inventory: tinjau opsi scan & print",
      "Uji scan satu receipt kecil end-to-end",
    ],
    newMenus: [
      "Barcode → Main Menu (Operations)",
      "Barcode → Receipts / Deliveries / Internal Transfers",
      "Barcode → Inventory Adjustments (jika diaktifkan)",
      "Barcode → Batch / Cluster Transfers (bergantung settings)",
      "Inventory → Products (isi field Barcode)",
      "Settings → Barcode",
    ],
    newSettings: [
      "Settings → Barcode → Barcode Scanner / Operations",
      "Settings → Inventory → Barcode (tautan terkait)",
      "Settings → Barcode → Print / Labels (jika printer label)",
      "Configuration → Operation Types → Barcode options",
    ],
  },
  configurations: [
    {
      id: "bc-scanner",
      name: "Barcode Scanner / Camera",
      location: "Settings → Barcode → Barcode Scanner",
      what: "Mengaktifkan input scan (kamera perangkat atau keyboard-wedge scanner) di app Barcode.",
      whyEnable:
        "Tanpa scanner/kamera, operator kembali mengetik — tujuan mobile ops hilang.",
      whenEnable:
        "Tim gudang memakai HP/tablet atau scanner USB di stasiun receipt.",
      whenNot:
        "Lab murni desktop tanpa kamera — tetap bisa ketik barcode manual untuk latihan.",
      businessExample: `Operator menerima ${kopi.name} di dock: buka Barcode → Receipts → scan ${barcodes.kopi}.`,
      impact:
        "Tombol scan / fokus fokus input barcode aktif di setiap operasi.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-settings-barcode.png",
        caption: "Settings Barcode — opsi scanner & operasi di Odoo 19 Enterprise",
        whatYouSee: "Halaman Settings terkait Barcode",
        why: "Konfigurasi sebelum latihan scan di lantai gudang",
      },
    },
    {
      id: "bc-ops-menu",
      name: "Barcode Main Menu Operations",
      location: "Barcode app → Main Menu (tile operasi)",
      what: "Tile pintasan ke Receipts, Deliveries, Internal Transfers, Adjustments, dll.",
      whyEnable:
        "Operator memilih jenis operasi dalam 1 ketukan tanpa navigasi menu Inventory panjang.",
      whenEnable:
        "Selalu — ini pintu masuk default app Barcode setelah install.",
      whenNot:
        "Tidak relevan menonaktifkan; yang diatur adalah operation types mana yang tampil.",
      businessExample: `Pagi: tile Receipts untuk PO ${vendor.name}; siang: Deliveries untuk SO ${customer.name}.`,
      impact:
        "Workload harian digiring lewat tile; Overview Inventory tetap untuk supervisor.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-barcode.png",
        caption: "Barcode main menu — tile operasi gudang",
        whatYouSee: "Menu utama aplikasi Barcode dengan pintasan operasi",
        why: "Titik awal semua alur scan Barcode",
      },
    },
    {
      id: "bc-product-unique",
      name: "Unique Product Barcodes",
      location: "Inventory → Products → field Barcode (+ constraint unik)",
      what: "Setiap produk/varian punya kode barcode unik yang bisa di-resolve saat scan.",
      whyEnable:
        "Scan yang ambigu (dua produk satu kode) membuat qty masuk ke SKU salah.",
      whenEnable:
        "Sebelum go-live mobile ops; wajib untuk semua storable aktif.",
      whenNot:
        "Produk jasa (${seed.products.jasa.name}) biasanya tanpa barcode stok.",
      businessExample: `${kopi.name}=${barcodes.kopi}; ${teh.name}=${barcodes.teh}; ${dus.name}=${barcodes.dus}.`,
      impact:
        "Scan langsung menambah line/qty di picking aktif; error jika kode tidak dikenal.",
      screenshot: {
        src: "/screenshots/odoo19e/07-products-list.png",
        caption: "Daftar Products — siapkan barcode per SKU sebelum scan",
        whatYouSee: "List produk Inventory/Sales",
        whatToFill: `Barcode ${barcodes.kopi} pada ${kopi.name}`,
      },
    },
    {
      id: "bc-location-barcodes",
      name: "Location Barcodes",
      location: "Inventory → Configuration → Locations → Barcode",
      what: "Kode scan untuk lokasi (WH/Stock, zona pack) agar putaway/internal transfer akurat.",
      whyEnable:
        "Transfer internal multi-lokasi tanpa ketik nama lokasi panjang.",
      whenEnable:
        "Storage Locations aktif dan ada zona fisik terpisah.",
      whenNot:
        "Gudang one-location (hanya WH/Stock) — cukup scan produk.",
      businessExample: `Scan ${barcodes.locationStock} lalu ${barcodes.dus} saat pindah ke zona pack ${barcodes.locationPack}.`,
      impact:
        "Alur scan: lokasi → produk → qty; mengurangi salah rak.",
    },
    {
      id: "bc-qty-behavior",
      name: "Quantity Increment on Scan",
      location: "Settings → Barcode → Operations (scan increments qty)",
      what: "Setiap scan produk yang sama menambah Quantity Done (+1 atau +packaging).",
      whyEnable:
        "Mencerminkan gerakan fisik scan-per-unit atau scan-per-pack di lantai.",
      whenEnable:
        "Receipt/delivery unit-by-unit atau per dus ber-barcode packaging.",
      whenNot:
        "Qty besar diketik sekali (mis. 100 sak) — pakai input qty manual setelah scan pertama.",
      businessExample: `Scan ${barcodes.kopi} sebanyak ${seed.po.kopiQty} kali, atau scan sekali lalu ketik Done=${seed.po.kopiQty}.`,
      impact:
        "Kecepatan vs akurasi: salah scan = over-receive; pantau progress line.",
    },
    {
      id: "bc-show-quantity",
      name: "Show Quantity to Process",
      location: "Settings → Barcode / Operation Type options",
      what: "Menampilkan demand vs done di layar scan agar operator tahu sisa.",
      whyEnable:
        "Mencegah over-scan melebihi demand PO/SO.",
      whenEnable:
        "Selalu untuk receipt & delivery berdokumen.",
      whenNot:
        "Adjustment bebas tanpa demand — UI berbeda.",
      businessExample: `Delivery ${customer.name}: demand ${kopi.name} ${seed.so.kopiQty} — layar menunjukkan sisa hingga Validate.`,
      impact:
        "Progress bar/line jelas; Validate baru aman saat done ≥ demand (atau backorder).",
      screenshot: {
        src: "/screenshots/odoo19e/w3-barcode-ops.png",
        caption: "Layar operasi Barcode — progress qty saat scan",
        whatYouSee: "UI operasi scan receipt/delivery/internal",
        why: "Operator melihat sisa demand sambil scan",
      },
    },
    {
      id: "bc-vs-classic",
      name: "Barcode App vs Classic Inventory UI",
      location: "Perbandingan: Barcode app ↔ Inventory → Overview/Transfers",
      what: "Dua UI untuk dokumen stok yang sama; Barcode = mobile scan, Inventory = form penuh.",
      whyEnable:
        "Supervisor tetap pakai Overview; operator lantai pakai Barcode — tidak dobel proses.",
      whenEnable:
        "Pisahkan peran: scan di Barcode, exception/backorder kompleks di Inventory klasik.",
      whenNot:
        "Jangan Validate dua kali di kedua UI untuk picking yang sama.",
      businessExample: `Receipt PO ${vendor.name} di-scan via Barcode; supervisor cek tile Receipts di Inventory Overview.`,
      impact:
        "Satu truth: stock.picking Done; dual UI hanya saluran eksekusi.",
      screenshot: {
        src: "/screenshots/odoo19e/06-inventory-overview.png",
        caption: "Inventory Overview klasik — pantauan supervisor setelah scan Barcode",
        whatYouSee: "Tile Receipts/Deliveries di Inventory",
        why: "Membuktikan hasil scan mobile masuk ke operasi stok yang sama",
      },
    },
  ],
  masterData: [
    {
      id: "md-product-barcode",
      name: "Product Barcode (product.product / template)",
      purpose: "Kode yang di-scan untuk mengidentifikasi SKU di operasi Barcode.",
      required: true,
      whyNeeded:
        "Tanpa barcode unik, app Barcode tidak bisa menambahkan qty ke line yang benar.",
      fields: [
        {
          field: "Name",
          type: "Char",
          required: true,
          purpose: "Nama produk",
          why: "Konfirmasi visual setelah scan",
          example: kopi.name,
          impactIfEmpty: "Produk invalid",
        },
        {
          field: "Barcode",
          type: "Char",
          required: true,
          purpose: "Kode EAN/internal unik",
          why: "Resolusi scan → product.product",
          example: barcodes.kopi,
          impactIfEmpty: "Scan gagal / 'Barcode not found'",
        },
        {
          field: "Product Type",
          type: "Selection",
          required: true,
          purpose: "Goods Storable",
          why: "Hanya storable yang punya picking stok",
          example: kopi.type,
          impactIfEmpty: "Tidak muncul di operasi gudang",
        },
        {
          field: "Unit of Measure",
          type: "Many2one",
          required: true,
          purpose: "Satuan qty Done",
          why: "Setiap scan +1 UoM dasar (kecuali packaging)",
          example: kopi.uom,
          impactIfEmpty: "Default Units; risiko salah satuan",
          related: "uom.uom",
        },
        {
          field: "Packaging Barcode",
          type: "Char (product.packaging)",
          required: false,
          purpose: "Barcode dus/pack",
          why: "Scan kemasan menambah qty konversi",
          example: "PACK-KOPI-12",
          impactIfEmpty: "Hanya scan unit dasar",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/07-products-list.png",
        caption: "Products list — master SKU sebelum diisi barcode",
        whatYouSee: "Daftar produk termasuk kopi/teh/dus",
        whatToFill: "Buka form → tab General → Barcode",
      },
    },
    {
      id: "md-demo-sheet",
      name: "Demo Data Sheet — Barcode Latihan",
      purpose:
        "Lembar referensi kode agar seluruh peserta lab scan nilai yang sama.",
      required: true,
      whyNeeded:
        "Tanpa sheet bersama, tiap orang membuat barcode berbeda dan prosedur seed tidak reproducible.",
      fields: [
        {
          field: "SKU / Produk",
          type: "Char",
          required: true,
          purpose: "Identitas item seed",
          why: "Cocokkan dengan Products",
          example: `${kopi.name} | ${teh.name} | ${dus.name}`,
          impactIfEmpty: "Sheet tidak berguna",
        },
        {
          field: "Barcode Value",
          type: "Char",
          required: true,
          purpose: "Nilai yang di-print/ketik/scan",
          why: "Input ke field Barcode produk",
          example: `${barcodes.kopi} / ${barcodes.teh} / ${barcodes.dus}`,
          impactIfEmpty: "Tidak ada target scan",
        },
        {
          field: "Dokumen Latihan",
          type: "Char",
          required: false,
          purpose: "PO/SO/picking terkait",
          why: "Operator tahu picking mana yang di-scan",
          example: `PO ${vendor.name}; SO ${customer.name}`,
          impactIfEmpty: "Harus cari picking manual",
        },
        {
          field: "Lokasi (opsional)",
          type: "Char",
          required: false,
          purpose: "Barcode lokasi",
          why: "Latihan internal transfer",
          example: `${barcodes.locationStock} → ${barcodes.locationPack}`,
          impactIfEmpty: "Skip scan lokasi",
        },
        {
          field: "Qty Target",
          type: "Float",
          required: false,
          purpose: "Demand yang harus tercapai",
          why: "Stop scan saat Done = demand",
          example: `Receipt kopi ${seed.po.kopiQty}; Delivery kopi ${seed.so.kopiQty}`,
          impactIfEmpty: "Risiko over/under scan",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-barcode.png",
        caption: "Setelah isi demo sheet — buka Barcode main menu untuk latihan",
      },
    },
    {
      id: "md-picking-for-scan",
      name: "Transfer siap scan (stock.picking)",
      purpose: "Dokumen receipt/delivery/internal yang akan diproses lewat Barcode.",
      required: true,
      whyNeeded:
        "App Barcode mengoperasikan picking yang sudah ada (dari PO/SO/manual), bukan membuat PO.",
      fields: [
        {
          field: "Operation Type",
          type: "Many2one",
          required: true,
          purpose: "Receipts / Delivery / Internal",
          why: "Menentukan tile menu Barcode",
          example: "Receipts",
          impactIfEmpty: "Picking tidak masuk tile",
          related: "stock.picking.type",
        },
        {
          field: "Source Document",
          type: "Char",
          required: false,
          purpose: "Origin PO/SO",
          why: "Cari picking dari nomor dokumen",
          example: "P00001 / S00001",
          impactIfEmpty: "Cari lewat partner/tanggal",
        },
        {
          field: "Contact",
          type: "Many2one",
          required: false,
          purpose: "Vendor/Customer",
          why: "Filter receiving/shipping",
          example: `${vendor.name} / ${customer.name}`,
          impactIfEmpty: "Kurang konteks di list",
          related: "res.partner",
        },
        {
          field: "Status",
          type: "Selection",
          required: true,
          purpose: "Ready / Waiting",
          why: "Hanya picking terbuka yang di-scan",
          example: "Ready",
          impactIfEmpty: "Tidak muncul di antrian Barcode",
        },
        {
          field: "Operations lines",
          type: "One2many",
          required: true,
          purpose: "Produk + demand",
          why: "Target qty untuk scan",
          example: `${kopi.name} × ${seed.po.kopiQty}`,
          impactIfEmpty: "Tidak ada yang di-scan",
          related: "stock.move",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/13-inventory-receipts.png",
        caption: "Receipts klasik — picking yang sama bisa dibuka dari Barcode",
        whatYouSee: "List/form receipt Inventory",
        why: "Bridge antara dokumen PO dan operasi scan",
      },
    },
  ],
  dependencies: {
    nodes: [
      { id: "products", label: "Products + Barcode" },
      { id: "inventory", label: "Inventory / Picking" },
      { id: "barcode", label: "Barcode App" },
      { id: "purchase", label: "Purchase (IN)" },
      { id: "sales", label: "Sales (OUT)" },
      { id: "device", label: "Scanner / Camera" },
    ],
    edges: [
      {
        from: "products",
        to: "barcode",
        why: "Field barcode produk dipakai untuk resolusi scan",
      },
      {
        from: "purchase",
        to: "inventory",
        why: "Confirm PO membuat receipt picking",
      },
      {
        from: "sales",
        to: "inventory",
        why: "Confirm SO membuat delivery picking",
      },
      {
        from: "inventory",
        to: "barcode",
        why: "Barcode mengonsumsi picking & move yang sama",
      },
      {
        from: "device",
        to: "barcode",
        why: "Input fisik scan masuk ke UI Barcode",
      },
      {
        from: "barcode",
        to: "inventory",
        why: "Validate scan mengubah quant On Hand seperti Validate klasik",
      },
    ],
    summary:
      "Barcode adalah lapisan UX di atas Inventory: produk ber-barcode + picking dari Purchase/Sales + perangkat scan → Validate yang sama dengan form Transfers klasik.",
  },
  forms: [
    {
      id: "form-bc-main",
      name: "Barcode Main Menu",
      menuPath: "Home → Barcode",
      fields: [
        {
          field: "Operations tiles",
          required: true,
          purpose: "Pilih jenis operasi",
          why: "Membuka antrian picking terkait",
          example: "Receipts / Deliveries / Internal Transfers",
        },
        {
          field: "Scan anything / Search",
          required: false,
          purpose: "Scan dokumen atau produk dari menu",
          why: "Shortcut langsung ke picking/produk",
          example: "Scan nomor picking WH/IN/…",
        },
        {
          field: "Applications / Inventory link",
          required: false,
          purpose: "Kembali ke Inventory klasik",
          why: "Exception handling di form penuh",
          example: "Buka Inventory Overview",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-barcode.png",
        caption: "Form/menu utama Barcode Odoo 19 Enterprise",
        whatYouSee: "Tile operasi Barcode",
        whatToFill: "Tidak ada field master — pilih tile Receipts untuk mulai",
      },
    },
    {
      id: "form-bc-ops",
      name: "Barcode Operation Screen (scan lines)",
      menuPath: "Barcode → Receipts / Deliveries / Internal → pilih picking",
      fields: [
        {
          field: "Picking / Document",
          required: true,
          purpose: "Transfer yang diproses",
          why: "Konteks demand lines",
          example: `Receipt dari ${vendor.name}`,
        },
        {
          field: "Scan Product Barcode",
          required: true,
          purpose: "Input scan SKU",
          why: "Menambah qty Done pada move line",
          example: barcodes.kopi,
        },
        {
          field: "Quantity Done",
          required: true,
          purpose: "Qty aktual ter-scan",
          why: "Dasar Validate & backorder",
          example: seed.po.kopiQty,
        },
        {
          field: "Demand / To Process",
          required: false,
          purpose: "Target dari PO/SO",
          why: "Kontrol over-scan",
          example: seed.po.kopiQty,
        },
        {
          field: "Location scan",
          required: false,
          purpose: "Lokasi source/dest",
          why: "Internal transfer & putaway",
          example: barcodes.locationStock,
        },
        {
          field: "Validate",
          required: true,
          purpose: "Selesaikan picking",
          why: "Posting move ke quant",
          example: "Validate setelah semua line lengkap",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-barcode-ops.png",
        caption: "Layar operasi scan Barcode — lines & progress",
        whatYouSee: "UI scan produk dan qty pada operasi gudang",
        whatToFill: `Scan ${barcodes.kopi} hingga Done=${seed.po.kopiQty}`,
      },
    },
    {
      id: "form-product-barcode-field",
      name: "Product Form — field Barcode",
      menuPath: "Inventory → Products → Products → [produk] → General",
      fields: [
        {
          field: "Barcode",
          required: true,
          purpose: "Kode unik scan",
          why: "Wajib sebelum mobile ops",
          example: barcodes.kopi,
        },
        {
          field: "Name",
          required: true,
          purpose: "Label setelah scan",
          why: "Operator konfirmasi SKU di layar",
          example: kopi.name,
        },
        {
          field: "Internal Reference",
          required: false,
          purpose: "Kode internal alternatif",
          why: "Kadang dipakai jika barcode kosong (bergantung config)",
          example: "KA-1KG",
        },
        {
          field: "Inventory → Operations",
          required: false,
          purpose: "Routes / tracking",
          why: "Lot/serial menambah langkah scan",
          example: "By Lots (opsional)",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/07-products-list.png",
        caption: "Masuk dari Products list untuk mengisi barcode seed",
      },
    },
  ],
  procedures: [
    {
      id: "proc-bc-prepare-barcodes",
      title: "Menyiapkan barcode produk (demo sheet)",
      goal: `Semua SKU seed punya barcode unik siap scan: ${kopi.name}, ${teh.name}, ${dus.name}.`,
      preparation: [
        "Inventory & Barcode terpasang",
        "Login Inventory Manager / Admin",
        "Cetak atau catat lembar demo barcode",
      ],
      steps: [
        "Inventory → Products → Products",
        `Buka ${kopi.name} → isi Barcode: ${barcodes.kopi} → Save`,
        `Buka ${teh.name} → isi Barcode: ${barcodes.teh} → Save`,
        `Buka ${dus.name} → isi Barcode: ${barcodes.dus} → Save`,
        "Pastikan tidak ada duplikat (error uniqueness)",
        "Simpan lembar demo untuk operator lantai",
      ],
      expectedResult: "Setiap produk seed punya barcode; siap dipakai di app Barcode.",
      verification: [
        "Search barcode di Products menemukan satu produk",
        "Tidak ada warning duplicate barcode",
        "Sheet demo cocok dengan nilai di form",
      ],
      fillFields: [
        {
          field: "Barcode",
          value: barcodes.kopi,
          where: `Product ${kopi.name}`,
          how: "Ketik",
          required: true,
        },
        {
          field: "Barcode",
          value: barcodes.teh,
          where: `Product ${teh.name}`,
          how: "Ketik",
          required: true,
        },
        {
          field: "Barcode",
          value: barcodes.dus,
          where: `Product ${dus.name}`,
          how: "Ketik",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/07-products-list.png",
        caption: "Products — titik masuk mengisi barcode demo sheet",
      },
    },
    {
      id: "proc-bc-main-menu",
      title: "Mengenal Barcode main menu",
      goal: "Operator paham tile operasi dan bedanya dengan Inventory Overview.",
      preparation: [
        "App Barcode terpasang",
        "Minimal satu picking open (opsional untuk eksplorasi menu)",
      ],
      steps: [
        "Home → Barcode",
        "Amati tile: Receipts, Deliveries, Internal Transfers, dll.",
        "Bandingkan dengan Home → Inventory → Overview (tile klasik)",
        "Catat: Barcode = eksekusi scan; Overview = monitoring antrian",
        "Kembali ke Barcode main menu sebagai home operator mobile",
      ],
      expectedResult: "Operator memilih kanal yang benar: scan di Barcode, pantau di Inventory.",
      verification: [
        "Menu Barcode terbuka tanpa error",
        "Tile operasi terlihat",
        "Inventory Overview tetap bisa dibuka paralel (supervisor)",
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-barcode.png",
        caption: "Barcode main menu — home operator mobile",
        whatYouSee: "Tile operasi aplikasi Barcode",
        why: "Orientasi pertama sebelum scan receipt",
      },
    },
    {
      id: "proc-bc-scan-receipt",
      title: `Scan Receipt PO ${vendor.name}`,
      goal: `Menerima ${kopi.name} × ${seed.po.kopiQty} dan ${teh.name} × ${seed.po.tehQty} via Barcode.`,
      preparation: [
        "PO confirmed; receipt Ready/Waiting",
        "Barcode produk sudah diisi (demo sheet)",
        "Login Inventory User di perangkat scan",
      ],
      steps: [
        "Home → Barcode → Receipts",
        `Pilih picking dari ${vendor.name} (origin PO)`,
        `Scan atau ketik ${barcodes.kopi} hingga Done = ${seed.po.kopiQty}`,
        `Scan ${barcodes.teh} hingga Done = ${seed.po.tehQty}`,
        "Periksa progress line lengkap",
        "Validate",
        "Opsional: buka Inventory → Overview / Receipts — status Done",
      ],
      expectedResult: "Picking incoming Done; On Hand naik; sama seperti Validate di form klasik.",
      verification: [
        `Products → ${kopi.name}: On Hand bertambah ${seed.po.kopiQty}`,
        "Receipt tidak tersisa di antrian Barcode",
        "Inventory → Transfers filter Done menampilkan dokumen",
      ],
      fillFields: [
        {
          field: "Product barcode (kopi)",
          value: barcodes.kopi,
          where: "Barcode operation screen",
          how: "Scan/ketik berulang atau + qty",
          required: true,
          note: `Target Done ${seed.po.kopiQty}`,
        },
        {
          field: "Product barcode (teh)",
          value: barcodes.teh,
          where: "Barcode operation screen",
          how: "Scan/ketik",
          required: true,
          note: `Target Done ${seed.po.tehQty}`,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-barcode-ops.png",
        caption: "Operasi scan receipt di Barcode",
        whatYouSee: "Layar scan lines receipt",
        expectedResult: "Done mencapai demand lalu Validate",
      },
    },
    {
      id: "proc-bc-scan-delivery",
      title: `Scan Delivery SO ${customer.name}`,
      goal: `Mengirim ${kopi.name} × ${seed.so.kopiQty} lewat Barcode Deliveries.`,
      preparation: [
        `On Hand ${kopi.name} ≥ ${seed.so.kopiQty} (receipt sebelumnya selesai)`,
        "SO confirmed; delivery Ready",
        "Barcode produk aktif",
      ],
      steps: [
        "Barcode → Deliveries",
        `Buka picking outgoing ${customer.name}`,
        "Check availability jika masih Waiting",
        `Scan ${barcodes.kopi} hingga Done = ${seed.so.kopiQty}`,
        "Validate",
        "Konfirmasi di Inventory Overview bahwa Delivery Orders berkurang",
      ],
      expectedResult: "Outgoing Done; On Hand turun; qty_delivered SO terisi.",
      verification: [
        "Delivery picking Done",
        `On Hand ${kopi.name} turun ${seed.so.kopiQty}`,
        "Tidak ada line ter-scan ke produk lain",
      ],
      fillFields: [
        {
          field: "Product barcode",
          value: barcodes.kopi,
          where: "Barcode Deliveries screen",
          how: "Scan/ketik",
          required: true,
        },
        {
          field: "Quantity Done",
          value: seed.so.kopiQty,
          where: "Line operations",
          how: "Akumulasi scan atau ketik",
          required: true,
        },
        {
          field: "Customer",
          value: customer.name,
          where: "Header picking",
          how: "Otomatis dari SO",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/06-inventory-overview.png",
        caption: "Setelah scan delivery — verifikasi di Inventory Overview",
        whatYouSee: "Tile Delivery Orders",
        why: "Membuktikan mobile ops menulis ke dokumen klasik",
      },
    },
    {
      id: "proc-bc-internal",
      title: "Scan Internal Transfer kemasan",
      goal: `Memindahkan ${dus.name} antar lokasi dengan scan lokasi + produk.`,
      preparation: [
        "Storage Locations aktif (jika multi-lokasi)",
        `Stok ${dus.name} ada di WH/Stock`,
        `Barcode lokasi ${barcodes.locationStock} / ${barcodes.locationPack} (atau nama lokasi)`,
        `Barcode produk ${barcodes.dus}`,
      ],
      steps: [
        "Barcode → Internal Transfers",
        "Buat atau pilih internal picking",
        `Scan lokasi sumber ${barcodes.locationStock}`,
        `Scan ${barcodes.dus} dan set qty (mis. 10)`,
        `Scan lokasi tujuan ${barcodes.locationPack}`,
        "Validate",
        "Cek quant: total On Hand sama, lokasi berubah",
      ],
      expectedResult: "Transfer internal Done; zona pack menerima dus.",
      verification: [
        "Source ≠ Destination",
        `Quant ${dus.name} di lokasi tujuan bertambah`,
        "Tidak ada perubahan total qty perusahaan",
      ],
      fillFields: [
        {
          field: "Product barcode",
          value: barcodes.dus,
          where: "Internal transfer scan",
          how: "Scan",
          required: true,
        },
        {
          field: "Quantity",
          value: "10",
          where: "Line",
          how: "Ketik/scan",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-barcode-ops.png",
        caption: "Scan internal transfer di layar operasi Barcode",
      },
    },
    {
      id: "proc-bc-vs-classic",
      title: "Bandingkan mobile Barcode vs Inventory klasik",
      goal: "Memahami kapan pakai scan mobile dan kapan buka form Inventory.",
      preparation: [
        "Satu receipt masih draft/Ready untuk eksperimen (atau gunakan database lab)",
        "Akses Barcode + Inventory",
      ],
      steps: [
        "Buka picking yang sama di Inventory → Operations → Transfers (form klasik)",
        "Catat field: Operation Type, locations, lines, Validate",
        "Buka picking yang sama dari Barcode → Receipts (UI scan)",
        "Catat perbedaan: fokus scan + qty, lebih sedikit field administratif",
        "Selesaikan HANYA di satu UI (hindari double validate)",
        "Gunakan Inventory klasik untuk: edit lokasi massal, split, unlock, catatan backorder rumit",
        "Gunakan Barcode untuk: eksekusi cepat di lantai",
      ],
      expectedResult: "SOP peran jelas: operator scan di Barcode; exception di Inventory.",
      verification: [
        "Satu picking hanya divalidasi sekali",
        "On Hand konsisten",
        "Tim paham kedua pintu masuk",
      ],
      screenshot: {
        src: "/screenshots/odoo19e/13-inventory-receipts.png",
        caption: "Receipt form klasik — saluran exception & audit detail",
        whatYouSee: "Form/list Inventory Receipts",
        why: "Pasangan perbandingan terhadap w3-barcode-ops.png",
      },
    },
  ],
  scenarios: [
    {
      id: "sc-bc-inbound-day",
      title: "Hari receiving penuh scan",
      whenToUse: `Vendor ${vendor.name} dan ${vendorKemasan.name} kirim di hari yang sama.`,
      flow: [
        "Siapkan demo sheet barcode",
        "Barcode → Receipts — kerjakan antrian berurutan",
        "Validate tiap picking setelah line lengkap",
        "Supervisor cek Inventory Overview akhir shift",
      ],
      notes: "Jangan campur qty antar picking; selalu pastikan dokumen aktif benar.",
    },
    {
      id: "sc-bc-ship-retail",
      title: "Shipping retail dengan scan",
      whenToUse: `SO ${customer.name} Ready dan stok sudah di WH/Stock.`,
      flow: [
        "Barcode → Deliveries",
        `Scan ${barcodes.kopi} sampai ${seed.so.kopiQty}`,
        "Validate",
        "Sales melihat qty delivered",
      ],
    },
    {
      id: "sc-bc-internal-pack",
      title: "Pindah ke zona packing",
      whenToUse: "Sebelum gelombang delivery distributor.",
      flow: [
        "Internal Transfer via Barcode",
        `Pindahkan ${dus.name} + ${kopi.name} ke lokasi pack`,
        "Delivery scan dari lokasi pack (jika source location diset)",
      ],
      notes: `Distributor ${distributor.name} sering butuh packing lebih rapi dari retail.`,
    },
    {
      id: "sc-bc-partial-backorder",
      title: "Receipt parsial + sisa nanti",
      whenToUse: "Vendor kirim kurang dari PO.",
      flow: [
        "Scan qty aktual < demand",
        "Validate → Create Backorder",
        "Sisa muncul lagi di Barcode Receipts",
        "Scan pelunasan keesokan hari",
      ],
    },
    {
      id: "sc-bc-mobile-vs-desk",
      title: "Hybrid: lantai scan, kantor klasik",
      whenToUse: "Ada exception lot/serial atau salah lokasi.",
      flow: [
        "Operator hentikan scan",
        "Supervisor buka picking di Inventory Transfers",
        "Koreksi line/lokasi/lot",
        "Operator lanjutkan sisa scan di Barcode atau Validate di klasik",
      ],
    },
  ],
  integrations: [
    {
      id: "int-bc-inventory",
      withModule: "Inventory",
      relationship: "UI alternatif untuk stock.picking",
      whatHappens:
        "Setiap Validate di Barcode menjalankan logika picking yang sama; Overview & Reporting Inventory langsung mencerminkan hasil.",
    },
    {
      id: "int-bc-purchase",
      withModule: "Purchase",
      relationship: "Receipt dari PO",
      whatHappens:
        `PO ${vendor.name} confirmed → incoming picking → di-scan di Barcode Receipts → qty_received PO terisi.`,
    },
    {
      id: "int-bc-sales",
      withModule: "Sales",
      relationship: "Delivery dari SO",
      whatHappens:
        `SO ${customer.name} confirmed → outgoing picking → Barcode Deliveries → qty_delivered terisi setelah Validate.`,
    },
    {
      id: "int-bc-products",
      withModule: "Products / Inventory master",
      relationship: "product.barcode & packaging",
      whatHappens:
        "Scan menyelesaikan produk; packaging barcode mengonversi qty ke UoM dasar.",
    },
    {
      id: "int-bc-quality",
      withModule: "Quality (opsional)",
      relationship: "Quality checks pada picking",
      whatHappens:
        "Jika Quality aktif, scan receipt bisa memicu check sebelum putaway selesai.",
    },
  ],
  mistakes: [
    {
      id: "m-bc-no-barcode",
      problem: "Produk belum punya barcode lalu dipaksa scan",
      why: "Operasi macet; operator menebak SKU",
      detect: "Pesan barcode not found; line tidak bertambah",
      fix: "Isi field Barcode dari demo sheet, ulang scan",
      prevent: "Checklist master data sebelum shift receiving",
    },
    {
      id: "m-bc-duplicate-code",
      problem: "Dua produk memakai barcode sama",
      why: "Qty masuk ke produk salah secara diam-diam atau error constraint",
      detect: "Save produk gagal / scan menunjuk SKU tidak terduga",
      fix: "Pisahkan kode; koreksi move jika sudah Validate",
      prevent: "Policy uniqueness + audit barcode bulanan",
    },
    {
      id: "m-bc-wrong-picking",
      problem: "Scan di picking dokumen yang salah",
      why: "Receipt vendor A masuk ke PO vendor B",
      detect: "Origin/partner di header tidak cocok fisik",
      fix: "Cancel/unlock jika memungkinkan; buat koreksi transfer",
      prevent: "Scan nomor picking / verifikasi partner sebelum scan SKU",
    },
    {
      id: "m-bc-double-validate",
      problem: "Validate di Barcode lalu Validate lagi di Inventory",
      why: " verw bingung; risiko backorder kosong / error state",
      detect: "User claim 'sudah validate dua kali'",
      fix: "Cek state picking — jika Done, jangan ulangi; koreksi via return/adjustment",
      prevent: "SOP satu saluran validate per dokumen",
    },
    {
      id: "m-bc-overscan",
      problem: "Scan melebihi demand tanpa sadar",
      why: "Over-receive/over-deliver; stok & invoice tidak selaras",
      detect: "Done > Demand di line",
      fix: "Kurangi qty sebelum Validate atau return setelahnya",
      prevent: "Aktifkan tampilan sisa qty; hentikan saat progress 100%",
    },
    {
      id: "m-bc-ignore-classic",
      problem: "Memaksa semua exception hanya di HP",
      why: "Lot, split, unlock sulit di layar sempit → data kotor",
      detect: "Operator stuck; picking lama di Ready",
      fix: "Eskalasi ke Inventory klasik + Manager",
      prevent: "Scenario hybrid mobile vs desk dalam training",
    },
  ],
  troubleshooting: [
    {
      id: "t-bc-not-found",
      problem: "Barcode not found saat scan",
      causes: [
        "Field Barcode produk kosong",
        "Salah ketik / rusak label",
        "Scan packaging yang belum dikonfigurasi",
        "Produk di company lain (multi-company)",
      ],
      diagnosis: [
        "Inventory → Products → cari nama → cek Barcode",
        "Coba ketik kode manual dari demo sheet",
        "Cek company di pojok kanan",
      ],
      solution: [
        "Isi/perbaiki barcode",
        "Tambahkan packaging barcode jika label dus",
        "Ganti ke company yang benar",
      ],
      prevention: "Demo sheet + print label dari Odoo setelah master data final",
    },
    {
      id: "t-bc-empty-receipts",
      problem: "Tile Receipts kosong padahal ada PO",
      causes: [
        "PO belum Confirm",
        "Picking sudah Done",
        "Filter user/warehouse",
        "Receipt multi-step masih di operasi lain",
      ],
      diagnosis: [
        "Inventory → Transfers — filter Incoming",
        "Cek status PO receiving",
        "Cek Overview klasik",
      ],
      solution: [
        "Confirm PO",
        "Pilih operation type yang benar",
        "Clear filter di Barcode",
      ],
      prevention: "Pahami bahwa Barcode hanya menampilkan picking terbuka",
    },
    {
      id: "t-bc-camera",
      problem: "Kamera/scanner tidak merespons di browser",
      causes: [
        "Izin kamera browser ditolak",
        "HTTPS/permission perangkat",
        "Scanner keyboard buffer fokus di field lain",
      ],
      diagnosis: [
        "Cek permission site kamera",
        "Uji ketik barcode manual di input",
        "Fokuskan kursor ke kotak scan",
      ],
      solution: [
        "Izinkan kamera",
        "Pakai scanner HID + fokus field",
        "Latihan lab dengan ketik manual jika kamera tidak ada",
      ],
      prevention: "Checklist perangkat sebelum shift; sediakan mode ketik cadangan",
    },
    {
      id: "t-bc-cannot-validate",
      problem: "Tidak bisa Validate di Barcode",
      causes: [
        "Qty Done masih 0",
        "Lot/serial wajib belum di-scan",
        "Hak akses kurang",
        "Picking Waiting Availability (delivery)",
      ],
      diagnosis: [
        "Cek progress tiap line",
        "Cek tracking di produk",
        "Cek group Inventory User",
      ],
      solution: [
        "Lengkapi scan / isi lot",
        "Check availability / selesaikan receipt dulu",
        "Minta hak akses",
      ],
      prevention: "Briefing tracking & availability sebelum go-live mobile",
    },
    {
      id: "t-bc-qty-mismatch",
      problem: "On Hand tidak berubah setelah klaim Validate",
      causes: [
        "Validate belum sukses (masih draft)",
        "Melihat produk/lokasi salah",
        "Backorder memecah qty",
      ],
      diagnosis: [
        "Buka picking di Inventory Transfers — state?",
        "Moves History untuk produk",
        "Cek lokasi quant",
      ],
      solution: [
        "Ulangi Validate jika masih Ready",
        "Refresh product form",
        "Gabungkan pemahaman backorder",
      ],
      prevention: "Verifikasi ganda: smart button picking + On Hand",
    },
  ],
  behind: {
    models: [
      "stock.picking",
      "stock.picking.type",
      "stock.move",
      "stock.move.line",
      "stock.quant",
      "product.product",
      "product.template",
      "product.packaging",
      "stock.location",
      "barcode command / barcode nomenclature (Enterprise)",
    ],
    relations: [
      "product.product.barcode → resolusi scan",
      "stock.picking.move_ids → stock.move (demand)",
      "stock.move.line qty_done diisi oleh scan UI",
      "stock.picking.type menentukan tile Barcode",
      "Validate Barcode = stock.picking.button_validate",
    ],
    automations: [
      "scan increment qty_done on matching move line",
      "auto-assign / reservation sebelum delivery scan",
      "backorder wizard jika done < demand saat validate",
      "pembuatan inventory adjustment moves dari scan adjustment (jika dipakai)",
    ],
    securityNotes: [
      "Hak Inventory User cukup untuk scan & validate operasi harian",
      "Settings Barcode & nomenclature biasanya Manager",
      "Perangkat bersama: pakai user gudang terpisah, logout antar shift",
    ],
    note: "Barcode Odoo 19 Enterprise tidak mengganti model stok — ia merapikan input qty_done. Inventory Overview tetap sumber pantauan supervisor; Products tetap master barcode.",
  },
  reporting: [
    {
      name: "Inventory Overview",
      path: "Inventory → Overview",
      kpi: "Antrian Ready/Waiting setelah shift scan",
      decision: "Apakah backlog receiving/shipping masih aman?",
    },
    {
      name: "Transfers / Moves History",
      path: "Inventory → Reporting → Moves History",
      kpi: "Jejak move hasil Validate Barcode",
      decision: "Audit salah scan SKU atau over-receive",
    },
    {
      name: "Stock On Hand",
      path: "Inventory → Reporting → Stock",
      kpi: "Qty per produk/lokasi pasca scan",
      decision: `Apakah ${kopi.name} cukup untuk SO berikutnya?`,
    },
    {
      name: "Product barcode coverage",
      path: "Inventory → Products (filter Barcode kosong)",
      kpi: "% SKU aktif tanpa barcode",
      decision: "Prioritas lengkapi master sebelum perluas mobile ops",
    },
  ],
  security: {
    roles: [
      {
        role: "Inventory / User (Barcode operator)",
        can: [
          "Buka app Barcode",
          "Scan receipt/delivery/internal",
          "Validate picking Ready",
          "Lihat produk & qty terkait operasi",
        ],
        cannot: [
          "Ubah Settings Barcode / nomenclature",
          "Hapus warehouse & operation types",
          "Adjustment besar tanpa kebijakan Manager",
        ],
        whyDifferent:
          "Operator lantai butuh kecepatan eksekusi, bukan mengubah aturan scan global.",
      },
      {
        role: "Inventory / Manager",
        can: [
          "Konfigurasi Settings Barcode",
          "Kelola barcode lokasi & operation types",
          "Unlock / koreksi picking bermasalah di UI klasik",
          "Audit Moves History",
        ],
        cannot: [
          "Mengganti kebijakan akuntansi valuation tanpa Accounting",
        ],
        whyDifferent:
          "Manager menjaga integritas master barcode dan exception path.",
      },
    ],
    notes: [
      "Jangan pakai akun Administrator bersama di HP gudang untuk pekerjaan harian",
      "Pisahkan user receiving vs shipping jika ingin jejak audit lebih jelas",
      "Portal customer/vendor tidak memakai app Barcode internal",
    ],
  },
  levels: {
    beginner: [
      "Isi barcode produk dari demo sheet",
      "Buka Barcode main menu & kenali tile",
      "Scan receipt sederhana sampai Validate",
      "Cek On Hand di Products",
    ],
    intermediate: [
      "Scan delivery SO retail",
      "Internal transfer dengan scan lokasi",
      "Receipt parsial + backorder",
      "Bandingkan hasil di Inventory Overview",
    ],
    advanced: [
      "Packaging barcode & konversi qty",
      "Hybrid exception: Barcode + form klasik",
      "Multi-step receipt dengan scan putaway",
      "Lot/serial scanning pada line",
    ],
    expert: [
      "Desain nomenclature & aturan scan perusahaan",
      "KPI productivity scan (lines/hour, error rate)",
      "Integrasi Quality checks dalam alur scan",
      "Standardisasi label & device fleet gudang",
    ],
  },
  exercises: [
    {
      id: "ex-bc-sheet",
      title: "Terapkan demo data sheet",
      objective: "Semua produk seed ber-barcode unik",
      prerequisites: ["Products seed ada", "Akses edit produk"],
      task: [
        `Set barcode ${kopi.name}=${barcodes.kopi}`,
        `Set ${teh.name}=${barcodes.teh}, ${dus.name}=${barcodes.dus}`,
        "Simpan sheet untuk teman lab",
      ],
      expectedResult: "Search by barcode menemukan tepat satu produk per kode",
      checklist: ["Tidak duplikat", "Nilai tercatat di sheet", "Jasa tidak wajib barcode"],
    },
    {
      id: "ex-bc-receipt",
      title: "Scan receipt penuh",
      objective: "Menyelesaikan incoming PO via Barcode",
      prerequisites: ["PO confirmed", "Barcode produk terisi"],
      task: [
        "Barcode → Receipts",
        `Scan ${kopi.name} & ${teh.name} sampai demand`,
        "Validate",
        "Verifikasi di Inventory Overview",
      ],
      expectedResult: "Picking Done; On Hand naik",
      checklist: ["Partner benar", "Done = demand", "Tidak double validate"],
    },
    {
      id: "ex-bc-delivery",
      title: "Scan delivery retail",
      objective: `Kirim ${seed.so.kopiQty} ${kopi.name} ke ${customer.name}`,
      prerequisites: ["Stok cukup", "SO confirmed"],
      task: [
        "Barcode → Deliveries",
        `Scan ${barcodes.kopi}`,
        "Validate",
        "Cek On Hand turun",
      ],
      expectedResult: "Outgoing Done; SO delivered qty terisi",
      checklist: ["SKU benar", "Qty tepat", "Overview bersih"],
    },
    {
      id: "ex-bc-internal",
      title: "Internal transfer dus",
      objective: `Pindahkan ${dus.name} antar lokasi lewat scan`,
      prerequisites: ["Storage Locations (jika dipakai)", "Stok dus ada"],
      task: [
        "Barcode → Internal Transfers",
        "Scan produk (± lokasi)",
        "Validate",
        "Bandingkan quant per lokasi",
      ],
      expectedResult: "Total On Hand sama; lokasi berubah",
      checklist: ["Source ≠ dest", "Qty konsisten"],
    },
    {
      id: "ex-bc-compare-ui",
      title: "Mobile vs klasik",
      objective: "Menulis SOP singkat kapan pakai Barcode vs Inventory",
      prerequisites: ["Sudah menyelesaikan minimal 1 scan Validate"],
      task: [
        "Buka picking historis di kedua UI",
        "Catat 3 tugas yang lebih cepat di Barcode",
        "Catat 3 tugas yang lebih aman di Inventory klasik",
        "Presentasikan ke supervisor lab",
      ],
      expectedResult: "SOP hybrid satu halaman untuk tim gudang",
      checklist: [
        "Sebut main menu Barcode",
        "Sebut Overview Inventory",
        "Larangan double validate tertulis",
      ],
    },
  ],
  coreFlowLinks: [
    { label: "Deep Dive Inventory", href: "/materi/inventory" },
    { label: "Inventory Overview", href: "/modul/flow-inventory" },
    { label: "Transfers & Adjustments", href: "/modul/flow-inventory/transfers-adjustments" },
    { label: "Flow Purchase", href: "/modul/flow-purchase" },
    { label: "Flow Sales", href: "/modul/flow-sales" },
    { label: "Products", href: "/modul/master-inventory" },
  ],
};
