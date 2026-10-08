import type { DeepDiveModule } from "../types";
import { seed } from "../../seed";

const customer = seed.customers.toko;
const distributor = seed.customers.distributor;
const kopi = seed.products.kopi;
const jasa = seed.products.jasa;
const company = seed.company;

/**
 * Deep Dive — CRM (Wave 2)
 * Pipeline, Lead/Opportunity, Activity; konversi ke Sales Quotation.
 */
export const crmDeepDive: DeepDiveModule = {
  slug: "crm",
  name: "CRM — Pipeline & Opportunity",
  shortTitle: "CRM",
  icon: "Target",
  category: "crm-sales",
  wave: 2,
  availability: "available",
  apps: ["CRM", "Sales", "Contacts", "Calendar"],
  overview: {
    function:
      "Modul CRM mengelola siklus Lead-to-Opportunity: menangkap prospek, mengkualifikasi, memindahkan stage pipeline, mencatat aktivitas follow-up, dan mengonversi opportunity menjadi Quotation/Sales Order. Di Odoo 19 Enterprise, CRM memakai model crm.lead (tipe lead/opportunity) yang terintegrasi dengan Sales dan Activities.",
    businessProblem:
      "Tanpa CRM, prospek hilang di chat/email, tidak ada owner jelas, follow-up tidak terjadwal, dan pipeline forecast omzet tidak bisa diandalkan sebelum order masuk Sales.",
    typicalUsers: [
      "Sales Representative / Salesperson",
      "Sales Team Leader",
      "Sales Manager",
      "Marketing / Lead Capture Admin",
    ],
    whenNeeded:
      "Saat tim sales mulai mengelola banyak prospek paralel, butuh visibilitas stage, aktivitas terstruktur, dan konversi terukur ke Quotation.",
    relatedModules: ["Contacts", "Sales", "Calendar", "Activities", "Discuss"],
    businessScenario: `${company.name} menerima inquiry dari ${customer.name} (retail) dan ${distributor.name} (distributor) untuk ${kopi.name} dan ${jasa.name}. Tim sales membuat Lead/Opportunity di CRM, menempatkan di stage pipeline, menjadwalkan call/meeting, lalu New Quotation setelah deal hampir closing.`,
  },
  prerequisites: {
    modules: ["Contacts", "Sales (untuk konversi Quotation)", "CRM app terpasang"],
    masterData: [
      `Contact/customer potensial: ${customer.name}, ${distributor.name}`,
      "Sales Team (crm.team) — mis. Sales Nusantara",
      "Pipeline stages (crm.stage)",
      "Tags opportunity (opsional)",
      `Produk referensi: ${kopi.name}, ${jasa.name}`,
    ],
    configuration: [
      "CRM → Configuration → Settings: Leads (jika ingin pisah Lead vs Opportunity)",
      "CRM → Configuration → Sales Teams",
      "CRM → Configuration → Stages",
      "Activities types (Call, Email, Meeting) tersedia",
    ],
    access: [
      "Sales / User: kelola opportunity milik sendiri / team",
      "Sales / Manager: semua pipeline, konfigurasi stage & team",
      "Hak Create Contact jika lead baru belum punya partner",
    ],
    relationships:
      "crm.lead.partner_id → res.partner; action New Quotation membuat sale.order terhubung opportunity. Activity (mail.activity) menempel di lead untuk follow-up.",
  },
  installation: {
    how: [
      "Home → Apps",
      "Cari 'CRM' atau 'Customer Relationship Management'",
      "Klik Install pada aplikasi CRM",
      "Pastikan menu CRM muncul di App Switcher",
    ],
    dependencies: [
      "Contacts (otomatis)",
      "Sales sering sudah terpasang atau dianjurkan untuk konversi Quotation",
      "Calendar membantu Meeting activity",
    ],
    afterInstall: [
      "Buka CRM → Configuration → Settings, aktifkan Leads jika diperlukan",
      "Buat/sesuaikan Sales Team dan Stages pipeline",
      "Assign salesperson ke team",
    ],
    newMenus: [
      "CRM → Sales → My Pipeline",
      "CRM → Sales → Leads (jika Leads aktif)",
      "CRM → Sales → My Activities",
      "CRM → Reporting",
      "CRM → Configuration → Settings",
      "CRM → Configuration → Sales Teams",
      "CRM → Configuration → Stages",
    ],
    newSettings: [
      "Settings → CRM → Pipeline",
      "Settings → CRM → Leads",
      "Settings → CRM → Generative AI / Enrichment (opsional Enterprise)",
    ],
  },
  configurations: [
    {
      id: "crm-leads",
      name: "Leads",
      location: "Settings → CRM → Leads → Leads",
      what: "Memisahkan entri mentah (Lead) dari Opportunity yang sudah dikualifikasi.",
      whyEnable:
        "Marketing/admin bisa capture lead massal; sales hanya mengolah yang lolos kualifikasi.",
      whenEnable:
        "Volume inquiry besar dari website/pameran dan perlu tahap screening.",
      whenNot:
        "Tim kecil yang langsung membuat Opportunity — layer Lead menambah klik tanpa nilai.",
      businessExample: `Inquiry email dari ${customer.name} masuk sebagai Lead, lalu Convert to Opportunity setelah telepon kualifikasi.`,
      impact:
        "Menu Leads muncul; Convert to Opportunity memindahkan record ke pipeline opportunity.",
      screenshot: {
        src: "/screenshots/odoo19e/01-home-apps.png",
        caption: "Home Apps — cari dan install CRM sebelum mengatur Leads",
        whatYouSee: "Daftar aplikasi Odoo termasuk CRM",
        why: "Leads diaktifkan dari Settings setelah CRM terpasang",
      },
    },
    {
      id: "crm-recursive-activities",
      name: "Recurring Activities / Activity Plans",
      location: "Settings → CRM → Activities (atau Configuration → Activity Types / Plans)",
      what: "Rencana aktivitas berulang (call → email → demo) per stage atau plan.",
      whyEnable:
        "Menstandarkan follow-up agar tidak ada opportunity 'menggantung' tanpa next action.",
      whenEnable:
        "Sales team >3 orang dan proses closing punya langkah wajib yang sama.",
      whenNot:
        "Setiap deal unik dan plan kaku justru diabaikan sales.",
      businessExample: `Plan "Retail Closing": Call hari 0, Email penawaran hari 2, Meeting hari 5 untuk ${customer.name}.`,
      impact:
        "Tombol Activity / Launch Plan menambahkan beberapa mail.activity sekaligus.",
    },
    {
      id: "crm-lead-enrichment",
      name: "Lead Enrichment (Enterprise)",
      location: "Settings → CRM → Lead Generation / Enrichment",
      what: "Melengkapi data perusahaan dari sumber enrichment (jika lisensi/fitur aktif).",
      whyEnable:
        "Menghemat riset manual untuk lead B2B baru.",
      whenEnable:
        "Banyak lead company tanpa alamat/website lengkap.",
      whenNot:
        "Data pelanggan lokal sudah lengkap di Contacts; enrichment tidak relevan atau tidak tersedia di lab.",
      businessExample: `Lead ${distributor.name} dilengkapi website & industri otomatis sebelum assign ke sales.`,
      impact:
        "Tombol Enrich muncul di form lead; field company terisi tambahan.",
      screenshot: {
        required: true,
        caption:
          "[SCREENSHOT REQUIRED] Settings CRM — opsi Lead Enrichment / Lead Generation di Odoo 19 Enterprise",
      },
    },
    {
      id: "crm-multi-teams",
      name: "Multi Sales Teams",
      location: "CRM → Configuration → Sales Teams",
      what: "Membagi pipeline per tim (retail vs distributor, region, produk).",
      whyEnable:
        "Forecast dan assignment tidak bercampur antar segmen.",
      whenEnable:
        "Ada lebih dari satu saluran penjualan atau wilayah.",
      whenNot:
        "Satu tim tunggal menangani semua — cukup default Sales Team.",
      businessExample: `Team "Retail Jakarta" untuk ${customer.name}; team "Distributor" untuk ${distributor.name}.`,
      impact:
        "Field Sales Team di opportunity; filter pipeline per team; reporting terpisah.",
    },
    {
      id: "crm-probability",
      name: "Stage Probability / Expected Revenue",
      location: "CRM → Configuration → Stages (Probability %)",
      what: "Setiap stage punya probability default untuk hitung expected revenue.",
      whyEnable:
        "Forecast pipeline = expected revenue × probability, bukan hanya jumlah deal.",
      whenEnable:
        "Manajemen butuh forecast bulanan berbasis stage realistis.",
      whenNot:
        "Stage hanya status operasional tanpa arti close-rate — probability 0/100 memadai.",
      businessExample: `Stage "Proposal" 60%: opportunity ${kopi.name} Rp 1.200.000 → expected ~Rp 720.000.`,
      impact:
        "Kanban menampilkan expected revenue; laporan Forecast memakai probability stage.",
      screenshot: {
        src: "/screenshots/odoo19e/w2-crm-pipeline.png",
        caption: "Kanban CRM Pipeline — stage dengan opportunity dan expected revenue",
        whatYouSee: "Kolom stage pipeline CRM",
        why: "Probability stage mempengaruhi angka forecast di board",
      },
    },
    {
      id: "crm-won-lost",
      name: "Won / Lost Reasons",
      location: "CRM → Configuration → Lost Reasons (dan tombol Won/Lost di form)",
      what: "Alasan kalah (lost reason) dan penandaan Won untuk analisis win-rate.",
      whyEnable:
        "Tanpa alasan lost, coaching sales tidak punya data objektif.",
      whenEnable:
        "Volume opportunity cukup untuk analisis bulanan.",
      whenNot:
        "Fase awal setup — fokus dulu isi pipeline, baru wajibkan lost reason.",
      businessExample: `Opportunity ${distributor.name} Lost dengan reason "Harga terlalu tinggi" → review pricelist.`,
      impact:
        "Lost memindahkan ke stage lost + reason; Won menandai success dan siap/lanjut Quotation.",
    },
  ],
  masterData: [
    {
      id: "md-crm-team",
      name: "Sales Team (crm.team)",
      purpose: "Wadah pipeline, anggota salesperson, dan target omzet.",
      required: true,
      whyNeeded:
        "Opportunity tanpa team sulit difilter; assignment dan forecasting per tim tidak jalan.",
      fields: [
        {
          field: "Sales Team",
          type: "Char",
          required: true,
          purpose: "Nama tim",
          why: "Label di filter & reporting",
          example: "Sales Nusantara",
          impactIfEmpty: "Team tidak bisa disimpan",
        },
        {
          field: "Team Leader",
          type: "Many2one",
          required: false,
          purpose: "Manajer tim",
          why: "Approval & visibility leadership",
          example: "Administrator",
          impactIfEmpty: "Tidak ada owner eskalasi default",
          related: "res.users",
        },
        {
          field: "Members",
          type: "Many2many",
          required: false,
          purpose: "Salesperson anggota",
          why: "Domain 'My Team' dan assignment",
          example: "Sales User A, Sales User B",
          impactIfEmpty: "Hanya leader yang terlihat di team",
          related: "res.users",
        },
        {
          field: "Invoicing Target",
          type: "Monetary",
          required: false,
          purpose: "Target omzet periode",
          why: "Dashboard pencapaian",
          example: "50000000",
          impactIfEmpty: "Progress target kosong",
        },
      ],
    },
    {
      id: "md-crm-stage",
      name: "Pipeline Stage (crm.stage)",
      purpose: "Tahapan kanban dari New hingga Won/Lost.",
      required: true,
      whyNeeded:
        "Tanpa stage, pipeline tidak punya alur kualifikasi dan probability forecast.",
      fields: [
        {
          field: "Stage Name",
          type: "Char",
          required: true,
          purpose: "Nama kolom kanban",
          why: "Bahasa operasional tim sales",
          example: "New / Qualified / Proposal / Won",
          impactIfEmpty: "Stage invalid",
        },
        {
          field: "Probability",
          type: "Float",
          required: false,
          purpose: "% kemungkinan closing",
          why: "Expected revenue",
          example: "60",
          impactIfEmpty: "Forecast memakai 0 atau default",
        },
        {
          field: "Folded in Pipeline",
          type: "Boolean",
          required: false,
          purpose: "Sembunyikan kolom Won/Lost di board",
          why: "Board fokus deal aktif",
          example: "True untuk Won/Lost",
          impactIfEmpty: "Board penuh stage historis",
        },
        {
          field: "Sales Team",
          type: "Many2one",
          required: false,
          purpose: "Stage khusus satu team",
          why: "Pipeline berbeda per segmen",
          example: "Sales Nusantara",
          impactIfEmpty: "Stage shared semua team",
          related: "crm.team",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-crm-pipeline.png",
        caption: "Pipeline CRM — kolom stage sebagai master alur deal",
      },
    },
    {
      id: "md-crm-lead",
      name: "Lead / Opportunity (crm.lead)",
      purpose: "Record prospek atau peluang penjualan bernilai.",
      required: true,
      whyNeeded:
        "Ini dokumen kerja harian sales di CRM; tanpa itu tidak ada pipeline.",
      fields: [
        {
          field: "Opportunity / Lead",
          type: "Char",
          required: true,
          purpose: "Judul deal",
          why: "Identitas cepat di kanban",
          example: `Retail ${kopi.name} — ${customer.name}`,
          impactIfEmpty: "Record tidak tersimpan",
        },
        {
          field: "Customer",
          type: "Many2one",
          required: false,
          purpose: "Partner terkait",
          why: "Link ke Contacts & Quotation",
          example: customer.name,
          impactIfEmpty: "Harus buat partner saat convert/quotation",
          related: "res.partner",
        },
        {
          field: "Expected Revenue",
          type: "Monetary",
          required: false,
          purpose: "Nilai potensi deal",
          why: "Forecast & prioritas",
          example: "1200000",
          impactIfEmpty: "Forecast understated",
        },
        {
          field: "Salesperson",
          type: "Many2one",
          required: false,
          purpose: "Owner deal",
          why: "Akuntabilitas follow-up",
          example: "Administrator",
          impactIfEmpty: "Deal orphan; My Pipeline kosong",
          related: "res.users",
        },
        {
          field: "Sales Team",
          type: "Many2one",
          required: false,
          purpose: "Tim pemilik",
          why: "Filter & target team",
          example: "Sales Nusantara",
          impactIfEmpty: "Sulit agregasi per team",
          related: "crm.team",
        },
        {
          field: "Tags",
          type: "Many2many",
          required: false,
          purpose: "Segmentasi deal",
          why: "Filter retail/distributor/produk",
          example: "Retail, Kopi",
          impactIfEmpty: "Analisis silang sulit",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-crm-form-new.png",
        caption: "Form Opportunity baru — field inti crm.lead",
        whatYouSee: "Form create opportunity CRM",
        whatToFill: `Judul deal, Customer ${customer.name}, Expected Revenue`,
      },
    },
  ],
  dependencies: {
    nodes: [
      { id: "contacts", label: "Contacts" },
      { id: "crm", label: "CRM (Lead/Opp)" },
      { id: "activity", label: "Activities / Calendar" },
      { id: "sales", label: "Sales (Quotation)" },
      { id: "account", label: "Invoicing (setelah SO)" },
    ],
    edges: [
      {
        from: "contacts",
        to: "crm",
        why: "Customer/partner mengisi crm.lead.partner_id",
      },
      {
        from: "crm",
        to: "activity",
        why: "Follow-up Call/Email/Meeting menempel di lead",
      },
      {
        from: "crm",
        to: "sales",
        why: "New Quotation membuat sale.order dari opportunity",
      },
      {
        from: "sales",
        to: "account",
        why: "Setelah SO confirmed & delivered, invoice menutup revenue",
      },
    ],
    summary:
      "CRM menghubungkan prospek (Contacts) ke follow-up (Activities) lalu ke Sales Quotation; Accounting ikut setelah Order-to-Cash berjalan.",
  },
  forms: [
    {
      id: "form-opportunity",
      name: "Opportunity (crm.lead type=opportunity)",
      menuPath: "CRM → Sales → My Pipeline → New",
      fields: [
        {
          field: "Opportunity",
          required: true,
          purpose: "Judul peluang",
          why: "Identitas di kanban",
          example: `Paket ${kopi.name} + ${jasa.name} — ${customer.name}`,
        },
        {
          field: "Customer",
          required: false,
          purpose: "Mitra bisnis",
          why: "Konversi quotation memakai partner",
          example: customer.name,
        },
        {
          field: "Expected Revenue",
          required: false,
          purpose: "Nilai deal",
          why: "Forecast pipeline",
          example: "1225000",
        },
        {
          field: "Probability",
          required: false,
          purpose: "% closing",
          why: "Override probability stage jika perlu",
          example: "60",
        },
        {
          field: "Salesperson",
          required: false,
          purpose: "Owner",
          why: "My Pipeline filter",
          example: "Administrator",
        },
        {
          field: "Sales Team",
          required: false,
          purpose: "Tim",
          why: "Reporting team",
          example: "Sales Nusantara",
        },
        {
          field: "Notes / Internal Note",
          required: false,
          purpose: "Konteks kebutuhan pelanggan",
          why: "Handover antar sales",
          example: `Butuh ${seed.so.kopiQty} kg ${kopi.name} + pengiriman lokal`,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-crm-form-new.png",
        caption: "Form Opportunity baru di CRM Odoo 19",
        whatYouSee: "Header opportunity dan field revenue",
        whatToFill: `Customer ${customer.name}, expected revenue paket kopi+jasa`,
      },
    },
    {
      id: "form-lead",
      name: "Lead (crm.lead type=lead)",
      menuPath: "CRM → Sales → Leads → New",
      fields: [
        {
          field: "Lead",
          required: true,
          purpose: "Judul prospek mentah",
          why: "Antrian kualifikasi",
          example: `Website inquiry — ${distributor.name}`,
        },
        {
          field: "Contact Name",
          required: false,
          purpose: "Nama orang kontak",
          why: "Sebelum partner dibuat",
          example: "Budi Procurement",
        },
        {
          field: "Email / Phone",
          required: false,
          purpose: "Kontak follow-up",
          why: "Activity Call/Email",
          example: distributor.email,
        },
        {
          field: "Company Name",
          required: false,
          purpose: "Nama perusahaan prospek",
          why: "Convert ke res.partner",
          example: distributor.name,
        },
        {
          field: "Salesperson",
          required: false,
          purpose: "Yang mengkualifikasi",
          why: "Ownership lead",
          example: "Administrator",
        },
        {
          field: "Tags",
          required: false,
          purpose: "Sumber/kanal",
          why: "Analisis lead source",
          example: "Website, Distributor",
        },
      ],
      screenshot: {
        required: true,
        caption:
          "[SCREENSHOT REQUIRED] Form Lead baru (CRM → Leads → New) setelah opsi Leads diaktifkan",
      },
    },
  ],
  procedures: [
    {
      id: "proc-crm-create-opp",
      title: `Membuat Opportunity untuk ${customer.name}`,
      goal: "Opportunity masuk pipeline stage New dengan expected revenue realistis.",
      preparation: [
        `Contact ${customer.name} sudah ada`,
        "Sales Team & Stages sudah dikonfigurasi",
        "Login sebagai Sales User / Admin",
      ],
      steps: [
        "Home → CRM → My Pipeline → New",
        `Isi Opportunity: Paket ${kopi.name} + ${jasa.name} — ${customer.name}`,
        `Pilih Customer: ${customer.name}`,
        `Isi Expected Revenue sesuai perkiraan (${kopi.salesPrice}×${seed.so.kopiQty} + ${jasa.salesPrice})`,
        "Pilih Salesperson & Sales Team",
        "Save — kartu muncul di stage New",
      ],
      expectedResult: "crm.lead tersimpan; terlihat di kanban pipeline.",
      verification: [
        "Badge stage = New (atau stage pertama)",
        "Customer terisi",
        "Expected revenue > 0",
      ],
      fillFields: [
        {
          field: "Opportunity",
          value: `Paket ${kopi.name} + ${jasa.name} — ${customer.name}`,
          where: "Header",
          how: "Ketik",
          required: true,
        },
        {
          field: "Customer",
          value: customer.name,
          where: "Header",
          how: "Pilih",
          required: true,
        },
        {
          field: "Expected Revenue",
          value: "1225000",
          where: "Header",
          how: "Ketik",
        },
        {
          field: "Sales Team",
          value: "Sales Nusantara",
          where: "Header",
          how: "Pilih",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-crm-form-new.png",
        caption: "Form Opportunity siap diisi untuk prospek retail",
      },
    },
    {
      id: "proc-crm-activities",
      title: "Menjadwalkan Activity follow-up",
      goal: "Ada next activity terjadwal agar deal tidak menggantung.",
      preparation: ["Opportunity sudah dibuat", "Activity type Call/Email tersedia"],
      steps: [
        "Buka Opportunity",
        "Klik Schedule Activity (atau ikon jam)",
        "Pilih Activity Type: Call",
        "Set Due Date (mis. besok)",
        "Isi Summary: Konfirmasi kebutuhan qty & alamat kirim",
        "Schedule → Mark as Done setelah telepon, lalu buat activity berikutnya jika perlu",
        "Drag kartu ke stage Qualified / Proposal sesuai hasil call",
      ],
      expectedResult: "mail.activity tercatat; My Activities menampilkan tugas.",
      verification: [
        "Chatter menampilkan activity",
        "CRM → My Activities berisi item",
        "Stage sudah digeser jika kualifikasi sukses",
      ],
      fillFields: [
        {
          field: "Activity Type",
          value: "Call",
          where: "Schedule Activity wizard",
          how: "Pilih",
          required: true,
        },
        {
          field: "Due Date",
          value: "Besok (tanggal lab)",
          where: "Schedule Activity wizard",
          how: "Pilih",
          required: true,
        },
        {
          field: "Summary",
          value: `Konfirmasi qty ${seed.so.kopiQty} ${kopi.name}`,
          where: "Schedule Activity wizard",
          how: "Ketik",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w2-crm-pipeline.png",
        caption: "Pipeline setelah opportunity punya activity & pindah stage",
      },
    },
    {
      id: "proc-crm-new-quotation",
      title: "Convert Opportunity menjadi Quotation",
      goal: "sale.order draft terhubung ke opportunity; pipeline siap Won setelah deal.",
      preparation: [
        "Opportunity di stage Proposal / Negotiation",
        `Produk ${kopi.name} dan ${jasa.name} Can be Sold`,
        "Sales app terpasang",
      ],
      steps: [
        "Buka Opportunity → New Quotation",
        "Review Quotation yang terbentuk (customer & line jika otomatis)",
        `Pastikan line: ${kopi.name} × ${seed.so.kopiQty}, ${jasa.name} × ${seed.so.jasaQty}`,
        "Save Quotation di Sales",
        "Kembali ke Opportunity → mark Won setelah pelanggan setuju (atau setelah Confirm SO sesuai SOP)",
      ],
      expectedResult: "Smart button Quotations muncul; link opportunity ↔ sale.order.",
      verification: [
        "Sales → Quotations: dokumen dengan customer benar",
        "Opportunity menampilkan quotation linked",
        "Expected revenue selaras dengan total penawaran",
      ],
      fillFields: [
        {
          field: "Customer",
          value: customer.name,
          where: "Quotation Header",
          how: "Otomatis dari opportunity",
          required: true,
        },
        {
          field: "Product (line 1)",
          value: kopi.name,
          where: "Order Lines",
          how: "Pilih",
          required: true,
        },
        {
          field: "Quantity (line 1)",
          value: seed.so.kopiQty,
          where: "Order Lines",
          how: "Ketik",
          required: true,
        },
        {
          field: "Product (line 2)",
          value: jasa.name,
          where: "Order Lines",
          how: "Pilih",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/09-sales-quotation-form.png",
        caption: "Quotation Sales hasil New Quotation dari CRM Opportunity",
      },
    },
  ],
  scenarios: [
    {
      id: "sc-crm-retail-pipeline",
      title: "Pipeline retail penuh sampai Quotation",
      whenToUse: `Inquiry ${customer.name} jelas dan stok/produk sudah dikenal.`,
      flow: [
        "Buat Opportunity",
        "Schedule Call",
        "Pindah stage Qualified → Proposal",
        "New Quotation",
        "Mark Won setelah deal",
      ],
      notes: "Jalur default latihan Wave 2 CRM → Sales.",
    },
    {
      id: "sc-crm-lead-convert",
      title: "Lead mentah dikonversi",
      whenToUse: "Opsi Leads aktif; data masuk dari form/website.",
      flow: [
        "Buat Lead",
        "Enrich/lengkapi kontak",
        "Convert to Opportunity",
        "Assign salesperson",
        "Lanjut aktivitas & quotation",
      ],
    },
    {
      id: "sc-crm-lost-analysis",
      title: "Deal kalah dengan lost reason",
      whenToUse: "Pelanggan memilih kompetitor atau menunda.",
      flow: [
        "Opportunity di Proposal",
        "Mark as Lost",
        "Pilih Lost Reason",
        "Review Reporting Lost",
        "Sesuaikan harga/pricelist jika pola berulang",
      ],
    },
    {
      id: "sc-crm-multi-team",
      title: "Dua team: retail vs distributor",
      whenToUse: "Segmen berbeda dengan owner berbeda.",
      flow: [
        `Opportunity ${customer.name} → team Retail`,
        `Opportunity ${distributor.name} → team Distributor`,
        "Filter pipeline per team",
        "Bandingkan win-rate di Reporting",
      ],
    },
  ],
  integrations: [
    {
      id: "int-crm-contacts",
      withModule: "Contacts",
      relationship: "crm.lead.partner_id → res.partner",
      whatHappens:
        "Customer di opportunity memakai master Contacts; alamat/email mengalir ke Quotation.",
    },
    {
      id: "int-crm-sales",
      withModule: "Sales",
      relationship: "Opportunity → sale.order",
      whatHappens:
        "New Quotation membuat penawaran; Confirm SO melanjutkan O2C di luar CRM.",
    },
    {
      id: "int-crm-calendar",
      withModule: "Calendar / Activities",
      relationship: "mail.activity & calendar.event",
      whatHappens:
        "Meeting activity bisa membuat event kalender; reminder muncul di systray.",
    },
    {
      id: "int-crm-discuss",
      withModule: "Discuss / Chatter",
      relationship: "mail.message di crm.lead",
      whatHappens:
        "Log email, note internal, dan mention rekan tersimpan di chatter opportunity.",
    },
  ],
  mistakes: [
    {
      id: "m-crm-no-next-activity",
      problem: "Opportunity tanpa next activity",
      why: "Deal dingin; forecast tampak hidup padahal tidak ada follow-up",
      detect: "Filter 'No Activity' / overdue kosong terus",
      fix: "Schedule activity segera; wajibkan sebelum pindah stage",
      prevent: "SOP: setiap stage punya activity plan",
    },
    {
      id: "m-crm-skip-to-so",
      problem: "Langsung buat SO tanpa opportunity",
      why: "Pipeline & win-rate tidak tercatat; coaching buta",
      detect: "SO tanpa origin CRM; reporting CRM kosong",
      fix: "Buat opportunity retrospektif + link quotation jika memungkinkan",
      prevent: "Sales wajib mulai dari CRM untuk deal non-counter",
    },
    {
      id: "m-crm-wrong-revenue",
      problem: "Expected revenue dikarang / 0",
      why: "Forecast menyesatkan manajemen",
      detect: "Total expected tidak masuk akal vs harga produk",
      fix: "Update revenue dari qty×harga realistis",
      prevent: "Isi revenue saat masuk stage Proposal",
    },
    {
      id: "m-crm-duplicate-opp",
      problem: "Duplikat opportunity untuk customer yang sama",
      why: "Double counting forecast; bentrok salesperson",
      detect: "Beberapa kartu aktif nama mirip untuk ${customer.name}",
      fix: "Merge/close duplikat; satu owner",
      prevent: "Cari existing opportunity sebelum New",
    },
    {
      id: "m-crm-won-without-quote",
      problem: "Mark Won tanpa Quotation/SO",
      why: "Win rate naik palsu; revenue tidak masuk Sales",
      detect: "Won tanpa smart button Quotation",
      fix: "Buat Quotation atau batalkan Won jika belum deal",
      prevent: "Definisi Won = ada Quotation accepted / SO",
    },
  ],
  troubleshooting: [
    {
      id: "t-crm-no-quotation-btn",
      problem: "Tombol New Quotation tidak muncul",
      causes: [
        "Sales app belum terpasang",
        "Hak akses Sales kurang",
        "Record masih Lead belum di-convert",
      ],
      diagnosis: [
        "Cek Apps → Sales installed",
        "Cek group Sales User pada user",
        "Cek tipe record Lead vs Opportunity",
      ],
      solution: [
        "Install Sales",
        "Convert Lead to Opportunity",
        "Login ulang setelah hak akses diubah",
      ],
      prevention: "Checklist Wave 2: CRM + Sales + Contacts sebelum latihan convert",
    },
    {
      id: "t-crm-pipeline-empty",
      problem: "My Pipeline kosong padahal ada data",
      causes: [
        "Filter My Pipeline (salesperson lain)",
        "Team salah",
        "Stage folded / archived",
      ],
      diagnosis: [
        "Hapus filter / gunakan Pipeline",
        "Cek Salesperson di opportunity",
        "Configuration → Stages",
      ],
      solution: [
        "Assign salesperson ke user login",
        "Pindahkan stage aktif",
        "Clear search facets",
      ],
      prevention: "Default assign salesperson saat create",
    },
    {
      id: "t-crm-activity-missing",
      problem: "Tidak bisa schedule activity",
      causes: [
        "Activity type tidak ada",
        "Hak akses terbatas",
        "Record belum di-save",
      ],
      diagnosis: [
        "Settings → Activity Types",
        "Save opportunity dulu",
      ],
      solution: [
        "Buat activity type Call/Email",
        "Save record → Schedule Activity",
      ],
      prevention: "Seed activity types di awal lab",
    },
  ],
  behind: {
    models: [
      "crm.lead",
      "crm.stage",
      "crm.team",
      "crm.team.member",
      "crm.tag",
      "crm.lost.reason",
      "mail.activity",
      "sale.order",
      "res.partner",
    ],
    relations: [
      "crm.lead.partner_id → res.partner",
      "crm.lead.stage_id → crm.stage",
      "crm.lead.team_id → crm.team",
      "crm.lead.user_id → res.users",
      "crm.lead.order_ids → sale.order",
      "mail.activity.res_id → crm.lead (res_model)",
    ],
    automations: [
      "stage probability updates expected revenue display",
      "activity deadline reminders via mail",
      "Won/Lost archive or fold stages",
      "New Quotation action creates sale.order linked to opportunity",
    ],
    securityNotes: [
      "sales.group_sale_salesman: own/team documents",
      "sales.group_sale_manager: all opportunities & configuration",
    ],
    note: "Di Odoo 19, lead dan opportunity adalah crm.lead dengan type/flag berbeda; pipeline UI adalah kanban pada stage_id.",
  },
  reporting: [
    {
      name: "Pipeline Analysis",
      path: "CRM → Reporting → Pipeline",
      kpi: "Expected revenue per stage/team",
      decision: "Fokus coaching stage Proposal yang menumpuk",
    },
    {
      name: "Forecast",
      path: "CRM → Reporting → Forecast",
      kpi: "Closing prediction periode berjalan",
      decision: "Alokasi stok/promosi untuk deal high-probability",
    },
    {
      name: "Win/Loss",
      path: "CRM → Reporting → Opportunities (group Won/Lost)",
      kpi: "Win rate & lost reasons",
      decision: "Sesuaikan harga atau value proposition",
    },
    {
      name: "Activities",
      path: "CRM → Reporting / My Activities",
      kpi: "Overdue vs planned activities",
      decision: "Intervensi salesperson dengan backlog follow-up",
    },
  ],
  security: {
    roles: [
      {
        role: "Sales / User",
        can: [
          "Buat & gerakkan opportunity sendiri/tim",
          "Schedule activity",
          "New Quotation dari opportunity",
        ],
        cannot: [
          "Ubah stage master & team configuration",
          "Lihat semua pipeline perusahaan (jika own documents)",
        ],
        whyDifferent:
          "Sales fokusasional fokus eksekusi deal, bukan desain pipeline.",
      },
      {
        role: "Sales / Manager",
        can: [
          "Semua opportunity",
          "Konfigurasi team, stage, lost reasons",
          "Analisis forecasting & target",
        ],
        cannot: [
          "Post invoice akuntansi tanpa role Accounting",
        ],
        whyDifferent:
          "Manager bertanggung jawab forecast dan kebijakan proses CRM.",
      },
    ],
    notes: [
      "Portal customer tidak mengelola CRM internal",
      "Marketing user boleh create Lead jika group sesuai",
    ],
  },
  levels: {
    beginner: [
      "Buat opportunity dari pipeline",
      "Geser stage dengan drag-and-drop",
      "Schedule Call activity",
      "Pahami Won vs Lost",
    ],
    intermediate: [
      "Aktifkan Leads + Convert",
      "Multi team & tags",
      "New Quotation dari opportunity",
      "Pakai probability & expected revenue",
    ],
    advanced: [
      "Activity plans berulang",
      "Analisis lost reasons bulanan",
      "Forecast vs actual invoicing",
      "Aturan assignment per team",
    ],
    expert: [
      "Desain stage probability berbasis data historis",
      "Integrasi lead capture website",
      "SLA follow-up & coaching KPI",
      "Sinkronisasi CRM ↔ Sales policy (kapan Won)",
    ],
  },
  exercises: [
    {
      id: "ex-crm-opp-basic",
      title: "Opportunity retail kopi",
      objective: `Membuat opportunity untuk ${customer.name}`,
      prerequisites: ["Contacts customer ada", "CRM terpasang"],
      task: [
        "Buat opportunity dengan expected revenue",
        "Assign salesperson & team",
        "Pastikan muncul di kanban New",
      ],
      expectedResult: "Kartu pipeline terlihat dengan customer benar",
      checklist: ["Judul jelas", "Revenue terisi", "Owner terisi"],
    },
    {
      id: "ex-crm-activity",
      title: "Follow-up Call",
      objective: "Menjadwalkan dan menyelesaikan activity",
      prerequisites: ["Opportunity ada"],
      task: [
        "Schedule Call due tomorrow",
        "Mark Done dengan note hasil",
        "Pindah stage Qualified",
      ],
      expectedResult: "Chatter berisi log activity; stage berubah",
      checklist: ["Tidak ada overdue tanpa alasan", "Note hasil call tersimpan"],
    },
    {
      id: "ex-crm-quotation",
      title: "New Quotation dari CRM",
      objective: "Menghubungkan opportunity ke Sales",
      prerequisites: ["Produk Can be Sold", "Sales terpasang"],
      task: [
        "New Quotation",
        `Isi ${kopi.name} × ${seed.so.kopiQty} dan ${jasa.name}`,
        "Kembali ke CRM cek smart button",
      ],
      expectedResult: "Quotation linked; siap Confirm di Sales",
      checklist: ["Customer sama", "Origin/link opportunity ada"],
    },
    {
      id: "ex-crm-lost",
      title: "Simulasi Lost Reason",
      objective: "Menutup deal kalah dengan alasan",
      prerequisites: ["Opportunity kedua untuk latihan"],
      task: [
        `Buat opportunity ${distributor.name}`,
        "Mark Lost + pilih reason",
        "Buka reporting lost",
      ],
      expectedResult: "Deal di stage Lost; reason tercatat",
      checklist: ["Reason wajib terisi", "Tidak menghapus record"],
    },
  ],
  coreFlowLinks: [
    { label: "Deep Dive Sales", href: "/materi/sales" },
    { label: "Core Flow Sales", href: "/modul/flow-sales" },
    { label: "Quotation sampai SO", href: "/modul/flow-sales/quotation-to-so" },
    { label: "Master Contacts", href: "/modul/master-contacts" },
    { label: "Deep Dive Contacts", href: "/materi/contacts" },
  ],
};
