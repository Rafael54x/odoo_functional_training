import type { DeepDiveModule } from "../types";
import { seed } from "../../seed";

const customer = seed.customers.toko;
const distributor = seed.customers.distributor;
const kopi = seed.products.kopi;
const jasa = seed.products.jasa;
const teh = seed.products.teh;
const company = seed.company;

/**
 * Deep Dive — Subscriptions
 * Recurring products, plans/recurrence, sale.order subscription,
 * close/renew/upsell, invoicing cadence, MRR untuk pemula.
 */
export const subscriptionsDeepDive: DeepDiveModule = {
  slug: "subscriptions",
  name: "Subscriptions — Recurring Revenue & Plans",
  shortTitle: "Subscriptions",
  icon: "RefreshCw",
  category: "sales",
  wave: 4,
  availability: "available",
  apps: ["Subscriptions", "Sales", "Invoicing", "Contacts", "Products"],
  overview: {
    function:
      "Modul Subscriptions (Odoo 19 Enterprise) mengelola penjualan berulang: produk/jasa dengan recurrence (mingguan, bulanan, tahunan), subscription plan, dokumen sale.order bertipe subscription, siklus invoice otomatis, serta aksi close / renew / upsell. Bagi pemula, pikirkan Subscriptions sebagai Sales Order yang 'hidup terus' sampai ditutup — setiap periode sistem membuat invoice sesuai cadence, sehingga MRR (Monthly Recurring Revenue) bisa dipantau.",
    businessProblem:
      "Tanpa Subscriptions, kontrak langganan dicatat sebagai SO sekali bayar atau invoice manual berulang. Tim lupa tagih, renewal hilang di spreadsheet, upsell tidak terukur, dan keuangan tidak melihat MRR vs one-shot sales.",
    typicalUsers: [
      "Sales Subscription / Account Manager",
      "Customer Success (renewal & churn)",
      "Finance / Billing (invoice cadence)",
      "Product Manager (recurring catalog)",
    ],
    whenNeeded:
      "Saat ada produk/jasa berulang (membership, support retainer, langganan pengiriman, SaaS-like fee) yang harus ditagih otomatis per periode dan dilaporkan sebagai recurring revenue.",
    relatedModules: ["Sales", "Invoicing / Accounting", "Contacts", "Products", "CRM", "Website (opsional eCommerce)"],
    businessScenario: `${company.name} menjual paket langganan bulanan "Kopi Retail Retainer" ke ${customer.name} (kirim ${kopi.name} + ${jasa.name} setiap bulan) dan paket tahunan support distributor ke ${distributor.name}. Tim Sales membuat subscription dari quotation, Finance memantau invoice otomatis, Customer Success menangani renew/upsell/close saat kontrak berakhir atau pelanggan naik paket.`,
  },
  prerequisites: {
    modules: [
      "Subscriptions app terpasang (Enterprise)",
      "Sales (quotation → confirmation)",
      "Invoicing / Accounting untuk customer invoice",
      "Contacts (customer subscription)",
      "Products — katalog recurring",
    ],
    masterData: [
      `Contact/customer: ${customer.name}, ${distributor.name}`,
      "Recurring products (product.template) dengan Recurring invoice / subscription flag",
      "Subscription Plans / Recurrence periods (bulan, tahun, dll.)",
      "Pricelist IDR (seed: IDR Public Pricelist)",
      "Payment Terms customer (15 Days / 30 Days sesuai seed)",
      `Produk contoh: ${kopi.name}, ${jasa.name}, ${teh.name}`,
    ],
    configuration: [
      "Subscriptions → Configuration → Settings",
      "Subscriptions → Configuration → Recurrence Periods / Plans",
      "Sales → Settings: quotation & invoicing policy terkait",
      "Products: tandai produk sebagai Recurring / Subscription",
      "Journal & tax penjualan (Pajak Penjualan 11%) siap",
    ],
    access: [
      "Sales / User: buat quotation & subscription milik sendiri",
      "Sales / Administrator atau Subscriptions Manager: konfigurasi plan, close massal, reporting MRR",
      "Billing / Accountant: post invoice dari subscription",
    ],
    relationships:
      "sale.order (subscription) → res.partner; order line → product.product dengan recurrence; plan/recurrence menentukan next invoice date; account.move (invoice) dihasilkan per cadence; close/renew mengubah state subscription tanpa menghapus sejarah invoice.",
  },
  installation: {
    how: [
      "Home → Apps",
      "Cari 'Subscriptions' (atau 'Subscription')",
      "Klik Install pada aplikasi Subscriptions",
      "Pastikan menu Subscriptions muncul di App Switcher",
      "Refresh / login ulang jika menu belum terlihat",
    ],
    dependencies: [
      "Sales (sale_management) — fondasi quotation/SO",
      "Invoicing / Account — customer invoices",
      "Contacts — partner pelanggan",
      "Products — master produk recurring",
    ],
    afterInstall: [
      "Buka Subscriptions → Configuration → Settings, aktifkan opsi yang dibutuhkan lab",
      "Buat/sesuaikan Recurrence Period (Monthly, Yearly)",
      "Tandai minimal satu produk sebagai recurring (mis. retainer jasa atau paket kopi bulanan)",
      "Uji alur: Quotation → Confirm → Subscription aktif → Generate/cek invoice",
    ],
    newMenus: [
      "Subscriptions → Subscriptions (list/kanban aktif)",
      "Subscriptions → Quotations (quotation bertipe subscription)",
      "Subscriptions → Reporting (MRR, Retention, dll.)",
      "Subscriptions → Configuration → Settings",
      "Subscriptions → Configuration → Recurrence Periods / Plans",
      "Sales → Products (dengan opsi recurring)",
    ],
    newSettings: [
      "Settings → Subscriptions",
      "Settings → Sales (invoicing policy, quotation template terkait)",
      "Product form → tab Sales / Recurring invoice options",
    ],
  },
  configurations: [
    {
      id: "sub-recurrence",
      name: "Recurrence Periods / Subscription Plans",
      location: "Subscriptions → Configuration → Recurrence Periods (atau Plans)",
      what: "Definisi periode tagih: Weekly, Monthly, Quarterly, Yearly — dasar cadence invoice.",
      whyEnable:
        "Tanpa recurrence, produk tidak punya siklus tagih yang konsisten; MRR tidak bisa dihitung per plan.",
      whenEnable:
        `Segera setelah install — minimal Monthly dan Yearly untuk lab ${company.name}.`,
      whenNot:
        "Tidak relevan menonaktifkan; yang salah adalah membuat terlalu banyak periode custom sebelum butuh.",
      businessExample: `Plan "Monthly Retail" untuk ${customer.name} (tagih tiap 1 bulan); plan "Yearly Distributor Support" untuk ${distributor.name}.`,
      impact:
        "Field Recurrence di quotation/subscription; next invoice date; reporting per plan.",
      screenshot: {
        src: "/screenshots/odoo19e/w4-settings-subscriptions.png",
        caption: "Settings Subscriptions — opsi recurrence & perilaku langganan",
        whatYouSee: "Halaman konfigurasi aplikasi Subscriptions Odoo 19 Enterprise",
        why: "Recurrence/plan harus siap sebelum membuat produk & SO subscription",
      },
    },
    {
      id: "sub-recurring-product",
      name: "Recurring Products",
      location: "Sales → Products → Product form (Recurring / Subscription)",
      what: "Menandai product.template sebagai produk langganan agar muncul di alur Subscriptions.",
      whyEnable:
        "Hanya produk recurring yang membentuk subscription line dengan cadence; produk one-shot tetap SO biasa.",
      whenEnable:
        "Untuk retainer, membership, paket kirim berkala, atau fee support berulang.",
      whenNot:
        `Jangan tandai ${kopi.name} storable biasa sebagai recurring jika penjualan selalu one-shot — gunakan produk terpisah 'Paket Langganan Kopi Bulanan'.`,
      businessExample: `Produk "Retainer Kopi Retail Monthly" (service/combo) harga berulang; line opsional ${jasa.name} pengiriman dalam paket.`,
      impact:
        "Produk muncul di filter Subscriptions Products; quotation dengan line ini menjadi subscription saat confirm.",
      screenshot: {
        src: "/screenshots/odoo19e/w4-subscriptions-products.png",
        caption: "Daftar produk subscription / recurring di katalog",
        whatYouSee: "List produk yang dipakai untuk langganan",
        why: "Catalog recurring terpisah mental dari stok one-shot",
      },
    },
    {
      id: "sub-auto-invoice",
      name: "Automatic Invoicing Cadence",
      location: "Settings → Subscriptions + cron/scheduled action invoice",
      what: "Sistem membuat draft/post invoice sesuai next invoice date pada subscription aktif.",
      whyEnable:
        "Menghilangkan tagihan manual bulanan yang mudah lupa untuk puluhan pelanggan.",
      whenEnable:
        "Volume subscription > beberapa pelanggan atau komitmen SLA billing ke finance.",
      whenNot:
        "Fase latihan awal — boleh Generate Invoice manual dulu agar paham field tanggal.",
      businessExample: `Setiap tanggal 1, subscription ${customer.name} menghasilkan invoice IDR untuk paket kopi bulanan.`,
      impact:
        "account.move terhubung subscription; smart button Invoices; MRR mengikuti invoice period.",
      screenshot: {
        src: "/screenshots/odoo19e/15-customer-invoices.png",
        caption: "Customer Invoices — hasil cadence penagihan subscription",
        whatYouSee: "Daftar invoice pelanggan yang bisa berasal dari subscription",
        why: "Finance memverifikasi output billing di Invoicing",
      },
    },
    {
      id: "sub-close-reasons",
      name: "Close Reasons / Churn Tracking",
      location: "Subscriptions → Configuration → Close Reasons (jika tersedia) / Settings",
      what: "Alasan penutupan subscription (harga, pindah vendor, selesai proyek, dll.).",
      whyEnable:
        "Churn tanpa alasan tidak bisa dianalisis; Customer Success butuh kategori.",
      whenEnable:
        "Saat mulai mengukur retention/MRR secara serius.",
      whenNot:
        "Lab pemula fokus confirm + invoice dulu; alasan close bisa ditambah belakangan.",
      businessExample: `${customer.name} close karena "Budget retail turun" — masuk laporan churn reason.`,
      impact:
        "Action Close meminta reason; reporting retention memisahkan voluntary vs lain.",
    },
    {
      id: "sub-upsell-renew",
      name: "Upsell & Renew Actions",
      location: "Form Subscription → Action Upsell / Renew",
      what: "Upsell: quotation tambahan terhubung subscription aktif. Renew: perpanjang periode/end date.",
      whyEnable:
        "Naik paket atau perpanjang kontrak tanpa membuat SO orphan yang tidak terhubung MRR lama.",
      whenEnable:
        "Account manager aktif menawarkan paket lebih tinggi atau kontrak tahunan.",
      whenNot:
        "Jangan upsell dengan mengedit sembarangan historical invoice — selalu lewat alur Upsell.",
      businessExample: `${distributor.name} naik dari paket basic ke paket include ${teh.name} tambahan — Upsell quotation lalu confirm.`,
      impact:
        "Subscription lines bertambah/berubah; MRR naik; jejak quotation upsell tersimpan.",
      screenshot: {
        src: "/screenshots/odoo19e/w4-subscription-form.png",
        caption: "Form subscription — header, lines, aksi renew/upsell/close",
        whatYouSee: "Detail subscription sale.order di Odoo 19",
        why: "Titik operasional harian Account Manager",
      },
    },
    {
      id: "sub-payment-token",
      name: "Online Payment / Token (opsional)",
      location: "Settings → Subscriptions / Payment Providers",
      what: "Pembayaran otomatis dengan payment token (kartu) untuk self-service renewal.",
      whyEnable:
        "Mengurangi DSO untuk B2C/SMB yang bayar online tiap periode.",
      whenEnable:
        "Payment provider sudah dikonfigurasi dan pelanggan setuju auto-debit.",
      whenNot:
        `B2B ${distributor.name} dengan Payment Terms 30 Days + transfer manual — token belum perlu.`,
      businessExample: `Retail kecil bayar bulanan online; ${distributor.name} tetap invoice + transfer.`,
      impact:
        "Invoice bisa auto-paid; gagal bayar memicu reminder/close policy (sesuai setup).",
      screenshot: {
        src: "/screenshots/odoo19e/w4-00-home-apps.png",
        caption: "Home Apps — pastikan Subscriptions, Sales, Invoicing terpasang",
        whatYouSee: "Daftar aplikasi Odoo termasuk Subscriptions",
        why: "Stack billing lengkap sebelum opsi payment token",
      },
    },
  ],
  masterData: [
    {
      id: "md-sub-product",
      name: "Recurring Product (product.template)",
      purpose: "SKU/jasa yang ditagih berulang dan masuk alur Subscriptions.",
      required: true,
      whyNeeded:
        "Tanpa produk recurring, quotation tidak membentuk subscription yang benar.",
      fields: [
        {
          field: "Product Name",
          type: "Char",
          required: true,
          purpose: "Nama di katalog & invoice line",
          why: "Pelanggan & finance mengenali paket",
          example: "Paket Langganan Kopi Retail Monthly",
          impactIfEmpty: "Produk tidak tersimpan",
        },
        {
          field: "Product Type",
          type: "Selection",
          required: true,
          purpose: "Goods / Service / Combo sesuai desain paket",
          why: "Service murni sering dipakai retainer; goods jika kirim fisik berkala",
          example: "Service (retainer) atau Goods+Service combo",
          impactIfEmpty: "Tipe default bisa salah untuk stok/invoice",
        },
        {
          field: "Sales Price",
          type: "Monetary",
          required: true,
          purpose: "Harga per periode recurrence",
          why: "Dasar MRR = harga × qty (disesuaikan ke bulanan di report)",
          example: "500000 (IDR per bulan)",
          impactIfEmpty: "Invoice 0; MRR salah",
        },
        {
          field: "Recurring / Subscription",
          type: "Boolean",
          required: false,
          purpose: "Flag produk langganan",
          why: "Masuk filter & alur Subscriptions",
          example: "True",
          impactIfEmpty: "Perilaku seperti produk one-shot",
        },
        {
          field: "Recurrence",
          type: "Many2one",
          required: false,
          purpose: "Periode default (Monthly/Yearly)",
          why: "Pre-fill di quotation line",
          example: "Monthly",
          impactIfEmpty: "Harus dipilih manual di SO",
          related: "sale.temporal.recurrence / subscription plan",
        },
        {
          field: "Customer Taxes",
          type: "Many2many",
          required: false,
          purpose: "Pajak penjualan",
          why: "Invoice compliance ID",
          example: "Pajak Penjualan 11%",
          impactIfEmpty: "Invoice tanpa PPN jika seharusnya kena",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/07-products-list.png",
        caption: "Products list — buat SKU recurring di samping katalog biasa",
        whatYouSee: "Daftar produk Sales termasuk kandidat langganan",
      },
    },
    {
      id: "md-sub-plan",
      name: "Recurrence Period / Plan",
      purpose: "Master periode tagih yang dipakai subscription lines.",
      required: true,
      whyNeeded:
        "Cadence invoice dan normalisasi MRR bergantung definisi periode.",
      fields: [
        {
          field: "Name",
          type: "Char",
          required: true,
          purpose: "Label periode",
          why: "Tampil di SO & report",
          example: "Monthly",
          impactIfEmpty: "Period tidak tersimpan",
        },
        {
          field: "Duration / Unit",
          type: "Integer + Selection",
          required: true,
          purpose: "Panjang satu siklus (1 Month, 1 Year)",
          why: "Menghitung next invoice date",
          example: "1 Month",
          impactIfEmpty: "Tanggal invoice tidak terhitung",
        },
        {
          field: "Active",
          type: "Boolean",
          required: false,
          purpose: "Periode boleh dipilih",
          why: "Nonaktifkan periode usang tanpa hapus sejarah",
          example: "True",
          impactIfEmpty: "Default active",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-settings-subscriptions.png",
        caption: "Konfigurasi terkait plan/recurrence Subscriptions",
      },
    },
    {
      id: "md-sub-order",
      name: "Subscription (sale.order)",
      purpose: "Dokumen langganan aktif: pelanggan, lines, recurrence, tanggal, state.",
      required: true,
      whyNeeded:
        "Ini unit kerja harian Subscriptions — setara 'kontrak hidup' di Odoo.",
      fields: [
        {
          field: "Customer",
          type: "Many2one",
          required: true,
          purpose: "Pemilik langganan",
          why: "Invoice & portal & MRR per partner",
          example: customer.name,
          impactIfEmpty: "SO tidak bisa confirm",
          related: "res.partner",
        },
        {
          field: "Payment Terms",
          type: "Many2one",
          required: false,
          purpose: "Jatuh tempo invoice",
          why: "Cashflow & DSO",
          example: customer.paymentTerms,
          impactIfEmpty: "Default company terms",
        },
        {
          field: "Recurrence",
          type: "Many2one",
          required: true,
          purpose: "Siklus tagih subscription",
          why: "Next invoice & MRR bucket",
          example: "Monthly",
          impactIfEmpty: "Bukan subscription valid",
        },
        {
          field: "Date / Start Date",
          type: "Date",
          required: false,
          purpose: "Mulai kontrak",
          why: "Awal perhitungan periode",
          example: "Hari confirm lab",
          impactIfEmpty: "Default hari ini",
        },
        {
          field: "End Date",
          type: "Date",
          required: false,
          purpose: "Akhir kontrak (jika fixed term)",
          why: "Renewal reminder; auto-close",
          example: "12 bulan kemudian",
          impactIfEmpty: "Evergreen sampai Close manual",
        },
        {
          field: "Order Lines",
          type: "One2many",
          required: true,
          purpose: "Produk/jasa recurring + qty + price",
          why: "Isi invoice tiap periode",
          example: `1 × Paket Kopi Monthly + ${jasa.name}`,
          impactIfEmpty: "Tidak ada yang ditagih",
        },
        {
          field: "Next Invoice Date",
          type: "Date",
          required: false,
          purpose: "Jadwal tagih berikutnya",
          why: "Cron/manual generate",
          example: "Awal bulan depan",
          impactIfEmpty: "Billing berhenti / tertunda",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-subscription-form.png",
        caption: "Form Subscription — field inti sale.order subscription",
        whatYouSee: "Header customer, recurrence, lines, status",
        whatToFill: `Customer ${customer.name}, recurrence Monthly, lines paket`,
      },
    },
    {
      id: "md-sub-contact",
      name: "Customer Contact (res.partner)",
      purpose: "Master pelanggan yang punya satu atau lebih subscription.",
      required: true,
      whyNeeded:
        "Subscription tanpa partner valid memutus invoice, email, dan analisis churn.",
      fields: [
        {
          field: "Name",
          type: "Char",
          required: true,
          purpose: "Nama customer",
          why: "Identitas kontrak",
          example: customer.name,
          impactIfEmpty: "Contact invalid",
        },
        {
          field: "Email",
          type: "Char",
          required: false,
          purpose: "Kirim invoice & reminder",
          why: "Billing communication",
          example: customer.email,
          impactIfEmpty: "Invoice tidak terkirim otomatis",
        },
        {
          field: "Payment Terms",
          type: "Many2one",
          required: false,
          purpose: "Default terms ke SO",
          why: "Konsistensi cash collection",
          example: customer.paymentTerms,
          impactIfEmpty: "Terms diisi manual tiap SO",
        },
        {
          field: "Pricelist",
          type: "Many2one",
          required: false,
          purpose: "Harga paket per segmen",
          why: "Retail vs distributor beda harga",
          example: customer.pricelist,
          impactIfEmpty: "Public price / company default",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/02-contacts-list.png",
        caption: "Contacts — pelanggan subscription harus bersih di master",
      },
    },
  ],
  dependencies: {
    nodes: [
      { id: "contacts", label: "Contacts" },
      { id: "products", label: "Recurring Products" },
      { id: "plans", label: "Recurrence Plans" },
      { id: "sales", label: "Sales Quotation" },
      { id: "subscription", label: "Subscription (SO)" },
      { id: "invoice", label: "Customer Invoice" },
      { id: "mrr", label: "MRR Reporting" },
    ],
    edges: [
      {
        from: "contacts",
        to: "subscription",
        why: "partner_id pemilik kontrak langganan",
      },
      {
        from: "products",
        to: "sales",
        why: "Line quotation memakai produk recurring",
      },
      {
        from: "plans",
        to: "subscription",
        why: "Recurrence menentukan cadence & next invoice",
      },
      {
        from: "sales",
        to: "subscription",
        why: "Confirm quotation → subscription aktif",
      },
      {
        from: "subscription",
        to: "invoice",
        why: "Tiap periode generate account.move",
      },
      {
        from: "subscription",
        to: "mrr",
        why: "Nilai berulang dinormalisasi ke bulanan di laporan",
      },
    ],
    summary:
      "Contacts + recurring products + plans membentuk quotation; confirm menjadi subscription hidup; cadence menghasilkan invoice; reporting membaca MRR/retention dari subscription aktif vs closed.",
  },
  forms: [
    {
      id: "form-sub-quotation",
      name: "Subscription Quotation (sale.order)",
      menuPath: "Subscriptions → Quotations → New (atau Sales → New dengan produk recurring)",
      fields: [
        {
          field: "Customer",
          required: true,
          purpose: "Pelanggan langganan",
          why: "Kontrak & invoice",
          example: customer.name,
        },
        {
          field: "Expiration",
          required: false,
          purpose: "Batas berlaku penawaran",
          why: "Tekan keputusan sebelum start date",
          example: "7 hari dari hari ini",
        },
        {
          field: "Payment Terms",
          required: false,
          purpose: "Tempo bayar invoice",
          why: "Selaras seed customer",
          example: customer.paymentTerms,
        },
        {
          field: "Recurrence",
          required: true,
          purpose: "Siklus tagih",
          why: "Membedakan SO biasa vs subscription",
          example: "Monthly",
        },
        {
          field: "Product line",
          required: true,
          purpose: "Paket recurring",
          why: "Isi tagihan tiap periode",
          example: "Paket Langganan Kopi Retail Monthly × 1",
        },
        {
          field: "Optional service line",
          required: false,
          purpose: "Add-on berulang",
          why: "Upsell kecil sejak awal",
          example: `${jasa.name} × 1`,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/09-sales-quotation-form.png",
        caption: "Form quotation Sales — pola pengisian mirip subscription quotation",
        whatYouSee: "Header customer dan order lines",
        whatToFill: `Customer ${customer.name}, produk recurring, recurrence Monthly`,
      },
    },
    {
      id: "form-subscription",
      name: "Subscription Form",
      menuPath: "Subscriptions → Subscriptions → buka record",
      fields: [
        {
          field: "Status",
          required: true,
          purpose: "In Progress / Closed / dll.",
          why: "Operasional & filter MRR aktif",
          example: "In Progress",
        },
        {
          field: "Next Invoice",
          required: false,
          purpose: "Tanggal tagih berikut",
          why: "Kontrol billing",
          example: "Awal bulan depan",
        },
        {
          field: "End Date",
          required: false,
          purpose: "Akhir kontrak",
          why: "Renewal pipeline",
          example: "+12 bulan",
        },
        {
          field: "Salesperson",
          required: false,
          purpose: "Owner akun",
          why: "Akuntabilitas renew/upsell",
          example: "Administrator",
        },
        {
          field: "Subscription lines",
          required: true,
          purpose: "Isi paket saat ini",
          why: "MRR & invoice content",
          example: `Paket kopi + ${jasa.name}`,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-subscription-form.png",
        caption: "Form subscription aktif setelah confirm",
        whatYouSee: "Status, dates, lines, smart buttons invoice",
      },
    },
    {
      id: "form-sub-product",
      name: "Recurring Product Form",
      menuPath: "Sales → Products → New / Subscriptions Products",
      fields: [
        {
          field: "Name",
          required: true,
          purpose: "Nama paket",
          why: "Tampil di penawaran & invoice",
          example: "Paket Langganan Kopi Retail Monthly",
        },
        {
          field: "Sales Price",
          required: true,
          purpose: "Harga per periode",
          why: "Dasar perhitungan MRR",
          example: "500000",
        },
        {
          field: "Recurring flag",
          required: false,
          purpose: "Aktifkan perilaku subscription",
          why: "Masuk alur Subscriptions",
          example: "Checked",
        },
        {
          field: "Recurrence default",
          required: false,
          purpose: "Periode bawaan",
          why: "Kurangi salah pilih di SO",
          example: "Monthly",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-subscriptions-products.png",
        caption: "Produk subscription di list/katalog",
      },
    },
  ],
  procedures: [
    {
      id: "proc-sub-product",
      title: "Menyiapkan produk recurring untuk lab",
      goal: "Ada minimal satu produk yang bisa dijual sebagai subscription Monthly.",
      preparation: [
        "Apps Subscriptions & Sales terpasang",
        "Recurrence Monthly sudah ada",
        "Pricelist IDR aktif",
      ],
      steps: [
        "Sales → Products → New",
        "Nama: Paket Langganan Kopi Retail Monthly",
        "Type: Service (atau sesuai desain paket lab)",
        "Sales Price: 500000 IDR",
        "Customer Tax: Pajak Penjualan 11%",
        "Aktifkan opsi Recurring / Subscription",
        "Set default Recurrence = Monthly",
        "Save — verifikasi muncul di Subscriptions Products",
      ],
      expectedResult: "Produk recurring siap dipilih di quotation Subscriptions.",
      verification: [
        "Flag recurring tercentang",
        "Harga & tax terisi",
        "Terlihat di filter produk subscription",
      ],
      fillFields: [
        {
          field: "Product Name",
          value: "Paket Langganan Kopi Retail Monthly",
          where: "General",
          how: "Ketik",
          required: true,
        },
        {
          field: "Sales Price",
          value: "500000",
          where: "General",
          how: "Ketik",
          required: true,
        },
        {
          field: "Recurrence",
          value: "Monthly",
          where: "Sales / Recurring",
          how: "Pilih",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-subscriptions-products.png",
        caption: "Setelah save — produk masuk katalog subscription",
      },
    },
    {
      id: "proc-sub-create",
      title: `Membuat subscription untuk ${customer.name}`,
      goal: "Quotation recurring dikonfirmasi menjadi subscription In Progress.",
      preparation: [
        `Contact ${customer.name} ada`,
        "Produk Paket Langganan Kopi Retail Monthly ada",
        "Recurrence Monthly siap",
      ],
      steps: [
        "Subscriptions → Quotations → New",
        `Customer: ${customer.name}`,
        `Payment Terms: ${customer.paymentTerms}`,
        "Pilih Recurrence: Monthly",
        "Add line: Paket Langganan Kopi Retail Monthly × 1",
        `Opsional add line: ${jasa.name} × 1 jika paket include pengiriman`,
        "Send by Email atau Confirm langsung di lab",
        "Confirm — record pindah ke Subscriptions (In Progress)",
        "Catat Next Invoice Date",
      ],
      expectedResult: "Subscription aktif; smart button menunjuk ke SO/subscription; siap ditagih.",
      verification: [
        "Status In Progress (atau setara)",
        "Recurrence = Monthly",
        "Customer benar",
        "Next Invoice Date terisi",
      ],
      fillFields: [
        {
          field: "Customer",
          value: customer.name,
          where: "Header",
          how: "Pilih",
          required: true,
        },
        {
          field: "Recurrence",
          value: "Monthly",
          where: "Header",
          how: "Pilih",
          required: true,
        },
        {
          field: "Product",
          value: "Paket Langganan Kopi Retail Monthly",
          where: "Order Lines",
          how: "Pilih",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-subscriptions.png",
        caption: "List Subscriptions — subscription baru terlihat setelah confirm",
        whatYouSee: "Daftar langganan aktif",
      },
    },
    {
      id: "proc-sub-invoice",
      title: "Menagih periode pertama (invoice cadence)",
      goal: "Invoice pelanggan terbentuk dari subscription dan siap di-post.",
      preparation: [
        "Subscription In Progress",
        "Journal sales & tax siap",
        "Hak akses Billing/Accountant atau Sales yang boleh create invoice",
      ],
      steps: [
        `Buka subscription ${customer.name}`,
        "Action → Create Invoice / Generate Invoice (label sesuai lab)",
        "Atau tunggu/jalankan mekanisme otomatis jika Next Invoice sudah jatuh tempo",
        "Review draft invoice: partner, lines, tax 11%, amount",
        "Confirm / Post invoice",
        "Opsional: Register Payment untuk simulasi lunas",
        "Kembali ke subscription — smart button Invoices bertambah",
      ],
      expectedResult: "account.move posted terhubung subscription; jejak billing periode 1 lengkap.",
      verification: [
        `Invoice customer = ${customer.name}`,
        "Amount selaras paket + tax",
        "Source/document link ke subscription",
        "Next Invoice Date bergeser ke periode berikutnya",
      ],
      fillFields: [
        {
          field: "Invoice lines",
          value: "Review dari subscription lines",
          where: "Invoice form",
          how: "Review",
          required: true,
        },
        {
          field: "Payment Terms",
          value: customer.paymentTerms,
          where: "Other Info / header",
          how: "Pilih jika kosong",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/15-customer-invoices.png",
        caption: "Invoice pelanggan setelah generate dari subscription",
      },
    },
    {
      id: "proc-sub-upsell",
      title: "Upsell paket subscription",
      goal: "MRR naik lewat quotation upsell yang terhubung subscription lama.",
      preparation: [
        "Subscription aktif",
        "Produk add-on atau paket lebih tinggi siap",
        "Salesperson pemilik akun",
      ],
      steps: [
        `Buka subscription ${customer.name}`,
        "Action → Upsell (atau Create Upsell Quotation)",
        `Tambah line: misalnya add-on ${teh.name} berulang atau upgrade harga paket`,
        "Confirm upsell quotation",
        "Verifikasi lines subscription terbarui",
        "Invoice periode berikutnya memakai harga/composition baru",
      ],
      expectedResult: "Subscription lines baru; MRR meningkat; sejarah upsell quotation tersimpan.",
      verification: [
        "Link upsell quotation ↔ subscription",
        "Lines mencerminkan paket baru",
        "Reporting MRR naik setelah periode berlaku",
      ],
      fillFields: [
        {
          field: "Upsell product",
          value: teh.name,
          where: "Upsell quotation lines",
          how: "Pilih",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-subscription-form.png",
        caption: "Form subscription — titik mulai aksi Upsell",
      },
    },
    {
      id: "proc-sub-renew-close",
      title: "Renew atau Close subscription",
      goal: "Memperpanjang kontrak atau menutup dengan alasan churn yang tercatat.",
      preparation: [
        "Subscription mendekati End Date atau permintaan stop dari pelanggan",
        "Close reasons dikonfigurasi (jika dipakai)",
      ],
      steps: [
        "Buka subscription target",
        "Jika perpanjang: Action → Renew — set end date / periode baru, confirm",
        "Jika berhenti: Action → Close — pilih Close Reason",
        "Pastikan tidak ada invoice draft menggantung yang tidak relevan",
        "Komunikasi ke pelanggan lewat chatter jika perlu",
        "Cek Reporting: retention/churn terbarui",
      ],
      expectedResult: "Subscription renewed (masih In Progress) atau Closed dengan reason; MRR aktif turun jika close.",
      verification: [
        "State sesuai aksi",
        "Close reason terisi jika Closed",
        "Tidak ada generate invoice baru setelah Closed",
      ],
      fillFields: [
        {
          field: "Close Reason",
          value: "Budget / End of project (sesuai master)",
          where: "Close wizard",
          how: "Pilih",
          note: "Hanya untuk skenario Close",
        },
        {
          field: "End Date",
          value: "+12 bulan dari hari ini",
          where: "Renew wizard / form",
          how: "Isi tanggal",
          note: "Untuk skenario Renew",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-subscriptions.png",
        caption: "List Subscriptions — filter In Progress vs Closed setelah aksi",
      },
    },
  ],
  scenarios: [
    {
      id: "sc-sub-retail-monthly",
      title: "Langganan bulanan retail sampai invoice pertama",
      whenToUse: `${customer.name} setuju paket kopi bulanan.`,
      flow: [
        "Siapkan produk recurring Monthly",
        "Quotation → Confirm",
        "Subscription In Progress",
        "Generate & post invoice periode 1",
        "Pantau Next Invoice Date",
      ],
      notes: "Jalur default latihan Subscriptions.",
    },
    {
      id: "sc-sub-distributor-yearly",
      title: "Kontrak tahunan distributor + payment terms 30 hari",
      whenToUse: `${distributor.name} ingin support/fee tahunan dengan tempo ${distributor.paymentTerms}.`,
      flow: [
        "Produk recurring Yearly",
        `Quotation ke ${distributor.name}`,
        "Confirm subscription",
        "Invoice tahunan + terms 30 Days",
        "Set End Date + reminder renew H-30",
      ],
    },
    {
      id: "sc-sub-upsell-mrr",
      title: "Upsell menaikkan MRR",
      whenToUse: "Pelanggan puas dan minta add-on.",
      flow: [
        "Subscription aktif",
        "Upsell quotation",
        "Confirm",
        "Invoice berikutnya lebih besar",
        "Bandingkan MRR sebelum/sesudah di Reporting",
      ],
    },
    {
      id: "sc-sub-churn-close",
      title: "Churn dengan close reason",
      whenToUse: "Pelanggan berhenti berlangganan.",
      flow: [
        "Terima permintaan stop",
        "Close + reason",
        "Stop billing",
        "Analisis churn di report",
        "Opsional: win-back campaign (Email Marketing)",
      ],
    },
    {
      id: "sc-sub-mixed-catalog",
      title: "Campur one-shot SO dan subscription",
      whenToUse: `${customer.name} beli ${kopi.name} sekali + punya retainer bulanan.`,
      flow: [
        "SO biasa untuk stok one-shot",
        "Subscription terpisah untuk retainer",
        "Jangan campur di satu dokumen jika cadence beda",
        "Invoice masing-masing jalur",
      ],
      notes: "Pemula sering menggabungkan — pisahkan agar MRR bersih.",
    },
  ],
  integrations: [
    {
      id: "int-sub-sales",
      withModule: "Sales",
      relationship: "Quotation/SO → subscription state pada sale.order",
      whatHappens:
        "Alur penawaran sama dengan Sales; confirm + recurrence mengaktifkan perilaku langganan.",
    },
    {
      id: "int-sub-invoicing",
      withModule: "Invoicing / Accounting",
      relationship: "Subscription → account.move (customer invoice)",
      whatHappens:
        "Setiap periode menghasilkan invoice; payment & tax mengikuti konfigurasi akuntansi.",
    },
    {
      id: "int-sub-contacts",
      withModule: "Contacts",
      relationship: "sale.order.partner_id → res.partner",
      whatHappens:
        "Data pelanggan, email billing, pricelist, dan payment terms mengalir ke subscription.",
    },
    {
      id: "int-sub-crm",
      withModule: "CRM",
      relationship: "Opportunity → quotation subscription (opsional)",
      whatHappens:
        "Deal langganan besar dari pipeline CRM di-convert ke quotation recurring.",
    },
    {
      id: "int-sub-products",
      withModule: "Products / Inventory",
      relationship: "order line → product; goods berulang bisa picu delivery",
      whatHappens:
        "Jika paket include barang storable, delivery per periode mengikuti kebijakan penjualan/stok.",
    },
  ],
  mistakes: [
    {
      id: "m-sub-flag-all-products",
      problem: "Menandai semua produk stok sebagai recurring",
      why: "MRR kotor; SO one-shot ikut terhitung langganan",
      detect: "Subscriptions Products berisi hampir seluruh katalog",
      fix: "Buat SKU paket terpisah; matikan flag pada produk one-shot",
      prevent: "Konvensi nama 'Paket Langganan …' + review katalog",
    },
    {
      id: "m-sub-edit-posted-invoice",
      problem: "Mengubah harga dengan edit invoice lama",
      why: "Sejarah billing rusak; audit gagal; MRR historis salah",
      detect: "Invoice posted diedit atau dibatalkan massal tanpa upsell",
      fix: "Pakai Upsell/change plan untuk periode depan; credit note jika koreksi periode lalu",
      prevent: "SOP: perubahan paket hanya lewat Upsell/Renew",
    },
    {
      id: "m-sub-forget-close",
      problem: "Pelanggan sudah berhenti tapi subscription masih In Progress",
      why: "Invoice hantu; MRR inflated; komplain pelanggan",
      detect: "Invoice draft/post setelah permintaan stop",
      fix: "Close segera + batalkan draft invoice tidak relevan",
      prevent: "Checklist CS: ticket stop → Close subscription hari yang sama",
    },
    {
      id: "m-sub-wrong-recurrence",
      problem: "Yearly price dipasang dengan recurrence Monthly",
      why: "Tagih 12× lipat atau sebaliknya; churn marah",
      detect: "Amount invoice tidak masuk akal vs kontrak PDF",
      fix: "Koreksi recurrence/price; credit note; komunikasi ke pelanggan",
      prevent: "Dual control: Sales + Finance review sebelum confirm",
    },
    {
      id: "m-sub-mix-one-shot",
      problem: "Mencampur line one-shot besar ke dalam subscription",
      why: "Cadence membingungkan; sebagian line tidak seharusnya berulang",
      detect: "Invoice bulanan memuat biaya setup sekali bayar berulang-ulang",
      fix: "Pisah SO one-shot untuk setup; subscription hanya retainer",
      prevent: "Template quotation terpisah: Setup vs Retainer",
    },
    {
      id: "m-sub-ignore-next-date",
      problem: "Mengabaikan Next Invoice Date",
      why: "Billing macet atau dobel jika diutak-atik manual",
      detect: "Tanggal kosong / mundur jauh; backlog invoice",
      fix: "Set ulang next date; generate tertunda dengan hati-hati",
      prevent: "Dashboard mingguan: subscription tanpa next date",
    },
  ],
  troubleshooting: [
    {
      id: "t-sub-not-subscription",
      problem: "Setelah Confirm, dokumen tidak muncul di menu Subscriptions",
      causes: [
        "Produk/line tanpa recurrence / flag recurring",
        "Quotation dibuat di Sales tanpa field recurrence",
        "Filter status di list Subscriptions",
      ],
      diagnosis: [
        "Buka SO — cek field Recurrence terisi",
        "Cek produk line adalah recurring product",
        "Clear filter di Subscriptions → All",
      ],
      solution: [
        "Buat ulang quotation dengan produk recurring + recurrence",
        "Atau set recurrence sebelum confirm jika field masih editable",
        "Pastikan app Subscriptions terpasang",
      ],
      prevention: "SOP: quotation langganan hanya dari menu Subscriptions → Quotations",
    },
    {
      id: "t-sub-no-invoice",
      problem: "Invoice tidak terbuat padahal tanggal sudah lewat",
      causes: [
        "Subscription Closed / paused",
        "Next Invoice Date di masa depan karena salah set",
        "Cron scheduled action tidak jalan di database lab",
        "Hak user tidak bisa create invoice",
      ],
      diagnosis: [
        "Cek state subscription & next date",
        "Settings → Technical → Scheduled Actions (Developer Mode) terkait subscription invoice",
        "Coba Create Invoice manual dari form",
      ],
      solution: [
        "Perbaiki next date",
        "Generate manual untuk mengejar periode",
        "Aktifkan/jalankan cron di lab jika otomatisasi dipakai",
      ],
      prevention: "Uji billing end-to-end di staging sebelum go-live",
    },
    {
      id: "t-sub-mrr-zero",
      problem: "Laporan MRR kosong atau nol",
      causes: [
        "Belum ada subscription In Progress",
        "Filter tanggal reporting salah",
        "Harga line 0 / recurrence tidak dikenali",
      ],
      diagnosis: [
        "Subscriptions list: ada yang In Progress?",
        "Reporting → hapus filter sempit",
        "Cek amount lines & recurrence",
      ],
      solution: [
        "Confirm minimal satu subscription berbayar",
        "Samakan periode report dengan start date",
        "Perbaiki harga produk",
      ],
      prevention: "Setelah install, buat data demo MRR di lab sebelum training user",
    },
    {
      id: "t-sub-upsell-missing",
      problem: "Tombol Upsell/Renew tidak muncul",
      causes: [
        "State bukan In Progress",
        "Hak akses Sales kurang",
        "Versi/label menu berbeda — aksi di Action menu",
      ],
      diagnosis: [
        "Cek status subscription",
        "Login sebagai Admin Sales",
        "Buka Action menu penuh di form",
      ],
      solution: [
        "Confirm dulu quotation menjadi subscription aktif",
        "Naikkan group user",
        "Gunakan path alternatif Create Quotation terhubung jika ada",
      ],
      prevention: "Cheat-sheet aksi form untuk tim CS/Sales",
    },
  ],
  behind: {
    models: [
      "sale.order (is_subscription / subscription state)",
      "sale.order.line",
      "product.template / product.product",
      "sale.temporal.recurrence (atau setara plan/recurrence)",
      "sale.order.close.reason (jika ada)",
      "account.move",
      "res.partner",
      "mail.activity (reminder renew)",
    ],
    relations: [
      "sale.order.partner_id → res.partner",
      "sale.order.line.product_id → product.product",
      "subscription recurrence → period definition",
      "invoice invoice_origin / subscription_id → sale.order",
      "upsell quotation → parent subscription",
    ],
    automations: [
      "scheduled action: generate invoices when next invoice date due",
      "next invoice date advance after billing",
      "optional payment token capture",
      "activities / emails before end date (renewal)",
      "MRR metrics recompute on line/state change",
    ],
    securityNotes: [
      "Sales User: subscription milik sendiri / tim",
      "Sales Admin: konfigurasi plan & semua kontrak",
      "Accountant: post & reconcile invoice, bukan sembarang close tanpa SOP",
    ],
    note: "Di Odoo 19 Enterprise, Subscriptions membangun di atas Sales Order: recurrence + state subscription + billing cron. MRR adalah metrik pelaporan (normalisasi ke bulanan), bukan field magis terpisah dari harga line. Pemula wajib paham Confirm → In Progress → Invoice sebelum otomatisasi penuh.",
  },
  reporting: [
    {
      name: "MRR / Recurring Revenue",
      path: "Subscriptions → Reporting → MRR (atau Subscription Analysis)",
      kpi: "Monthly Recurring Revenue aktif",
      decision: `Apakah paket retail ${customer.name} dan tahunan ${distributor.name} tumbuh bulan ini?`,
    },
    {
      name: "Retention / Churn",
      path: "Subscriptions → Reporting → Retention",
      kpi: "% subscription bertahan vs closed per periode",
      decision: "Perbaiki onboarding atau harga jika churn reason didominasi harga/kualitas",
    },
    {
      name: "Subscription Analysis",
      path: "Subscriptions → Reporting → Subscriptions",
      kpi: "Jumlah aktif, nilai per salesperson, per plan",
      decision: "Alokasi account manager ke segmen distributor vs retail",
    },
    {
      name: "Invoices from Subscriptions",
      path: "Invoicing → Customer Invoices (filter source subscription)",
      kpi: "Billed vs paid per periode",
      decision: "Kejar collection; review payment terms",
    },
  ],
  security: {
    roles: [
      {
        role: "Sales / User",
        can: [
          "Buat quotation & confirm subscription sendiri",
          "Upsell/renew dalam batas SOP",
          "Lihat invoice terkait (sering read)",
        ],
        cannot: [
          "Ubah recurrence master sembarangan",
          "Close massal semua pelanggan",
        ],
        whyDifferent:
          "Sales operasional fokus akuisisi & nurture akun, bukan kebijakan katalog global.",
      },
      {
        role: "Sales / Administrator",
        can: [
          "Konfigurasi plans & settings Subscriptions",
          "Semua subscription perusahaan",
          "Reporting MRR & retention",
        ],
        cannot: [
          "Mengunci periode akuntansi tanpa role accounting",
        ],
        whyDifferent:
          "Admin menjaga konsistensi produk recurring dan angka MRR perusahaan.",
      },
      {
        role: "Accountant / Billing",
        can: [
          "Post invoice dari subscription",
          "Register payment & reconcile",
          "Investigasi selisih tax/amount",
        ],
        cannot: [
          "Mengubah isi kontrak sales tanpa koordinasi",
        ],
        whyDifferent:
          "Finance menjaga kebenaran buku; perubahan paket tetap milik Sales lewat Upsell.",
      },
    ],
    notes: [
      "Pisahkan siapa yang boleh Close (dampak MRR) dari siapa yang hanya buat quotation",
      "Jangan beri Settings Subscriptions ke semua sales floor",
    ],
  },
  levels: {
    beginner: [
      "Bedakan SO one-shot vs subscription",
      "Buat produk recurring sederhana",
      "Quotation → Confirm → lihat di Subscriptions",
      "Generate invoice periode pertama",
    ],
    intermediate: [
      "Pahami Next Invoice Date & cadence",
      "Upsell add-on dengan benar",
      "Close + reason; baca dampak ke MRR",
      "Pisahkan setup fee vs retainer",
    ],
    advanced: [
      "Desain plan Monthly vs Yearly per segmen",
      "Analisis churn reason bulanan",
      "Koordinasi delivery barang berkala + invoice",
      "Renewal pipeline H-30 dengan activities",
    ],
    expert: [
      "Model harga & diskon yang menjaga MRR bersih",
      "Kebijakan pause/close vs credit note",
      "Integrasi payment token + dunning",
      "Forecast recurring vs pipeline CRM",
    ],
  },
  exercises: [
    {
      id: "ex-sub-product",
      title: "SKU paket langganan bulanan",
      objective: "Membuat produk recurring siap jual",
      prerequisites: ["Subscriptions terpasang", "Recurrence Monthly ada"],
      task: [
        "Buat produk Paket Langganan Kopi Retail Monthly",
        "Harga 500000 + tax 11%",
        "Flag recurring + Monthly",
        "Tunjukkan di list Subscriptions Products",
      ],
      expectedResult: "Produk muncul sebagai recurring product",
      checklist: ["Nama jelas", "Harga terisi", "Recurrence Monthly", "Tax terisi"],
    },
    {
      id: "ex-sub-confirm",
      title: `Subscription ${customer.name}`,
      objective: "Mengaktifkan langganan dari quotation",
      prerequisites: ["Produk recurring ada", `Contact ${customer.name}`],
      task: [
        "Buat quotation Monthly",
        "Confirm",
        "Buka menu Subscriptions — record In Progress",
        "Catat Next Invoice Date",
      ],
      expectedResult: "Subscription aktif terhubung customer benar",
      checklist: ["Customer benar", "Status aktif", "Lines benar", "Next date ada"],
    },
    {
      id: "ex-sub-invoice",
      title: "Invoice cadence periode 1",
      objective: "Menagih dan mem-post invoice dari subscription",
      prerequisites: ["Subscription In Progress"],
      task: [
        "Create/Generate Invoice",
        "Review amount & tax",
        "Post",
        "Cek smart button Invoices di subscription",
      ],
      expectedResult: "Invoice posted terhubung subscription",
      checklist: ["Partner benar", "Amount masuk akal", "Link ke subscription", "Next date bergeser"],
    },
    {
      id: "ex-sub-upsell-close",
      title: "Upsell lalu simulasi close",
      objective: "Memahami siklus hidup penuh MRR",
      prerequisites: ["Subscription dengan minimal 1 invoice"],
      task: [
        `Upsell tambah ${teh.name} atau naikkan qty`,
        "Confirm upsell",
        "Close dengan reason (di DB lab)",
        "Bandingkan list In Progress vs Closed",
      ],
      expectedResult: "Jejak upsell ada; subscription closed berhenti ditagih",
      checklist: ["Upsell linked", "Close reason", "Tidak ada invoice baru setelah close"],
    },
  ],
  coreFlowLinks: [
    { label: "Deep Dive Sales", href: "/materi/sales" },
    { label: "Deep Dive Invoicing", href: "/materi/invoicing" },
    { label: "Deep Dive Contacts", href: "/materi/contacts" },
    { label: "Deep Dive CRM", href: "/materi/crm" },
    { label: "Flow Sales", href: "/modul/flow-sales" },
    { label: "Flow Invoicing", href: "/modul/flow-invoicing" },
    { label: "Master Contacts", href: "/modul/master-contacts" },
  ],
};
