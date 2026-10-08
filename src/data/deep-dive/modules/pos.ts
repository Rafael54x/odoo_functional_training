import type { DeepDiveModule } from "../types";
import { seed } from "../../seed";

const customer = seed.customers.toko;
const kopi = seed.products.kopi;
const teh = seed.products.teh;
const company = seed.company;

/**
 * Deep Dive — Point of Sale (Wave 3)
 * Shop/config, open session, jual storable di register, payment, close session;
 * dampak Inventory & Accounting.
 */
export const posDeepDive: DeepDiveModule = {
  slug: "pos",
  name: "Point of Sale — Register & Session",
  shortTitle: "POS",
  icon: "MonitorSmartphone",
  category: "crm-sales",
  wave: 3,
  availability: "available",
  apps: ["Point of Sale", "Inventory", "Accounting", "Contacts"],
  overview: {
    function:
      "Modul Point of Sale (POS) mengelola penjualan counter/retail: konfigurasi shop (pos.config), membuka sesi kasir (pos.session), menjual produk di UI register, menerima pembayaran (tunai/kartu/QR), lalu menutup sesi agar jurnal kas dan pengurangan stok terposting. Di Odoo 19 Enterprise, order POS (pos.order) terintegrasi ke Inventory (stock.move) dan Accounting (account.bank.statement / jurnal closing).",
    businessProblem:
      "Tanpa POS, penjualan toko tercatat manual, stok tidak ikut turun real-time, kas harian sulit direkonsiliasi, dan Accounting tidak punya jejak closing session yang auditable.",
    typicalUsers: [
      "Kasir / Cashier",
      "Store Supervisor",
      "Inventory Ops (stok toko)",
      "Finance / Accounting (closing & rekonsiliasi kas)",
    ],
    whenNeeded:
      "Saat ada counter fisik atau pop-up store yang menjual barang storable/consumable dengan pembayaran langsung (cash/card), bukan hanya Sales Order B2B.",
    relatedModules: [
      "Inventory",
      "Accounting",
      "Contacts",
      "Sales (produk & pricelist)",
      "Barcode (opsional)",
    ],
    businessScenario: `${company.name} membuka counter retail di Jakarta. Kasir membuka sesi pada POS Shop "Nusantara Counter", menjual ${kopi.name} (storable, harga ${kopi.salesPrice}) kepada walk-in atau pelanggan ${customer.name}, menerima pembayaran Cash/Bank, lalu Close Session. Closing mengurangi On Hand di WH/Stock dan menghasilkan entri kas/pendapatan di Accounting.`,
  },
  prerequisites: {
    modules: [
      "Point of Sale app terpasang",
      "Inventory (untuk produk storable & stock)",
      "Accounting / Invoicing (journal pembayaran & closing)",
      "Contacts (pelanggan opsional di register)",
    ],
    masterData: [
      `Produk Can be Sold + storable: ${kopi.name}, ${teh.name}`,
      "POS Shop / Config (pos.config) — mis. Nusantara Counter",
      "Payment methods: Cash, Bank/Card",
      "Warehouse/lokasi stok yang dipakai shop",
      `Stok On Hand ${kopi.name} cukup (receipt/adjustment sebelumnya)`,
      `Contact opsional: ${customer.name}`,
    ],
    configuration: [
      "Point of Sale → Configuration → Settings: opsi produk, barcode, tips, dll.",
      "Point of Sale → Configuration → Point of Sale (shop/config)",
      "Point of Sale → Configuration → Payment Methods",
      "Journal kas/bank terhubung payment method",
      "Pricelist IDR (seed: IDR Public Pricelist)",
    ],
    access: [
      "Point of Sale / User: buka register, jual, bayar dalam sesi",
      "Point of Sale / Manager: konfigurasi shop, payment method, close & control",
      "Inventory User: cek stok setelah penjualan",
      "Accounting: review jurnal closing session",
    ],
    relationships:
      "pos.config menentukan shop, payment methods, dan stock location. pos.session dibuka dari config; pos.order dibuat di register; pembayaran memakai pos.payment.method. Close Session memposting ke Accounting dan mengurangi stock via stock.move dari lokasi shop.",
  },
  installation: {
    how: [
      "Home → Apps",
      "Cari 'Point of Sale' atau 'PoS'",
      "Klik Install pada aplikasi Point of Sale",
      "Pastikan menu Point of Sale muncul di App Switcher",
    ],
    dependencies: [
      "Contacts (otomatis)",
      "Inventory / Stock (untuk produk storable)",
      "Accounting journals untuk payment methods",
      "Sales product catalog (product.template Can be Sold)",
    ],
    afterInstall: [
      "Buka Point of Sale → Configuration → Settings, aktifkan opsi yang diperlukan",
      "Buat/sesuaikan POS Shop (Point of Sale config)",
      "Pastikan Payment Methods Cash & Bank aktif dan terhubung journal",
      `Pastikan ${kopi.name} Available in POS / kategori POS terlihat di register`,
    ],
    newMenus: [
      "Point of Sale → Dashboard (daftar shop & Open Register)",
      "Point of Sale → Orders",
      "Point of Sale → Sessions",
      "Point of Sale → Reporting",
      "Point of Sale → Configuration → Settings",
      "Point of Sale → Configuration → Point of Sale",
      "Point of Sale → Configuration → Payment Methods",
      "Point of Sale → Configuration → Bill & Receipt printers (opsional)",
    ],
    newSettings: [
      "Settings → Point of Sale → Restaurant / Barcode / Tips (sesuai edisi)",
      "Settings → Point of Sale → Inventory (update stock, ship later)",
      "Settings → Point of Sale → Payment & Accounting links",
    ],
  },
  configurations: [
    {
      id: "pos-shop-config",
      name: "POS Shop (Point of Sale Config)",
      location: "Point of Sale → Configuration → Point of Sale",
      what: "Master toko/counter: nama shop, warehouse/lokasi, pricelist, payment methods, dan kategori produk yang tampil di register.",
      whyEnable:
        "Setiap counter fisik butuh identitas operasional terpisah agar sesi, kas, dan stok tidak bercampur.",
      whenEnable:
        "Setup awal sebelum kasir pertama kali Open Register; tambah config baru jika ada cabang/counter kedua.",
      whenNot:
        "Jangan buat banyak config kosong — satu shop cukup sampai ada lokasi/kas fisik berbeda.",
      businessExample: `Shop "Nusantara Counter" di ${company.city} memakai WH/Stock, pricelist IDR, payment Cash+Bank, menampilkan kategori ${kopi.category}.`,
      impact:
        "Dashboard menampilkan kartu shop; Open Session/Register memakai setting config ini.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-pos-config.png",
        caption:
          "Konfigurasi Point of Sale (shop) — nama, inventory, dan opsi register",
        whatYouSee: "Form/list pos.config dengan pengaturan shop",
        why: "Semua sesi kasir bergantung pada config shop yang benar",
      },
    },
    {
      id: "pos-payment-methods",
      name: "Payment Methods",
      location: "Point of Sale → Configuration → Payment Methods",
      what: "Metode bayar di register (Cash, Bank/Card, Customer Account) yang terhubung ke journal Accounting.",
      whyEnable:
        "Tanpa payment method, kasir tidak bisa menyelesaikan order; closing tidak punya breakdown kas vs bank.",
      whenEnable:
        "Wajib sebelum Open Session; tambah metode baru jika toko terima QR/EDC tambahan.",
      whenNot:
        "Jangan aktifkan Customer Account (piutang) di counter tunai murni jika SOP melarang kredit walk-in.",
      businessExample: `Cash (journal Cash) untuk walk-in; Bank untuk EDC saat ${customer.name} bayar non-tunai.`,
      impact:
        "Tombol pembayaran di UI POS; laporan session per metode; jurnal closing mengikuti journal method.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-settings-pos-payment.png",
        caption:
          "Settings Point of Sale — konfigurasi terkait payment methods / pembayaran",
        whatYouSee: "Bagian settings POS untuk metode pembayaran",
        why: "Payment methods harus selaras dengan journal sebelum closing",
      },
    },
    {
      id: "pos-available-products",
      name: "Produk Available in POS / Kategori POS",
      location:
        "Product form → PoS tab / Point of Sale → Configuration → Categories; Settings POS",
      what: "Menentukan produk mana yang muncul di grid register (Available in POS + kategori).",
      whyEnable:
        "Kasir hanya melihat SKU retail; produk internal (mis. packaging) tidak mengacaukan UI.",
      whenEnable:
        "Setiap produk yang dijual di counter harus di-flag; kategori mempercepat pencarian.",
      whenNot:
        "Jangan centang Available in POS pada produk non-jual (bahan baku murni) kecuali memang dijual ecer.",
      businessExample: `${kopi.name} dan ${teh.name} Available in POS; ${seed.products.dus.name} tidak perlu muncul di register.`,
      impact:
        "Grid produk di register terfilter; scan/barcode hanya relevan untuk SKU POS.",
      screenshot: {
        src: "/screenshots/odoo19e/07-products-list.png",
        caption: "Daftar produk — pastikan storable Can be Sold siap untuk POS",
        whatYouSee: "Product list termasuk barang storable",
        whatToFill: `${kopi.name}: Can be Sold, Available in POS, harga ${kopi.salesPrice}`,
      },
    },
    {
      id: "pos-inventory-update",
      name: "Update Quantities / Real-time Inventory",
      location: "Settings → Point of Sale → Inventory (atau opsi shop)",
      what: "Mengatur kapan stok berkurang: saat order dibayar di sesi (real-time) vs penjadwalan pengiriman.",
      whyEnable:
        "Counter yang menyerahkan barang langsung butuh On Hand turun agar tidak oversell.",
      whenEnable:
        "Toko menyerahkan ${kopi.name} di tempat (default retail).",
      whenNot:
        "Model 'ship later' / order pickup gudang terpisah — gunakan alur delivery, bukan asumsi stok counter.",
      businessExample: `Setelah bayar 2× ${kopi.name}, On Hand WH/Stock langsung berkurang 2 unit.`,
      impact:
        "stock.move/picking terkait pos.order; Inventory Overview mencerminkan penjualan hari itu.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-settings-pos-payment.png",
        caption: "Settings POS — opsi Inventory yang mempengaruhi update stok",
        whatYouSee: "Bagian konfigurasi Point of Sale di Settings",
      },
    },
    {
      id: "pos-pricelist-taxes",
      name: "Pricelist & Taxes di POS",
      location: "pos.config → Pricelist; Product taxes; Settings POS",
      what: "Harga jual di register mengikuti pricelist shop; pajak penjualan (PPN) mengikuti tax produk/fiscal.",
      whyEnable:
        "Harga counter konsisten dengan daftar harga publik; invoice/receipt pajak benar.",
      whenEnable:
        "Selalu — minimal satu pricelist IDR per shop.",
      whenNot:
        "Jangan campur pricelist distributor di counter retail tanpa SOP diskon eksplisit.",
      businessExample: `Shop memakai IDR Public Pricelist; ${kopi.name} tampil Rp ${kopi.salesPrice} + ${kopi.salesTax}.`,
      impact:
        "Line order memakai price unit & tax; total receipt dan jurnal pendapatan mengikuti.",
    },
    {
      id: "pos-session-control",
      name: "Opening / Closing Control (Cash Control)",
      location: "Settings → Point of Sale → Cash Control / Session",
      what: "Wajib mengisi opening cash dan menghitung closing balance vs expected sebelum tutup sesi.",
      whyEnable:
        "Mencegah selisih kas tidak terdeteksi; supervisor punya jejak difference.",
      whenEnable:
        "Counter yang pegang uang tunai harian.",
      whenNot:
        "POS demo/training tanpa kas fisik — boleh longgarkan, tapi production wajib.",
      businessExample:
        "Opening cash Rp 500.000; setelah penjualan Cash, closing expected vs counted harus match sebelum validate.",
      impact:
        "Wizard opening/closing muncul; difference tercatat di session; Accounting posting memakai angka closing.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-pos-sessions.png",
        caption: "Daftar Sessions POS — status Open/Closed dan kontrol sesi",
        whatYouSee: "List pos.session dengan state sesi kasir",
        why: "Cash control menempel pada siklus open → close session",
      },
    },
  ],
  masterData: [
    {
      id: "md-pos-config",
      name: "POS Shop / Config (pos.config)",
      purpose: "Definisi counter: stok, pembayaran, pricelist, dan UI produk.",
      required: true,
      whyNeeded:
        "Tanpa config, tidak ada Open Register; sesi dan order tidak punya konteks toko.",
      fields: [
        {
          field: "Point of Sale Name",
          type: "Char",
          required: true,
          purpose: "Nama shop di dashboard",
          why: "Kasir memilih counter yang benar",
          example: "Nusantara Counter",
          impactIfEmpty: "Config tidak tersimpan",
        },
        {
          field: "Warehouse / Operation Type",
          type: "Many2one",
          required: true,
          purpose: "Sumber stok penjualan POS",
          why: "Menentukan lokasi pengurangan On Hand",
          example: "WH/Stock",
          impactIfEmpty: "Stok tidak bergerak atau error saat validate",
          related: "stock.warehouse",
        },
        {
          field: "Payment Methods",
          type: "Many2many",
          required: true,
          purpose: "Metode bayar di register",
          why: "Menyelesaikan order & breakdown closing",
          example: "Cash, Bank",
          impactIfEmpty: "Tidak bisa Payment di UI POS",
          related: "pos.payment.method",
        },
        {
          field: "Available Pricelist(s)",
          type: "Many2many",
          required: false,
          purpose: "Harga yang boleh dipakai kasir",
          why: "Konsistensi harga retail",
          example: "IDR Public Pricelist",
          impactIfEmpty: "Pakai pricelist default company",
          related: "product.pricelist",
        },
        {
          field: "Product Categories / Restriction",
          type: "Many2many",
          required: false,
          purpose: "Filter grid produk",
          why: "UI kasir tetap ramping",
          example: kopi.category,
          impactIfEmpty: "Semua produk Available in POS tampil",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-pos-config.png",
        caption: "Master POS Shop (pos.config) untuk counter Nusantara",
      },
    },
    {
      id: "md-pos-payment-method",
      name: "Payment Method (pos.payment.method)",
      purpose: "Cara bayar di register yang terhubung journal Accounting.",
      required: true,
      whyNeeded:
        "Order POS baru selesai setelah pembayaran; closing memposting per metode.",
      fields: [
        {
          field: "Method",
          type: "Char",
          required: true,
          purpose: "Nama tombol bayar",
          why: "Kasir memilih dengan benar",
          example: "Cash",
          impactIfEmpty: "Method invalid",
        },
        {
          field: "Journal",
          type: "Many2one",
          required: false,
          purpose: "Journal kas/bank terkait",
          why: "Posting Accounting saat close",
          example: "Cash / Bank",
          impactIfEmpty: "Closing gagal atau tidak terposting ke GL",
          related: "account.journal",
        },
        {
          field: "Identify Customer",
          type: "Boolean",
          required: false,
          purpose: "Wajib pilih customer saat bayar",
          why: "Piutang / loyalty / invoice",
          example: "False untuk Cash walk-in",
          impactIfEmpty: "Walk-in tanpa partner (default)",
        },
        {
          field: "Company",
          type: "Many2one",
          required: false,
          purpose: "Entitas pemilik method",
          why: "Multi-company isolation",
          example: company.name,
          impactIfEmpty: "Pakai company aktif",
          related: "res.company",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-settings-pos-payment.png",
        caption: "Settings POS — payment methods untuk Cash/Bank di register",
      },
    },
    {
      id: "md-pos-product",
      name: "Produk POS (product.template)",
      purpose: "SKU yang dijual di register — harga, pajak, stok, flag POS.",
      required: true,
      whyNeeded:
        "Register menjual product.product; storable perlu On Hand agar penjualan fisik valid.",
      fields: [
        {
          field: "Name",
          type: "Char",
          required: true,
          purpose: "Label di grid/receipt",
          why: "Kasir & pelanggan mengenali item",
          example: kopi.name,
          impactIfEmpty: "Produk tidak bisa dipakai",
        },
        {
          field: "Product Type",
          type: "Selection",
          required: true,
          purpose: "Goods storable vs service",
          why: "Storable memicu stock move",
          example: kopi.type,
          impactIfEmpty: "Perilaku stok/accounting salah",
        },
        {
          field: "Sales Price",
          type: "Monetary",
          required: true,
          purpose: "Harga unit di POS",
          why: "Total order & pendapatan",
          example: kopi.salesPrice,
          impactIfEmpty: "Harga 0 — omzet salah",
        },
        {
          field: "Sales Tax",
          type: "Many2many",
          required: false,
          purpose: "PPN penjualan",
          why: "Receipt & jurnal pajak",
          example: kopi.salesTax,
          impactIfEmpty: "Tanpa PPN jika seharusnya kena",
        },
        {
          field: "Available in POS",
          type: "Boolean",
          required: false,
          purpose: "Tampil di register",
          why: "Filter katalog kasir",
          example: "True",
          impactIfEmpty: "Tidak muncul di grid POS",
        },
        {
          field: "Barcode",
          type: "Char",
          required: false,
          purpose: "Scan cepat di register",
          why: "Akurasi & kecepatan kasir",
          example: "8991002123456 (contoh lab)",
          impactIfEmpty: "Harus klik grid manual",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/07-products-list.png",
        caption: `${kopi.name} dan produk lain di product list sebelum dijual di POS`,
        whatToFill: `Type ${kopi.type}, price ${kopi.salesPrice}, Available in POS`,
      },
    },
    {
      id: "md-pos-session",
      name: "POS Session (pos.session)",
      purpose: "Wadah operasional kasir dari Open sampai Close Register.",
      required: true,
      whyNeeded:
        "Semua order & pembayaran menempel di session; closing mem-post Accounting.",
      fields: [
        {
          field: "Point of Sale",
          type: "Many2one",
          required: true,
          purpose: "Shop pemilik sesi",
          why: "Konteks config & stok",
          example: "Nusantara Counter",
          impactIfEmpty: "Session tidak valid",
          related: "pos.config",
        },
        {
          field: "Responsible / Opened by",
          type: "Many2one",
          required: true,
          purpose: "Kasir yang membuka",
          why: "Akuntabilitas kas",
          example: "Administrator / Cashier",
          impactIfEmpty: "Audit trail lemah",
          related: "res.users",
        },
        {
          field: "Status",
          type: "Selection",
          required: true,
          purpose: "Opening control / Opened / Closing / Closed",
          why: "Alur kontrol kas",
          example: "Opened",
          impactIfEmpty: "UI register tidak bisa dipakai",
        },
        {
          field: "Opening Balance",
          type: "Monetary",
          required: false,
          purpose: "Modal kas awal",
          why: "Cash control",
          example: "500000",
          impactIfEmpty: "Expected closing kurang akurat jika cash control on",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-pos-sessions.png",
        caption: "Sessions — jejak open/close register per shop",
      },
    },
  ],
  dependencies: {
    nodes: [
      { id: "products", label: "Products (storable)" },
      { id: "inventory", label: "Inventory (On Hand)" },
      { id: "pos-config", label: "POS Config + Payment" },
      { id: "pos-session", label: "Open Session / Register" },
      { id: "pos-order", label: "POS Order + Payment" },
      { id: "accounting", label: "Accounting (Close Session)" },
    ],
    edges: [
      {
        from: "products",
        to: "pos-config",
        why: "Produk Available in POS masuk katalog shop",
      },
      {
        from: "inventory",
        to: "pos-session",
        why: "Lokasi WH/Stock harus punya qty sebelum jual storable",
      },
      {
        from: "pos-config",
        to: "pos-session",
        why: "Open Register membuat pos.session dari config",
      },
      {
        from: "pos-session",
        to: "pos-order",
        why: "Setiap penjualan di UI menjadi pos.order dalam sesi terbuka",
      },
      {
        from: "pos-order",
        to: "inventory",
        why: "Bayar order storable mengurangi On Hand",
      },
      {
        from: "pos-session",
        to: "accounting",
        why: "Close Session memposting kas/bank & pendapatan",
      },
    ],
    summary:
      "Produk & stok menyiapkan shop; sesi terbuka memungkinkan order+bayar; closing menyelaraskan kas ke Accounting dan stok ke Inventory.",
  },
  forms: [
    {
      id: "form-pos-config",
      name: "Point of Sale Config (pos.config)",
      menuPath: "Point of Sale → Configuration → Point of Sale → New / Open",
      fields: [
        {
          field: "Point of Sale Name",
          required: true,
          purpose: "Nama counter",
          why: "Identitas di dashboard",
          example: "Nusantara Counter",
        },
        {
          field: "Warehouse",
          required: true,
          purpose: "Gudang sumber stok",
          why: "Pengurangan On Hand",
          example: "WH",
        },
        {
          field: "Payment Methods",
          required: true,
          purpose: "Metode bayar aktif",
          why: "Tombol Payment di register",
          example: "Cash, Bank",
        },
        {
          field: "Pricelist",
          required: false,
          purpose: "Harga default",
          why: "Konsistensi retail IDR",
          example: "IDR Public Pricelist",
        },
        {
          field: "Receipt Header / Footer",
          required: false,
          purpose: "Teks struk",
          why: "Branding toko",
          example: company.name,
        },
        {
          field: "Allowed Employees / Users",
          required: false,
          purpose: "Siapa boleh buka shop",
          why: "Kontrol akses kasir",
          example: "Cashier, Administrator",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-pos-config.png",
        caption: "Form konfigurasi Point of Sale shop",
        whatYouSee: "Field shop, inventory, payment pada pos.config",
        whatToFill: "Nama Nusantara Counter, payment Cash+Bank, warehouse WH",
      },
    },
    {
      id: "form-pos-order",
      name: "POS Order (pos.order) — backend",
      menuPath: "Point of Sale → Orders → Orders",
      fields: [
        {
          field: "Session",
          required: true,
          purpose: "Sesi kasir asal order",
          why: "Link ke open/close",
          example: "Nusantara Counter / POS/0001",
        },
        {
          field: "Customer",
          required: false,
          purpose: "Partner (opsional)",
          why: "Invoice/loyalty/history",
          example: customer.name,
        },
        {
          field: "Order Lines — Product",
          required: true,
          purpose: "Item terjual",
          why: "Revenue & stock move",
          example: kopi.name,
        },
        {
          field: "Quantity",
          required: true,
          purpose: "Qty per line",
          why: "Total & stok",
          example: "2",
        },
        {
          field: "Payments",
          required: true,
          purpose: "Rincian metode bayar",
          why: "Closing per journal",
          example: "Cash = total order",
        },
        {
          field: "State",
          required: true,
          purpose: "Draft / Paid / Done / Invoiced",
          why: "Status operasional",
          example: "Paid / Done",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-pos.png",
        caption:
          "UI Point of Sale / konteks order — penjualan di register tercatat sebagai pos.order",
        whatYouSee: "Layar aplikasi POS atau daftar terkait order",
        why: "Order dibayar di register menjadi dokumen Orders di backend",
      },
    },
  ],
  procedures: [
    {
      id: "proc-pos-setup-shop",
      title: "Menyiapkan POS Shop & Payment Methods",
      goal: "Config shop siap Open Register dengan Cash/Bank dan produk kopi tampil.",
      preparation: [
        "Apps Point of Sale terpasang",
        `Produk ${kopi.name} Can be Sold, storable, punya On Hand`,
        "Journal Cash & Bank tersedia di Accounting",
        "Login sebagai POS Manager / Admin",
      ],
      steps: [
        "Home → Apps pastikan Point of Sale terpasang (atau buka dari App Switcher)",
        "Point of Sale → Configuration → Payment Methods — pastikan Cash & Bank ada + journal terisi",
        "Point of Sale → Configuration → Point of Sale → buka/buat 'Nusantara Counter'",
        "Assign Payment Methods Cash & Bank; set Warehouse/Pricelist IDR",
        `Products → ${kopi.name} → centang Available in POS (dan kategori jika dipakai)`,
        "Settings → Point of Sale: review opsi Inventory & Cash Control sesuai lab",
      ],
      expectedResult:
        "Dashboard POS menampilkan shop; produk kopi siap di katalog register.",
      verification: [
        "Kartu shop terlihat di Point of Sale dashboard",
        "Payment methods terpasang di config",
        `${kopi.name} Available in POS = True`,
      ],
      fillFields: [
        {
          field: "Point of Sale Name",
          value: "Nusantara Counter",
          where: "pos.config form",
          how: "Ketik",
          required: true,
        },
        {
          field: "Payment Methods",
          value: "Cash, Bank",
          where: "pos.config",
          how: "Pilih",
          required: true,
        },
        {
          field: "Pricelist",
          value: "IDR Public Pricelist",
          where: "pos.config",
          how: "Pilih",
        },
        {
          field: "Available in POS",
          value: "True",
          where: `Product ${kopi.name}`,
          how: "Centang",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-00-home-apps.png",
        caption:
          "Home Apps — pastikan Point of Sale terpasang sebelum konfigurasi shop",
        whatYouSee: "Daftar aplikasi Odoo termasuk Point of Sale",
        why: "Install POS dari Apps sebelum membuka pos.config",
      },
    },
    {
      id: "proc-pos-open-sell",
      title: `Open Session & jual ${kopi.name}`,
      goal: "Sesi terbuka; order kopi dibayar; stok berkurang.",
      preparation: [
        "Shop Nusantara Counter sudah dikonfigurasi",
        `On Hand ${kopi.name} ≥ 2`,
        "Kasir punya hak Point of Sale User",
      ],
      steps: [
        "Point of Sale → pilih shop Nusantara Counter → Open Register / New Session",
        "Isi Opening Control (cash awal) jika diminta → Open Session",
        `Di UI register, pilih/scan ${kopi.name}, set qty 2`,
        `Opsional: set Customer ${customer.name}`,
        "Payment → pilih Cash (atau Bank) → isi amount = total → Validate",
        "Receipt muncul — lanjut New Order jika perlu",
      ],
      expectedResult:
        "pos.order Paid dalam sesi Opened; On Hand kopi turun sesuai qty.",
      verification: [
        "Order muncul di Point of Sale → Orders",
        `Inventory: On Hand ${kopi.name} berkurang 2`,
        "Session state = Opened; ada pembayaran Cash/Bank",
      ],
      fillFields: [
        {
          field: "Opening Cash",
          value: "500000",
          where: "Opening Control wizard",
          how: "Ketik",
          note: "Sesuaikan jika cash control aktif",
        },
        {
          field: "Product",
          value: kopi.name,
          where: "POS Register grid",
          how: "Klik / Scan",
          required: true,
        },
        {
          field: "Quantity",
          value: "2",
          where: "Order lines di register",
          how: "Ketik / +/-",
          required: true,
        },
        {
          field: "Customer",
          value: customer.name,
          where: "Register header / customer button",
          how: "Pilih",
        },
        {
          field: "Payment Method",
          value: "Cash",
          where: "Payment screen",
          how: "Pilih",
          required: true,
        },
        {
          field: "Amount",
          value: String(Number(kopi.salesPrice) * 2),
          where: "Payment screen",
          how: "Ketik / auto total",
          required: true,
          note: "Belum termasuk PPN jika tax exclusive — ikuti total yang dihitung Odoo",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-pos.png",
        caption: "Register POS — jual produk dan selesaikan pembayaran",
        whatYouSee: "UI Point of Sale untuk transaksi kasir",
        whatToFill: `${kopi.name} × 2, bayar Cash`,
      },
    },
    {
      id: "proc-pos-close-session",
      title: "Close Session & cek dampak Inventory/Accounting",
      goal: "Sesi Closed; kas direkonsiliasi; jurnal & stok konsisten.",
      preparation: [
        "Minimal satu order Paid di sesi berjalan",
        "Hak Close Session (User/Manager sesuai policy)",
        "Uang fisik dihitung jika Cash Control on",
      ],
      steps: [
        "Dari UI POS: Close Session / Backend: Point of Sale → Sessions → sesi Opened",
        "Masuk Closing Control — isi counted cash per metode jika diminta",
        "Bandingkan expected vs counted; catat difference jika ada",
        "Validate / Close Session sampai state Closed & Posted",
        `Cek Inventory Overview / product ${kopi.name} — qty sesuai penjualan`,
        "Cek Accounting: journal items / bank statement terkait session",
      ],
      expectedResult:
        "pos.session Closed; GL kas/pendapatan terisi; stok sudah final untuk order sesi itu.",
      verification: [
        "Sessions list: state Closed",
        "Tidak ada order Paid tertinggal di sesi terbuka",
        "Laporan Orders / Sales Details memuat transaksi kopi",
        "Jurnal closing ada di Accounting",
      ],
      fillFields: [
        {
          field: "Counted Cash",
          value: "Expected dari layar closing",
          where: "Closing Control",
          how: "Ketik",
          required: true,
          note: "Samakan dengan expected bila tidak ada selisih fisik",
        },
        {
          field: "Closing Notes",
          value: `Shift pagi — jual ${kopi.name}`,
          where: "Closing wizard / chatter",
          how: "Ketik",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-pos-sessions.png",
        caption: "Sessions setelah Close — status Closed untuk audit harian",
        whatYouSee: "Daftar sesi POS dengan state",
        expectedResult: "Sesi latihan bertanda Closed/Posted",
      },
    },
    {
      id: "proc-pos-mixed-payment",
      title: "Order campuran Cash + Bank",
      goal: "Satu order dibayar split method; closing breakdown benar.",
      preparation: [
        "Sesi Opened",
        "Payment methods Cash & Bank aktif di shop",
        `${teh.name} juga Available in POS (opsional line kedua)`,
      ],
      steps: [
        `Buat order: ${kopi.name} × 1 (+ ${teh.name} × 1 opsional)`,
        "Payment → masukkan sebagian ke Cash",
        "Sisa bayar dengan Bank → Validate",
        "Tutup sesi di akhir shift — pastikan total per method cocok",
      ],
      expectedResult:
        "pos.payment terpecah dua method; closing menampilkan dua baris kas/bank.",
      verification: [
        "Order detail: dua payment lines",
        "Closing control: Cash & Bank terpisah",
        "Tidak ada residual amount di order",
      ],
      fillFields: [
        {
          field: "Product",
          value: kopi.name,
          where: "Register",
          how: "Pilih",
          required: true,
        },
        {
          field: "Payment Cash",
          value: "100000",
          where: "Payment screen",
          how: "Ketik",
          required: true,
        },
        {
          field: "Payment Bank",
          value: "Sisa total",
          where: "Payment screen",
          how: "Ketik",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-pos-app.png",
        caption: "Entry Point of Sale app — lanjut ke register untuk split payment",
      },
    },
  ],
  scenarios: [
    {
      id: "sc-pos-walkin-cash",
      title: "Walk-in bayar tunai kopi",
      whenToUse: "Pelanggan tanpa akun, serah terima langsung di counter.",
      flow: [
        "Open Session",
        `Scan/pilih ${kopi.name}`,
        "Payment Cash → Validate",
        "Serahkan barang",
        "Close Session akhir shift",
      ],
      notes: "Jalur default latihan Wave 3 POS + Inventory + Accounting.",
    },
    {
      id: "sc-pos-known-customer",
      title: `Pelanggan ${customer.name} di register`,
      whenToUse: "Ingin history order / invoice pelanggan retail dikenal.",
      flow: [
        "Open Session",
        `Set Customer ${customer.name}`,
        `Jual ${kopi.name}`,
        "Bayar Bank/Cash",
        "Opsional Invoice dari order jika diaktifkan",
        "Close Session",
      ],
      notes: `Pricelist ${customer.pricelist} harus selaras dengan shop bila harga khusus.`,
    },
    {
      id: "sc-pos-cash-difference",
      title: "Selisih kas saat closing",
      whenToUse: "Counted cash ≠ expected setelah penjualan tunai.",
      flow: [
        "Hitung fisik laci",
        "Isi counted di Closing Control",
        "Catat difference (surplus/shortage)",
        "Validate close sesuai SOP (supervisor approve jika perlu)",
        "Investigasi order Cash vs struk",
      ],
    },
    {
      id: "sc-pos-stockout",
      title: "Stok habis di tengah shift",
      whenToUse: `On Hand ${kopi.name} tidak cukup untuk order berikutnya.`,
      flow: [
        "POS menolak / warning qty (bergantung setting)",
        "Stop jual SKU itu atau kurangi qty",
        "Inventory Adjustment / transfer masuk ke lokasi shop",
        "Lanjut penjualan setelah On Hand cukup",
      ],
    },
  ],
  integrations: [
    {
      id: "int-pos-inventory",
      withModule: "Inventory",
      relationship: "pos.order → stock.move / picking dari lokasi shop",
      whatHappens: `Menjual ${kopi.name} mengurangi On Hand; forecast & valuation mengikuti move POS.`,
    },
    {
      id: "int-pos-accounting",
      withModule: "Accounting",
      relationship: "pos.session close → account moves / statements",
      whatHappens:
        "Close Session memposting penerimaan per payment method journal dan pendapatan/pajak terkait order.",
    },
    {
      id: "int-pos-contacts",
      withModule: "Contacts",
      relationship: "pos.order.partner_id → res.partner",
      whatHappens: `Memilih ${customer.name} di register mengaitkan order ke master Contacts untuk history & invoice.`,
    },
    {
      id: "int-pos-sales-products",
      withModule: "Sales / Products",
      relationship: "product.template shared catalog",
      whatHappens:
        "Harga, pajak, dan Can be Sold dipakai bersama; POS menambah flag Available in POS tanpa mengubah SO B2B.",
    },
  ],
  mistakes: [
    {
      id: "m-pos-no-stock",
      problem: "Menjual storable tanpa On Hand / lokasi salah",
      why: "Oversell; closing & valuation kacau; pengiriman fisik tidak ada",
      detect: `Inventory ${kopi.name} negatif atau warning stock di POS`,
      fix: "Adjustment/receipt ke lokasi shop; batalkan/koreksi order jika SOP izinkan",
      prevent: "Cek On Hand sebelum buka toko; samakan warehouse di pos.config",
    },
    {
      id: "m-pos-forget-close",
      problem: "Lupa Close Session di akhir hari",
      why: "Kas tidak terposting; sesi menggantung; shift berikutnya bentrok",
      detect: "Sessions tetap Opened keesokan hari; Accounting belum ada jurnal POS",
      fix: "Close Session segera; isi counted dengan bukti fisik/struk",
      prevent: "SOP closing wajib sebelum tutup toko; supervisor cek Sessions list",
    },
    {
      id: "m-pos-wrong-payment-journal",
      problem: "Payment method tanpa journal / journal salah",
      why: "Closing gagal atau uang masuk akun GL yang salah",
      detect: "Error saat close; laporan kas tidak match bank",
      fix: "Perbaiki journal di pos.payment.method; re-close / reconcile",
      prevent: "Checklist setup: setiap method punya journal company yang benar",
    },
    {
      id: "m-pos-product-not-in-pos",
      problem: `${kopi.name} tidak muncul di register`,
      why: "Kasir tidak bisa jual SKU utama; order manual di backend rawan salah",
      detect: "Grid kosong / search produk tidak ketemu",
      fix: "Centang Available in POS; cek kategori/restriction di config; refresh register",
      prevent: "Saat create produk retail, set flag POS + kategori sekaligus",
    },
    {
      id: "m-pos-open-two-sessions",
      problem: "Mencoba buka dua sesi aktif pada shop yang sama",
      why: "Kas bercampur; kontrol opening/closing rusak",
      detect: "Tombol Open disabled; ada session Opened di Sessions",
      fix: "Pakai Continue Session atau Close dulu sebelum buka baru",
      prevent: "Satu shop = satu sesi terbuka; ganti user lewat mekanisme yang didukung",
    },
  ],
  troubleshooting: [
    {
      id: "t-pos-cannot-open",
      problem: "Tidak bisa Open Register / New Session",
      causes: [
        "Masih ada session Opened pada config yang sama",
        "User tanpa group Point of Sale",
        "Payment methods belum di-assign ke shop",
        "Config archived / company salah",
      ],
      diagnosis: [
        "Point of Sale → Sessions: cari state Opening/Opened",
        "Settings → Users: group Point of Sale",
        "Buka pos.config → tab Payment Methods",
      ],
      solution: [
        "Continue existing session atau Close Session lama",
        "Tambah group POS User/Manager",
        "Assign Cash/Bank ke config lalu refresh",
      ],
      prevention: "Checklist go-live shop: methods + rights + tidak ada sesi zombie",
    },
    {
      id: "t-pos-payment-blocked",
      problem: "Tombol Payment/Validate tidak menyelesaikan order",
      causes: [
        "Amount bayar < total",
        "Metode tidak aktif di config",
        "Wajib customer tetapi belum dipilih",
        "Koneksi/printer error (jika force print)",
      ],
      diagnosis: [
        "Lihat residual amount di payment screen",
        "Cek methods di pos.config vs tombol di UI",
        "Cek opsi Identify Customer pada method",
      ],
      solution: [
        "Isi amount sampai residual 0 (atau kembalian benar)",
        "Aktifkan method di config dan reload POS",
        "Pilih customer jika method memaksa",
      ],
      prevention: "Latihan split payment & full cash sebelum shift nyata",
    },
    {
      id: "t-pos-close-accounting-error",
      problem: "Close Session gagal posting ke Accounting",
      causes: [
        "Journal payment method kosong/salah tipe",
        "Chart of accounts / account receivable belum siap",
        "Periode terkunci / lock date",
        "Tax/account produk belum ter-map",
      ],
      diagnosis: [
        "Baca traceback/error wizard closing",
        "Payment Methods → field Journal",
        "Product category / taxes income accounts",
        "Accounting lock dates",
      ],
      solution: [
        "Lengkapi journal & accounts",
        "Perbaiki tax mapping produk",
        "Buka lock date jika memang lab/test (hati-hati production)",
        "Retry Close Session",
      ],
      prevention:
        "Uji close session dengan 1 order kecil setelah setup, sebelum hari sibuk",
    },
    {
      id: "t-pos-stock-not-updated",
      problem: "Order Paid tetapi On Hand tidak berkurang",
      causes: [
        "Produk bukan storable (service/consumable salah tipe)",
        "Opsi inventory POS / ship later",
        "Warehouse config beda dengan lokasi yang dicek user",
        "Session/order belum fully done",
      ],
      diagnosis: [
        `Cek Product Type ${kopi.name}`,
        "Cek warehouse di pos.config vs Inventory overview location",
        "Cek stock move terkait pos.order",
      ],
      solution: [
        "Ubah tipe ke Goods storable bila memang fisik",
        "Samakan lokasi pengecekan dengan shop",
        "Pastikan order Paid/Done dan sesi tidak error inventory",
      ],
      prevention: "Seed produk retail sebagai storable + receipt awal sebelum POS",
    },
  ],
  behind: {
    models: [
      "pos.config",
      "pos.session",
      "pos.order",
      "pos.order.line",
      "pos.payment",
      "pos.payment.method",
      "pos.category",
      "product.template / product.product",
      "stock.move",
      "account.journal",
      "res.partner",
    ],
    relations: [
      "pos.session.config_id → pos.config",
      "pos.order.session_id → pos.session",
      "pos.order.partner_id → res.partner",
      "pos.order.lines → pos.order.line → product.product",
      "pos.payment.payment_method_id → pos.payment.method",
      "pos.payment.method.journal_id → account.journal",
      "pos.config stock → stock.warehouse / picking type",
      "closing session → account.move (dan statement lines sesuai versi)",
    ],
    automations: [
      "Open Session creates pos.session and locks config to one open session",
      "Paying order creates pos.payment and marks order paid",
      "Stock moves reduce On Hand for storable lines",
      "Close Session posts accounting entries and finalizes cash control",
    ],
    securityNotes: [
      "point_of_sale.group_pos_user: operate register & own session flows",
      "point_of_sale.group_pos_manager: configuration, all sessions, tighter control",
      "Accounting rights terpisah untuk investigasi jurnal closing",
    ],
    note: "Di Odoo 19, UI register adalah client POS terpisah yang sync ke pos.order; backend Sessions/Orders dipakai untuk kontrol dan audit setelah transaksi.",
  },
  reporting: [
    {
      name: "Orders",
      path: "Point of Sale → Orders → Orders",
      kpi: "Omzet per order/produk/kasir dalam periode",
      decision: `Evaluasi SKU terlaris (${kopi.name} vs ${teh.name}) di counter`,
    },
    {
      name: "Sessions",
      path: "Point of Sale → Orders → Sessions",
      kpi: "Durasi sesi, total payments, cash difference",
      decision: "Coaching kasir jika difference berulang",
    },
    {
      name: "Sales Details",
      path: "Point of Sale → Reporting → Sales Details (atau setara)",
      kpi: "Qty & revenue per product/category per hari",
      decision: "Restock harian WH/Stock untuk SKU cepat habis",
    },
    {
      name: "Payment Analysis",
      path: "Point of Sale → Reporting / group by Payment Method",
      kpi: "Proporsi Cash vs Bank",
      decision: "Siapkan modal cash opening & rekonsiliasi EDC",
    },
  ],
  security: {
    roles: [
      {
        role: "Point of Sale / User",
        can: [
          "Open/Continue Register pada shop yang diizinkan",
          "Buat order, terima pembayaran, cetak receipt",
          "Close session sesuai SOP toko",
        ],
        cannot: [
          "Ubah pos.config & payment method master",
          "Menghapus histori order sesuka hati",
          "Mengubah journal Accounting secara langsung",
        ],
        whyDifferent:
          "Kasir fokus transaksi harian; konfigurasi keuangan/stok dikunci agar tidak berubah di tengah shift.",
      },
      {
        role: "Point of Sale / Manager",
        can: [
          "Konfigurasi shop, categories, payment methods",
          "Lihat semua sessions & orders",
          "Supervisi cash difference & closing",
        ],
        cannot: [
          "Mengganti lock date Accounting tanpa role Finance",
          "Mengubah COA tanpa Accounting Manager",
        ],
        whyDifferent:
          "Manager bertanggung jawab kontrol kas dan setup counter, bukan desain ledger penuh.",
      },
      {
        role: "Accounting / Inventory (pendukung)",
        can: [
          "Rekonsiliasi jurnal hasil closing",
          "Cek stock move & adjustment terkait POS",
        ],
        cannot: [
          "Mengoperasikan register tanpa group POS",
        ],
        whyDifferent:
          "Back-office memvalidasi dampak stok & GL, bukan menggantikan kasir.",
      },
    ],
    notes: [
      "Pisahkan user kasir dari admin konfigurasi di production",
      "Jangan share login sesi — audit Responsible di pos.session menjadi kabur",
      "Hak refund/discount (jika diaktifkan) sebaiknya dibatasi manager",
    ],
  },
  levels: {
    beginner: [
      "Install Point of Sale & buka dashboard shop",
      "Open Session dengan opening cash sederhana",
      `Jual ${kopi.name} bayar Cash`,
      "Close Session tanpa difference",
    ],
    intermediate: [
      "Siapkan payment Cash+Bank dan split payment",
      `Assign customer ${customer.name} di register`,
      "Baca Orders & Sessions list setelah shift",
      "Verifikasi On Hand turun setelah penjualan",
    ],
    advanced: [
      "Cash control dengan selisih & investigasi",
      "Multi shop / multi warehouse",
      "Pricelist & tax edge cases di receipt",
      "Lacak journal items hasil closing di Accounting",
    ],
    expert: [
      "Desain kebijakan refund/discount & otorisasi",
      "Integrasi barcode/EDC/QR dan rekonsiliasi harian",
      "KPI difference rate & shrink stok toko",
      "Sinkronisasi counter POS dengan kanal Sales/eCommerce tanpa double stock",
    ],
  },
  exercises: [
    {
      id: "ex-pos-shop-setup",
      title: "Setup Nusantara Counter",
      objective: "Shop POS siap dipakai kasir dengan Cash & Bank",
      prerequisites: [
        "Point of Sale terpasang",
        "Journal Cash/Bank ada",
        `${kopi.name} sudah di master produk`,
      ],
      task: [
        "Buat/edit pos.config Nusantara Counter",
        "Assign payment methods",
        `Aktifkan Available in POS pada ${kopi.name}`,
        "Screenshot/cek dashboard shop muncul",
      ],
      expectedResult: "Open Register tersedia pada shop latihan",
      checklist: [
        "Payment methods terisi",
        "Warehouse terisi",
        "Produk kopi tampil flag POS",
      ],
    },
    {
      id: "ex-pos-sell-kopi",
      title: `Jual ${kopi.name} di register`,
      objective: "Menyelesaikan satu order Paid dalam sesi terbuka",
      prerequisites: [
        "Shop siap",
        `On Hand ${kopi.name} ≥ 2`,
      ],
      task: [
        "Open Session",
        `Order ${kopi.name} × 2`,
        "Bayar Cash full",
        "Catat nomor order / receipt",
      ],
      expectedResult: "pos.order Paid; stok berkurang 2",
      checklist: [
        "Total sesuai harga×qty (+tax bila ada)",
        "Session masih Opened",
        "Inventory mencerminkan penjualan",
      ],
    },
    {
      id: "ex-pos-close-audit",
      title: "Close Session & audit dampak",
      objective: "Menutup sesi dan memverifikasi Inventory + Accounting",
      prerequisites: ["Minimal satu order Paid di sesi"],
      task: [
        "Close Session dengan counted = expected",
        "Buka Sessions pastikan Closed",
        `Cek On Hand ${kopi.name}`,
        "Cek jurnal/statement terkait session di Accounting",
      ],
      expectedResult: "Sesi Closed/Posted; kas & stok selaras dengan order",
      checklist: [
        "Tidak ada session Opened tertinggal",
        "Difference = 0 (latihan ideal)",
        "Ada jejak posting akuntansi",
      ],
    },
    {
      id: "ex-pos-split-pay",
      title: "Latihan split Cash + Bank",
      objective: "Satu order dengan dua payment method",
      prerequisites: ["Sesi Opened", "Cash & Bank aktif"],
      task: [
        `Order ${kopi.name} × 1`,
        "Bayar sebagian Cash, sisa Bank",
        "Validate & cek payment lines di Orders",
      ],
      expectedResult: "Residual 0; dua baris pos.payment",
      checklist: ["Jumlah Cash+Bank = total", "Closing nanti menampilkan dua method"],
    },
  ],
  coreFlowLinks: [
    { label: "Deep Dive Inventory", href: "/materi/inventory" },
    { label: "Deep Dive Accounting", href: "/materi/accounting" },
    { label: "Deep Dive Sales", href: "/materi/sales" },
    { label: "Master Products", href: "/modul/master-inventory" },
    { label: "Core Flow Inventory", href: "/modul/flow-inventory" },
    { label: "Home Apps (install POS)", href: "/materi/pos" },
  ],
};
