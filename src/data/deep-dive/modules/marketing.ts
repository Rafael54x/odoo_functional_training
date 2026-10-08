import type { DeepDiveModule } from "../types";
import { seed } from "../../seed";

const customer = seed.customers.toko;
const distributor = seed.customers.distributor;
const kopi = seed.products.kopi;
const teh = seed.products.teh;
const jasa = seed.products.jasa;
const company = seed.company;

/**
 * Deep Dive — Email Marketing / Mailing
 * Mailing lists, campaigns, templates/A/B, contacts, send & reporting.
 * App Odoo sering bernama "Email Marketing".
 */
export const marketingDeepDive: DeepDiveModule = {
  slug: "marketing",
  name: "Email Marketing — Mailing Lists & Campaigns",
  shortTitle: "Email Marketing",
  icon: "Mail",
  category: "marketing",
  wave: 4,
  availability: "available",
  apps: ["Email Marketing", "Contacts", "CRM", "Link Tracker"],
  overview: {
    function:
      `Modul Email Marketing (sering tampil sebagai app 'Email Marketing' di Odoo 19 Enterprise) mengelola mailing list, kontak penerima, desain mailing (template), penjadwalan/kirim kampanye, serta laporan open/click/bounce. Untuk pemula: ini bukan Outlook massal — setiap mailing punya audience (list/filter), konten, dan metrik. Integrasi Contacts memastikan ${customer.name} dan ${distributor.name} hanya dikirimi email yang relevan dan patuh unsubscribe.`,
    businessProblem:
      `Tanpa Email Marketing, promo tersebar di WA pribadi, tidak ada list terkurasi, tidak ada jejak open/click, dan risiko mengirim ke kontak tanpa consent. Tim tidak tahu kampanye ${kopi.name} mana yang berhasil.`,
    typicalUsers: [
      "Marketing Executive",
      "Demand Gen / Growth",
      "Sales Ops (nurture leads)",
      "Customer Success (newsletter & win-back)",
    ],
    whenNeeded:
      "Saat perlu newsletter, promo produk, nurture lead CRM, atau pengumuman terukur ke segmen kontak — bukan sekadar satu-satu email dari chatter.",
    relatedModules: ["Contacts", "CRM", "Website", "Link Tracker", "Sales", "Subscriptions (win-back churn)"],
    businessScenario: `${company.name} ingin mengirim newsletter bulanan "Tips seduh ${kopi.name}" ke retail (${customer.name}) dan katalog B2B ke ${distributor.name}. Tim Marketing membuat Mailing List, menyusun mailing dari template, menguji A/B subject (jika aktif), mengirim, lalu membaca open rate & klik ke landing produk ${teh.name}.`,
  },
  prerequisites: {
    modules: [
      "Email Marketing app terpasang",
      "Contacts (sumber penerima)",
      "Outgoing Email Server dikonfigurasi (Settings)",
      "CRM opsional untuk domain lead",
      "Website opsional untuk landing & form subscribe",
    ],
    masterData: [
      `Contact dengan email valid: ${customer.name} (${customer.email}), ${distributor.name} (${distributor.email})`,
      "Mailing List (mis. Retail Nusantara, Distributor B2B)",
      "Mailing Contact / subscription ke list",
      "Email Template atau blok konten mailing",
      "UTM / Link Tracker untuk URL produk (opsional tapi disarankan)",
    ],
    configuration: [
      "Email Marketing → Configuration → Settings",
      "Email Marketing → Mailing Lists",
      "Settings → Technical → Outgoing Mail Servers (atau UI Settings email)",
      "Blacklist / Unsubscribe behavior aktif default — pahami sebelum kirim massal",
      "CRM: field email blacklisted / opted-out dipahami",
    ],
    access: [
      "Email Marketing / User: buat mailing & lihat report milik sendiri",
      "Email Marketing / Administrator: settings, list besar, hapus kampanye",
      "Jangan beri hak kirim massal ke user tanpa pelatihan consent",
    ],
    relationships:
      "mailing.mailing → mailing.list / domain recipients; mailing.contact ↔ res.partner (sering); mail.mail / mail.trace untuk delivery & open/click; unsubscribe menulis blacklist agar Contacts tidak dikirimi ulang.",
  },
  installation: {
    how: [
      "Home → Apps",
      "Cari 'Email Marketing' (bukan hanya Marketing Automation — itu modul berbeda)",
      "Klik Install",
      "Pastikan app Email Marketing muncul di switcher",
      "Uji Outgoing Email di Settings sebelum kampanye nyata",
    ],
    dependencies: [
      "Contacts / Mail",
      "Mass Mailing (inti Email Marketing)",
      "Link Tracker (sering ikut untuk click tracking)",
      "CRM/Website opsional",
    ],
    afterInstall: [
      "Buka Email Marketing → Configuration → Settings",
      "Buat Mailing List pertama (Retail / Distributor)",
      "Tambahkan kontak uji dengan email lab",
      "Buat mailing draft → Test → Send ke diri sendiri sebelum audience besar",
    ],
    newMenus: [
      "Email Marketing → Mailings",
      "Email Marketing → Mailing Lists",
      "Email Marketing → Mailing Lists → Mailing List Contacts",
      "Email Marketing → Reporting",
      "Email Marketing → Configuration → Settings",
    ],
    newSettings: [
      "Settings → Email Marketing / Mass Mailing",
      "Settings → Discuss / Email (outgoing server)",
      "Opsi A/B Testing, Blacklist, Dedicated Server (sesuai lab)",
    ],
  },
  configurations: [
    {
      id: "mkt-mailing-lists",
      name: "Mailing Lists",
      location: "Email Marketing → Mailing Lists",
      what: "Wadah opt-in penerima (bukan sekadar filter Contacts sekali jalan).",
      whyEnable:
        "List memisahkan segmen (retail vs distributor) dan menghormati subscribe/unsubscribe per list.",
      whenEnable:
        "Sebelum mailing pertama — minimal satu list uji dan satu list produksi lab.",
      whenNot:
        "Jangan buat puluhan list kosong; mulai dari segmen bisnis nyata.",
      businessExample: `List "Retail WA-OptIn" berisi ${customer.name}; list "Distributor B2B" berisi ${distributor.name}.`,
      impact:
        "Mailing memilih list sebagai audience; kontak bisa subscribe ke beberapa list.",
      screenshot: {
        src: "/screenshots/odoo19e/w4-marketing.png",
        caption: "App Email Marketing — pintu masuk list & mailings",
        whatYouSee: "Beranda/menu aplikasi Email Marketing",
        why: "List dan mailings dikelola dari app ini",
      },
    },
    {
      id: "mkt-ab-testing",
      name: "A/B Testing (Subject / Body)",
      location: "Settings → Email Marketing + opsi pada form Mailing",
      what: "Menguji variasi subject atau konten ke sampel, lalu kirim pemenang ke sisa audience.",
      whyEnable:
        "Subject lemah membunuh open rate; A/B memberi data bukan opini.",
      whenEnable:
        "Audience cukup besar (ratusan+) agar sampel bermakna.",
      whenNot:
        "List lab 5 kontak — A/B tidak valid secara statistik; pakai Test email saja.",
      businessExample: `Subject A: "Stok ${kopi.name} masuk minggu ini" vs B: "Resep seduh untuk toko Anda" — pemenang ke seluruh retail list.`,
      impact:
        "Mailing punya stage A/B; metrik terpisah per varian sebelum final send.",
      screenshot: {
        src: "/screenshots/odoo19e/w4-settings-marketing.png",
        caption: "Settings Email Marketing — opsi termasuk A/B & tracking",
        whatYouSee: "Halaman konfigurasi Email Marketing",
        why: "Fitur A/B dan perilaku kirim diatur di Settings",
      },
    },
    {
      id: "mkt-templates",
      name: "Mailing Templates & Themes",
      location: "Email Marketing → Configuration → Templates / theme di form mailing",
      what: "Kerangka desain (header brand, footer unsubscribe, blok produk) agar kampanye konsisten.",
      whyEnable:
        "Tanpa template, setiap mailing tampil beda dan sering lupa link unsubscribe.",
      whenEnable:
        `Setelah identitas brand ${company.name} disepakati (logo, warna, footer legal).`,
      whenNot:
        "Jangan over-design template sebelum outgoing email & list sehat.",
      businessExample: `Template "Newsletter Nusantara" dengan hero ${kopi.name} dan CTA ke katalog.`,
      impact:
        "Create mailing dari template; footer compliance konsisten.",
      screenshot: {
        src: "/screenshots/odoo19e/w4-mailing-form.png",
        caption: "Form mailing — editor konten & pengaturan kampanye",
        whatYouSee: "Form create/edit mailing di Odoo 19",
        why: "Template diterapkan saat menyusun body mailing",
      },
    },
    {
      id: "mkt-tracking",
      name: "Open & Click Tracking + Link Tracker",
      location: "Settings Email Marketing; Link Tracker app/menu",
      what: "Mengukur apakah email dibuka dan link diklik (dengan batasan privacy client email).",
      whyEnable:
        "Tanpa tracking, sukses kampanye hanya ditebak dari balasan manual.",
      whenEnable:
        "Selalu untuk kampanye promo/nurture yang ingin dioptimasi.",
      whenNot:
        "Email transaksional murni (invoice) biasanya bukan lewat Email Marketing.",
      businessExample: `Klik CTA "Pesan ${teh.name}" diukur; Sales follow lead yang klik.`,
      impact:
        "Reporting open/click; URL diganti/dilacak Link Tracker.",
      screenshot: {
        src: "/screenshots/odoo19e/w4-marketing-mailings.png",
        caption: "Daftar Mailings — status kirim & pintu ke statistik",
        whatYouSee: "List kampanye email",
        why: "Setelah kirim, metrik open/click dibaca dari sini",
      },
    },
    {
      id: "mkt-blacklist",
      name: "Blacklist / Unsubscribe",
      location: "Built-in footer mailing + Contacts blacklist fields",
      what: "Mekanisme berhenti langganan yang wajib dihormati sistem.",
      whyEnable:
        "Kepatuhan & reputasi IP/domain pengirim; menghindari spam complaint.",
      whenEnable:
        "Selalu aktif — jangan dicari celah untuk menonaktifkan di produksi.",
      whenNot:
        "Tidak ada alasan bisnis menonaktifkan unsubscribe di kampanye marketing.",
      businessExample: `${customer.name} unsubscribe dari newsletter retail — mailing berikutnya otomatis mengecualikan.`,
      impact:
        "Kontak masuk blacklist/opt-out; mailing skip penerima tersebut.",
      screenshot: {
        src: "/screenshots/odoo19e/w4-marketing.png",
        caption: "Tampilan terkait di Odoo 19 Enterprise",
        whatYouSee: "UI modul pada lab / runbot Enterprise",
      },
    },
    {
      id: "mkt-crm-domain",
      name: "Recipients from CRM / Contacts Domain",
      location: "Form Mailing → Recipients model & filter domain",
      what: "Selain mailing list, audience bisa dari Contacts atau Leads dengan filter (tag, negara, stage).",
      whyEnable:
        "Nurture lead CRM tanpa menduplikasi ke list manual setiap minggu.",
      whenEnable:
        "CRM terisi dan field segmentasi (tags, team) konsisten.",
      whenNot:
        "Data CRM kotor (email kosong/duplikat) — bersihkan dulu, pakai list kecil.",
      businessExample: `Domain: Leads stage "Proposition" + tag minat ${kopi.name}.`,
      impact:
        "Mailing dinamis mengikuti hasil filter saat send.",
      screenshot: {
        src: "/screenshots/odoo19e/w2-crm-pipeline.png",
        caption: "CRM Pipeline — sumber segmen audience nurture (opsional)",
        whatYouSee: "Kanban peluang CRM",
        why: "Filter mailing bisa menarget stage/tag CRM",
      },
    },
  ],
  masterData: [
    {
      id: "md-mkt-list",
      name: "Mailing List (mailing.list)",
      purpose: "Segmen opt-in penerima kampanye.",
      required: true,
      whyNeeded:
        "Tanpa list, sulit mengelola subscribe/unsubscribe dan memisahkan retail vs B2B.",
      fields: [
        {
          field: "List Name",
          type: "Char",
          required: true,
          purpose: "Nama segmen",
          why: "Dipilih di form mailing",
          example: "Retail Nusantara",
          impactIfEmpty: "List tidak tersimpan",
        },
        {
          field: "Is Public",
          type: "Boolean",
          required: false,
          purpose: "Bisa dipakai form subscribe website",
          why: "Self-service opt-in",
          example: "True untuk newsletter publik",
          impactIfEmpty: "Hanya isi manual/import",
        },
        {
          field: "Active",
          type: "Boolean",
          required: false,
          purpose: "List masih dipakai",
          why: "Nonaktifkan list usang",
          example: "True",
          impactIfEmpty: "Default active",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-marketing.png",
        caption: "Email Marketing — kelola mailing lists dari app",
      },
    },
    {
      id: "md-mkt-contact",
      name: "Mailing Contact / List Subscriber",
      purpose: "Penerima yang terhubung ke list (sering sinkron dengan res.partner).",
      required: true,
      whyNeeded:
        "List kosong = tidak ada yang dikirimi; email invalid merusak reputasi pengirim.",
      fields: [
        {
          field: "Name",
          type: "Char",
          required: true,
          purpose: "Nama penerima",
          why: "Personalization greeting",
          example: customer.name,
          impactIfEmpty: "Kontak sulit dikenali",
        },
        {
          field: "Email",
          type: "Char",
          required: true,
          purpose: "Alamat kirim",
          why: "Tanpa email tidak masuk audience",
          example: customer.email,
          impactIfEmpty: "Tidak bisa subscribe efektif",
        },
        {
          field: "Mailing Lists",
          type: "Many2many",
          required: false,
          purpose: "List yang diikuti",
          why: "Segmen kirim",
          example: "Retail Nusantara",
          impactIfEmpty: "Kontak tidak masuk mailing berbasis list",
          related: "mailing.list",
        },
        {
          field: "Opt-out / Blacklist",
          type: "Boolean",
          required: false,
          purpose: "Status berhenti",
          why: "Compliance",
          example: "False",
          impactIfEmpty: "Default opted-in jika baru subscribe",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/02-contacts-list.png",
        caption: "Contacts — pastikan email pelanggan valid sebelum import ke list",
        whatYouSee: "Daftar kontak master",
      },
    },
    {
      id: "md-mkt-mailing",
      name: "Mailing Campaign (mailing.mailing)",
      purpose: "Satu kampanye email: audience, subject, body, jadwal, status.",
      required: true,
      whyNeeded:
        "Ini dokumen kerja Marketing — tanpa mailing tidak ada kirim terukur.",
      fields: [
        {
          field: "Subject",
          type: "Char",
          required: true,
          purpose: "Judul email",
          why: "Faktor utama open rate",
          example: `Stok ${kopi.name} & tips display untuk toko`,
          impactIfEmpty: "Mailing tidak bisa dikirim",
        },
        {
          field: "Recipients",
          type: "Selection + M2M/domain",
          required: true,
          purpose: "Siapa yang menerima",
          why: "Scope kampanye",
          example: "Mailing List: Retail Nusantara",
          impactIfEmpty: "Tidak ada penerima",
        },
        {
          field: "Body / Template",
          type: "Html",
          required: true,
          purpose: "Konten email",
          why: "Pesan & CTA",
          example: `Highlight ${kopi.name}, CTA katalog ${teh.name}`,
          impactIfEmpty: "Email kosong ditolak sistem",
        },
        {
          field: "Responsible",
          type: "Many2one",
          required: false,
          purpose: "Owner kampanye",
          why: "Akuntabilitas",
          example: "Marketing User",
          impactIfEmpty: "Sulit filter My Mailings",
          related: "res.users",
        },
        {
          field: "Scheduled date",
          type: "Datetime",
          required: false,
          purpose: "Jadwal kirim",
          why: "Kirim di jam buka toko retail",
          example: "Selasa 09:00 WIB",
          impactIfEmpty: "Kirim segera saat Send",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-mailing-form.png",
        caption: "Form mailing — subject, recipients, body",
        whatToFill: "Subject jelas, list Retail, body + CTA",
      },
    },
    {
      id: "md-mkt-partner",
      name: "Contact Master (res.partner)",
      purpose: "Sumber kebenaran nama, email, tag pelanggan untuk segmentasi.",
      required: true,
      whyNeeded:
        "Email Marketing jelek jika Contacts penuh duplikat dan email kosong.",
      fields: [
        {
          field: "Name",
          type: "Char",
          required: true,
          purpose: "Identitas",
          why: "Merge & personalize",
          example: distributor.name,
          impactIfEmpty: "Duplikat sulit dicegah",
        },
        {
          field: "Email",
          type: "Char",
          required: false,
          purpose: "Alamat utama",
          why: "Masuk domain Contacts recipients",
          example: distributor.email,
          impactIfEmpty: "Tidak masuk audience domain Contacts",
        },
        {
          field: "Tags",
          type: "Many2many",
          required: false,
          purpose: "Segmen bisnis",
          why: "Filter mailing",
          example: customer.tags,
          impactIfEmpty: "Hanya bisa filter kasar (negara/kota)",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/02-contacts-list.png",
        caption: "Bersihkan Contacts sebelum kampanye besar",
      },
    },
  ],
  dependencies: {
    nodes: [
      { id: "contacts", label: "Contacts" },
      { id: "lists", label: "Mailing Lists" },
      { id: "mailing", label: "Mailing" },
      { id: "mailserver", label: "Outgoing Mail" },
      { id: "tracking", label: "Open/Click Traces" },
      { id: "crm", label: "CRM (opsional)" },
      { id: "website", label: "Website Subscribe (opsional)" },
    ],
    edges: [
      {
        from: "contacts",
        to: "lists",
        why: "Import/subscribe partner ke mailing list",
      },
      {
        from: "lists",
        to: "mailing",
        why: "Audience utama kampanye",
      },
      {
        from: "mailserver",
        to: "mailing",
        why: "Tanpa outgoing server, status stuck / fail",
      },
      {
        from: "mailing",
        to: "tracking",
        why: "Setelah send, trace open/click/bounce",
      },
      {
        from: "crm",
        to: "mailing",
        why: "Domain recipients dari lead/opportunity",
      },
      {
        from: "website",
        to: "lists",
        why: "Form subscribe mengisi list publik",
      },
    ],
    summary:
      "Contacts/CRM mengisi list atau domain; mailing memakai template + audience; outgoing mail mengirim; tracking & unsubscribe menutup loop kepatuhan dan optimasi.",
  },
  forms: [
    {
      id: "form-mailing",
      name: "Mailing (mailing.mailing)",
      menuPath: "Email Marketing → Mailings → New",
      fields: [
        {
          field: "Subject",
          required: true,
          purpose: "Judul inbox",
          why: "Open rate",
          example: `Promo mingguan ${kopi.name} untuk toko Anda`,
        },
        {
          field: "Recipients",
          required: true,
          purpose: "List atau model+domain",
          why: "Siapa yang dikirimi",
          example: "Mailing List: Retail Nusantara",
        },
        {
          field: "From",
          required: true,
          purpose: "Nama & email pengirim",
          why: "Kepercayaan penerima",
          example: `${company.name} <marketing@nusantara-demo.test>`,
        },
        {
          field: "Body",
          required: true,
          purpose: "Konten HTML",
          why: "Pesan + CTA",
          example: `Blok cerita ${kopi.name} + tombol ke katalog`,
        },
        {
          field: "A/B Test",
          required: false,
          purpose: "Varian uji",
          why: "Optimasi subject",
          example: "Subject A/B 20% sampel",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-mailing-form.png",
        caption: "Form mailing baru siap diisi",
        whatYouSee: "Editor mailing Odoo 19 Enterprise",
        whatToFill: "Subject, recipients list, body, from",
      },
    },
    {
      id: "form-mailing-list",
      name: "Mailing List",
      menuPath: "Email Marketing → Mailing Lists → New",
      fields: [
        {
          field: "Name",
          required: true,
          purpose: "Nama list",
          why: "Label di mailing",
          example: "Retail Nusantara",
        },
        {
          field: "Is Public",
          required: false,
          purpose: "Tampil di form website",
          why: "Opt-in publik",
          example: "False untuk list B2B undangan saja",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-marketing-mailings.png",
        caption: "Area mailings/lists di Email Marketing",
      },
    },
    {
      id: "form-list-contact",
      name: "Tambah kontak ke list",
      menuPath: "Mailing List → Contacts → Add",
      fields: [
        {
          field: "Contact / Email",
          required: true,
          purpose: "Penerima",
          why: "Harus punya email valid",
          example: customer.email,
        },
        {
          field: "Name",
          required: false,
          purpose: "Nama tampilan",
          why: "Personalize",
          example: customer.name,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/02-contacts-list.png",
        caption: "Ambil email dari Contacts yang sudah bersih",
      },
    },
  ],
  procedures: [
    {
      id: "proc-mkt-list",
      title: "Membuat mailing list dan mengisi kontak",
      goal: `List Retail terisi minimal kontak uji + ${customer.name}.`,
      preparation: [
        "Email Marketing terpasang",
        `Contact ${customer.name} punya email ${customer.email}`,
        "Outgoing mail server lab siap",
      ],
      steps: [
        "Email Marketing → Mailing Lists → New",
        "Name: Retail Nusantara",
        "Save",
        "Buka tab/smart button Contacts pada list",
        `Add ${customer.name} / ${customer.email}`,
        `Opsional: buat list kedua Distributor B2B + ${distributor.name}`,
        "Verifikasi jumlah subscriber > 0",
      ],
      expectedResult: "Mailing list siap dipilih sebagai recipients.",
      verification: [
        "List muncul di selector mailing",
        "Email kontak terisi & tidak blacklist",
        "Jumlah kontak sesuai",
      ],
      fillFields: [
        {
          field: "List Name",
          value: "Retail Nusantara",
          where: "Form list",
          how: "Ketik",
          required: true,
        },
        {
          field: "Email",
          value: customer.email,
          where: "List contacts",
          how: "Pilih/ketik",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-marketing.png",
        caption: "App Email Marketing — mulai dari Mailing Lists",
      },
    },
    {
      id: "proc-mkt-create-mailing",
      title: "Menyusun mailing newsletter produk",
      goal: "Draft mailing lengkap subject + body + audience, belum mass-send.",
      preparation: [
        "List Retail Nusantara terisi",
        "Template/theme dipilih",
        "URL CTA disiapkan (katalog/website)",
      ],
      steps: [
        "Email Marketing → Mailings → New",
        `Subject: Tips display ${kopi.name} minggu ini`,
        "Recipients: Mailing List → Retail Nusantara",
        `From: ${company.name} Marketing`,
        "Pilih template / susun body: pembuka, manfaat, CTA",
        `Sebutkan ${teh.name} sebagai cross-sell singkat`,
        "Pastikan footer unsubscribe ada (bawaan)",
        "Save as Draft",
        "Kirim Test ke email Anda sendiri",
      ],
      expectedResult: "Draft mailing tervalidasi di inbox uji; siap dijadwalkan.",
      verification: [
        "Test email diterima & tampilan OK",
        "Link CTA bisa diklik",
        "Unsubscribe link terlihat",
        "Recipients count > 0",
      ],
      fillFields: [
        {
          field: "Subject",
          value: `Tips display ${kopi.name} minggu ini`,
          where: "Header mailing",
          how: "Ketik",
          required: true,
        },
        {
          field: "Recipients",
          value: "Retail Nusantara",
          where: "Recipients",
          how: "Pilih list",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-mailing-form.png",
        caption: "Form mailing saat menyusun konten",
      },
    },
    {
      id: "proc-mkt-send",
      title: "Mengirim atau menjadwalkan kampanye",
      goal: "Mailing berstatus Sent/In Queue; penerima menerima email.",
      preparation: [
        "Test email sukses",
        "Audience final di-review (tanpa kontak internal sensitif)",
        "Outgoing server tidak error",
      ],
      steps: [
        "Buka draft mailing",
        "Review recipients count sekali lagi",
        "Pilih Send Now atau Schedule (mis. Selasa 09:00)",
        "Confirm wizard pengiriman",
        "Pantau status: In Queue → Sending → Sent",
        "Buka Reporting / statistik mailing",
      ],
      expectedResult: "Kampanye terkirim; trace delivery mulai terkumpul.",
      verification: [
        "Status Sent (atau terjadwal lalu Sent)",
        "Delivered > 0 di lab",
        "Tidak ada error massal di mail queue",
      ],
      fillFields: [
        {
          field: "Schedule",
          value: "Selasa 09:00 (atau Send Now di lab)",
          where: "Send wizard",
          how: "Pilih",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-marketing-mailings.png",
        caption: "List mailings menampilkan status setelah kirim",
      },
    },
    {
      id: "proc-mkt-ab",
      title: "Uji A/B subject (audience cukup)",
      goal: "Memahami alur A/B sebelum mengunci subject pemenang.",
      preparation: [
        "A/B aktif di Settings",
        "List latihan dengan cukup kontak (atau pahami konsep di lab kecil)",
        "Dua draft subject siap",
      ],
      steps: [
        "Pada mailing, aktifkan A/B Testing untuk Subject",
        `Variant A: Stok ${kopi.name} tiba`,
        `Variant B: Ide etalase ${kopi.name} untuk toko`,
        "Set % sampel (mis. 20%) dan kriteria menang (open rate)",
        "Jalankan A/B",
        "Setelah pemenang ditentukan, kirim ke sisa audience",
      ],
      expectedResult: "Satu subject pemenang dipakai final send; metrik A vs B terbaca.",
      verification: [
        "Dua varian punya statistik",
        "Final send memakai pemenang",
        "Dokumentasikan pembelajaran untuk kampanye berikutnya",
      ],
      fillFields: [
        {
          field: "Subject A",
          value: `Stok ${kopi.name} tiba`,
          where: "A/B tab",
          how: "Ketik",
          required: true,
        },
        {
          field: "Subject B",
          value: `Ide etalase ${kopi.name} untuk toko`,
          where: "A/B tab",
          how: "Ketik",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-settings-marketing.png",
        caption: "Settings — pastikan opsi A/B tersedia sebelum uji",
      },
    },
    {
      id: "proc-mkt-report-follow",
      title: "Membaca laporan dan follow-up Sales",
      goal: "Open/click dipakai untuk tindakan, bukan hanya angka.",
      preparation: [
        "Mailing sudah Sent",
        "Sales punya akses Contacts/CRM",
        "Link CTA memakai tracking",
      ],
      steps: [
        "Buka mailing → tab/statistik Opened, Clicked, Bounced",
        "Export atau filter kontak yang Clicked CTA",
        `Buat activity Sales ke ${customer.name} jika mereka klik`,
        "Periksa bounce — perbaiki email Contacts yang salah",
        "Catat subject/CTA pemenang di playbook Marketing",
      ],
      expectedResult: "Ada tindak lanjut bisnis dari metrik; data kontak semakin bersih.",
      verification: [
        "Angka open/click terbaca",
        "Bounce ditangani",
        "Minimal satu follow-up Sales terdokumentasi di lab",
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-marketing-mailings.png",
        caption: "Mailings list — pintu ke statistik per kampanye",
      },
    },
  ],
  scenarios: [
    {
      id: "sc-mkt-newsletter",
      title: "Newsletter bulanan retail",
      whenToUse: "Edukasi + soft promo ke toko.",
      flow: [
        "List Retail",
        "Template newsletter",
        `Konten tips + ${kopi.name}`,
        "Test → Schedule",
        "Baca open rate minggu berikutnya",
      ],
      notes: "Jalur default latihan Email Marketing.",
    },
    {
      id: "sc-mkt-b2b-catalog",
      title: "Katalog singkat ke distributor",
      whenToUse: `${distributor.name} dan peer B2B perlu price list update.`,
      flow: [
        "List Distributor B2B",
        "Mailing dengan attachment/link katalog",
        `Highlight ${kopi.name} & ${teh.name}`,
        "Send",
        "Sales follow yang klik",
      ],
    },
    {
      id: "sc-mkt-crm-nurture",
      title: "Nurture lead dari CRM",
      whenToUse: "Lead belum siap SO tetapi perlu edukasi.",
      flow: [
        "Recipients = Leads dengan filter stage",
        "Isi edukatif bukan hard sell",
        "Kirim",
        "Lead yang klik → naikkan prioritas di CRM",
      ],
    },
    {
      id: "sc-mkt-winback",
      title: "Win-back setelah churn subscription",
      whenToUse: "Pelanggan close subscription (lihat modul Subscriptions).",
      flow: [
        "List/domain ex-subscribers",
        "Offer kembali dengan value jelas",
        "Hormati unsubscribe",
        "Ukur click → CS hubungi",
      ],
    },
    {
      id: "sc-mkt-ab-subject",
      title: "Optimasi subject dengan A/B",
      whenToUse: "Audience besar, kampanye rutin.",
      flow: [
        "Aktifkan A/B",
        "Dua subject",
        "Pilih pemenang",
        "Final send",
        "Simpan pembelajaran",
      ],
    },
  ],
  integrations: [
    {
      id: "int-mkt-contacts",
      withModule: "Contacts",
      relationship: "Recipients & blacklist ↔ res.partner / mailing.contact",
      whatHappens:
        "Email dan opt-out di Contacts memengaruhi siapa yang boleh dikirimi.",
    },
    {
      id: "int-mkt-crm",
      withModule: "CRM",
      relationship: "Domain mailing pada crm.lead; klik → prioritas follow-up",
      whatHappens:
        "Kampanye nurture menarget pipeline; Sales bekerja dari sinyal engagement.",
    },
    {
      id: "int-mkt-website",
      withModule: "Website",
      relationship: "Form subscribe → mailing.list; landing CTA",
      whatHappens:
        "Pengunjung opt-in sendiri; mailing mengarahkan traffic balik ke website.",
    },
    {
      id: "int-mkt-sales",
      withModule: "Sales / Products",
      relationship: `Konten CTA ke produk ${kopi.name}/${teh.name}`,
      whatHappens:
        "Kampanye yang baik menghasilkan quotation; lacak dengan UTM/Link Tracker.",
    },
    {
      id: "int-mkt-mail",
      withModule: "Discuss / Mail",
      relationship: "mail.mail queue & templates",
      whatHappens:
        "Pengiriman fisik lewat infrastruktur email Odoo; gagal terlihat di Outgoing Emails.",
    },
  ],
  mistakes: [
    {
      id: "m-mkt-no-test",
      problem: "Send massal tanpa Test email",
      why: "Typo, link rusak, atau merge field kosong sampai ke semua pelanggan",
      detect: "Komplain langsung setelah send; screenshot body jelek",
      fix: "Recall tidak selalu mungkin — kirim koreksi; perbaiki template",
      prevent: "Checklist wajib: Test ke 2 inbox (Gmail/Outlook) sebelum Send",
    },
    {
      id: "m-mkt-bought-list",
      problem: "Import list beli / tanpa consent",
      why: "Illegal/spam; domain masuk blacklist; rusak semua email perusahaan",
      detect: "Bounce & spam complaint tinggi di mailing pertama",
      fix: "Hentikan kirim; bersihkan list; pakai hanya opt-in",
      prevent: "Kebijakan: hanya kontak dengan sumber jelas (form, event, pelanggan)",
    },
    {
      id: "m-mkt-ignore-unsub",
      problem: "Menghapus footer unsubscribe atau kirim ulang ke opted-out",
      why: "Melanggar kepercayaan & regulasi; reputasi pengirim hancur",
      detect: "Template custom tanpa link default; kontak blacklist tetap terkirimi",
      fix: "Kembalikan footer bawaan; hormati blacklist",
      prevent: "Review template oleh Admin sebelum dipakai produksi",
    },
    {
      id: "m-mkt-wrong-segment",
      problem: "Kirim harga distributor ke list retail",
      why: "Kekacauan kanal; retail minta harga grosir",
      detect: `${customer.name} menerima penawaran khusus ${distributor.name}`,
      fix: "Pisah list; clarifikasi komunikasi",
      prevent: "Satu mailing = satu segmen; dual control recipients",
    },
    {
      id: "m-mkt-attach-huge",
      problem: "Attachment katalog 20MB di email",
      why: "Spam filter; gagal kirim; inbox penuh",
      detect: "Banyak bounce/error ukuran",
      fix: "Ganti dengan link download Website/Knowledge",
      prevent: "SOP: CTA link, bukan lampiran besar",
    },
    {
      id: "m-mkt-no-cta",
      problem: "Newsletter tanpa CTA jelas",
      why: "Open tinggi tapi tidak ada tindakan bisnis",
      detect: "Click rate mendekati nol",
      fix: "Satu CTA utama per mailing (pesan / reply / form)",
      prevent: "Wireframe: satu tujuan per kampanye",
    },
  ],
  troubleshooting: [
    {
      id: "t-mkt-stuck-queue",
      problem: "Mailing stuck In Queue / tidak terkirim",
      causes: [
        "Outgoing mail server salah/kredensial gagal",
        "Cron mail tidak jalan di lab",
        "Email From domain ditolak server",
      ],
      diagnosis: [
        "Settings → Outgoing Emails / Technical → Emails",
        "Lihat error pada mail.mail",
        "Uji Send Test lagi",
      ],
      solution: [
        "Perbaiki SMTP / mail plugin lab",
        "Jalankan cron fetchmail/mail secara manual jika diizinkan lab",
        "Samakan From dengan domain terotorisasi",
      ],
      prevention: "Smoke test outgoing sebelum kampanye besar",
    },
    {
      id: "t-mkt-zero-recipients",
      problem: "Recipients count 0 saat akan kirim",
      causes: [
        "List kosong",
        "Domain filter terlalu ketat",
        "Semua kontak opt-out/blacklist",
        "Model recipients salah dipilih",
      ],
      diagnosis: [
        "Buka list → hitung kontak",
        "Edit domain → Search lebih dulu",
        "Cek blacklist pada sample kontak",
      ],
      solution: [
        "Isi list / longgarkan domain",
        "Pilih mailing list yang benar",
        "Perbaiki email kontak",
      ],
      prevention: "Lihat angka recipients di form sebelum jadwal",
    },
    {
      id: "t-mkt-no-opens",
      problem: "Open rate selalu 0%",
      causes: [
        "Tracking gambar diblok client email",
        "Mailing belum benar-benar delivered",
        "Privacy Apple/Gmail mengurangi open tracking",
      ],
      diagnosis: [
        "Cek Delivered vs Sent",
        "Cek Click — kadang click ada meski open 0",
        "Uji ke inbox yang mengizinkan remote images",
      ],
      solution: [
        "Utamakan click & reply sebagai KPI sekunder",
        "Perbaiki deliverability jika Delivered rendah",
        "Jangan panik pada open 0 di sampel kecil",
      ],
      prevention: "Edukasi stakeholder: open rate tidak sempurna di era privacy",
    },
    {
      id: "t-mkt-ab-missing",
      problem: "Opsi A/B tidak muncul di form mailing",
      causes: [
        "Fitur belum aktif di Settings",
        "Hak akses kurang",
        "Versi/label menu berbeda",
      ],
      diagnosis: [
        "Settings → Email Marketing → cek A/B",
        "Login Admin",
        "Cari tab A/B Testing di mailing",
      ],
      solution: [
        "Aktifkan opsi A/B",
        "Upgrade group user Marketing",
        "Untuk list kecil, lewati A/B dan fokus Test email",
      ],
      prevention: "Checklist Settings setelah install app",
    },
  ],
  behind: {
    models: [
      "mailing.mailing",
      "mailing.list",
      "mailing.contact",
      "mailing.trace",
      "mail.mail",
      "mail.blacklist",
      "link.tracker",
      "res.partner",
      "crm.lead",
    ],
    relations: [
      "mailing.mailing → mailing.list (M2M) atau domain pada model",
      "mailing.contact.list_ids → mailing.list",
      "mailing.trace.mass_mailing_id → mailing.mailing",
      "unsubscribe → mail.blacklist / opt-out flags",
      "link.tracker mengaitkan URL CTA ke statistik klik",
    ],
    automations: [
      "queue mail jobs on send/schedule",
      "A/B winner selection after sample window",
      "open/click pixel & redirect tracking",
      "bounce handling updates contact deliverability",
    ],
    securityNotes: [
      "Marketing User vs Admin — batasi siapa boleh Send ke list besar",
      "Konten email bisa berisi data pelanggan — hati-hati hak akses export",
      "Jangan share kredensial SMTP ke semua user",
    ],
    note: "Email Marketing di Odoo 19 Enterprise berbeda dari Marketing Automation (workflow multi-step). Modul ini fokus mass mailing terukur. Deliverability bergantung infrastruktur email lab — functional learner wajib Test sebelum Send.",
  },
  reporting: [
    {
      name: "Mailing Statistics",
      path: "Email Marketing → Mailings → buka record → Statistics",
      kpi: "Sent, Delivered, Opened %, Clicked %, Bounced %",
      decision: "Iterasi subject/CTA; bersihkan email bounce",
    },
    {
      name: "Link Tracker",
      path: "Link Tracker (menu) / statistik klik di mailing",
      kpi: "Klik per URL CTA",
      decision: `CTA mana yang mendorong minat ${kopi.name} vs ${teh.name}`,
    },
    {
      name: "Mailing Lists Growth",
      path: "Email Marketing → Mailing Lists",
      kpi: "Jumlah subscriber aktif vs unsubscribed",
      decision: "Apakah form Website/opt-in perlu diperbaiki",
    },
    {
      name: "Campaign to Pipeline",
      path: "CRM / Sales filter setelah kampanye",
      kpi: "Lead/SO yang lahir pasca mailing",
      decision: "ROI kampanye vs biaya waktu produksi konten",
    },
  ],
  security: {
    roles: [
      {
        role: "Email Marketing / User",
        can: [
          "Buat & uji mailing",
          "Kirim ke list yang diizinkan",
          "Lihat statistik kampanye sendiri",
        ],
        cannot: [
          "Ubah settings global sembarangan",
          "Menghapus jejak kampanye perusahaan tanpa SOP",
        ],
        whyDifferent:
          "Eksekusi kampanye vs kebijakan deliverability/compliance dipisah.",
      },
      {
        role: "Email Marketing / Administrator",
        can: [
          "Settings A/B, server terkait",
          "Kelola semua list & mailing",
          "Audit bounce & blacklist",
        ],
        cannot: [
          "Mengabaikan hukum/consent meski punya akses teknis",
        ],
        whyDifferent:
          "Admin menjaga reputasi domain pengirim organisasi.",
      },
      {
        role: "Sales User (baca sinyal)",
        can: [
          "Melihat kontak yang engage (sesuai sharing)",
          "Follow-up opportunity",
        ],
        cannot: [
          "Send mass mailing tanpa role Marketing",
        ],
        whyDifferent:
          "Sales memakai hasil kampanye, bukan mengoperasikan blast.",
      },
    ],
    notes: [
      "Batasi Send Now pada list >N kontak — butuh approval di SOP perusahaan",
      "Pisahkan mailbox marketing dari email pribadi Owner",
    ],
  },
  levels: {
    beginner: [
      "Bedakan Email Marketing vs email chatter biasa",
      "Buat mailing list & tambah kontak",
      "Susun mailing sederhana + Test",
      "Send ke list kecil lab",
    ],
    intermediate: [
      "Pakai template konsisten + CTA",
      "Baca open/click/bounce",
      "Segmentasi retail vs distributor",
      "Follow-up Sales dari yang klik",
    ],
    advanced: [
      "A/B subject dengan benar",
      "Recipients domain dari CRM",
      "Integrasi form Website subscribe",
      "Win-back & nurture terukur",
    ],
    expert: [
      "Program kalender editorial + UTM hygiene",
      "Deliverability & list hygiene jangka panjang",
      "ROI kampanye vs pipeline/SO",
      "Tata kelola consent multi-list",
    ],
  },
  exercises: [
    {
      id: "ex-mkt-list",
      title: "List Retail Nusantara",
      objective: "Menyiapkan audience opt-in lab",
      prerequisites: ["Email Marketing terpasang", "Contacts ada email"],
      task: [
        "Buat list Retail Nusantara",
        `Tambah ${customer.name}`,
        `Opsional tambah ${distributor.name} ke list terpisah`,
        "Pastikan count > 0",
      ],
      expectedResult: "List siap dipilih di mailing",
      checklist: ["Nama list jelas", "Email valid", "Bukan blacklist"],
    },
    {
      id: "ex-mkt-draft-test",
      title: "Draft + Test newsletter",
      objective: "Menyusun kampanye aman sebelum mass send",
      prerequisites: ["List terisi"],
      task: [
        `Subject tentang ${kopi.name}`,
        "Body + satu CTA",
        "Recipients = list Retail",
        "Send Test ke email Anda",
      ],
      expectedResult: "Test diterima; tampilan & link OK",
      checklist: ["Unsubscribe ada", "CTA jalan", "Tidak ada merge field kosong"],
    },
    {
      id: "ex-mkt-send-stats",
      title: "Kirim lab & baca statistik",
      objective: "Menyelesaikan siklus send → report",
      prerequisites: ["Test sukses", "Outgoing mail OK"],
      task: [
        "Send Now ke list lab",
        "Tunggu status Sent",
        "Catat Delivered/Open/Click",
        "Perbaiki 1 bounce jika ada",
      ],
      expectedResult: "Kampanye punya angka statistik terbaca",
      checklist: ["Status Sent", "Statistik dibuka", "Bounce ditinjau"],
    },
    {
      id: "ex-mkt-segment-cta",
      title: "Segmen B2B + CTA produk",
      objective: "Melatih segmentasi dan CTA terukur",
      prerequisites: [`Contact ${distributor.name}`],
      task: [
        "List Distributor B2B",
        `Mailing highlight ${teh.name} & ${jasa.name}`,
        "Pakai link ter-track",
        "Simulasikan follow-up Sales jika click",
      ],
      expectedResult: "Mailing segmen benar; CTA terukur",
      checklist: ["Bukan list retail", "CTA satu tujuan", "Rencana follow-up ada"],
    },
  ],
  coreFlowLinks: [
    { label: "Deep Dive Contacts", href: "/materi/contacts" },
    { label: "Deep Dive CRM", href: "/materi/crm" },
    { label: "Deep Dive Website", href: "/materi/website" },
    { label: "Deep Dive Sales", href: "/materi/sales" },
    { label: "Deep Dive Settings", href: "/materi/settings" },
    { label: "Master Contacts", href: "/modul/master-contacts" },
  ],
};
