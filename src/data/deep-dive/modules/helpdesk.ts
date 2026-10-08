import type { DeepDiveModule } from "../types";
import { seed } from "../../seed";

const customer = seed.customers.toko;
const distributor = seed.customers.distributor;
const kopi = seed.products.kopi;
const jasa = seed.products.jasa;
const company = seed.company;

/**
 * Deep Dive — Helpdesk
 * Teams, Tickets, Stages, SLA, Assign, Portal; opsional Convert to Lead/CRM.
 */
export const helpdeskDeepDive: DeepDiveModule = {
  slug: "helpdesk",
  name: "Helpdesk — Tickets & SLA",
  shortTitle: "Helpdesk",
  icon: "Headset",
  category: "services",
  wave: 3,
  availability: "available",
  apps: ["Helpdesk", "Contacts", "CRM", "Discuss"],
  overview: {
    function:
      "Modul Helpdesk mengelola siklus support ticket: menerima keluhan/permintaan pelanggan, menempatkan di stage kanban per Helpdesk Team, meng-assign agent, menegakkan SLA (waktu respon & resolusi), berkomunikasi lewat chatter/email, dan menutup tiket. Di Odoo 19 Enterprise, model utama helpdesk.ticket terintegrasi Contacts, optional CRM (Convert to Lead/Opportunity), Project/Timesheets, dan Customer Portal.",
    businessProblem:
      "Tanpa Helpdesk, keluhan hilang di WhatsApp/email, tidak ada owner jelas, SLA tidak terukur, dan tim sales/support tidak punya jejak eskalasi ke opportunity atau project perbaikan.",
    typicalUsers: [
      "Helpdesk Agent / Customer Support",
      "Helpdesk Team Leader",
      "Customer Success / After-Sales",
      "Sales (eskalasi ticket → lead/opportunity)",
    ],
    whenNeeded:
      "Saat volume keluhan/permintaan after-sales mulai paralel, perlu SLA, assignment, portal pelanggan, dan pelaporan resolution time.",
    relatedModules: ["Contacts", "CRM", "Discuss", "Project", "Sales", "Website / Portal"],
    businessScenario: `${company.name} menerima keluhan dari ${customer.name} tentang kualitas ${kopi.name} dan permintaan follow-up pengiriman ${jasa.name} dari ${distributor.name}. Tim Support membuat ticket per Helpdesk Team, assign agent, pantau SLA, balas lewat portal/email, lalu Convert to Lead jika ticket ternyata peluang penjualan ulang.`,
  },
  prerequisites: {
    modules: [
      "Helpdesk app terpasang",
      "Contacts (customer ticket)",
      "CRM (opsional — Convert to Lead/Opportunity)",
      "Website / Portal (opsional — tiket dari pelanggan)",
    ],
    masterData: [
      `Contact/customer: ${customer.name}, ${distributor.name}`,
      "Helpdesk Team (helpdesk.team) — mis. Support Nusantara",
      "Ticket stages (helpdesk.stage)",
      "SLA policies (helpdesk.sla) — respon & resolusi",
      "Tags ticket (opsional): Kualitas, Pengiriman, Klaim",
      `Produk referensi keluhan: ${kopi.name}, ${jasa.name}`,
    ],
    configuration: [
      "Helpdesk → Configuration → Settings: SLA, Rating, Convert to Lead, dll.",
      "Helpdesk → Configuration → Helpdesk Teams",
      "Helpdesk → Configuration → Stages",
      "Helpdesk → Configuration → SLA Policies",
      "Assign members ke team + alias email (jika dipakai)",
    ],
    access: [
      "Helpdesk / User: kelola ticket milik sendiri / team",
      "Helpdesk / Administrator: semua ticket, konfigurasi team/stage/SLA",
      "Portal user (customer): buat/lihat ticket sendiri jika portal aktif",
    ],
    relationships:
      "helpdesk.ticket.partner_id → res.partner; team_id → helpdesk.team; stage_id → helpdesk.stage; SLA status menempel ticket. Convert to Lead membuat crm.lead terhubung konteks ticket. Portal menampilkan ticket pelanggan.",
  },
  installation: {
    how: [
      "Home → Apps",
      "Cari 'Helpdesk'",
      "Klik Install pada aplikasi Helpdesk",
      "Pastikan menu Helpdesk muncul di App Switcher",
    ],
    dependencies: [
      "Contacts (otomatis)",
      "Discuss / Mail untuk chatter & email alias",
      "CRM disarankan jika ingin Convert to Lead",
      "Website opsional untuk form/portal ticket",
    ],
    afterInstall: [
      "Buka Helpdesk → Configuration → Settings, aktifkan SLA dan opsi yang dibutuhkan",
      "Buat/sesuaikan Helpdesk Team, Stages, dan SLA Policies",
      "Assign agent ke team; uji buat ticket pertama",
    ],
    newMenus: [
      "Helpdesk → Tickets → My Tickets / All Tickets",
      "Helpdesk → Overview (dashboard team)",
      "Helpdesk → Reporting",
      "Helpdesk → Configuration → Settings",
      "Helpdesk → Configuration → Helpdesk Teams",
      "Helpdesk → Configuration → Stages",
      "Helpdesk → Configuration → SLA Policies",
    ],
    newSettings: [
      "Settings → Helpdesk → Helpdesk",
      "Settings → Helpdesk → Productivity (SLA, Rating, dll.)",
      "Settings → Helpdesk → After-Sales (Convert to Lead / Project — sesuai opsi lab)",
    ],
  },
  configurations: [
    {
      id: "hd-sla",
      name: "SLA Policies",
      location: "Settings → Helpdesk → Productivity → SLA / Helpdesk → Configuration → SLA Policies",
      what: "Aturan batas waktu first response dan/atau resolusi per team, prioritas, atau tag.",
      whyEnable:
        "Tanpa SLA, kinerja support tidak terukur dan ticket kritis mudah terlambat tanpa alarm.",
      whenEnable:
        "Tim support >1 orang atau ada komitmen waktu ke pelanggan (mis. 4 jam respon).",
      whenNot:
        "Volume ticket sangat rendah dan semua ditangani ad-hoc oleh satu orang.",
      businessExample: `SLA "Retail Critical": first response 2 jam untuk ticket ${customer.name} terkait ${kopi.name}; target close 1 hari kerja.`,
      impact:
        "Ticket menampilkan deadline SLA; status Succeeded/Failed; reporting compliance per team.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-settings-helpdesk-sla.png",
        caption: "Settings / SLA Helpdesk — kebijakan waktu respon & resolusi",
        whatYouSee: "Konfigurasi SLA policies Helpdesk Odoo 19 Enterprise",
        why: "SLA harus aktif agar deadline tampil di ticket kanban/form",
      },
    },
    {
      id: "hd-multi-teams",
      name: "Multi Helpdesk Teams",
      location: "Helpdesk → Configuration → Helpdesk Teams",
      what: "Membagi antrian ticket per tim (retail vs distributor, kualitas vs pengiriman).",
      whyEnable:
        "Assignment, stage, alias email, dan SLA tidak bercampur antar segmen support.",
      whenEnable:
        "Ada lebih dari satu saluran keluhan atau spesialisasi agent.",
      whenNot:
        "Satu tim tunggal menangani semua — cukup default Helpdesk Team.",
      businessExample: `Team "Support Retail" untuk ${customer.name}; team "Support Distributor" untuk ${distributor.name}.`,
      impact:
        "Field Team di ticket; kanban per team; reporting & SLA terpisah.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-helpdesk-teams.png",
        caption: "Daftar Helpdesk Teams — konfigurasi tim support",
        whatYouSee: "List/kanban Helpdesk Teams dengan anggota dan alias",
        why: "Team adalah wadah assignment dan SLA",
      },
    },
    {
      id: "hd-assign",
      name: "Assignment Method",
      location: "Helpdesk → Configuration → Helpdesk Teams (Assignment)",
      what: "Cara ticket baru di-assign: manual, random, balanced, atau berdasarkan skill/domain.",
      whyEnable:
        "Mengurangi ticket orphan tanpa owner dan meratakan beban agent.",
      whenEnable:
        "Beberapa agent aktif di team yang sama.",
      whenNot:
        "Team leader selalu assign manual — method otomatis justru bentrok dengan SOP.",
      businessExample: `Ticket keluhan ${kopi.name} dari ${customer.name} auto-assign ke agent retail yang paling sedikit open ticket.`,
      impact:
        "Field Assigned To terisi otomatis saat create/email-in; My Tickets terisi merata.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-helpdesk.png",
        caption: "Tampilan terkait di Odoo 19 Enterprise",
        whatYouSee: "UI modul pada lab / runbot Enterprise",
      },
    },
    {
      id: "hd-customer-ratings",
      name: "Customer Ratings",
      location: "Settings → Helpdesk → Productivity → Customer Ratings",
      what: "Mengirim survei kepuasan setelah ticket ditutup.",
      whyEnable:
        "CSAT/rating memberi umpan balik kualitas resolusi, bukan hanya kecepatan SLA.",
      whenEnable:
        "Volume ticket cukup dan ingin coaching agent berbasis skor pelanggan.",
      whenNot:
        "Fase awal setup — fokus tutup ticket & SLA dulu.",
      businessExample: `${customer.name} menutup ticket klaim ${kopi.name} → email rating; skor rendah memicu review proses packing.`,
      impact:
        "Email/rating request setelah Solved; reporting rata-rata rating per team/agent.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-settings-helpdesk.png",
        caption: "Settings Helpdesk — opsi produktivitas termasuk Ratings & SLA",
        whatYouSee: "Halaman Settings aplikasi Helpdesk",
        why: "Ratings dan SLA diaktifkan dari sini sebelum operasi harian",
      },
    },
    {
      id: "hd-convert-lead",
      name: "Convert to Lead / Opportunity (CRM)",
      location: "Settings → Helpdesk → After-Sales / tombol Convert di form ticket",
      what: "Mengubah ticket yang ternyata peluang penjualan menjadi Lead/Opportunity di CRM.",
      whyEnable:
        "Support sering mendengar kebutuhan beli ulang; tanpa convert, pipeline sales kehilangan sinyal.",
      whenEnable:
        "CRM terpasang dan after-sales boleh menghasilkan upsell/cross-sell.",
      whenNot:
        "Helpdesk murni klaim/garansi tanpa funnel penjualan — convert menambah noise CRM.",
      businessExample: `Ticket ${distributor.name} "minta penawaran ${kopi.name} 50 kg" → Convert to Opportunity, lanjut Sales.`,
      impact:
        "Tombol Convert to Lead/Opportunity; smart button ke crm.lead; ticket tetap punya jejak asal.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-helpdesk.png",
        caption: "Tampilan terkait di Odoo 19 Enterprise",
        whatYouSee: "UI modul pada lab / runbot Enterprise",
      },
    },
    {
      id: "hd-portal",
      name: "Customer Portal Tickets",
      location: "Settings → Helpdesk + Website/Portal; akses pelanggan di /my/tickets",
      what: "Pelanggan membuat dan memantau ticket dari portal tanpa login backend.",
      whyEnable:
        "Mengurangi intake manual via telepon/WA dan memberi transparansi status ke customer.",
      whenEnable:
        "Customer B2B (retail/distributor) sudah punya portal user di Contacts.",
      whenNot:
        "Semua keluhan masih di-counter fisik atau WA internal tanpa portal.",
      businessExample: `${customer.name} login portal → submit ticket "Kemasan ${kopi.name} rusak" → muncul di team Support Retail.`,
      impact:
        "Ticket dari portal terisi partner otomatis; pelanggan melihat stage/pesan balasan.",
      screenshot: {
        src: "/screenshots/odoo19e/w3-00-home-apps.png",
        caption: "Home Apps — pastikan Helpdesk (dan Website jika portal) terpasang",
        whatYouSee: "Daftar aplikasi Odoo termasuk Helpdesk",
        why: "Portal ticket membutuhkan Helpdesk aktif dan akses portal customer",
      },
    },
  ],
  masterData: [
    {
      id: "md-hd-team",
      name: "Helpdesk Team (helpdesk.team)",
      purpose: "Wadah antrian ticket, anggota agent, alias email, stage & SLA terkait.",
      required: true,
      whyNeeded:
        "Ticket tanpa team sulit difilter; assignment, SLA, dan reporting per tim tidak jalan.",
      fields: [
        {
          field: "Team Name",
          type: "Char",
          required: true,
          purpose: "Nama tim support",
          why: "Label di filter, kanban, dan reporting",
          example: "Support Nusantara",
          impactIfEmpty: "Team tidak bisa disimpan",
        },
        {
          field: "Team Members",
          type: "Many2many",
          required: false,
          purpose: "Agent yang boleh di-assign",
          why: "Domain assignment & My Team",
          example: "Support Agent A, Team Leader",
          impactIfEmpty: "Tidak ada kandidat auto-assign",
          related: "res.users",
        },
        {
          field: "Email Alias",
          type: "Char",
          required: false,
          purpose: "Alamat email masuk → ticket",
          why: "Intake otomatis dari mailbox",
          example: "support@nusantara-demo.test",
          impactIfEmpty: "Hanya create manual/portal",
        },
        {
          field: "Assignment Method",
          type: "Selection",
          required: false,
          purpose: "Cara pilih assignee",
          why: "Beban kerja merata",
          example: "Balanced",
          impactIfEmpty: "Default manual / perilaku standar Odoo",
        },
        {
          field: "Use SLA",
          type: "Boolean",
          required: false,
          purpose: "Aktifkan SLA di team ini",
          why: "Deadline & compliance",
          example: "True",
          impactIfEmpty: "Ticket team tanpa tracking SLA",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-helpdesk-teams.png",
        caption: "Master Helpdesk Teams — fondasi antrian support",
      },
    },
    {
      id: "md-hd-stage",
      name: "Ticket Stage (helpdesk.stage)",
      purpose: "Tahapan kanban dari New hingga Solved/Cancelled.",
      required: true,
      whyNeeded:
        "Tanpa stage, tidak ada alur triage → in progress → waiting → solved.",
      fields: [
        {
          field: "Stage Name",
          type: "Char",
          required: true,
          purpose: "Nama kolom kanban",
          why: "Bahasa operasional tim support",
          example: "New / In Progress / On Hold / Solved",
          impactIfEmpty: "Stage invalid",
        },
        {
          field: "Team",
          type: "Many2one / Many2many",
          required: false,
          purpose: "Stage khusus satu/beberapa team",
          why: "Pipeline berbeda per segmen",
          example: "Support Nusantara",
          impactIfEmpty: "Stage shared semua team",
          related: "helpdesk.team",
        },
        {
          field: "Folded in Kanban",
          type: "Boolean",
          required: false,
          purpose: "Sembunyikan Solved/Cancelled di board",
          why: "Board fokus ticket aktif",
          example: "True untuk Solved",
          impactIfEmpty: "Board penuh ticket historis",
        },
        {
          field: "Closing Stage",
          type: "Boolean",
          required: false,
          purpose: "Menandai stage penutup (Solved)",
          why: "SLA resolusi & rating trigger",
          example: "True pada Solved",
          impactIfEmpty: "Ticket 'selesai' tidak menutup metrik",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-helpdesk.png",
        caption: "Kanban Helpdesk — kolom stage sebagai alur ticket",
      },
    },
    {
      id: "md-hd-sla",
      name: "SLA Policy (helpdesk.sla)",
      purpose: "Definisi target waktu (respon/resolusi) dan kondisi berlakunya.",
      required: false,
      whyNeeded:
        "Tanpa policy, opsi SLA aktif tidak punya aturan konkret per prioritas/team.",
      fields: [
        {
          field: "Name",
          type: "Char",
          required: true,
          purpose: "Nama kebijakan",
          why: "Identitas di ticket & report",
          example: "Respon 4 Jam — Retail",
          impactIfEmpty: "Policy tidak tersimpan",
        },
        {
          field: "Team",
          type: "Many2one",
          required: true,
          purpose: "Team yang memakai SLA",
          why: "Scope penerapan",
          example: "Support Nusantara",
          impactIfEmpty: "SLA tidak terikat antrian",
          related: "helpdesk.team",
        },
        {
          field: "Priority",
          type: "Selection",
          required: false,
          purpose: "Prioritas ticket yang kena SLA",
          why: "Critical beda dari Low",
          example: "High",
          impactIfEmpty: "Berlaku semua prioritas (tergantung domain)",
        },
        {
          field: "Within",
          type: "Float / Hours",
          required: true,
          purpose: "Batas waktu target",
          why: "Deadline dihitung dari create/stage",
          example: "4",
          impactIfEmpty: "Policy invalid",
        },
        {
          field: "Target Stage / Type",
          type: "Many2one / Selection",
          required: false,
          purpose: "First response vs reach stage tertentu",
          why: "Membedakan respon awal vs close",
          example: "In Progress / Solved",
          impactIfEmpty: "Perilaku default tipe SLA",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-settings-helpdesk-sla.png",
        caption: "SLA Policies — target waktu per team/prioritas",
      },
    },
    {
      id: "md-hd-ticket",
      name: "Ticket (helpdesk.ticket)",
      purpose: "Dokumen kerja harian support: keluhan, permintaan, klaim.",
      required: true,
      whyNeeded:
        "Ini unit kerja Helpdesk; tanpa ticket tidak ada antrian, SLA, atau reporting.",
      fields: [
        {
          field: "Subject",
          type: "Char",
          required: true,
          purpose: "Judul singkat ticket",
          why: "Identitas di kanban & portal",
          example: `Kemasan rusak — ${kopi.name} — ${customer.name}`,
          impactIfEmpty: "Ticket tidak tersimpan",
        },
        {
          field: "Customer",
          type: "Many2one",
          required: false,
          purpose: "Partner pelapor",
          why: "Sejarah support & portal",
          example: customer.name,
          impactIfEmpty: "Sulit agregasi per pelanggan; portal tidak cocok",
          related: "res.partner",
        },
        {
          field: "Helpdesk Team",
          type: "Many2one",
          required: true,
          purpose: "Antrian pemilik",
          why: "Stage, SLA, assignment",
          example: "Support Nusantara",
          impactIfEmpty: "Ticket tidak masuk pipeline team",
          related: "helpdesk.team",
        },
        {
          field: "Assigned to",
          type: "Many2one",
          required: false,
          purpose: "Agent owner",
          why: "Akuntabilitas & My Tickets",
          example: "Administrator",
          impactIfEmpty: "Ticket orphan; SLA berisiko gagal",
          related: "res.users",
        },
        {
          field: "Priority",
          type: "Selection",
          required: false,
          purpose: "Urgensi bintang",
          why: "Urutan kerja & domain SLA",
          example: "High (2 stars)",
          impactIfEmpty: "Default prioritas; SLA salah target",
        },
        {
          field: "Tags",
          type: "Many2many",
          required: false,
          purpose: "Kategori isu",
          why: "Analisis akar masalah",
          example: "Kualitas, Packing",
          impactIfEmpty: "Reporting isu silang sulit",
        },
        {
          field: "Description",
          type: "Html",
          required: false,
          purpose: "Detail keluhan",
          why: "Konteks untuk agent & handover",
          example: `Karton ${kopi.name} penyok saat terima; butuh penggantian ${seed.so.kopiQty} unit`,
          impactIfEmpty: "Agent harus tanya ulang ke pelanggan",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-helpdesk-ticket-form.png",
        caption: "Form Ticket Helpdesk — field inti helpdesk.ticket",
        whatYouSee: "Form create/edit ticket",
        whatToFill: `Subject, Customer ${customer.name}, Team, Priority`,
      },
    },
  ],
  dependencies: {
    nodes: [
      { id: "contacts", label: "Contacts" },
      { id: "helpdesk", label: "Helpdesk (Ticket)" },
      { id: "sla", label: "SLA Policies" },
      { id: "discuss", label: "Discuss / Email" },
      { id: "crm", label: "CRM (Convert Lead)" },
      { id: "portal", label: "Customer Portal" },
    ],
    edges: [
      {
        from: "contacts",
        to: "helpdesk",
        why: "Customer mengisi helpdesk.ticket.partner_id",
      },
      {
        from: "helpdesk",
        to: "sla",
        why: "Team + priority memilih policy; deadline menempel ticket",
      },
      {
        from: "helpdesk",
        to: "discuss",
        why: "Chatter, email alias, notifikasi agent/pelanggan",
      },
      {
        from: "portal",
        to: "helpdesk",
        why: "Pelanggan submit/pantau ticket dari /my",
      },
      {
        from: "helpdesk",
        to: "crm",
        why: "Convert to Lead/Opportunity saat ticket bernilai penjualan",
      },
    ],
    summary:
      "Helpdesk menghubungkan pelanggan (Contacts/Portal) ke antrian ticket + SLA, komunikasi (Discuss), dan opsional eskalasi penjualan (CRM).",
  },
  forms: [
    {
      id: "form-ticket",
      name: "Ticket (helpdesk.ticket)",
      menuPath: "Helpdesk → Tickets → New",
      fields: [
        {
          field: "Subject",
          required: true,
          purpose: "Judul ticket",
          why: "Identitas di kanban & portal",
          example: `Klaim kualitas ${kopi.name} — ${customer.name}`,
        },
        {
          field: "Customer",
          required: false,
          purpose: "Pelapor",
          why: "Riwayat & balasan email/portal",
          example: customer.name,
        },
        {
          field: "Helpdesk Team",
          required: true,
          purpose: "Antrian",
          why: "Stage & SLA team",
          example: "Support Nusantara",
        },
        {
          field: "Assigned to",
          required: false,
          purpose: "Agent",
          why: "My Tickets & akuntabilitas",
          example: "Administrator",
        },
        {
          field: "Priority",
          required: false,
          purpose: "Urgensi",
          why: "Urutan kerja + domain SLA",
          example: "High",
        },
        {
          field: "Tags",
          required: false,
          purpose: "Kategori",
          why: "Analisis isu",
          example: "Kualitas",
        },
        {
          field: "Description",
          required: false,
          purpose: "Detail kasus",
          why: "Handover antar agent",
          example: `Diterima ${seed.so.kopiQty} kg; 2 unit kemasan rusak; minta replacement`,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-helpdesk-ticket-form.png",
        caption: "Form Ticket baru di Helpdesk Odoo 19",
        whatYouSee: "Header ticket: subject, customer, team, assignee",
        whatToFill: `Subject klaim ${kopi.name}, Customer ${customer.name}`,
      },
    },
    {
      id: "form-team",
      name: "Helpdesk Team",
      menuPath: "Helpdesk → Configuration → Helpdesk Teams → New",
      fields: [
        {
          field: "Name",
          required: true,
          purpose: "Nama team",
          why: "Label operasional",
          example: "Support Nusantara",
        },
        {
          field: "Members",
          required: false,
          purpose: "Daftar agent",
          why: "Assignment pool",
          example: "Administrator, Support User",
        },
        {
          field: "Alias",
          required: false,
          purpose: "Email masuk",
          why: "Ticket dari email",
          example: "support@nusantara-demo.test",
        },
        {
          field: "Assignment Method",
          required: false,
          purpose: "Metode assign",
          why: "Beban merata",
          example: "Balanced",
        },
        {
          field: "Stages / SLA",
          required: false,
          purpose: "Pipeline & kebijakan waktu",
          why: "Alur kerja team",
          example: "New→In Progress→Solved + SLA 4 jam",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-helpdesk-teams.png",
        caption: "Form/list Helpdesk Teams",
        whatYouSee: "Konfigurasi team support",
      },
    },
  ],
  procedures: [
    {
      id: "proc-hd-create-ticket",
      title: `Membuat Ticket untuk ${customer.name}`,
      goal: "Ticket masuk stage New di team yang benar dengan customer & prioritas jelas.",
      preparation: [
        `Contact ${customer.name} sudah ada`,
        "Helpdesk Team & Stages sudah dikonfigurasi",
        "Login sebagai Helpdesk User / Admin",
      ],
      steps: [
        "Home → Helpdesk → Tickets → New",
        `Isi Subject: Klaim kemasan ${kopi.name} — ${customer.name}`,
        `Pilih Customer: ${customer.name}`,
        "Pilih Helpdesk Team: Support Nusantara",
        "Set Priority High jika klaim stok/urgent",
        "Isi Description (qty rusak, nomor SO jika ada)",
        "Assign agent (manual atau biarkan auto-assign)",
        "Save — kartu muncul di kanban New",
      ],
      expectedResult: "helpdesk.ticket tersimpan; terlihat di board team; SLA mulai jika policy cocok.",
      verification: [
        "Stage = New (atau stage pertama)",
        "Customer & Team terisi",
        "Assigned to terisi (jika method aktif)",
        "Deadline SLA tampil jika policy match",
      ],
      fillFields: [
        {
          field: "Subject",
          value: `Klaim kemasan ${kopi.name} — ${customer.name}`,
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
          field: "Helpdesk Team",
          value: "Support Nusantara",
          where: "Header",
          how: "Pilih",
          required: true,
        },
        {
          field: "Priority",
          value: "High",
          where: "Header",
          how: "Pilih bintang",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-helpdesk-ticket-form.png",
        caption: "Form Ticket siap diisi untuk klaim retail",
      },
    },
    {
      id: "proc-hd-assign-sla",
      title: "Assign agent dan penuhi first response SLA",
      goal: "Ticket punya owner; balasan pertama sebelum deadline SLA.",
      preparation: [
        "Ticket sudah dibuat",
        "SLA policy aktif untuk team/priority",
        "Agent adalah member team",
      ],
      steps: [
        "Buka Ticket dari kanban Helpdesk",
        "Set Assigned to ke agent yang bertugas",
        "Balas pelanggan lewat chatter (Send message) — ini first response",
        "Geser stage ke In Progress",
        "Jadwalkan Activity follow-up jika menunggu barang replacement",
        "Pantau widget SLA: Remaining / Failed",
      ],
      expectedResult: "Assignee terisi; first response tercatat; SLA respon Succeeded jika tepat waktu.",
      verification: [
        "My Tickets menampilkan item untuk agent",
        "Chatter punya pesan keluar ke customer",
        "Status SLA first response hijau/Succeeded",
      ],
      fillFields: [
        {
          field: "Assigned to",
          value: "Administrator",
          where: "Header ticket",
          how: "Pilih",
          required: true,
        },
        {
          field: "Message",
          value: `Terima kasih, klaim ${kopi.name} kami proses penggantian`,
          where: "Chatter Send message",
          how: "Ketik & Send",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-helpdesk.png",
        caption: "Kanban Helpdesk setelah assign & pindah stage",
        whatYouSee: "Kartu ticket di kolom In Progress",
      },
    },
    {
      id: "proc-hd-resolve-portal",
      title: "Menyelesaikan ticket dan jejak portal pelanggan",
      goal: "Ticket Solved; pelanggan melihat status/pesan dari portal (jika aktif).",
      preparation: [
        "Ticket In Progress dengan solusi siap",
        `Portal user untuk ${customer.name} (opsional lab)`,
        "Closing stage Solved dikonfigurasi",
      ],
      steps: [
        "Dokumentasikan solusi di chatter / Internal Note",
        "Kirim pesan final ke customer (replacement dijadwalkan / credit note)",
        "Drag atau set Stage = Solved",
        "Jika Ratings aktif, biarkan sistem kirim survei",
        "Opsional: login portal sebagai customer → My Tickets cek status Solved",
      ],
      expectedResult: "Ticket di closing stage; SLA resolusi terisi; portal menampilkan status akhir.",
      verification: [
        "Stage folded Solved",
        "Tidak ada open SLA failed tanpa alasan",
        "Portal (jika dipakai) menampilkan ticket closed/solved",
      ],
      fillFields: [
        {
          field: "Stage",
          value: "Solved",
          where: "Status bar / kanban",
          how: "Pilih / drag",
          required: true,
        },
        {
          field: "Closing message",
          value: `Penggantian ${kopi.name} dikirim via ${jasa.name}`,
          where: "Chatter",
          how: "Ketik",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-helpdesk-app.png",
        caption: "App Helpdesk — overview setelah ticket diselesaikan",
        whatYouSee: "Menu/dashboard aplikasi Helpdesk",
      },
    },
    {
      id: "proc-hd-convert-lead",
      title: "Convert Ticket menjadi Lead/Opportunity",
      goal: "Peluang penjualan dari percakapan support masuk CRM tanpa kehilangan jejak ticket.",
      preparation: [
        "CRM terpasang; opsi Convert aktif",
        `Ticket dari ${distributor.name} berisi permintaan penawaran`,
        "Sales team siap menerima opportunity",
      ],
      steps: [
        `Buka ticket ${distributor.name} (permintaan beli ${kopi.name})`,
        "Action → Convert to Lead / Convert to Opportunity (label sesuai lab)",
        "Lengkapi wizard: salesperson, team sales, expected revenue jika diminta",
        "Confirm — buka smart button Lead/Opportunity",
        "Lanjut follow-up di CRM; tutup atau tautkan ticket sesuai SOP",
      ],
      expectedResult: "crm.lead terbuat; link ke ticket; pipeline sales punya sinyal after-sales.",
      verification: [
        "Smart button CRM di ticket",
        "Lead/Opp customer = partner ticket",
        "Judul/catatan memuat konteks produk",
      ],
      fillFields: [
        {
          field: "Customer",
          value: distributor.name,
          where: "Convert wizard / CRM",
          how: "Otomatis dari ticket",
          required: true,
        },
        {
          field: "Opportunity / Lead title",
          value: `Reorder ${kopi.name} — dari Helpdesk`,
          where: "Convert wizard",
          how: "Ketik / review",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w3-helpdesk-ticket-form.png",
        caption: "Form ticket — titik mulai Convert to Lead/Opportunity",
      },
    },
  ],
  scenarios: [
    {
      id: "sc-hd-retail-claim",
      title: "Klaim kualitas retail sampai Solved",
      whenToUse: `${customer.name} melapor kerusakan ${kopi.name} setelah SO.`,
      flow: [
        "Buat Ticket + priority High",
        "Assign agent",
        "First response dalam SLA",
        "Proses replacement / credit",
        "Stage Solved + rating",
      ],
      notes: "Jalur default latihan Helpdesk after-sales.",
    },
    {
      id: "sc-hd-portal-intake",
      title: "Ticket masuk dari Customer Portal",
      whenToUse: "Portal aktif; pelanggan self-service.",
      flow: [
        `Login portal ${customer.name}`,
        "Submit ticket",
        "Muncul di Helpdesk Team",
        "Agent balas → pelanggan lihat di portal",
        "Solved",
      ],
    },
    {
      id: "sc-hd-sla-breach",
      title: "SLA gagal dan eskalasi",
      whenToUse: "Ticket menumpuk atau assignee cuti.",
      flow: [
        "Ticket High tanpa balasan",
        "SLA status Failed",
        "Team leader re-assign",
        "Respons darurat + review capacity",
        "Sesuaikan policy atau staffing",
      ],
    },
    {
      id: "sc-hd-convert-upsell",
      title: "Support menemukan peluang penjualan",
      whenToUse: `${distributor.name} minta penawaran saat tiket pengiriman.`,
      flow: [
        "Ticket pengiriman / info produk",
        "Convert to Lead/Opportunity",
        "Sales lanjut Quotation",
        "Helpdesk tutup isu operasional",
      ],
    },
    {
      id: "sc-hd-multi-team",
      title: "Dua team: retail vs distributor",
      whenToUse: "Segmen support berbeda.",
      flow: [
        `Ticket ${customer.name} → Support Retail`,
        `Ticket ${distributor.name} → Support Distributor`,
        "Filter per team",
        "Bandingkan SLA compliance di Reporting",
      ],
    },
  ],
  integrations: [
    {
      id: "int-hd-contacts",
      withModule: "Contacts",
      relationship: "helpdesk.ticket.partner_id → res.partner",
      whatHappens:
        "Customer di ticket memakai master Contacts; email/portal mengikuti partner.",
    },
    {
      id: "int-hd-crm",
      withModule: "CRM",
      relationship: "Ticket → crm.lead (Convert)",
      whatHappens:
        "Convert to Lead/Opportunity memindahkan sinyal penjualan ke pipeline CRM.",
    },
    {
      id: "int-hd-discuss",
      withModule: "Discuss / Mail",
      relationship: "mail.message & alias → helpdesk.ticket",
      whatHappens:
        "Email ke alias team membuat/memperbarui ticket; balasan agent keluar sebagai email.",
    },
    {
      id: "int-hd-portal",
      withModule: "Website / Customer Portal",
      relationship: "Portal ticket pages",
      whatHappens:
        "Pelanggan membuat dan memantau ticket; mengurangi intake manual.",
    },
    {
      id: "int-hd-project",
      withModule: "Project / Timesheets",
      relationship: "Ticket → task (opsional Enterprise)",
      whatHappens:
        "Isu kompleks bisa dipecah jadi project task dan jam ditrack di Timesheets.",
    },
  ],
  mistakes: [
    {
      id: "m-hd-no-assignee",
      problem: "Ticket tanpa Assigned to",
      why: "SLA mudah gagal; tidak ada owner follow-up",
      detect: "Filter 'Unassigned' penuh",
      fix: "Assign segera atau aktifkan assignment method",
      prevent: "SOP: ticket baru wajib punya owner dalam X menit",
    },
    {
      id: "m-hd-wrong-team",
      problem: "Ticket masuk team salah",
      why: "SLA/stage tidak relevan; agent bingung",
      detect: "Isi retail di team distributor atau sebaliknya",
      fix: "Pindahkan Team; review alias email & form portal default team",
      prevent: "Pisah alias/team per segmen; instruksi portal jelas",
    },
    {
      id: "m-hd-solve-without-reply",
      problem: "Mark Solved tanpa balasan ke pelanggan",
      why: "CSAT jelek; pelanggan mengira diabaikan",
      detect: "Solved tanpa pesan outbound di chatter",
      fix: "Kirim penutup lalu Solved ulang jika perlu",
      prevent: "Checklist: pesan final sebelum closing stage",
    },
    {
      id: "m-hd-ignore-sla-failed",
      problem: "Mengabaikan ticket SLA Failed",
      why: "Komitmen waktu ke pelanggan rusak; metrik menyesatkan jika dibiarkan",
      detect: "Reporting Failed tinggi; board merah",
      fix: "Eskalasi harian; re-assign; root-cause kapasitas",
      prevent: "Alert team leader + kapasitas vs volume",
    },
    {
      id: "m-hd-skip-convert",
      problem: "Permintaan beli hanya ditutup sebagai ticket",
      why: "Pipeline CRM kehilangan upsell; forecast understated",
      detect: "Chatter ada minta penawaran tapi tidak ada lead",
      fix: "Convert to Lead/Opportunity retrospektif",
      prevent: "Tag 'Sales Signal' + SOP convert",
    },
    {
      id: "m-hd-duplicate-tickets",
      problem: "Duplikat ticket untuk isu yang sama",
      why: "Double work; SLA ganda; pelanggan bingung",
      detect: `Beberapa open ticket mirip untuk ${customer.name}`,
      fix: "Merge/close duplikat; satu ticket aktif",
      prevent: "Cari open ticket customer sebelum New",
    },
  ],
  troubleshooting: [
    {
      id: "t-hd-sla-not-showing",
      problem: "Deadline SLA tidak muncul di ticket",
      causes: [
        "SLA belum diaktifkan di Settings/Team",
        "Tidak ada policy yang match team/priority/tag",
        "Ticket dibuat sebelum policy disimpan",
      ],
      diagnosis: [
        "Settings → Helpdesk → cek SLA aktif",
        "Configuration → SLA Policies vs team ticket",
        "Buat ticket uji baru setelah policy",
      ],
      solution: [
        "Aktifkan Use SLA di team",
        "Sesuaikan domain policy (priority/tags)",
        "Recompute / buat ulang ticket lab jika perlu",
      ],
      prevention: "Checklist: Team + Policy + Settings sebelum intake produksi",
    },
    {
      id: "t-hd-portal-missing",
      problem: "Pelanggan tidak melihat menu ticket di portal",
      causes: [
        "Helpdesk/portal belum dikonfigurasi",
        "Partner tanpa portal access",
        "Ticket tanpa customer yang sama dengan login",
      ],
      diagnosis: [
        "Contacts → Portal Access pada customer",
        "Cek ticket.partner_id = user portal",
        "Apps Website/Portal terpasang",
      ],
      solution: [
        "Grant portal access ke contact",
        "Pastikan ticket terhubung partner benar",
        "Uji /my setelah login portal",
      ],
      prevention: "Saat onboarding customer B2B, aktifkan portal sekaligus",
    },
    {
      id: "t-hd-no-convert-btn",
      problem: "Tombol Convert to Lead/Opportunity tidak ada",
      causes: [
        "CRM belum terpasang",
        "Opsi after-sales convert belum aktif",
        "Hak akses kurang",
      ],
      diagnosis: [
        "Apps → CRM installed",
        "Settings → Helpdesk after-sales options",
        "Group user Helpdesk + Sales/CRM",
      ],
      solution: [
        "Install CRM",
        "Aktifkan convert di Settings",
        "Login ulang setelah group diubah",
      ],
      prevention: "Lab: Helpdesk + CRM jika skenario upsell dipakai",
    },
    {
      id: "t-hd-kanban-empty",
      problem: "My Tickets / board kosong padahal ada data",
      causes: [
        "Filter My Tickets (assignee lain)",
        "Team salah di search facet",
        "Stage folded / archived",
      ],
      diagnosis: [
        "Clear filters → All Tickets",
        "Cek Assigned to & Team",
        "Configuration → Stages",
      ],
      solution: [
        "Assign user login ke ticket",
        "Pilih team benar di filter",
        "Unarchive stage aktif",
      ],
      prevention: "Default team + assign saat create",
    },
  ],
  behind: {
    models: [
      "helpdesk.ticket",
      "helpdesk.team",
      "helpdesk.stage",
      "helpdesk.sla",
      "helpdesk.sla.status",
      "helpdesk.tag",
      "mail.activity",
      "mail.alias",
      "res.partner",
      "crm.lead",
    ],
    relations: [
      "helpdesk.ticket.partner_id → res.partner",
      "helpdesk.ticket.team_id → helpdesk.team",
      "helpdesk.ticket.stage_id → helpdesk.stage",
      "helpdesk.ticket.user_id → res.users",
      "helpdesk.sla.status.ticket_id → helpdesk.ticket",
      "helpdesk.sla.team_id → helpdesk.team",
      "Convert action → crm.lead (jika CRM)",
    ],
    automations: [
      "email alias → create/update ticket",
      "assignment method mengisi user_id",
      "SLA deadline & failed/succeeded computation",
      "rating request on closing stage",
      "portal sync visibility for partner tickets",
    ],
    securityNotes: [
      "Helpdesk User: own/team tickets",
      "Helpdesk Administrator: all tickets & configuration",
      "Portal user: hanya ticket partner terkait",
    ],
    note: "Di Odoo 19 Enterprise, Helpdesk kanban berbasis stage per team; SLA status adalah record terpisah yang menempel ticket; Convert ke CRM bersifat opsional setelah CRM terpasang.",
  },
  reporting: [
    {
      name: "Ticket Analysis",
      path: "Helpdesk → Reporting → Tickets",
      kpi: "Volume ticket per team/tag/customer",
      decision: "Alokasi agent ke isu yang paling sering (mis. packing ${kopi.name})",
    },
    {
      name: "SLA Status",
      path: "Helpdesk → Reporting → SLA Status",
      kpi: "% Succeeded vs Failed (first response & resolusi)",
      decision: "Perketat prioritas atau tambah kapasitas shift",
    },
    {
      name: "Team Performance",
      path: "Helpdesk → Overview / Reporting per Team",
      kpi: "Open tickets, avg time to close, unassigned",
      decision: "Rebalance assignment method & backlog harian",
    },
    {
      name: "Customer Ratings",
      path: "Helpdesk → Reporting → Customer Ratings",
      kpi: "CSAT rata-rata per agent",
      decision: "Coaching kualitas balasan, bukan hanya kecepatan",
    },
  ],
  security: {
    roles: [
      {
        role: "Helpdesk / User",
        can: [
          "Buat & gerakkan ticket sendiri/tim",
          "Balas chatter/email",
          "Assign dalam batas team (sesuai group)",
        ],
        cannot: [
          "Ubah master Stage/SLA/Team secara luas",
          "Lihat semua ticket perusahaan (jika own documents)",
        ],
        whyDifferent:
          "Agent fokus resolusi operasional, bukan desain kebijakan SLA.",
      },
      {
        role: "Helpdesk / Administrator",
        can: [
          "Semua ticket",
          "Konfigurasi team, stage, SLA, ratings",
          "Analisis compliance & assignment method",
        ],
        cannot: [
          "Mengelola pricelist/SO tanpa role Sales",
        ],
        whyDifferent:
          "Admin bertanggung jawab kapasitas support dan komitmen waktu ke pelanggan.",
      },
      {
        role: "Portal Customer",
        can: [
          "Buat ticket sendiri",
          "Lihat status & pesan ticket miliknya",
        ],
        cannot: [
          "Lihat ticket pelanggan lain",
          "Ubah SLA/team internal",
        ],
        whyDifferent:
          "Portal hanya self-service pelanggan, bukan konsol agent.",
      },
    ],
    notes: [
      "Jangan berikan Admin Helpdesk ke semua sales tanpa perlu — konfigurasi SLA sensitif",
      "Portal access dikontrol dari Contacts, terpisah dari group backend Helpdesk",
    ],
  },
  levels: {
    beginner: [
      "Buat ticket dari menu Helpdesk",
      "Pilih team, customer, priority",
      "Geser stage New → In Progress → Solved",
      "Balas pelanggan lewat chatter",
    ],
    intermediate: [
      "Konfigurasi multi team & assignment",
      "Aktifkan dan uji SLA policy",
      "Pakai tags & filter unassigned",
      "Pahami jejak ticket di Customer Portal",
    ],
    advanced: [
      "Analisis SLA Failed bulanan",
      "Convert ticket → Lead/Opportunity",
      "Alias email per team",
      "Ratings + coaching agent",
    ],
    expert: [
      "Desain SLA per segmen (retail vs distributor) berbasis data historis",
      "Integrasi Helpdesk ↔ Project untuk isu kompleks",
      "Kebijakan kapan Solved vs On Hold vs convert CRM",
      "Kapasitas staffing vs volume ticket & CSAT",
    ],
  },
  exercises: [
    {
      id: "ex-hd-ticket-basic",
      title: "Ticket klaim retail",
      objective: `Membuat ticket untuk ${customer.name}`,
      prerequisites: ["Contacts customer ada", "Helpdesk Team ada"],
      task: [
        `Buat ticket klaim ${kopi.name}`,
        "Assign agent & set priority",
        "Pastikan muncul di kanban New",
      ],
      expectedResult: "Kartu ticket terlihat dengan customer & team benar",
      checklist: ["Subject jelas", "Customer terisi", "Team terisi", "Owner terisi"],
    },
    {
      id: "ex-hd-sla-response",
      title: "Penuhi first response SLA",
      objective: "Membalas ticket sebelum deadline SLA",
      prerequisites: ["SLA policy aktif", "Ticket High ada"],
      task: [
        "Buka ticket High",
        "Send message ke customer",
        "Pindah In Progress",
        "Cek status SLA Succeeded",
      ],
      expectedResult: "First response tercatat; SLA tidak Failed",
      checklist: ["Pesan outbound ada", "Assignee ada", "SLA widget hijau/Succeeded"],
    },
    {
      id: "ex-hd-portal",
      title: "Simulasi portal pelanggan",
      objective: "Memahami intake/visibility dari sisi customer",
      prerequisites: ["Portal access untuk customer lab"],
      task: [
        `Grant/cek portal ${customer.name}`,
        "Buat atau lihat ticket dari portal",
        "Agent balas dari backend",
        "Refresh portal — pesan/status terlihat",
      ],
      expectedResult: "Pelanggan melihat update tanpa login backend",
      checklist: ["Partner sama", "Pesan non-internal terlihat di portal"],
    },
    {
      id: "ex-hd-convert",
      title: "Convert to Lead dari Helpdesk",
      objective: "Menghubungkan sinyal penjualan ke CRM",
      prerequisites: ["CRM terpasang", "Opsi convert aktif"],
      task: [
        `Buat ticket permintaan beli untuk ${distributor.name}`,
        "Convert to Lead/Opportunity",
        "Verifikasi smart button & data di CRM",
      ],
      expectedResult: "crm.lead terhubung; konteks produk tersimpan",
      checklist: ["Customer sama", "Link ticket↔lead ada", "Sales bisa lanjut quotation"],
    },
  ],
  coreFlowLinks: [
    { label: "Deep Dive CRM", href: "/materi/crm" },
    { label: "Deep Dive Contacts", href: "/materi/contacts" },
    { label: "Deep Dive Sales", href: "/materi/sales" },
    { label: "Deep Dive Project", href: "/materi/project" },
    { label: "Master Contacts", href: "/modul/master-contacts" },
  ],
};
