import type { DeepDiveModule } from "../types";
import { seed } from "../../seed";

const company = seed.company;
const customer = seed.customers.toko;
const distributor = seed.customers.distributor;
const vendor = seed.vendors.bahan;
const kopi = seed.products.kopi;
const jasa = seed.products.jasa;

export const accountingDeepDive: DeepDiveModule = {
  slug: "accounting",
  name: "Accounting — Invoice, Bill, Pajak & Laporan",
  shortTitle: "Accounting",
  icon: "Calculator",
  category: "Keuangan",
  wave: 1,
  availability: "available",
  apps: ["Accounting", "Invoicing"],
  overview: {
    function:
      "Modul Accounting (dan Invoicing) mengelola Chart of Accounts, pajak, jurnal, Customer Invoice, Vendor Bill, payment, rekonsiliasi bank, dan laporan keuangan. Di Odoo 19 Enterprise, dokumen pusat adalah account.move yang terhubung ke Sales (piutang) dan Purchase (hutang).",
    businessProblem:
      "Tanpa Accounting terintegrasi, invoice dibuat di luar sistem, pajak tidak konsisten, dan laporan laba/rugi tidak mencerminkan transaksi operasional PO/SO/stok.",
    typicalUsers: [
      "Accounts Receivable (AR)",
      "Accounts Payable (AP)",
      "Accountant / Controller",
      "Finance Manager",
    ],
    whenNeeded:
      "Begitu perusahaan menerbitkan invoice pelanggan, menerima bill vendor, atau membutuhkan laporan keuangan & pajak dari transaksi Odoo.",
    relatedModules: ["Sales", "Purchase", "Inventory (valuation)", "Contacts", "Bank"],
    businessScenario: `${company.name} beroperasi dalam ${company.currency} dengan NPWP ${company.taxId}. Setelah Sales ke ${customer.name}, AR membuat Customer Invoice + PPN 11%. Setelah Purchase dari ${vendor.name}, AP memposting Vendor Bill + Pajak Pembelian 11%. Finance memonitor Aged Receivable/Payable, Register Payment, dan membaca Profit & Loss serta Balance Sheet.`,
  },
  prerequisites: {
    modules: [
      "Contacts",
      "Sales & Purchase (untuk dokumen sumber)",
      "Inventory (jika valuation otomatis)",
    ],
    masterData: [
      `Company ${company.name} dengan currency ${company.currency}`,
      "Chart of Accounts (lokal Indonesia / template terpasang)",
      "Pajak Penjualan 11% & Pajak Pembelian 11%",
      "Journals: Customer Invoices, Vendor Bills, Bank, Cash",
      "Payment Terms: 15 Days, 30 Days",
      "Bank account perusahaan (untuk payment & reco)",
    ],
    configuration: [
      "Accounting → Settings: Taxes, Fiscal Localization",
      "Default taxes pada produk",
      "Accounts receivable/payable di partner atau properti default",
      "Inventory valuation accounts di product category (opsional wave 1)",
    ],
    access: [
      "Invoicing / Accounting: buat draft invoice/bill",
      "Accountant: post journal entries, reconciliation",
      "Advisor: settings, tax, closing",
    ],
    relationships:
      "SO Create Invoice → account.move out_invoice; PO Create Bill → in_invoice; Payment → account.payment yang merekonsiliasi move lines outstanding. Stok automated menambah journal valuation.",
  },
  installation: {
    how: [
      "Home → Apps",
      "Cari 'Invoicing' dan/atau 'Accounting'",
      "Install Accounting (Enterprise) untuk fitur penuh; Invoicing cukup untuk invoice dasar",
      "Ikuti wizard Fiscal Localization jika diminta",
    ],
    dependencies: [
      "Contacts",
      "Sales/Purchase direkomendasikan",
      "Bank reconciliation butuh Accounting penuh",
    ],
    afterInstall: [
      "Accounting → Configuration → Settings: cek taxes & currency",
      "Pastikan Chart of Accounts terisi",
      "Buat/cek Bank Journal untuk rekening perusahaan",
      "Mapping default income/expense di produk atau kategori",
    ],
    newMenus: [
      "Accounting → Customers → Invoices",
      "Accounting → Vendors → Bills",
      "Accounting → Customers → Payments",
      "Accounting → Accounting → Journal Entries",
      "Accounting → Reporting",
      "Accounting → Configuration → Chart of Accounts / Taxes / Journals",
    ],
    newSettings: [
      "Settings → Accounting → Taxes",
      "Settings → Accounting → Customer Payments",
      "Settings → Accounting → Vendor Payments",
      "Settings → Accounting → Fiscal Localization",
    ],
  },
  configurations: [
    {
      id: "acc-fiscal",
      name: "Fiscal Localization Pack",
      location: "Settings → Accounting → Fiscal Localization",
      what: "Paket COA, pajak, dan laporan sesuai negara.",
      whyEnable:
        "Menyelaraskan struktur akun & pajak dengan praktik lokal Indonesia.",
      whenEnable:
        "Saat setup database baru sebelum transaksi massal.",
      whenNot:
        "Jangan ganti localization setelah banyak journal posted tanpa migrasi.",
      businessExample: `${company.name} memakai pack Indonesia dengan PPN 11%.`,
      impact:
        "Chart of Accounts, taxes, dan beberapa report menyesuaikan pack.",
      screenshot: {
        src: "/screenshots/odoo19e/11-settings.png",
        caption: "Settings Accounting — Fiscal Localization & opsi pajak",
      },
    },
    {
      id: "acc-taxes",
      name: "Default Taxes",
      location: "Settings → Accounting → Taxes → Default Taxes",
      what: "Pajak jual/beli default untuk produk baru.",
      whyEnable:
        "Mengurangi invoice/bill tanpa PPN karena lupa set tax di produk.",
      whenEnable:
        "Mayoritas transaksi kena PPN 11%.",
      whenNot:
        "Campuran taxable/non-taxable tinggi — lebih aman set per produk/kategori.",
      businessExample: `Default Sales Tax = Pajak Penjualan 11%; Purchase Tax = Pajak Pembelian 11%.`,
      impact:
        "Produk baru mewarisi tax; line SO/PO terisi otomatis.",
      screenshot: {
        src: "/screenshots/odoo19e/16-taxes.png",
        caption: "Konfigurasi Taxes — PPN penjualan dan pembelian",
      },
    },
    {
      id: "acc-cash-basis",
      name: "Cash Basis / Tax Cash Basis (jika relevan)",
      location: "Settings → Accounting → Taxes → Cash Basis",
      what: "Pengakuan pajak saat payment, bukan saat invoice.",
      whyEnable:
        "Menyesuaikan rezim pajak cash basis.",
      whenEnable:
        "Kebijakan fiskal perusahaan/aturan lokal mengharuskan cash basis.",
      whenNot:
        "Accrual standard — biarkan tax pada saat post invoice.",
      businessExample:
        "PPN baru diakui saat ${customer.name} membayar invoice.",
      impact:
        "Tax grid & journal tax mengikuti payment reconciliation.",
    },
    {
      id: "acc-payment-terms",
      name: "Payment Terms",
      location: "Accounting → Configuration → Payment Terms / Settings linked defaults",
      what: "Skema jatuh tempo (Immediate, 15 Days, 30 Days, dll).",
      whyEnable:
        "Standarisasi due date AR/AP dan laporan aged.",
      whenEnable:
        "Selalu — minimal dua terms untuk retail vs distributor.",
      whenNot:
        "Tidak relevan menonaktifkan; yang salah adalah terms inkonsisten per partner.",
      businessExample: `${customer.name}: ${customer.paymentTerms}; ${vendor.name}: ${vendor.paymentTerms}; ${distributor.name}: ${distributor.paymentTerms}.`,
      impact:
        "Invoice/Bill mendapat Invoice Date + Due Date otomatis.",
    },
    {
      id: "acc-incoterm",
      name: "Incoterms",
      location: "Settings → Accounting → Customer Invoices → Incoterms",
      what: "Syarat pengiriman internasional (FOB, CIF, dll).",
      whyEnable:
        "Dokumen ekspor/impor butuh incoterm resmi.",
      whenEnable:
        "Ada penjualan/pembelian lintas negara.",
      whenNot:
        "Pure domestic demo seperti seed lokal Indonesia — opsional.",
      businessExample: "SO ekspor ke customer luar negeri memakai FOB.",
      impact:
        "Field Incoterm muncul di invoice/SO.",
    },
    {
      id: "acc-analytics",
      name: "Analytic Accounting",
      location: "Settings → Accounting → Analytics",
      what: "Cost center / analytic account pada journal items.",
      whyEnable:
        "Memecah revenue/cost per proyek, cabang, atau saluran.",
      whenEnable:
        "Butuh P&L per analytic (mis. retail vs distributor channel).",
      whenNot:
        "Tim finance kecil tanpa dimensi analitik — menambah noise.",
      businessExample: `Tag analytic "Retail" pada invoice ${customer.name}.`,
      impact:
        "Analytic lines wajib/opsional di account.move.line; report analytic tersedia.",
    },
    {
      id: "acc-lock-dates",
      name: "Lock Dates",
      location: "Accounting → Settings / Accounting → Lock Dates",
      what: "Mengunci periode agar journal lama tidak diubah.",
      whyEnable:
        "Menjaga integritas closing bulanan/tahunan.",
      whenEnable:
        "Setelah tutup buku periode tertentu.",
      whenNot:
        "Database latihan yang masih dikoreksi berkali-kali — kunci belakangan.",
      businessExample: "Lock all entries sebelum 2026-10-01 setelah closing September.",
      impact:
        "User biasa tidak bisa post/ubah entry sebelum lock date.",
    },
  ],
  masterData: [
    {
      id: "md-coa",
      name: "Chart of Accounts (account.account)",
      purpose: "Daftar akun aset, liabilitas, ekuitas, pendapatan, beban.",
      required: true,
      whyNeeded:
        "Setiap journal item membutuhkan akun; tanpa COA, invoice tidak bisa diposting.",
      fields: [
        {
          field: "Code",
          type: "Char",
          required: true,
          purpose: "Kode akun",
          why: "Sorting & referensi cepat",
          example: "411000",
          impactIfEmpty: "Akun tidak valid",
        },
        {
          field: "Account Name",
          type: "Char",
          required: true,
          purpose: "Nama akun",
          why: "Keterbacaan laporan",
          example: "Product Sales",
          impactIfEmpty: "Tidak tersimpan",
        },
        {
          field: "Type",
          type: "Selection",
          required: true,
          purpose: "Asset/Liability/Income/Expense/dll",
          why: "Menentukan posisi di Balance Sheet / P&L",
          example: "Income",
          impactIfEmpty: "Laporan salah klasifikasi",
        },
        {
          field: "Reconcile",
          type: "Boolean",
          required: false,
          purpose: "Akun bisa direkonsiliasi",
          why: "AR/AP/Bank butuh reconcile",
          example: "True untuk Receivable/Payable",
          impactIfEmpty: "Payment matching gagal",
        },
        {
          field: "Taxes",
          type: "Many2many",
          required: false,
          purpose: "Default tax saat akun dipilih",
          why: "Konsistensi pajak",
          example: "Pajak Penjualan 11%",
          impactIfEmpty: "Tax harus di line produk",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/10-accounting.png",
        caption: "Accounting app — pintu masuk COA, journal, dan laporan",
      },
    },
    {
      id: "md-tax",
      name: "Taxes (account.tax)",
      purpose: "Definisi PPN jual/beli dan mapping akun tax.",
      required: true,
      whyNeeded:
        "Invoice/bill seed memakai Pajak 11%; tanpa tax, compliance & total salah.",
      fields: [
        {
          field: "Tax Name",
          type: "Char",
          required: true,
          purpose: "Label pajak",
          why: "Tampil di dokumen",
          example: kopi.salesTax,
          impactIfEmpty: "Tidak tersimpan",
        },
        {
          field: "Tax Type",
          type: "Selection",
          required: true,
          purpose: "Sales / Purchase",
          why: "Menentukan di dokumen mana dipakai",
          example: "Sales",
          impactIfEmpty: "Tax tidak muncul di SO",
        },
        {
          field: "Computation / Amount",
          type: "Float / Selection",
          required: true,
          purpose: "Persentase atau fixed",
          why: "Hitung tax amount",
          example: "11% (percentage)",
          impactIfEmpty: "Tax 0",
        },
        {
          field: "Tax Account",
          type: "Many2one",
          required: true,
          purpose: "Akun hutang/kredit pajak",
          why: "Posting journal tax",
          example: "Tax Received / Tax Paid",
          impactIfEmpty: "Error saat post invoice",
          related: "account.account",
        },
        {
          field: "Label on Invoices",
          type: "Char",
          required: false,
          purpose: "Teks di cetakan",
          why: "Kejelasan ke pelanggan",
          example: "PPN 11%",
          impactIfEmpty: "Hanya nama teknis",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/16-taxes.png",
        caption: "Daftar Taxes — pastikan 11% jual dan beli ada",
      },
    },
    {
      id: "md-journal",
      name: "Journals (account.journal)",
      purpose: "Buku pencatatan per tipe dokumen: Sale, Purchase, Bank, Cash, Miscellaneous.",
      required: true,
      whyNeeded:
        "Invoice pelanggan memakai Sales journal; bill memakai Purchase journal; payment memakai Bank/Cash.",
      fields: [
        {
          field: "Journal Name",
          type: "Char",
          required: true,
          purpose: "Nama jurnal",
          why: "Identitas di list entries",
          example: "Customer Invoices",
          impactIfEmpty: "Tidak tersimpan",
        },
        {
          field: "Type",
          type: "Selection",
          required: true,
          purpose: "Sale/Purchase/Cash/Bank/General",
          why: "Menentukan behavior dokumen",
          example: "Sale",
          impactIfEmpty: "Journal tidak dipakai otomatis",
        },
        {
          field: "Short Code",
          type: "Char",
          required: true,
          purpose: "Prefix nomor",
          why: "Sequence INV/BILL/BNK",
          example: "INV",
          impactIfEmpty: "Sequence bentrok",
        },
        {
          field: "Default Account",
          type: "Many2one",
          required: false,
          purpose: "Akun default (bank/cash)",
          why: "Payment & liquidity",
          example: "Bank BCA IDR",
          impactIfEmpty: "Harus pilih akun tiap payment",
          related: "account.account",
        },
        {
          field: "Currency",
          type: "Many2one",
          required: false,
          purpose: "Mata uang jurnal",
          why: "Multi-currency bank",
          example: company.currency,
          impactIfEmpty: "Pakai company currency",
        },
      ],
    },
  ],
  dependencies: {
    nodes: [
      { id: "contacts", label: "Contacts" },
      { id: "coa", label: "COA / Taxes / Journals" },
      { id: "sales", label: "Sales Orders" },
      { id: "purchase", label: "Purchase Orders" },
      { id: "accounting", label: "Invoices & Bills" },
      { id: "bank", label: "Payments & Bank Reco" },
    ],
    edges: [
      {
        from: "coa",
        to: "accounting",
        why: "Posting account.move membutuhkan akun, tax, dan journal valid",
      },
      {
        from: "contacts",
        to: "accounting",
        why: "Customer/Vendor partner_id & receivable/payable accounts",
      },
      {
        from: "sales",
        to: "accounting",
        why: "Create Invoice dari SO mengisi out_invoice lines",
      },
      {
        from: "purchase",
        to: "accounting",
        why: "Create Bill dari PO mengisi in_invoice lines",
      },
      {
        from: "accounting",
        to: "bank",
        why: "Register Payment dan rekonsiliasi membersihkan outstanding AR/AP",
      },
    ],
    summary:
      "Accounting menutup siklus O2C dan P2P: master keuangan (COA/tax/journal) harus siap, dokumen operasional menjadi invoice/bill, lalu payment & bank reconciliation menyelesaikan saldo.",
  },
  forms: [
    {
      id: "form-customer-invoice",
      name: "Customer Invoice (account.move move_type=out_invoice)",
      menuPath: "Accounting → Customers → Invoices → New",
      fields: [
        {
          field: "Customer",
          required: true,
          purpose: "Debitur",
          why: "AR partner & alamat",
          example: customer.name,
        },
        {
          field: "Invoice Date",
          required: true,
          purpose: "Tanggal dokumen",
          why: "Period & aging",
          example: "2026-10-18",
        },
        {
          field: "Due Date / Payment Terms",
          required: true,
          purpose: "Jatuh tempo",
          why: "Aged receivable",
          example: customer.paymentTerms,
        },
        {
          field: "Journal",
          required: true,
          purpose: "Sales journal",
          why: "Sequence & default accounts",
          example: "Customer Invoices",
        },
        {
          field: "Invoice Lines — Product",
          required: true,
          purpose: "Item ditagih",
          why: "Revenue & tax base",
          example: kopi.name,
        },
        {
          field: "Invoice Lines — Quantity / Price",
          required: true,
          purpose: "Perhitungan amount",
          why: "Total piutang",
          example: `${seed.so.kopiQty} × ${kopi.salesPrice}`,
        },
        {
          field: "Taxes",
          required: false,
          purpose: "PPN keluaran",
          why: "Compliance",
          example: kopi.salesTax,
        },
        {
          field: "Source Document",
          required: false,
          purpose: "Origin SO",
          why: "Trace O2C",
          example: "S00001",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/15-customer-invoices.png",
        caption: "Customer Invoices — list dan akses form invoice",
        whatYouSee: "Daftar out_invoice",
      },
    },
    {
      id: "form-vendor-bill",
      name: "Vendor Bill (account.move move_type=in_invoice)",
      menuPath: "Accounting → Vendors → Bills → New",
      fields: [
        {
          field: "Vendor",
          required: true,
          purpose: "Kreditur",
          why: "AP partner",
          example: vendor.name,
        },
        {
          field: "Bill Reference",
          required: false,
          purpose: "Nomor invoice vendor",
          why: "Matching & anti-duplikat",
          example: "INV-SBM-001",
        },
        {
          field: "Bill Date",
          required: true,
          purpose: "Tanggal bill vendor",
          why: "Aging AP",
          example: "2026-10-20",
        },
        {
          field: "Accounting Date",
          required: true,
          purpose: "Tanggal jurnal",
          why: "Period recognition",
          example: "2026-10-20",
        },
        {
          field: "Payment Terms",
          required: false,
          purpose: "Jatuh tempo hutang",
          why: "Cash planning",
          example: vendor.paymentTerms,
        },
        {
          field: "Bill Lines — Product",
          required: true,
          purpose: "Item dibeli",
          why: "Expense/stock interim",
          example: kopi.name,
        },
        {
          field: "Quantity / Price",
          required: true,
          purpose: "Dasar hutang",
          why: "Total AP",
          example: `${seed.po.kopiQty} × ${kopi.purchasePrice}`,
        },
        {
          field: "Taxes",
          required: false,
          purpose: "PPN masukan",
          why: "Tax credit",
          example: kopi.purchaseTax,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/14-vendor-bills.png",
        caption: "Vendor Bills — form dan list tagihan supplier",
      },
    },
  ],
  procedures: [
    {
      id: "proc-invoice-from-so",
      title: "Post Customer Invoice dari Sales Order",
      goal: `Invoice ${customer.name} untuk ${kopi.name} dan ${jasa.name} ter-posting.`,
      preparation: [
        "SO confirmed & delivered sesuai policy",
        "Tax & income account produk siap",
      ],
      steps: [
        "Buka SO → Create Invoice → Regular Invoice",
        "Atau Accounting → Customers → Invoices → New (kurang disarankan)",
        "Review Customer, lines, taxes, terms",
        "Confirm Invoice",
        "Catat nomor INV dan residual amount",
      ],
      expectedResult: "out_invoice Posted; piutang bertambah; SO Fully Invoiced.",
      verification: [
        "Partner Ledger customer bertambah",
        "Tax Report memuat PPN keluaran",
        "Journal Items balance debit=credit",
      ],
      fillFields: [
        {
          field: "Customer",
          value: customer.name,
          where: "Header",
          how: "Otomatis dari SO",
          required: true,
        },
        {
          field: "Payment Terms",
          value: customer.paymentTerms,
          where: "Header",
          how: "Otomatis/pilih",
        },
        {
          field: "Line Product 1",
          value: `${kopi.name} × ${seed.so.kopiQty} @ ${kopi.salesPrice}`,
          where: "Invoice Lines",
          how: "Otomatis",
          required: true,
        },
        {
          field: "Line Product 2",
          value: `${jasa.name} × ${seed.so.jasaQty} @ ${jasa.salesPrice}`,
          where: "Invoice Lines",
          how: "Otomatis",
          required: true,
        },
        {
          field: "Taxes",
          value: kopi.salesTax,
          where: "Invoice Lines",
          how: "Otomatis/pilih",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/10b-customer-invoices.png",
        caption: "Customer Invoices setelah Create Invoice dari SO",
      },
    },
    {
      id: "proc-bill-from-po",
      title: "Post Vendor Bill dari Purchase Order",
      goal: `Bill ${vendor.name} sesuai receipt PO tercatat di AP.`,
      preparation: [
        "PO Fully Received (received policy)",
        "Expense/stock accounts kategori produk siap",
      ],
      steps: [
        "Buka PO → Create Bill",
        "Isi Bill Reference dari dokumen vendor",
        "Cek qty, price, pajak pembelian",
        "Confirm Bill",
        "Cek Billing Status PO = Fully Billed",
      ],
      expectedResult: "in_invoice Posted; hutang bertambah.",
      verification: [
        "Aged Payable menampilkan vendor",
        "Tax Purchase ter-record",
        "Tidak ada selisih qty vs receipt",
      ],
      fillFields: [
        {
          field: "Vendor",
          value: vendor.name,
          where: "Header",
          how: "Otomatis",
          required: true,
        },
        {
          field: "Bill Reference",
          value: "INV-SBM-001",
          where: "Header",
          how: "Ketik",
          required: true,
        },
        {
          field: "Payment Terms",
          value: vendor.paymentTerms,
          where: "Header",
          how: "Otomatis/pilih",
        },
        {
          field: "Lines",
          value: `${kopi.name} × ${seed.po.kopiQty}; ${seed.products.teh.name} × ${seed.po.tehQty}`,
          where: "Invoice Lines",
          how: "Otomatis",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/14-vendor-bills.png",
        caption: "Vendor Bill dari PO — siap Confirm",
      },
    },
    {
      id: "proc-register-payment",
      title: "Register Payment Customer",
      goal: "Melunasi invoice Toko Maju Jaya dan membersihkan residual.",
      preparation: [
        "Invoice Posted dengan residual > 0",
        "Bank/Cash journal siap",
      ],
      steps: [
        "Buka Customer Invoice → Register Payment",
        "Pilih Journal Bank",
        "Amount = residual (pelunasan penuh) atau sebagian",
        "Payment Date hari ini → Create Payment",
        "Pastikan invoice Payment Status = Paid",
      ],
      expectedResult: "account.payment tercatat; AR berkurang; invoice Paid.",
      verification: [
        "Invoice residual 0",
        "Bank journal item muncul",
        "Aged Receivable tidak lagi memuat invoice ini (jika lunas)",
      ],
      fillFields: [
        {
          field: "Journal",
          value: "Bank",
          where: "Payment wizard",
          how: "Pilih",
          required: true,
        },
        {
          field: "Amount",
          value: "(total invoice residual)",
          where: "Payment wizard",
          how: "Ketik/otomatis",
          required: true,
        },
        {
          field: "Customer",
          value: customer.name,
          where: "Payment wizard",
          how: "Otomatis",
        },
        {
          field: "Payment Date",
          value: "2026-10-25",
          where: "Payment wizard",
          how: "Ketik",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/15-customer-invoices.png",
        caption: "Wizard Register Payment pada Customer Invoice",
      },
    },
  ],
  scenarios: [
    {
      id: "sc-otc-accounting",
      title: "Order-to-Cash finance close",
      whenToUse: "Setelah Sales delivery selesai.",
      flow: [
        "Create Invoice dari SO",
        "Confirm",
        "Register Payment",
        "Cek P&L revenue & tax",
      ],
    },
    {
      id: "sc-p2p-accounting",
      title: "Procure-to-Pay finance close",
      whenToUse: "Setelah Receipt PO.",
      flow: [
        "Create Bill dari PO",
        "Confirm",
        "Register Payment vendor saat due",
        "Cek Aged Payable",
      ],
    },
    {
      id: "sc-credit-note",
      title: "Credit note retur penjualan",
      whenToUse: "Customer return sebagian barang / koreksi harga.",
      flow: [
        "Buka invoice → Credit Note",
        "Tentukan qty/amount dikredit",
        "Post credit note",
        "Reconcile dengan invoice / refund",
      ],
    },
    {
      id: "sc-bank-reco",
      title: "Bank reconciliation sederhana",
      whenToUse: "Statement bank bulanan masuk.",
      flow: [
        "Import/isi Bank Statement",
        "Match baris statement dengan payment",
        "Validate reconciliation",
        "Review outstanding",
      ],
      notes: "Fitur penuh di Accounting Enterprise.",
    },
  ],
  integrations: [
    {
      id: "int-acc-sales",
      withModule: "Sales",
      relationship: "SO → out_invoice",
      whatHappens:
        "Create Invoice menyalin order lines; posted invoice mengupdate invoice_status sale.order.",
    },
    {
      id: "int-acc-purchase",
      withModule: "Purchase",
      relationship: "PO → in_invoice",
      whatHappens:
        "Create Bill menyalin purchase lines; qty_invoiced di PO naik setelah post.",
    },
    {
      id: "int-acc-inventory",
      withModule: "Inventory",
      relationship: "Valuation journals",
      whatHappens:
        "Automated valuation menghasilkan account.move dari stock.valuation.layer saat receipt/delivery.",
    },
    {
      id: "int-acc-contacts",
      withModule: "Contacts",
      relationship: "Partner receivable/payable",
      whatHappens:
        "Setiap partner punya property account receivable/payable yang dipakai journal items.",
    },
  ],
  mistakes: [
    {
      id: "m-draft-forever",
      problem: "Invoice/Bill dibiarkan Draft",
      why: "Tidak mempengaruhi AR/AP & laporan resmi",
      detect: "Dokumen status Draft di list; laporan kosong",
      fix: "Confirm/Post setelah review",
      prevent: "SOP daily: post semua draft valid sebelum EOD",
    },
    {
      id: "m-manual-duplicate",
      problem: "Invoice manual + invoice dari SO untuk order sama",
      why: "Double revenue & double AR",
      detect: "Dua INV dengan deskripsi sama; SO tetap To Invoice atau over-invoiced",
      fix: "Credit note salah satu; jaga satu sumber",
      prevent: "Selalu Create Invoice dari SO",
    },
    {
      id: "m-wrong-period",
      problem: "Accounting Date di periode salah",
      why: "P&L bulan meleset",
      detect: "Laporan periode tidak memuat transaksi",
      fix: "Reverse & re-post di tanggal benar (atau reset draft jika belum lock)",
      prevent: "Checklist tanggal sebelum Confirm; pakai lock dates",
    },
    {
      id: "m-tax-wrong-type",
      problem: "Pakai purchase tax di customer invoice",
      why: "Tax report kacau; PPN keluaran/masukan tertukar",
      detect: "Tax line tidak masuk grid sales",
      fix: "Credit note; buat ulang dengan sales tax",
      prevent: "Tax type benar di produk; review tax di draft",
    },
    {
      id: "m-pay-unreconciled",
      problem: "Payment dibuat tanpa merekonsiliasi invoice",
      why: "AR residual tetap ada; outstanding dobel",
      detect: "Invoice Not Paid padahal ada payment partner",
      fix: "Reconcile payment dengan invoice di Outstanding Credits",
      prevent: "Register Payment dari tombol invoice, bukan payment lepas",
    },
  ],
  troubleshooting: [
    {
      id: "t-cannot-post",
      problem: "Confirm Invoice gagal (missing account / unbalanced)",
      causes: [
        "Income/expense account produk kosong",
        "Tax account belum diset",
        "Journal sequence issue",
      ],
      diagnosis: [
        "Buka product Accounting tab",
        "Cek tax configuration",
        "Baca traceback/error dialog",
      ],
      solution: [
        "Set Income Account di produk/kategori",
        "Lengkapi tax accounts",
        "Perbaiki journal sequence",
      ],
      prevention: "Master Accounting selesai sebelum transaksi live",
    },
    {
      id: "t-tax-zero",
      problem: "Total tax 0 pada invoice",
      causes: [
        "Line tanpa tax",
        "Fiscal position mengganti ke 0%",
        "Harga include tax misconfigured",
      ],
      diagnosis: [
        "Cek kolom Taxes per line",
        "Cek fiscal position partner",
      ],
      solution: [
        `Tambahkan ${kopi.salesTax}`,
        "Koreksi fiscal position",
      ],
      prevention: "Default taxes + product taxes wajib untuk taxable goods",
    },
    {
      id: "t-payment-status",
      problem: "Invoice tetap Not Paid setelah payment",
      causes: [
        "Payment belum di-reconcile",
        "Amount payment beda currency",
        "Payment ke partner berbeda",
      ],
      diagnosis: [
        "Cek Outstanding receipts/payments di invoice",
        "Cek partner_id payment vs invoice",
      ],
      solution: [
        "Add & Reconcile outstanding",
        "Buat payment ulang dari invoice",
      ],
      prevention: "Gunakan Register Payment pada form invoice",
    },
    {
      id: "t-report-mismatch",
      problem: "P&L tidak sama dengan total Sales Analysis",
      causes: [
        "Invoice belum posted",
        "Credit notes",
        "Revenue account mapping beda produk",
        "Cutoff tanggal berbeda",
      ],
      diagnosis: [
        "Filter tanggal sama",
        "Bandingkan hanya posted invoices",
        "Cek akun income per produk",
      ],
      solution: [
        "Post draft",
        "Samakan mapping akun",
        "Pahami Sales Analysis vs Accounting recognition",
      ],
      prevention: "Dokumentasikan kebijakan recognition & mapping akun",
    },
  ],
  behind: {
    models: [
      "account.move",
      "account.move.line",
      "account.payment",
      "account.account",
      "account.tax",
      "account.journal",
      "account.partial.reconcile",
      "account.bank.statement",
      "account.bank.statement.line",
      "res.partner",
    ],
    relations: [
      "account.move.partner_id → res.partner",
      "account.move.line_ids → account.move.line",
      "account.move.invoice_line_ids → account.move.line (display)",
      "account.payment.reconciled_invoice_ids → account.move",
      "sale.order.invoice_ids → account.move",
      "purchase.order.invoice_ids → account.move",
    ],
    automations: [
      "action_post: draft→posted, create tax lines, sequence name",
      "Register payment wizard creates account.payment + reconcile",
      "SO/PO create invoice buttons map lines & link origin",
    ],
    securityNotes: [
      "account.group_account_invoice vs account.group_account_manager / advisor",
      "Posting & lock dates biasanya hanya Accountant/Advisor",
    ],
    note: "Di Odoo 19, account.move mencakup invoice, bill, credit note, dan entry umum; bedanya pada move_type.",
  },
  reporting: [
    {
      name: "Profit and Loss",
      path: "Accounting → Reporting → Profit and Loss",
      kpi: "Revenue, COGS, Gross Profit, Net Profit",
      decision: "Apakah margin penjualan kopi sehat setelah PPN & biaya?",
    },
    {
      name: "Balance Sheet",
      path: "Accounting → Reporting → Balance Sheet",
      kpi: "Aset (termasuk stok), liabilitas AP, ekuitas",
      decision: "Posisi keuangan ${company.name} per tanggal cutoff",
    },
    {
      name: "Aged Receivable",
      path: "Accounting → Reporting → Partner Reports → Aged Receivable",
      kpi: "Piutang per bucket umur",
      decision: `Follow-up ${customer.name} / ${distributor.name} yang jatuh tempo`,
    },
    {
      name: "Tax Report",
      path: "Accounting → Reporting → Tax Report",
      kpi: "PPN keluaran vs masukan",
      decision: "Hitung kewajiban PPN periode berjalan",
    },
  ],
  security: {
    roles: [
      {
        role: "Invoicing / Billing",
        can: [
          "Buat & kirim customer invoice",
          "Buat vendor bill draft",
          "Register payment terbatas",
        ],
        cannot: [
          "Ubah Chart of Accounts & Taxes master",
          "Buka lock dates",
          "Hapus journal posted tanpa hak khusus",
        ],
        whyDifferent:
          "Operasional AR/AP vs kontrol kebijakan ledger oleh Accountant/Advisor.",
      },
      {
        role: "Accountant / Adviser",
        can: [
          "Post semua journal",
          "Rekonsiliasi bank",
          "Setup taxes, COA, lock dates",
          "Lihat laporan keuangan penuh",
        ],
        cannot: [
          "Biasanya tidak mengubah SO/PO operasional tanpa hak Sales/Purchase",
        ],
        whyDifferent:
          "Fokus integritas buku besar dan closing, bukan proses gudang/sales harian.",
      },
    ],
    notes: [
      "Pisahkan maker-checker: user buat draft, accountant post",
      "Akses bank journal & payment harus terbatas (sensitif)",
    ],
  },
  levels: {
    beginner: [
      "Kenali COA, Taxes, Journals",
      "Create Invoice dari SO seed",
      "Create Bill dari PO seed",
      "Baca total Untaxed vs Tax",
    ],
    intermediate: [
      "Register Payment AR & AP",
      "Credit note dasar",
      "Aged Receivable/Payable",
      "Pahami status Draft/Posted/Paid/Cancelled",
    ],
    advanced: [
      "Bank reconciliation",
      "Analytic accounts",
      "Lock dates & period closing",
      "Valuation journals vs invoice journals",
    ],
    expert: [
      "Desain COA & tax mapping lokal",
      "Multi-currency & unrealized gains",
      "Automation follow-up & payment matching rules",
      "KPI cash conversion cycle O2C/P2P",
    ],
  },
  exercises: [
    {
      id: "ex-inv-so",
      title: "Invoice dari SO retail",
      objective: `Post invoice ${customer.name}`,
      prerequisites: ["SO delivered"],
      task: ["Create Invoice", "Confirm", "Cek Tax 11%"],
      expectedResult: "Posted out_invoice linked ke SO",
      checklist: ["Origin SO", "Lines kopi+jasa", "Terms 15 Days"],
    },
    {
      id: "ex-bill-po",
      title: "Bill dari PO bahan",
      objective: `Post bill ${vendor.name}`,
      prerequisites: ["PO received"],
      task: ["Create Bill", "Isi Bill Reference", "Confirm"],
      expectedResult: "Posted in_invoice; PO Fully Billed",
      checklist: ["Qty = received", "Purchase tax ada"],
    },
    {
      id: "ex-payment-ar",
      title: "Pelunasan customer",
      objective: "Invoice menjadi Paid",
      prerequisites: ["Invoice posted"],
      task: ["Register Payment Bank", "Amount penuh", "Validate"],
      expectedResult: "Payment Status Paid; residual 0",
      checklist: ["Journal Bank", "Partner benar"],
    },
    {
      id: "ex-credit-note",
      title: "Credit note 1 unit kopi",
      objective: "Koreksi invoice setelah retur",
      prerequisites: ["Invoice paid atau open"],
      task: [
        "Credit Note qty 1 untuk Kopi Arabika 1kg",
        "Post",
        "Reconcile/refund sesuai status",
      ],
      expectedResult: "Revenue & tax berkurang 1 unit",
      checklist: ["Linked ke invoice asal", "Tax terbalik benar"],
    },
    {
      id: "ex-reports",
      title: "Baca P&L dan Aged Receivable",
      objective: "Interpretasi laporan setelah siklus E2E",
      prerequisites: ["Minimal 1 invoice & 1 bill posted"],
      task: [
        "Buka Profit and Loss periode berjalan",
        "Buka Aged Receivable",
        "Catat saldo ${customer.name}",
      ],
      expectedResult: "Angka cocok dengan dokumen posted",
      checklist: ["Filter tanggal benar", "Hanya Posted"],
    },
  ],
  coreFlowLinks: [
    { label: "Master Accounting", href: "/modul/master-accounting" },
    { label: "Chart of Accounts", href: "/modul/master-accounting/chart-of-accounts" },
    { label: "Taxes & Journals", href: "/modul/master-accounting/taxes-journals-terms" },
    { label: "Flow Invoicing", href: "/modul/flow-invoicing" },
    { label: "Customer Invoice & Payment", href: "/modul/flow-invoicing/customer-invoice-payment" },
    { label: "Bank Reco & Reports", href: "/modul/flow-invoicing/bank-reco-reports" },
    { label: "E2E Cycle", href: "/modul/flow-end-to-end" },
  ],
};
