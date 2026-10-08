import type { DeepDiveModule } from "../types";
import { seed } from "../../seed";

const v1 = seed.vendors.bahan;
const v2 = seed.vendors.kemasan;
const c1 = seed.customers.toko;
const c2 = seed.customers.distributor;
const company = seed.company;

/**
 * Deep Dive — Contacts (Wave 1)
 * Konten fungsional lengkap bahasa Indonesia untuk Odoo 19 Enterprise.
 */
export const contactsDeepDive: DeepDiveModule = {
  slug: "contacts",
  name: "Contacts",
  shortTitle: "Contacts",
  icon: "Users",
  category: "productivity",
  wave: 1,
  availability: "available",
  availabilityNote:
    "App Contacts tersedia di lab Odoo 19 Enterprise. Fitur portal invite & GDPR tools verifikasi di UI jika menu berbeda.",
  apps: ["Contacts", "Sales", "Purchase", "Invoicing"],
  overview: {
    function:
      "Contacts adalah buku alamat pusat (res.partner) untuk semua mitra bisnis: pelanggan, pemasok, karyawan terkait, dan alamat pengiriman/faktur. Setiap PO, SO, Invoice, Bill, dan Delivery memilih Contact sebagai partner.",
    businessProblem:
      "Tanpa Contact yang rapi, transaksi memakai nama bebas, alamat salah, syarat bayar tidak konsisten, dan laporan AR/AP tidak bisa dianalisis per mitra. Tim Sales, Purchase, dan Finance saling buat data duplikat.",
    typicalUsers: [
      "Sales Admin / Salesperson",
      "Purchase Officer / Buyer",
      "Accounting / AR-AP Clerk",
      "Master Data Admin",
      "Customer Service",
    ],
    whenNeeded:
      "Sejak hari pertama setup — sebelum membuat RFQ, Quotation, atau Invoice. Setiap mitra baru (vendor/customer) harus masuk Contacts lebih dulu.",
    relatedModules: [
      "Sales",
      "Purchase",
      "Inventory",
      "Accounting / Invoicing",
      "CRM",
      "Users & Access Rights",
    ],
    businessScenario: `PT Nusantara Functional Demo (${company.name}) beroperasi di Jakarta. Mereka membeli ${seed.products.kopi.name} dari ${v1.name} (Bandung) dan kemasan dari ${v2.name} (Tangerang), lalu menjual ke ${c1.name} (retail Jakarta) dan ${c2.name} (distributor Surabaya). Semua mitra itu adalah Contact — Company — dengan payment terms, tags, dan flag Customer/Vendor yang benar agar filter dan laporan bekerja.`,
  },
  prerequisites: {
    modules: [
      "Settings / Company sudah diisi (nama, alamat, currency IDR)",
      "Users & Access: minimal Admin atau hak Contacts + Sales/Purchase sesuai peran",
    ],
    masterData: [
      "Country Indonesia tersedia",
      "Payment Terms (Immediate, 15 Days, 30 Days) — biasanya bawaan Odoo",
      "Pricelist IDR Public (untuk customer)",
      "Chart of Accounts / Receivable & Payable (setelah Accounting di-install)",
    ],
    configuration: [
      "App Contacts terpasang (biasanya default)",
      "Opsional: Contacts → Configuration → Contact Tags",
      "Sales & Purchase tab muncul jika app Sales/Purchase terpasang",
    ],
    access: [
      "Group: Contact Creation (atau Admin) untuk membuat Contact",
      "Sales User / Purchase User cukup untuk memakai Contact di transaksi",
      "Accounting User untuk mengisi akun Receivable/Payable di Contact",
    ],
    relationships:
      "Company (settings) mendefinisikan identitas kita. Contact mendefinisikan identitas mitra. Produk berdiri sendiri. Transaksi (PO/SO) mengaitkan Contact + Product. Accounting membaca partner dari Contact untuk AR/AP.",
  },
  installation: {
    how: [
      "Home → Apps → cari Contacts.",
      "Jika belum terpasang: klik Install / Activate.",
      "Di lab Enterprise biasanya Contacts sudah aktif sejak database dibuat.",
      "Setelah install, ikon Contacts muncul di Home Apps.",
    ],
    dependencies: [
      "Base (wajib)",
      "Mail / Discuss (chatter pada form Contact)",
      "Sales / Purchase / Account (opsional — menambah tab & field terkait)",
    ],
    afterInstall: [
      "Buka Contacts → pastikan list/kanban terbuka.",
      "Siapkan Contact Tags: Vendor, Bahan Baku, Packaging, Customer, Retail, Distributor.",
      "Pastikan filter Customers / Vendors terlihat di sidebar atau Filters.",
    ],
    newMenus: [
      "Contacts → Contacts",
      "Contacts → Configuration → Contact Tags",
      "Contacts → Configuration → Industries (jika aktif)",
    ],
    newSettings: [
      "Settings → General Settings → Contacts (opsi seperti Partner Autocomplete — verifikasi di lab)",
      "Settings → Users & Companies → (tidak spesifik Contacts, tapi hak akses user)",
    ],
  },
  configurations: [
    {
      id: "cfg-contact-tags",
      name: "Contact Tags",
      location: "Contacts → Configuration → Contact Tags",
      what: "Label warna untuk mengelompokkan Contact (Vendor, Customer, Retail, dll.).",
      whyEnable:
        "Memudahkan filter, segmentasi marketing ringan, dan konsistensi master data antar tim.",
      whenEnable:
        "Saat mulai isi master — sebelum bulk create Contact, agar tag sudah tersedia.",
      whenNot:
        "Jangan buat puluhan tag mirip (Vendor / Pemasok / Supplier) — membingungkan filter.",
      businessExample: `Tag "${v1.tags}" pada ${v1.name}; tag "${c1.tags}" pada ${c1.name}.`,
      impact:
        "Filter & group-by Tags di list Contacts; tag ikut terbawa ke beberapa laporan/segmentasi.",
      screenshot: {
        caption: "Daftar Contact Tags di Configuration",
        required: true,
        whatYouSee: "[SCREENSHOT REQUIRED] List tag dengan warna",
        why: "Menunjukkan lokasi konfigurasi tag sebelum dipakai di form Contact",
      },
    },
    {
      id: "cfg-company-vs-individual",
      name: "Tipe Company vs Individual",
      location: "Contacts → form Contact → radio Company / Individual",
      what: "Menentukan apakah record adalah badan usaha atau orang.",
      whyEnable:
        "Vendor/customer B2B sebaiknya Company; orang kontak (PIC) sebagai Individual child-of company.",
      whenEnable: "Selalu pilih dengan sadar saat New Contact.",
      whenNot:
        "Jangan buat orang sebagai Company hanya karena butuh Tax ID — gunakan Company induk + Individual anak.",
      businessExample: `${v1.name} = Company; PIC “Budi — Purchase” = Individual, Related Company = ${v1.name}.`,
      impact:
        "Hierarki child contacts, tampilan nama di dokumen, dan validasi alamat/tax.",
      screenshot: {
        src: "/screenshots/odoo19e/03-contacts-form-new.png",
        caption: "Form Contact baru — pilih Company atau Individual",
        whatYouSee:
          "Form Contact kosong dengan opsi tipe Company/Individual di bagian atas",
        why: "Titik awal semua master mitra",
      },
    },
    {
      id: "cfg-customer-vendor-flag",
      name: "Flag Is a Customer / Is a Vendor",
      location: "Contacts → form → tab Sales & Purchase",
      what: "Menandai Contact sebagai pelanggan, pemasok, atau keduanya.",
      whyEnable:
        "Filter Customers/Vendors dan beberapa smart button bergantung pada flag ini (atau riwayat transaksi, tergantung versi).",
      whenEnable:
        "Saat membuat Contact yang akan dipakai di Sales atau Purchase.",
      whenNot:
        "Jangan centang keduanya tanpa alasan — dual-role hanya untuk mitra yang benar-benar beli & jual.",
      businessExample: `${c1.name} → Customer + payment terms ${c1.paymentTerms}; ${v1.name} → Vendor + ${v1.paymentTerms}.`,
      impact:
        "Visibility di filter; field Salesperson/Buyer & pricelist menjadi relevan.",
      screenshot: {
        caption: "Tab Sales & Purchase dengan flag Customer/Vendor",
        required: true,
        whatYouSee: "[SCREENSHOT REQUIRED] Tab Sales & Purchase Contact",
      },
    },
    {
      id: "cfg-payment-terms",
      name: "Payment Terms pada Contact",
      location: "Contacts → Sales & Purchase → Payment Terms",
      what: "Syarat pembayaran default yang terisi otomatis ke SO/Invoice atau PO/Bill.",
      whyEnable:
        "Mengurangi salah input tenor; laporan aged AR/AP mengikuti due date dari terms.",
      whenEnable: "Untuk setiap customer/vendor dengan kesepakatan kredit.",
      whenNot: "Cash & carry → Immediate Payment; jangan pakai 30 Days asal.",
      businessExample: `${c1.name} = ${c1.paymentTerms}; ${c2.name} = ${c2.paymentTerms}; ${v1.name} = ${v1.paymentTerms}.`,
      impact:
        "Invoice/Bill mendapat due date otomatis; aging bucket 0–30/30–60 bergerak sesuai terms.",
    },
    {
      id: "cfg-pricelist",
      name: "Pricelist Customer",
      location: "Contacts → Sales & Purchase → Pricelist",
      what: "Daftar harga jual default untuk customer.",
      whyEnable:
        "Harga SO mengikuti pricelist mitra, bukan selalu harga katalog umum.",
      whenEnable: "Ada perbedaan harga retail vs distributor.",
      whenNot:
        "Satu harga untuk semua dan belum ada aturan diskon → biarkan default IDR Public.",
      businessExample: `${c1.name} dan ${c2.name} memakai ${c1.pricelist} di lab.`,
      impact: "Line SO menghitung unit price dari pricelist Contact.",
    },
    {
      id: "cfg-accounting-accounts",
      name: "Receivable & Payable Account",
      location: "Contacts → tab Accounting",
      what: "Akun piutang (AR) dan hutang (AP) default untuk partner.",
      whyEnable:
        "Posting invoice/bill mengunci ke akun yang benar per mitra (atau pakai default property).",
      whenEnable:
        "Setelah chart of accounts siap; khusus mitra yang butuh akun berbeda (jarang di UKM).",
      whenNot:
        "Pemula: biarkan default dari Account Properties — jangan buat akun AR per customer tanpa kebijakan.",
      businessExample: `Default Receivable/Payable Indonesia untuk semua seed Contact di ${company.name}.`,
      impact: "Journal items invoice/bill memakai akun tersebut.",
    },
  ],
  masterData: [
    {
      id: "md-company-contact",
      name: "Contact bertipe Company",
      purpose:
        "Merepresentasikan badan usaha mitra (vendor atau customer) sebagai induk data.",
      required: true,
      whyNeeded:
        "Transaksi B2B, Tax ID, dan alamat legal melekat ke Company — bukan ke PIC perorangan.",
      fields: [
        {
          field: "Name / Company Name",
          type: "char",
          required: true,
          purpose: "Nama legal/dagang yang muncul di dokumen",
          why: "Harus konsisten agar pencarian PO/SO tidak gagal",
          example: v1.name,
          impactIfEmpty: "Contact tidak bisa disimpan",
        },
        {
          field: "Company type",
          type: "selection",
          required: true,
          purpose: "Company vs Individual",
          why: "Menentukan hierarki dan field yang tampil",
          example: "Company",
          impactIfEmpty: "Default Individual — salah untuk badan usaha",
        },
        {
          field: "Street / City / Country",
          type: "address",
          required: false,
          purpose: "Alamat utama mitra",
          why: "Cetak PO/SO/Invoice dan pengiriman",
          example: `${v1.street}, ${v1.city}, ${v1.country}`,
          impactIfEmpty: "Dokumen tanpa alamat — ditolak operasional",
        },
        {
          field: "Tax ID",
          type: "char",
          required: false,
          purpose: "NPWP / VAT mitra",
          why: "Kepatuhan faktur & validasi pajak",
          example: v1.taxId,
          impactIfEmpty: "Laporan pajak mitra tidak lengkap",
        },
        {
          field: "Phone / Email",
          type: "char",
          required: false,
          purpose: "Kontak operasional",
          why: "Follow-up RFQ, SO, penagihan",
          example: `${v1.phone} / ${v1.email}`,
          impactIfEmpty: "Tim harus cari kontak di luar sistem",
        },
        {
          field: "Tags",
          type: "many2many",
          required: false,
          purpose: "Klasifikasi cepat",
          why: "Filter & konsistensi master",
          example: v1.tags,
          impactIfEmpty: "Sulit segmentasi list Contacts",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/03-contacts-form-new.png",
        caption: "Form Contact Company baru",
        whatYouSee: "Field Name, alamat, phone, email pada form Contacts",
        whatToFill: `Name = ${v1.name}, alamat Bandung, Tax ID seed`,
        expectedResult: "Contact tersimpan sebagai Company",
      },
    },
    {
      id: "md-individual-child",
      name: "Contact Individual (PIC / child)",
      purpose:
        "Orang yang terkait company induk: buyer, salesperson lawan, finance contact.",
      required: false,
      whyNeeded:
        "Komunikasi operasional ke orang, sementara dokumen tetap atas nama Company.",
      fields: [
        {
          field: "Name",
          type: "char",
          required: true,
          purpose: "Nama orang",
          why: "Identitas PIC",
          example: "Budi — Purchase",
          impactIfEmpty: "Tidak bisa simpan",
        },
        {
          field: "Related Company / Company Name",
          type: "many2one",
          required: false,
          purpose: "Induk company",
          why: "Hierarki child-of",
          example: v1.name,
          impactIfEmpty: "PIC berdiri sendiri — sulit dilacak",
          related: "res.partner (parent)",
        },
        {
          field: "Email / Phone",
          type: "char",
          required: false,
          purpose: "Kontak langsung PIC",
          why: "Email RFQ/SO bisa diarahkan ke orang",
          example: "budi@sumber.test",
          impactIfEmpty: "Email jatuh ke alamat company saja",
        },
        {
          field: "Job Position",
          type: "char",
          required: false,
          purpose: "Jabatan",
          why: "Konteks peran",
          example: "Purchasing Staff",
          impactIfEmpty: "Kurang konteks saat banyak PIC",
        },
      ],
      screenshot: {
        caption: "Individual child di bawah Company",
        required: true,
        whatYouSee: "[SCREENSHOT REQUIRED] Contact Individual dengan Related Company",
      },
    },
    {
      id: "md-addresses",
      name: "Alamat Invoice & Delivery",
      purpose:
        "Alamat tambahan bertipe Invoice Address atau Delivery Address di bawah Company.",
      required: false,
      whyNeeded:
        "Gudang terima barang berbeda dari kantor pusat; alamat tagihan berbeda dari alamat kirim.",
      fields: [
        {
          field: "Address Type",
          type: "selection",
          required: true,
          purpose: "Invoice / Delivery / Other / Private",
          why: "SO/PO memilih alamat yang tepat",
          example: "Delivery Address",
          impactIfEmpty: "Semua pakai alamat utama — salah kirim",
        },
        {
          field: "Street / City",
          type: "address",
          required: true,
          purpose: "Lokasi fisik alamat turunan",
          why: "Delivery order & invoice print",
          example: "Gudang Vendor — alamat berbeda dari HQ",
          impactIfEmpty: "Alamat kosong di picking",
        },
      ],
      screenshot: {
        caption: "Child address Invoice/Delivery",
        required: true,
        whatYouSee: "[SCREENSHOT REQUIRED] Contacts dengan type address",
      },
    },
    {
      id: "md-customer-seed",
      name: "Customer seed lab",
      purpose: `Pelanggan latihan: ${c1.name} dan ${c2.name}.`,
      required: true,
      whyNeeded: "Dipakai seluruh modul Sales, Invoicing, dan E2E.",
      fields: [
        {
          field: "Name",
          type: "char",
          required: true,
          purpose: "Nama customer",
          why: "Konsistensi seed",
          example: c1.name,
          impactIfEmpty: "SO tidak bisa memilih partner seed",
        },
        {
          field: "Payment Terms",
          type: "many2one",
          required: false,
          purpose: "Tenor piutang",
          why: "Due date invoice",
          example: c1.paymentTerms,
          impactIfEmpty: "Default company terms",
        },
        {
          field: "Pricelist",
          type: "many2one",
          required: false,
          purpose: "Harga jual",
          why: "Konsistensi harga SO",
          example: c1.pricelist,
          impactIfEmpty: "Pakai pricelist default",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/02-contacts-list.png",
        caption: "List Contacts setelah seed customer/vendor terisi",
        whatYouSee: "Kanban/list Contacts di lab",
        expectedResult: "Filter Customers menampilkan Toko Maju Jaya & PT Distribusi Nusantara",
      },
    },
  ],
  dependencies: {
    nodes: [
      { id: "company", label: "Company Settings" },
      { id: "terms", label: "Payment Terms" },
      { id: "pricelist", label: "Pricelist" },
      { id: "coa", label: "Chart of Accounts" },
      { id: "contact", label: "Contact" },
      { id: "tags", label: "Contact Tags" },
      { id: "po", label: "Purchase Order" },
      { id: "so", label: "Sales Order" },
      { id: "inv", label: "Invoice / Bill" },
    ],
    edges: [
      {
        from: "company",
        to: "contact",
        why: "Currency & country company mempengaruhi format Contact",
      },
      {
        from: "tags",
        to: "contact",
        why: "Tag harus ada sebelum di-assign konsisten",
      },
      {
        from: "terms",
        to: "contact",
        why: "Payment terms di-link ke Contact",
      },
      {
        from: "pricelist",
        to: "contact",
        why: "Customer memakai pricelist",
      },
      {
        from: "coa",
        to: "contact",
        why: "Akun AR/AP opsional di tab Accounting",
      },
      {
        from: "contact",
        to: "po",
        why: "Vendor wajib di RFQ/PO",
      },
      {
        from: "contact",
        to: "so",
        why: "Customer wajib di Quotation/SO",
      },
      {
        from: "contact",
        to: "inv",
        why: "Partner invoice/bill = Contact",
      },
    ],
    summary:
      "Contact adalah hub master: bergantung pada Company, Terms, Pricelist, Tags (dan COA untuk accounting), lalu menjadi prasyarat wajib PO, SO, Invoice, dan Bill.",
  },
  forms: [
    {
      id: "form-contact-main",
      name: "Contact Form (utama)",
      menuPath: "Contacts → Contacts → New / Open",
      fields: [
        {
          field: "Company / Individual",
          required: true,
          purpose: "Tipe partner",
          why: "Menentukan struktur data",
          example: "Company",
        },
        {
          field: "Name",
          required: true,
          purpose: "Nama tampilan & legal singkat",
          why: "Kunci pencarian",
          example: c1.name,
        },
        {
          field: "Address",
          required: false,
          purpose: "Alamat utama",
          why: "Dokumen & pengiriman",
          example: `${c1.street}, ${c1.city}`,
        },
        {
          field: "Tax ID",
          required: false,
          purpose: "NPWP",
          why: "Pajak",
          example: v1.taxId,
        },
        {
          field: "Tags",
          required: false,
          purpose: "Klasifikasi",
          why: "Filter",
          example: c1.tags,
        },
        {
          field: "Phone / Mobile / Email / Website",
          required: false,
          purpose: "Kanal komunikasi",
          why: "Operasional harian",
          example: c1.email,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/03-contacts-form-new.png",
        caption: "Form Contact — identitas umum",
        whatYouSee: "Form New Contact Odoo 19",
      },
    },
    {
      id: "form-sales-purchase",
      name: "Tab Sales & Purchase",
      menuPath: "Contacts → form → Sales & Purchase",
      fields: [
        {
          field: "Salesperson",
          required: false,
          purpose: "User sales default",
          why: "Pipeline & komisi sederhana",
          example: "Administrator",
        },
        {
          field: "Payment Terms (Customer)",
          required: false,
          purpose: "Tenor piutang",
          why: "Due date invoice",
          example: c1.paymentTerms,
        },
        {
          field: "Pricelist",
          required: false,
          purpose: "Harga jual",
          why: "SO price",
          example: c1.pricelist,
        },
        {
          field: "Buyer",
          required: false,
          purpose: "User purchase default",
          why: "Ownership RFQ",
          example: "Administrator",
        },
        {
          field: "Payment Terms (Vendor)",
          required: false,
          purpose: "Tenor hutang",
          why: "Due date bill",
          example: v1.paymentTerms,
        },
      ],
      screenshot: {
        caption: "Tab Sales & Purchase Contact",
        required: true,
        whatYouSee: "[SCREENSHOT REQUIRED]",
      },
    },
    {
      id: "form-accounting",
      name: "Tab Accounting",
      menuPath: "Contacts → form → Accounting",
      fields: [
        {
          field: "Account Receivable",
          required: false,
          purpose: "Akun piutang",
          why: "Posting invoice",
          example: "121000 Account Receivable",
        },
        {
          field: "Account Payable",
          required: false,
          purpose: "Akun hutang",
          why: "Posting bill",
          example: "211000 Account Payable",
        },
        {
          field: "Fiscal Position",
          required: false,
          purpose: "Mapping pajak khusus mitra",
          why: "Pajak berbeda per wilayah/jenis",
          example: "(kosong untuk lab standar)",
        },
      ],
      screenshot: {
        caption: "Tab Accounting pada Contact",
        required: true,
        whatYouSee: "[SCREENSHOT REQUIRED]",
      },
    },
  ],
  procedures: [
    {
      id: "proc-create-vendor",
      title: "Membuat Vendor Company lengkap",
      goal: `Record vendor ${v1.name} siap dipakai di Purchase.`,
      preparation: [
        "Login admin di lab",
        "App Contacts terbuka",
        "Tag Vendor & Bahan Baku siap (atau buat saat isi)",
      ],
      steps: [
        "Contacts → New.",
        "Pilih Company.",
        `Isi Name: ${v1.name}.`,
        `Isi Street, City, Country: ${v1.street}, ${v1.city}, ${v1.country}.`,
        `Phone ${v1.phone}, Email ${v1.email}, Tax ID ${v1.taxId}.`,
        `Tags: ${v1.tags}.`,
        "Tab Sales & Purchase → tandai sebagai Vendor / isi Purchase Payment Terms.",
        `Payment Terms: ${v1.paymentTerms}.`,
        "Save.",
        "Verifikasi filter Vendors menampilkan record.",
      ],
      expectedResult: `${v1.name} muncul di Contacts dan bisa dipilih di RFQ.`,
      verification: [
        "Filter Vendors → nama muncul",
        "Buka form → data alamat & Tax ID terisi",
        "Purchase → New RFQ → autocomplete menemukan vendor",
      ],
      fillFields: [
        {
          field: "Name",
          value: v1.name,
          where: "General",
          how: "Ketik",
          required: true,
        },
        {
          field: "Street",
          value: v1.street,
          where: "Address",
          how: "Ketik",
          required: true,
        },
        {
          field: "City",
          value: v1.city,
          where: "Address",
          how: "Ketik",
          required: true,
        },
        {
          field: "Country",
          value: v1.country,
          where: "Address",
          how: "Pilih",
          required: true,
        },
        {
          field: "Email",
          value: v1.email,
          where: "General",
          how: "Ketik",
        },
        {
          field: "Tax ID",
          value: v1.taxId,
          where: "General",
          how: "Ketik",
        },
        {
          field: "Payment Terms",
          value: v1.paymentTerms,
          where: "Sales & Purchase",
          how: "Pilih",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/03-contacts-form-new.png",
        caption: "Create vendor dari form Contacts",
        whatToFill: `Field seed ${v1.name}`,
        expectedResult: "Vendor tersimpan",
      },
    },
    {
      id: "proc-create-customer",
      title: "Membuat Customer Company lengkap",
      goal: `Record customer ${c1.name} siap dipakai di Sales & Invoice.`,
      preparation: [
        "Pricelist IDR Public tersedia",
        "Payment Terms 15 Days tersedia",
      ],
      steps: [
        "Contacts → New → Company.",
        `Name: ${c1.name}; alamat ${c1.street}, ${c1.city}, ${c1.country}.`,
        `Phone ${c1.phone}, Email ${c1.email}.`,
        `Tags: ${c1.tags}.`,
        "Tab Sales & Purchase → Customer.",
        `Payment Terms ${c1.paymentTerms}; Pricelist ${c1.pricelist}.`,
        "Save → cek filter Customers.",
      ],
      expectedResult: `${c1.name} bisa dipilih di Quotation.`,
      verification: [
        "Filter Customers → muncul",
        "Sales → New Quotation → Customer autocomplete OK",
      ],
      fillFields: [
        {
          field: "Name",
          value: c1.name,
          where: "General",
          how: "Ketik",
          required: true,
        },
        {
          field: "Payment Terms",
          value: c1.paymentTerms,
          where: "Sales & Purchase",
          how: "Pilih",
        },
        {
          field: "Pricelist",
          value: c1.pricelist,
          where: "Sales & Purchase",
          how: "Pilih",
        },
      ],
      screenshot: {
        caption: "Customer Toko Maju Jaya tersimpan",
        required: true,
        whatYouSee: "[SCREENSHOT REQUIRED] Form customer setelah Save",
      },
    },
    {
      id: "proc-add-delivery-address",
      title: "Menambah Delivery Address di bawah Customer",
      goal: "Alamat kirim terpisah tersedia saat SO/Delivery.",
      preparation: [`Contact ${c1.name} sudah ada sebagai Company`],
      steps: [
        `Buka ${c1.name}.`,
        "Di smart button / tab Contacts & Addresses → New.",
        "Type: Delivery Address.",
        "Isi street gudang/toko cabang (contoh: Jl. Melawai Blok Loading Dock).",
        "City & Country sama atau sesuai lokasi kirim.",
        "Save.",
        "Buat SO → pastikan Delivery Address bisa dipilih.",
      ],
      expectedResult: "Child Delivery Address muncul di bawah customer.",
      verification: [
        "Di form induk, daftar addresses menampilkan tipe Delivery",
        "SO menampilkan alamat kirim yang dipilih",
      ],
      screenshot: {
        caption: "Delivery address child",
        required: true,
        whatYouSee: "[SCREENSHOT REQUIRED]",
      },
    },
    {
      id: "proc-merge-duplicates",
      title: "Menggabungkan Contact duplikat (Merge)",
      goal: "Satu mitra = satu record, tanpa kehilangan riwayat penting.",
      preparation: [
        "Dua Contact mirip terdeteksi (nama hampir sama)",
        "Hak akses Admin / Settings Technical jika perlu",
      ],
      steps: [
        "Contacts → list → centang dua record duplikat.",
        "Action → Merge (atau Contacts → Configuration tools Merge).",
        "Pilih record destination (yang datanya paling lengkap).",
        "Konfirmasi Merge.",
        "Cek transaksi lama masih menunjuk partner hasil merge.",
      ],
      expectedResult: "Satu Contact tersisa; referensi transaksi terarah ke survivor.",
      verification: [
        "Pencarian nama hanya satu hasil utama",
        "SO/PO historis masih terbuka tanpa error partner",
      ],
      screenshot: {
        caption: "Wizard Merge Contacts",
        required: true,
        whatYouSee: "[SCREENSHOT REQUIRED] Action Merge",
      },
    },
  ],
  scenarios: [
    {
      id: "sc-retail-customer",
      title: "Customer retail dengan tenor 15 hari",
      whenToUse: "Toko yang beli rutin, bayar setelah kirim dalam 15 hari.",
      flow: [
        `Buat Company ${c1.name}`,
        "Flag Customer + Payment Terms 15 Days + Pricelist IDR Public",
        "Buat SO → Confirm → Delivery → Invoice",
        "Cek Aged Receivable: bucket sesuai due date",
      ],
      notes: "Jangan pakai Individual untuk toko berbadan usaha.",
    },
    {
      id: "sc-vendor-bahan",
      title: "Vendor bahan baku 30 hari",
      whenToUse: "Pembelian stok bahan dengan hutang 30 hari.",
      flow: [
        `Buat ${v1.name} sebagai Vendor`,
        "Payment Terms 30 Days",
        "RFQ → PO → Receipt → Bill",
        "Aged Payable menampilkan hutang ke vendor",
      ],
    },
    {
      id: "sc-dual-role",
      title: "Mitra dual-role (jarang)",
      whenToUse: "Perusahaan yang kadang jadi supplier, kadang customer.",
      flow: [
        "Satu Contact Company",
        "Aktifkan Customer dan Vendor",
        "Pisahkan terms Sales vs Purchase jika berbeda",
        "Pakai tags Dual-Role agar mudah diaudit",
      ],
      notes: "Untuk lab, dual-role tidak wajib — seed memisahkan vendor & customer.",
    },
    {
      id: "sc-multi-address",
      title: "Kantor pusat + gudang kirim",
      whenToUse: "Alamat tagihan di HQ, barang dikirim ke gudang lain.",
      flow: [
        "Company induk = alamat HQ / Invoice",
        "Child Delivery Address = gudang",
        "SO pilih Delivery Address child",
        "Invoice tetap ke alamat Invoice/HQ",
      ],
    },
  ],
  integrations: [
    {
      id: "int-sales",
      withModule: "Sales",
      relationship: "Customer wajib (partner_id) pada Quotation/SO",
      whatHappens:
        "Pricelist, payment terms, salesperson, dan alamat delivery diwarisi dari Contact ke SO lalu ke Invoice.",
    },
    {
      id: "int-purchase",
      withModule: "Purchase",
      relationship: "Vendor wajib pada RFQ/PO",
      whatHappens:
        "Buyer & vendor payment terms mengalir ke PO dan Vendor Bill.",
    },
    {
      id: "int-inventory",
      withModule: "Inventory",
      relationship: "Partner pada Receipt/Delivery",
      whatHappens:
        "Picking menampilkan partner dari PO/SO; alamat delivery Contact dipakai untuk tujuan kirim.",
    },
    {
      id: "int-accounting",
      withModule: "Accounting / Invoicing",
      relationship: "Partner pada Invoice, Bill, Payment, Aging",
      whatHappens:
        "AR/AP digroup per Contact; akun Receivable/Payable Contact (atau default) dipakai saat posting.",
    },
  ],
  mistakes: [
    {
      id: "err-dup-name",
      problem: "Membuat Contact duplikat dengan ejaan sedikit berbeda",
      why: "Laporan AR/AP pecah; stok history per partner kacau",
      detect: "Cari nama mirip di Contacts; bandingkan Tax ID",
      fix: "Merge Contacts; samakan nama ke seed resmi",
      prevent: "Wajib search sebelum New; pakai Tax ID sebagai unik bisnis",
    },
    {
      id: "err-individual-vendor",
      problem: "Vendor badan usaha dibuat sebagai Individual",
      why: "Sulit menambah PIC/alamat; Tax ID & legal name tidak ideal",
      detect: "Ikon orang, bukan gedung; tidak ada child addresses rapi",
      fix: "Buat ulang sebagai Company atau ubah tipe jika diizinkan + pindahkan data",
      prevent: "Checklist: B2B = Company",
    },
    {
      id: "err-no-flag",
      problem: "Lupa menandai Customer/Vendor",
      why: "Contact “hilang” dari filter; user buat duplikat",
      detect: "Search All menemukan, filter Customers/Vendors tidak",
      fix: "Edit tab Sales & Purchase → set role",
      prevent: "Isi role langsung saat create",
    },
    {
      id: "err-wrong-terms",
      problem: "Payment terms Contact salah (30 Days padahal COD)",
      why: "Due date invoice/bill menyesatkan cashflow",
      detect: "Aged report bucket tidak masuk akal vs kontrak",
      fix: "Koreksi Contact + koreksi open invoices bila perlu",
      prevent: "Validasi terms dengan kontrak sebelum Save",
    },
    {
      id: "err-typo-seed",
      problem: "Mengubah ejaan nama seed saat latihan",
      why: "Langkah berikutnya di silabus gagal menemukan partner",
      detect: "Autocomplete tidak menemukan string seed",
      fix: `Rename persis ke ${c1.name} / ${v1.name}`,
      prevent: "Salin-tempel dari seed, jangan improvisasi",
    },
  ],
  troubleshooting: [
    {
      id: "tr-not-in-filter",
      problem: "Contact baru tidak muncul di filter Vendors/Customers",
      causes: [
        "Flag Customer/Vendor belum di-set",
        "Filter lain masih aktif (Tags, Archived)",
        "Multi-company: Contact di company lain",
      ],
      diagnosis: [
        "Clear filters → search nama",
        "Buka form → cek Sales & Purchase",
        "Cek field Company (multi-company) jika ada",
      ],
      solution: [
        "Set role yang benar → Save",
        "Hapus filter Archived",
        "Pastikan company aktif sama dengan transaksi",
      ],
      prevention: "Checklist role sebelum Save pertama",
    },
    {
      id: "tr-cannot-select-po",
      problem: "Vendor tidak bisa dipilih di RFQ",
      causes: [
        "Contact di-archive",
        "Tidak punya hak read Contacts",
        "Nama berbeda / typo",
      ],
      diagnosis: [
        "Contacts → hapus filter → cari nama",
        "Cek Active checkbox",
        "Login sebagai admin untuk isolasi hak akses",
      ],
      solution: [
        "Unarchive Contact",
        "Perbaiki nama ke seed",
        "Berikan group Contact Creation / Purchase User",
      ],
      prevention: "Jangan archive mitra yang masih punya open PO",
    },
    {
      id: "tr-address-missing-pdf",
      problem: "PDF PO/SO alamat kosong",
      causes: ["Street/City/Country Contact kosong", "Delivery address child kosong"],
      diagnosis: ["Buka Contact → cek Address", "Cek SO delivery address"],
      solution: ["Lengkapi alamat → cetak ulang PDF"],
      prevention: "Wajibkan alamat untuk Company vendor/customer utama",
    },
  ],
  behind: {
    models: [
      "res.partner — entitas Contact utama",
      "res.partner.category — Contact Tags",
      "res.partner.industry — industri (jika dipakai)",
      "account.payment.term — payment terms",
      "product.pricelist — pricelist customer",
    ],
    relations: [
      "res.partner.parent_id → hierarki Company/Individual/Address",
      "sale.order.partner_id → customer",
      "purchase.order.partner_id → vendor",
      "account.move.partner_id → invoice/bill partner",
      "stock.picking.partner_id → partner picking",
    ],
    automations: [
      "Onchange country/state format alamat",
      "Default AR/AP dari ir.property / company properties",
      "Pricelist & payment terms di-copy ke SO/PO saat pilih partner",
    ],
    securityNotes: [
      "Model res.partner dibaca luas oleh user operasional",
      "Field accounting sensitif — batasi group Accounting",
      "Portal users melihat Contact terkait mereka sendiri",
    ],
    note: "Fokus fungsional: pahami partner_id sebagai “kunci mitra” di hampir semua dokumen operasional.",
  },
  reporting: [
    {
      name: "Contacts List / Export",
      path: "Contacts → list → Export",
      kpi: "Jumlah customer & vendor aktif",
      decision: "Apakah master lengkap sebelum go-live transaksi?",
    },
    {
      name: "Aged Receivable",
      path: "Accounting → Reporting → Partner Reports → Aged Receivable",
      kpi: "Piutang per customer & bucket umur",
      decision: `Siapa perlu ditagih dulu? (${c1.name} vs ${c2.name})`,
    },
    {
      name: "Aged Payable",
      path: "Accounting → Reporting → Aged Payable",
      kpi: "Hutang per vendor",
      decision: "Prioritas bayar ${v1.name} vs ${v2.name}",
    },
    {
      name: "Sales Analysis by Customer",
      path: "Sales → Reporting → Sales",
      kpi: "Omzet per Contact customer",
      decision: "Fokus retensi retail vs distributor",
    },
  ],
  security: {
    roles: [
      {
        role: "Contact Creation / Sales User",
        can: [
          "Buat & edit Contact customer",
          "Pilih Contact di SO",
          "Lihat alamat & phone",
        ],
        cannot: [
          "Ubah group security",
          "Biasanya tidak mengedit akun GL sensitif tanpa Accounting",
        ],
        whyDifferent:
          "Sales butuh master customer cepat tanpa akses konfigurasi sistem.",
      },
      {
        role: "Purchase User",
        can: ["Buat vendor", "Pakai vendor di RFQ/PO"],
        cannot: ["Settings teknis", "Close fiscal period"],
        whyDifferent: "Fokus P2P, bukan admin platform.",
      },
      {
        role: "Accounting Admin",
        can: [
          "Edit tab Accounting Contact",
          "Lihat AR/AP penuh",
          "Merge & cleanup partner untuk integritas buku",
        ],
        cannot: ["Mengganti password user lain (itu Settings Admin)"],
        whyDifferent: "Bertanggung jawab atas kebenaran partner di buku besar.",
      },
    ],
    notes: [
      "Least privilege: user toko jangan dapat Settings → Users.",
      "Latih buat Contact sebagai Sales/Purchase User, bukan selalu Admin.",
      "Jangan bagikan password admin lab untuk operasi harian.",
    ],
  },
  levels: {
    beginner: [
      "Membedakan Company vs Individual",
      "Membuat 2 vendor + 2 customer dari seed",
      "Mengisi alamat, phone, email, tags",
      "Memahami filter Customers / Vendors",
    ],
    intermediate: [
      "Mengisi Sales & Purchase: terms, pricelist, buyer/salesperson",
      "Membuat Delivery/Invoice address child",
      "Menghubungkan Contact ke SO dan PO nyata",
      "Memakai tags untuk segmentasi",
    ],
    advanced: [
      "Tab Accounting & fiscal position",
      "Merge duplikat dengan aman",
      "Dual-role & multi-address strategy",
      "Export/import Contacts untuk migrasi",
    ],
    expert: [
      "Kebijakan master data enterprise (stewardship)",
      "Integrasi portal customer",
      "Analisis AR/AP + sales by partner untuk keputusan kredit",
      "Desain naming & Tax ID uniqueness lintas company",
    ],
  },
  exercises: [
    {
      id: "ex-seed-four",
      title: "Latihan: empat Contact seed",
      objective: "Menguasai create Contact Company untuk vendor & customer.",
      prerequisites: ["Login lab", "App Contacts aktif"],
      task: [
        `Buat ${v1.name} dan ${v2.name} sebagai Vendor`,
        `Buat ${c1.name} dan ${c2.name} sebagai Customer`,
        "Isi payment terms sesuai seed",
        "Screenshot list filter Vendors dan Customers",
      ],
      expectedResult: "Empat Company aktif, nama persis seed, siap modul Purchase/Sales.",
      checklist: [
        "Nama tanpa typo",
        "Country Indonesia",
        "Tags terisi",
        "Terms terisi",
      ],
    },
    {
      id: "ex-child-pic",
      title: "Latihan: PIC di bawah vendor",
      objective: "Memahami hierarki child Individual.",
      prerequisites: [`${v1.name} sudah ada`],
      task: [
        "Tambah Individual “Budi — Purchase” child-of vendor",
        "Isi email & job position",
        "Pastikan muncul di Contacts & Addresses induk",
      ],
      expectedResult: "Hierarki company → PIC terlihat di form induk.",
      checklist: ["Tipe Individual", "Related Company benar", "Email terisi"],
    },
    {
      id: "ex-delivery-addr",
      title: "Latihan: alamat kirim customer",
      objective: "Menyiapkan Delivery Address untuk SO.",
      prerequisites: [`${c1.name} sudah ada`],
      task: [
        "Tambah Delivery Address di bawah customer",
        "Buat Quotation singkat → pilih alamat kirim",
        "Cetak/preview SO — alamat kirim tampil",
      ],
      expectedResult: "SO memakai alamat delivery child, bukan hanya HQ.",
      checklist: ["Address type Delivery", "SO menampilkan alamat benar"],
    },
  ],
  coreFlowLinks: [
    { label: "Core: Master Contacts", href: "/modul/master-contacts" },
    { label: "Core: Setup Perusahaan", href: "/modul/setup-perusahaan" },
    { label: "Core: Purchase", href: "/modul/flow-purchase" },
    { label: "Core: Sales", href: "/modul/flow-sales" },
  ],
};
