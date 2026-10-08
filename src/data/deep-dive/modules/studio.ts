import type { DeepDiveModule } from "../types";
import { seed } from "../../seed";

const customer = seed.customers.toko;
const distributor = seed.customers.distributor;
const kopi = seed.products.kopi;
const jasa = seed.products.jasa;
const company = seed.company;

/**
 * Deep Dive — Odoo Studio
 * No-code customization: fields, views, menus, approval rules;
 * kapan TIDAK memakai Studio; kaitan Developer Mode.
 */
export const studioDeepDive: DeepDiveModule = {
  slug: "studio",
  name: "Odoo Studio — No-Code Customization",
  shortTitle: "Studio",
  icon: "Puzzle",
  category: "administration",
  wave: 4,
  availability: "available",
  availabilityNote:
    `Odoo Studio adalah fitur Enterprise. Latihan di lab ${company.name} bersifat fungsional — bukan kursus development Python. Selalu export/backup sebelum kustomisasi besar.`,
  apps: ["Studio", "Settings"],
  overview: {
    function:
      "Odoo Studio memungkinkan admin Enterprise menyesuaikan aplikasi tanpa menulis kode: menambah field, mengubah form/list/kanban, membuat menu & app sederhana, menambahkan automation dasar, serta approval rules. Studio menyimpan kustomisasi sebagai data (view/field custom) di database. Bagi pemula functional, Studio adalah 'obeng UI' — kuat, tetapi mudah merusak upgrade path jika dipakai untuk semua permintaan user.",
    businessProblem:
      `Tim minta 'tambah kolom saja' setiap minggu. Tanpa Studio, menunggu developer. Dengan Studio tanpa disiplin, form Sales penuh field mati, approval berlapis memacetkan SO ${customer.name}, dan upgrade Odoo 19→berikutnya penuh konflik view.`,
    typicalUsers: [
      "Functional Administrator / Key User",
      "Implementation Consultant",
      "Power User yang ditunjuk (bukan semua sales)",
      "IT Application Owner (governance)",
    ],
    whenNeeded:
      "Saat ada gap kecil yang jelas (field laporan, tab info, filter, approval ringan) dan biaya modul custom belum sebanding — serta ada pemilik yang merawat kustomisasi.",
    relatedModules: [
      "Settings",
      "Developer Mode (inspeksi teknis)",
      "Users & Access Rights",
      "Sales / Helpdesk / semua app yang dikustomisasi",
    ],
    businessScenario: `${company.name} ingin menandai SO retail dengan field "Toko Prioritas" dan approval manajer jika diskon > 15% untuk ${customer.name}. Consultant memakai Studio untuk menambah field + aturan approval di Sales — lalu mendokumentasikan perubahan. Untuk integrasi kompleks ke gudang pihak ketiga, mereka menolak Studio dan eskalasi ke development terpisah.`,
  },
  prerequisites: {
    modules: [
      "Odoo 19 Enterprise dengan Studio",
      "Settings + hak Administration",
      "Developer Mode dipahami (inspeksi, bukan wajib selalu on)",
      "App target sudah terpasang (mis. Sales) sebelum dikustomisasi",
    ],
    masterData: [
      "Daftar permintaan kustomisasi yang sudah diprioritaskan (bukan wish-list acak)",
      "User uji di tiap role (Sales User vs Manager)",
      `Dokumen contoh: SO ${customer.name} untuk ${kopi.name}`,
      "Konvensi penamaan field (x_studio_...)",
    ],
    configuration: [
      "User dengan akses Studio (biasanya Settings / Admin)",
      "Database lab/staging — jangan belajar di production tanpa backup",
      "Developer Mode siap untuk cek technical name field/view",
      "Prosedur export Studio customization (jika dipakai antar DB)",
    ],
    access: [
      "Hanya Admin/konsultan terlatih yang mengaktifkan Studio",
      "Sales User biasa: tidak perlu tombol Studio",
      "Pisahkan siapa boleh edit approval rules",
    ],
    relationships:
      "Studio membuat ir.model.fields (custom), mewarisi/menulis ir.ui.view, menu ir.ui.menu, dan bisa memasang base.automation / approval. Developer Mode menampilkan metadata yang sama agar Anda memverifikasi dampaknya. Kustomisasi menempel di database, bukan di kode repo kecuali diexport.",
  },
  installation: {
    how: [
      "Home → Apps",
      "Cari 'Studio'",
      "Install aplikasi Studio (Enterprise)",
      "Buka sembarang app bisnis (mis. Sales) — tombol toggle Studio muncul untuk user berhak",
      "Atau buka app Studio dari home untuk membuat app baru",
    ],
    dependencies: [
      "Enterprise subscription / codebase Enterprise",
      "base / web",
      "Aplikasi yang akan dikustomisasi (Sales, Contacts, dll.)",
    ],
    afterInstall: [
      "Login sebagai Admin → pastikan ikon Studio terlihat di menu atas saat di form",
      "Latihan di DB lab: tambah satu field Char lalu hapus/rollback sesuai SOP",
      "Aktifkan Developer Mode sekali untuk melihat Technical name field baru",
      `Dokumentasikan: siapa boleh pakai Studio di proyek ${company.name}`,
    ],
    newMenus: [
      "App Studio (home) — Custom apps / models",
      "Toggle Studio pada form/list aplikasi mana pun",
      "Studio → Approvals (jika menu terpisah di build lab)",
      "Settings tetap pusat Users & Technical (dengan Developer Mode)",
    ],
    newSettings: [
      "Akses Studio dikontrol group user",
      "Settings → Technical (Developer Mode) untuk inspeksi hasil Studio",
      "Export/Import customization tools di Studio",
    ],
  },
  configurations: [
    {
      id: "stu-toggle",
      name: "Studio Toggle pada Form/List",
      location: "Ikon Studio di systray / toolbar saat membuka record",
      what: "Mode desain UI: drag field, properties, tabs, tombol, studio automation pintas.",
      whyEnable:
        "Ini cara utama menyesuaikan layar yang sudah ada tanpa module Python.",
      whenEnable:
        "Hanya saat sesi kustomisasi terjadwal; matikan toggle setelah selesai agar UI kembali normal untuk operasi.",
      whenNot:
        "Jangan biarkan toggle on saat user bisnis input SO harian — rawan klik salah.",
      businessExample: `Di form Sales Order ${customer.name}, Admin membuka Studio untuk menambah field x_studio_toko_prioritas.`,
      impact:
        "View form/list di-patch; semua user melihat field baru sesuai invisible/groups.",
      screenshot: {
        src: "/screenshots/odoo19e/w4-studio.png",
        caption: "Studio aktif — kanvas kustomisasi di atas aplikasi bisnis",
        whatYouSee: "UI Odoo dengan Studio editor",
        why: "Toggle Studio adalah pintu masuk kustomisasi form/list",
      },
    },
    {
      id: "stu-custom-fields",
      name: "Custom Fields",
      location: "Studio → + Field / palet field types",
      what: "Menambah Char, Text, Many2one, Selection, Date, dll. pada model (mis. sale.order).",
      whyEnable:
        "Menangkap data bisnis yang tidak ada di standar — untuk filter, laporan, dan approval.",
      whenEnable:
        "Field dipakai nyata di proses (wajib diisi di SOP) dan punya pemilik data.",
      whenNot:
        "Jangan buat field 'jaga-jaga' — form jadi semak; pakai chatter/notes jika info sporadis.",
      businessExample: `Selection "Segmen Toko" pada SO: Retail / Distributor — memudahkan analisis ${customer.name} vs ${distributor.name}.`,
      impact:
        "Kolom database custom; bisa ditambah ke list, searchable, muncul di export.",
      screenshot: {
        src: "/screenshots/odoo19e/w4-studio-home.png",
        caption: "Studio Home — pusat membuat/mengelola kustomisasi & app",
        whatYouSee: "Beranda aplikasi Studio",
        why: "Field dan app custom dikelola dari ekosistem Studio",
      },
    },
    {
      id: "stu-views-menus",
      name: "Views, Menus & Mini Apps",
      location: "Studio editor views; Studio app untuk model/menu baru",
      what: "Mengubah tata letak form, kolom list, optional membuat model sederhana + menu.",
      whyEnable:
        "Kadang butuh register ringan (mis. daftar aset marketing) tanpa full custom module.",
      whenEnable:
        "Objek data sederhana, sedikit relasi, tidak menyentuh stok/akuntansi kritis.",
      whenNot:
        "Jangan modelkan inventori paralel atau jurnal akuntansi di Studio mini-app.",
      businessExample: `Menu "Catatan Rasa ${kopi.name}" untuk cupping notes — model sederhana, bukan mengganti Quality app.`,
      impact:
        "Menu baru di App Switcher/root; hak akses perlu diatur agar tidak terbuka ke semua.",
      screenshot: {
        src: "/screenshots/odoo19e/w4-settings-studio.png",
        caption: "Settings terkait Studio / kustomisasi Enterprise",
        whatYouSee: "Area konfigurasi yang relevan dengan Studio",
        why: "Governance akses & fitur sebelum membuat menu baru",
      },
    },
    {
      id: "stu-approvals",
      name: "Approval Rules",
      location: "Studio → Approvals / rules pada model (Sales Order, dll.)",
      what: "Menahan aksi (confirm) sampai user/group tertentu menyetujui, sering berbasis domain (diskon, amount).",
      whyEnable:
        "Kontrol risiko harga/diskon tanpa menulis workflow Python.",
      whenEnable:
        "Ada kebijakan jelas (mis. diskon > 15% butuh Sales Manager) dan approver aktif.",
      whenNot:
        `Jangan pasang 4 lapis approval untuk SO kecil — operasi ${customer.name} macet.`,
      businessExample: `SO ${customer.name} dengan diskon > 15% pada ${kopi.name} → butuh approval Manager sebelum Confirm.`,
      impact:
        "Tombol Confirm tertahan; aktivitas approval; jejak siapa approve.",
      screenshot: {
        src: "/screenshots/odoo19e/09-sales-quotation-form.png",
        caption: "Form quotation/SO — target umum aturan approval Studio",
        whatYouSee: "Form Sales yang akan dikenai rule",
        why: "Approval harus diuji di dokumen nyata setelah rule dipasang",
      },
    },
    {
      id: "stu-automation",
      name: "Studio Automations (dasar)",
      location: "Studio → Automations / Automated Actions pintas",
      what: "Trigger sederhana on create/update: set nilai, kirim email, next activity.",
      whyEnable:
        "Mengurangi kerja manual berulang untuk aturan bisnis ringan.",
      whenEnable:
        "Aturan stabil dan jarang berubah; dampak samping sudah diuji.",
      whenNot:
        "Jangan gantikan integrasi kompleks atau logika stok/accounting dengan automation Studio asal.",
      businessExample: `Jika SO customer = ${distributor.name}, set field Segmen = Distributor otomatis.`,
      impact:
        "base.automation record; bisa bentrok jika banyak rule overlapping.",
      screenshot: {
        src: "/screenshots/odoo19e/w2-settings.png",
        caption: "Settings — pintu terkait automation & teknis setelah Studio dipakai",
        whatYouSee: "Halaman Settings Odoo",
        why: "Automation Studio beririsan dengan Settings/Technical",
      },
    },
    {
      id: "stu-vs-devmode",
      name: "Studio ↔ Developer Mode",
      location: "Settings → Activate Developer Mode; ikon bug pada form",
      what: "Developer Mode untuk inspeksi technical name, view inherited, dan diagnosa — Studio untuk edit no-code.",
      whyEnable:
        "Tanpa Dev Mode, sulit memastikan field Studio benar-benar di model mana dan group invisible-nya apa.",
      whenEnable:
        "Saat membangun/men-debug kustomisasi; matikan untuk user bisnis.",
      whenNot:
        "Jangan ajarkan semua user menyalakan Dev Mode 'supaya lengkap'.",
      businessExample: `Setelah menambah field di Studio, Admin menyalakan Dev Mode → bug icon pada SO → cek field x_studio_toko_prioritas ada di sale.order.`,
      impact:
        "Visibilitas metadata; risiko edit Technical langsung jika tidak hati-hati.",
      screenshot: {
        src: "/screenshots/odoo19e/11-settings.png",
        caption: "Settings — aktifkan Developer Mode untuk inspeksi hasil Studio",
        whatYouSee: "Menu Settings Odoo",
        why: "Studio dan Developer Mode saling melengkapi untuk functional admin",
      },
    },
  ],
  masterData: [
    {
      id: "md-stu-field",
      name: "Custom Field (ir.model.fields)",
      purpose: "Field tambahan hasil Studio pada model Odoo.",
      required: false,
      whyNeeded:
        "Ini artefak utama kustomisasi data — harus dinamai dan didokumentasikan.",
      fields: [
        {
          field: "Field Type",
          type: "Selection",
          required: true,
          purpose: "Char, Integer, Many2one, Selection, …",
          why: "Salah tipe = data tidak bisa dianalisis",
          example: "Selection",
          impactIfEmpty: "Field tidak dibuat",
        },
        {
          field: "Label",
          type: "Char",
          required: true,
          purpose: "Label UI Indonesia/EN",
          why: "User memahami arti",
          example: "Toko Prioritas",
          impactIfEmpty: "Field membingungkan",
        },
        {
          field: "Technical Name",
          type: "Char",
          required: true,
          purpose: "x_studio_…",
          why: "Stabil untuk domain/approval/report",
          example: "x_studio_toko_prioritas",
          impactIfEmpty: "Studio generate otomatis — tetap catat",
        },
        {
          field: "Required / Readonly",
          type: "Boolean",
          required: false,
          purpose: "Kendali input",
          why: "Kualitas data vs friksi user",
          example: "Required=False dulu, lalu True setelah adopsi",
          impactIfEmpty: "Default opsional",
        },
        {
          field: "Groups (visibility)",
          type: "Many2many",
          required: false,
          purpose: "Siapa melihat field",
          why: "Sembunyikan info internal dari portal/user tertentu",
          example: "Sales / Manager",
          impactIfEmpty: "Terlihat semua yang akses form",
          related: "res.groups",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-studio.png",
        caption: "Studio editor — menambah & mengatur properti field",
      },
    },
    {
      id: "md-stu-view",
      name: "Customized View (ir.ui.view)",
      purpose: "Inherit view XML yang Studio tulis saat Anda drag-drop UI.",
      required: false,
      whyNeeded:
        "Memahami bahwa 'geser field' = record view di DB; bentrok upgrade sering di sini.",
      fields: [
        {
          field: "Model",
          type: "Char",
          required: true,
          purpose: "Model yang diubah",
          why: "Salah model = kustomisasi tidak muncul",
          example: "sale.order",
          impactIfEmpty: "View invalid",
        },
        {
          field: "View Type",
          type: "Selection",
          required: true,
          purpose: "form / tree / kanban / search",
          why: "Field di form belum tentu di list",
          example: "form",
          impactIfEmpty: "Tidak tersimpan",
        },
        {
          field: "Priority / Inherit",
          type: "Integer",
          required: false,
          purpose: "Urutan apply inherit",
          why: "Debug jika field 'hilang' setelah app lain",
          example: "99 (studio typical)",
          impactIfEmpty: "Default Studio",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-studio-home.png",
        caption: "Studio Home — kelola artefak kustomisasi secara terpusat",
      },
    },
    {
      id: "md-stu-approval",
      name: "Approval Rule",
      purpose: "Aturan siapa harus approve aksi pada model/domain tertentu.",
      required: false,
      whyNeeded:
        "Tanpa rule terdefinisi jelas, approval jadi politik ad-hoc di WA.",
      fields: [
        {
          field: "Model",
          type: "Many2one",
          required: true,
          purpose: "Dokumen yang dikontrol",
          why: "Scope rule",
          example: "Sales Order",
          impactIfEmpty: "Rule tidak jalan",
          related: "ir.model",
        },
        {
          field: "Domain / Condition",
          type: "Char",
          required: false,
          purpose: "Kapan rule berlaku",
          why: "Hindari approve semua SO",
          example: "Diskon > 15% atau amount > X",
          impactIfEmpty: "Bisa berlaku terlalu luas",
        },
        {
          field: "Approver Group / User",
          type: "Many2one/M2M",
          required: true,
          purpose: "Siapa yang boleh approve",
          why: "Akuntabilitas",
          example: "Sales / Administrator",
          impactIfEmpty: "Dokumen macet tanpa approver",
        },
        {
          field: "Action blocked",
          type: "Selection",
          required: false,
          purpose: "Confirm / button mana",
          why: "Kendali tepat pada aksi berisiko",
          example: "Confirm quotation",
          impactIfEmpty: "Perilaku default Studio",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/09-sales-quotation-form.png",
        caption: "Uji approval pada quotation nyata setelah rule dibuat",
      },
    },
    {
      id: "md-stu-governance",
      name: "Customization Register (dokumentasi proyek)",
      purpose: "Catatan non-Odoo (spreadsheet/Knowledge) daftar field & rule Studio.",
      required: true,
      whyNeeded:
        "DB tidak menjelaskan 'mengapa' field ada; upgrade & onboarding butuh register.",
      fields: [
        {
          field: "Change ID",
          type: "Char",
          required: true,
          purpose: "Nomor permintaan",
          why: "Lacak asal usul",
          example: "REQ-STU-012",
          impactIfEmpty: "Field yatim",
        },
        {
          field: "Model + Field",
          type: "Char",
          required: true,
          purpose: "sale.order / x_studio_…",
          why: "Teknis + bisnis",
          example: "sale.order.x_studio_toko_prioritas",
          impactIfEmpty: "Sulit audit",
        },
        {
          field: "Owner",
          type: "Char",
          required: true,
          purpose: "Siapa merawat",
          why: "Governance",
          example: "Functional Admin Nusantara",
          impactIfEmpty: "Tidak ada yang berani hapus/perbaiki",
        },
        {
          field: "Upgrade note",
          type: "Text",
          required: false,
          purpose: "Risiko saat upgrade",
          why: "Persiapan migrasi",
          example: "Cek inherit form sale.order",
          impactIfEmpty: "Kejutan di upgrade",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-00-home-apps.png",
        caption: "Home Apps — petakan app mana saja yang sudah disentuh Studio",
        whatYouSee: "Daftar aplikasi termasuk Studio",
      },
    },
  ],
  dependencies: {
    nodes: [
      { id: "enterprise", label: "Odoo Enterprise" },
      { id: "studio", label: "Studio App" },
      { id: "target", label: "Target App (Sales…)" },
      { id: "fields", label: "Custom Fields" },
      { id: "views", label: "Inherited Views" },
      { id: "approvals", label: "Approvals" },
      { id: "devmode", label: "Developer Mode" },
      { id: "users", label: "Users & Groups" },
    ],
    edges: [
      {
        from: "enterprise",
        to: "studio",
        why: "Studio hanya di edisi Enterprise",
      },
      {
        from: "studio",
        to: "target",
        why: "Kustomisasi menempel pada app/model bisnis",
      },
      {
        from: "studio",
        to: "fields",
        why: "Palet field membuat ir.model.fields",
      },
      {
        from: "fields",
        to: "views",
        why: "Field harus diletakkan di form/list agar dipakai user",
      },
      {
        from: "fields",
        to: "approvals",
        why: "Domain approval sering memakai field custom/standar",
      },
      {
        from: "devmode",
        to: "views",
        why: "Inspeksi technical view & field name",
      },
      {
        from: "users",
        to: "studio",
        why: "Hanya group tertentu boleh masuk mode Studio",
      },
    ],
    summary:
      "Enterprise + Studio menarget app bisnis; field & view tercipta di DB; approval/automation memakai field itu; Developer Mode dan Users/Groups menjaga agar kustomisasi terkendali dan bisa diaudit.",
  },
  forms: [
    {
      id: "form-studio-editor",
      name: "Studio Form Editor (pada Sales Order)",
      menuPath: "Sales → Order → buka record → Toggle Studio",
      fields: [
        {
          field: "Add Field",
          required: false,
          purpose: "Palet tipe field baru",
          why: "Titik buat x_studio_*",
          example: "Selection Toko Prioritas",
        },
        {
          field: "Properties",
          required: false,
          purpose: "Required, invisible, string, help",
          why: "Perilaku UI & validasi",
          example: "Help: isi Ya untuk retail prioritas",
        },
        {
          field: "Tabs / Columns",
          required: false,
          purpose: "Layout",
          why: "Jangan menaruh field kritis di tab tersembunyi tanpa SOP",
          example: "Tab 'Info Toko'",
        },
        {
          field: "Existing Field placement",
          required: false,
          purpose: "Geser field standar",
          why: "Urutan kerja user",
          example: "Payment Terms lebih ke atas",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-studio.png",
        caption: "Editor Studio di atas form bisnis",
        whatYouSee: "Mode desain Studio",
        whatToFill: "Field baru + properties; Save/close Studio",
      },
    },
    {
      id: "form-studio-home",
      name: "Studio Home — Custom App",
      menuPath: "Home → Studio",
      fields: [
        {
          field: "App Name",
          required: true,
          purpose: "Nama app custom",
          why: "Muncul di switcher",
          example: "Catatan Rasa Nusantara",
        },
        {
          field: "Model / Menus",
          required: true,
          purpose: "Objek & navigasi",
          why: "Tanpa menu, app tidak terjangkau",
          example: "Model Cupping Note + menu list",
        },
        {
          field: "Access Rights",
          required: true,
          purpose: "Group yang boleh akses",
          why: "Hindari data terbuka ke semua internal user",
          example: "Sales / User + Admin",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-studio-home.png",
        caption: "Studio Home untuk app/model baru",
      },
    },
    {
      id: "form-approval-rule",
      name: "Approval Rule Form",
      menuPath: "Studio → Approvals → New (path sesuai lab)",
      fields: [
        {
          field: "Name",
          required: true,
          purpose: "Nama rule",
          why: "Audit & komunikasi ke user",
          example: "Diskon > 15% butuh Manager",
        },
        {
          field: "Model",
          required: true,
          purpose: "sale.order dll.",
          why: "Scope",
          example: "Sales Order",
        },
        {
          field: "Condition",
          required: false,
          purpose: "Domain",
          why: "Hanya SO berisiko",
          example: "discount_rate > 15",
        },
        {
          field: "Approvers",
          required: true,
          purpose: "User/group",
          why: "Siapa membuka gembok Confirm",
          example: "Sales Administrator",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-settings-studio.png",
        caption: "Konfigurasi / settings terkait kemampuan Studio & approval",
      },
    },
  ],
  procedures: [
    {
      id: "proc-stu-add-field",
      title: "Menambah field custom di Sales Order",
      goal: "Field bisnis baru terlihat di form SO dan bisa diisi user Sales.",
      preparation: [
        "Studio terpasang; login Admin",
        "Backup/snapshot lab jika tersedia",
        "Keputusan: nama field, tipe, wajib/tidak",
        "Developer Mode siap untuk verifikasi",
      ],
      steps: [
        `Sales → Orders → buka SO contoh (atau buat quotation ${customer.name})`,
        "Klik ikon Studio (toggle)",
        "Drag field type Selection ke area form yang tepat",
        "Label: Toko Prioritas; opsi: Ya / Tidak",
        "Set help text singkat",
        "Opsional: tambahkan ke list view (kolom) untuk filter",
        "Close Studio / Save",
        "Aktifkan Developer Mode → bug icon → pastikan technical name tercatat",
        "Update customization register proyek",
      ],
      expectedResult: "Field muncul untuk user Sales; technical name terdokumentasi.",
      verification: [
        "Logout Studio mode — form normal menampilkan field",
        `Isi nilai pada SO ${customer.name}, Save, refresh — nilai persist`,
        "User Sales (bukan Admin) melihat field sesuai groups",
      ],
      fillFields: [
        {
          field: "Label",
          value: "Toko Prioritas",
          where: "Studio field properties",
          how: "Ketik",
          required: true,
        },
        {
          field: "Type",
          value: "Selection: Ya / Tidak",
          where: "Palet field",
          how: "Pilih",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-studio.png",
        caption: "Studio toggle saat menambah field pada form",
      },
    },
    {
      id: "proc-stu-approval",
      title: "Memasang approval diskon pada quotation",
      goal: "SO dengan diskon tinggi tidak bisa Confirm tanpa persetujuan Manager.",
      preparation: [
        "Field/diskon yang dipakai di domain sudah jelas",
        "User Manager uji ada",
        "SOP tertulis: ambang 15%",
      ],
      steps: [
        "Buka Studio Approvals (atau Approvals dari editor)",
        "New Rule: Diskon tinggi butuh Manager",
        "Model: Sales Order",
        "Condition: diskon > 15% (sesuaikan field lab)",
        "Approver: group Sales Administrator / Manager",
        "Save rule",
        `Buat quotation ${customer.name} line ${kopi.name} dengan diskon 20%`,
        "Coba Confirm sebagai Sales User — harus tertahan",
        "Login Manager → Approve → Confirm berhasil",
      ],
      expectedResult: "Kontrol diskon berjalan; jejak approval tersimpan.",
      verification: [
        "SO diskon rendah tetap Confirm tanpa hambatan",
        "SO diskon tinggi butuh approve",
        "Chatter/log menunjukkan approver",
      ],
      fillFields: [
        {
          field: "Rule Name",
          value: "Diskon > 15% butuh Manager",
          where: "Approval form",
          how: "Ketik",
          required: true,
        },
        {
          field: "Discount on line",
          value: "20",
          where: `SO test ${customer.name}`,
          how: "Ketik",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/09-sales-quotation-form.png",
        caption: "Uji Confirm quotation setelah approval rule aktif",
      },
    },
    {
      id: "proc-stu-list-search",
      title: "Menambah kolom list & filter search",
      goal: "Field custom bisa difilter di list Orders agar operasional cepat.",
      preparation: [
        "Field Toko Prioritas sudah ada di form",
        "Pahami perbedaan form vs tree vs search view",
      ],
      steps: [
        "Buka list Sales Orders",
        "Toggle Studio",
        "Tambah kolom Toko Prioritas ke list",
        "Edit search view: add filter 'Prioritas = Ya'",
        "Close Studio",
        "Uji filter sebagai Sales User",
      ],
      expectedResult: "Tim Sales memfilter SO prioritas tanpa export Excel.",
      verification: [
        "Kolom terlihat di list",
        "Filter mengembalikan SO yang ditandai Ya",
        `SO ${distributor.name} tidak ikut jika Tidak`,
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-studio-home.png",
        caption: "Studio Home — kelola view terkait setelah edit list/search",
      },
    },
    {
      id: "proc-stu-when-not",
      title: "Checklist kapan MENOLAK pakai Studio",
      goal: "Membiasakan governance: tidak semua request = field baru.",
      preparation: [
        "Kumpulan request user (contoh dari workshop)",
        "Hadir IT/consultant pengambil keputusan",
      ],
      steps: [
        "Terima request: 'Integrasi otomatis stok ke marketplace X'",
        "Tandai: butuh API, error handling, mapping — TOLAK Studio; usulkan development/modul",
        "Terima request: 'Tambah catatan preferensi seduh di Contact'",
        "Tandai: field Text/Html opsional — TERIMA Studio dengan register",
        "Terima request: 'App akuntansi paralel untuk kas kecil'",
        "Tandai: risiko finansial — TOLAK; pakai Accounting standar",
        "Dokumentasikan keputusan di customization register",
      ],
      expectedResult: "Tim punya contoh nyata terima/tolak; Studio tidak jadi tempat sampah.",
      verification: [
        "Minimal 1 request ditolak dengan alasan tertulis",
        "Minimal 1 request diterima dengan owner & technical name",
        "Tidak ada kustomisasi production tanpa register",
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w4-00-home-apps.png",
        caption: "Home Apps — pilih app standar dulu sebelum membuat app Studio",
        why: "Banyak kebutuhan sudah ada modulnya (Quality, Helpdesk, dll.)",
      },
    },
    {
      id: "proc-stu-devmode-verify",
      title: "Verifikasi kustomisasi dengan Developer Mode",
      goal: "Memastikan field/view Studio benar secara teknis sebelum serah terima user.",
      preparation: [
        "Field & approval lab sudah dibuat",
        "Hak Settings pada user Admin",
      ],
      steps: [
        "Settings → Activate the developer mode",
        "Buka SO → ikon bug → View Fields / Edit View Form",
        "Cari x_studio_toko_prioritas",
        "Catat model, type, view inherit id",
        "Settings → Technical → User Interface → Views: filter studio/sale.order",
        "Deactivate developer mode setelah selesai",
        "Lampirkan temuan ke register",
      ],
      expectedResult: "Dokumen serah terima memuat technical name & view terkait.",
      verification: [
        "Technical name diketahui",
        "View inherit terdaftar",
        "Dev Mode dimatikan di sesi user bisnis",
      ],
      fillFields: [
        {
          field: "Developer Mode",
          value: "Activate",
          where: "Settings bawah",
          how: "Klik link",
          required: true,
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/11-settings.png",
        caption: "Settings — Activate developer mode untuk inspeksi",
      },
    },
  ],
  scenarios: [
    {
      id: "sc-stu-field-report",
      title: "Field segmen untuk laporan Sales",
      whenToUse: "Butuh pivot SO retail vs distributor.",
      flow: [
        "Tambah Selection Segmen di SO via Studio",
        `Isi pada SO ${customer.name} & ${distributor.name}`,
        "Tambah ke list",
        "Group by di Reporting Sales",
      ],
      notes: "Kasus Studio yang sehat: data dipakai laporan.",
    },
    {
      id: "sc-stu-approval-discount",
      title: "Approval diskon",
      whenToUse: "Kebijakan harga ketat.",
      flow: [
        "Rule domain diskon",
        "Sales User ditolak Confirm",
        "Manager approve",
        "Confirm & invoice lanjut normal",
      ],
    },
    {
      id: "sc-stu-reject-complex",
      title: "Menolak request integrasi di Studio",
      whenToUse: "User minta sync realtime ke sistem luar.",
      flow: [
        "Analisis kompleksitas",
        "Tolak Studio",
        "Usulkan spesifikasi development / konektor",
        "Sementara: field status manual jika perlu",
      ],
    },
    {
      id: "sc-stu-mini-app",
      title: "Mini app catatan non-kritis",
      whenToUse: "Register ringan tanpa modul penuh.",
      flow: [
        "Studio Home → New App",
        "Model sederhana",
        "Menu + access rights",
        "Latih create/list",
        "Evaluasi setelah 30 hari: tetap berguna atau diganti modul standar?",
      ],
    },
    {
      id: "sc-stu-cleanup",
      title: "Membersihkan field mati",
      whenToUse: "Form penuh field tidak terisi 90 hari.",
      flow: [
        "Audit register vs usage",
        "Sembunyikan/invisible dulu",
        "Komunikasi ke user",
        "Hapus field setelah backup jika aman",
      ],
    },
  ],
  integrations: [
    {
      id: "int-stu-sales",
      withModule: "Sales",
      relationship: "Custom fields/approvals pada sale.order & lines",
      whatHappens:
        "Proses quotation→SO memakai field tambahan; approval menahan Confirm.",
    },
    {
      id: "int-stu-devmode",
      withModule: "Developer Mode / Settings Technical",
      relationship: "Inspeksi ir.model.fields & ir.ui.view hasil Studio",
      whatHappens:
        "Admin memverifikasi technical name, inherit view, dan diagnosa field hilang.",
    },
    {
      id: "int-stu-users",
      withModule: "Users & Access Rights",
      relationship: "Groups mengontrol Studio, visibility field, approver",
      whatHappens:
        "Tanpa group benar, field invisible atau approval tidak punya approver.",
    },
    {
      id: "int-stu-contacts",
      withModule: "Contacts",
      relationship: "Field custom pada res.partner untuk segmen marketing/sales",
      whatHappens:
        `Tag/field preferensi pada ${customer.name} dipakai filter mailing atau pricelist SOP.`,
    },
    {
      id: "int-stu-reporting",
      withModule: "Spreadsheet / Reporting",
      relationship: "Field custom masuk pencarian & export",
      whatHappens:
        `KPI internal bisa memecah performa ${kopi.name} per segmen toko.`,
    },
  ],
  mistakes: [
    {
      id: "m-stu-everyone-studio",
      problem: "Memberi akses Studio ke semua user bisnis",
      why: "Form berubah liar; tidak ada ownership; konflik view",
      detect: "Banyak x_studio field tanpa dokumentasi; user saling menimpa layout",
      fix: "Cabut group Studio; audit field; kunci proses change request",
      prevent: "Hanya Functional Admin + backup person",
    },
    {
      id: "m-stu-required-too-soon",
      problem: "Field baru langsung Required=True di production",
      why: "User tidak bisa Save dokumen lama/baru; operasi berhenti",
      detect: `Error mandatory field saat Confirm SO ${jasa.name}`,
      fix: "Matikan required; backfill data; edukasi; baru wajibkan",
      prevent: "Phase: optional → monitor fill rate → required",
    },
    {
      id: "m-stu-approval-stack",
      problem: "Bertumpuk approval tanpa SLA approver",
      why: "Pipeline sales macet; user bypass dengan draft eternal",
      detect: "Banyak SO menunggu approve berhari-hari",
      fix: "Sederhanakan rule; tetapkan delegasi; hapus lapisan redundan",
      prevent: "Maksimal 1–2 gerbang approval dengan kondisi ketat",
    },
    {
      id: "m-stu-replace-apps",
      problem: "Membangun ulang Helpdesk/Inventory di Studio mini-app",
      why: "Kehilangan integrasi standar; biaya maintenance tinggi",
      detect: "App custom meniru ticket/stok tanpa SLA/valuation",
      fix: "Migrasi ke modul standar; sunset mini-app",
      prevent: "Checklist 'apakah app Odoo sudah ada?' sebelum New App",
    },
    {
      id: "m-stu-prod-experiment",
      problem: "Uji drag-drop di production saat jam operasi",
      why: "View rusak untuk semua user; panik floor",
      detect: "Form error tiba-tiba setelah 'cuma geser sebentar'",
      fix: "Restore backup/view; kerjakan di staging",
      prevent: "Semua eksperimen di lab/staging; window change terkontrol",
    },
    {
      id: "m-stu-ignore-upgrade",
      problem: "Tidak mencatat kustomisasi untuk upgrade",
      why: "Upgrade gagal atau field hilang tanpa jejak",
      detect: "Paska upgrade, form Sales pecah",
      fix: "Inventory view Studio; perbaiki inherit; uji regresi",
      prevent: "Customization register wajib sebelum go-live",
    },
  ],
  troubleshooting: [
    {
      id: "t-stu-button-missing",
      problem: "Ikon Studio tidak muncul",
      causes: [
        "App Studio belum terpasang",
        "User tanpa group Studio/Admin",
        "Bukan database Enterprise",
      ],
      diagnosis: [
        "Apps → cari Studio installed?",
        "Settings → Users → groups",
        "Cek edisi Odoo",
      ],
      solution: [
        "Install Studio",
        "Tambah group yang benar; login ulang",
        "Gunakan lab Enterprise untuk modul ini",
      ],
      prevention: "Checklist akses Admin sebelum sesi kustomisasi",
    },
    {
      id: "t-stu-field-invisible",
      problem: "Field Studio tidak terlihat user lain",
      causes: [
        "Groups visibility membatasi",
        "Hanya ditambah di form, user pakai list",
        "View lain (mobile/studio conflict) menimpa",
        "Masih di mode Studio cache",
      ],
      diagnosis: [
        "Login sebagai user target",
        "Developer Mode → cek groups pada field",
        "Cek field ada di view form aktif",
      ],
      solution: [
        "Sesuaikan groups",
        "Add field ke view yang dipakai user",
        "Bersihkan conflict inherit jika perlu",
      ],
      prevention: "Uji dengan akun Sales User setiap selesai edit Studio",
    },
    {
      id: "t-stu-approval-stuck",
      problem: "Dokumen terus menunggu approval",
      causes: [
        "Approver group kosong / user nonaktif",
        "Domain rule terlalu luas",
        "User mencoba self-approve tanpa hak",
      ],
      diagnosis: [
        "Siapa anggota group approver?",
        "Lihat activity approval pada record",
        "Uji SO di luar domain (diskon rendah)",
      ],
      solution: [
        "Isi approver aktif + delegasi",
        "Perketat domain",
        "Admin override sesuai SOP darurat",
      ],
      prevention: "Simulasi cuti Manager sebelum go-live rule",
    },
    {
      id: "t-stu-view-error",
      problem: "Error Parse/View setelah edit Studio",
      causes: [
        "Drag field ke posisi invalid",
        "Bentrok dua inherit",
        "Field dihapus tetapi masih direferensi view",
      ],
      diagnosis: [
        "Baca traceback (Admin)",
        "Technical → Views filter model",
        "Bandingkan dengan staging bersih",
      ],
      solution: [
        "Disable inherit Studio bermasalah",
        "Perbaiki dari Studio/Technical dengan hati-hati",
        "Restore backup jika parah",
      ],
      prevention: "Perubahan kecil bertahap; selalu punya rollback",
    },
  ],
  behind: {
    models: [
      "ir.model",
      "ir.model.fields",
      "ir.ui.view",
      "ir.ui.menu",
      "ir.actions.act_window",
      "base.automation",
      "studio.approval.rule (nama dapat bervariasi per versi)",
      "ir.model.data",
      "res.groups",
    ],
    relations: [
      "custom field.model_id → ir.model",
      "studio view inherit_id → base view modul",
      "approval rule → model + groups approver",
      "menu → action → model custom/standar",
    ],
    automations: [
      "Studio automation → base.automation triggers",
      "approval blocks workflow buttons until approved",
      "export customization packs (opsional antar DB)",
    ],
    securityNotes: [
      "Akses Studio = kemampuan ubah struktur data aplikasi",
      "Field tanpa groups bisa bocor ke user yang seharusnya tidak lihat",
      "Jangan edit Technical records mentah jika Studio bisa memperbaiki dengan aman",
    ],
    note: `Studio adalah lapisan no-code di atas framework Odoo: hasilnya data di DB. Developer Mode adalah lampu sorot. Keduanya tidak menggantikan modul Python untuk integrasi/logika berat. Di Odoo 19 Enterprise lab ${company.name}, tekankan governance sekuat keterampilan klik.`,
  },
  reporting: [
    {
      name: "Customization Register (proyek)",
      path: "Dokumen eksternal / Knowledge — bukan menu Odoo wajib",
      kpi: "Jumlah field aktif vs field mati; % request ditolak",
      decision: "Apakah hutang kustomisasi sudah terlalu besar vs development",
    },
    {
      name: "Sales Analysis dengan field Studio",
      path: "Sales → Reporting → Analysis (group field custom)",
      kpi: "Revenue per Segmen Toko / Prioritas",
      decision: `Fokus CS ke retail prioritas ${customer.name}`,
    },
    {
      name: "Approval Latency",
      path: "Activity / filter SO waiting approval (manual atau studio report)",
      kpi: "Waktu rata-rata menunggu approve",
      decision: "Sesuaikan ambang diskon atau tambah approver",
    },
    {
      name: "Technical Views inventory",
      path: "Settings → Technical → Views (Developer Mode)",
      kpi: "Jumlah inherit Studio per model kritis",
      decision: "Bersihkan sebelum upgrade major",
    },
  ],
  security: {
    roles: [
      {
        role: "Studio / Settings Administrator",
        can: [
          "Toggle Studio",
          "Tambah field, ubah view, buat approval",
          "Export customization",
        ],
        cannot: [
          "Mengabaikan SOP change management",
          "Menghapus data bisnis lewat 'eksperimen'",
        ],
        whyDifferent:
          "Kekuatan kustomisasi setara semi-development — harus dibatasi orang terlatih.",
      },
      {
        role: "Sales Manager (Approver)",
        can: [
          "Approve SO sesuai rule",
          "Lihat field kontrol harga",
        ],
        cannot: [
          "Mengubah rule Studio sendiri (kecuali juga Admin)",
        ],
        whyDifferent:
          "Manager menjalankan kebijakan; Admin mengubah kebijakan.",
      },
      {
        role: "Sales / User",
        can: [
          "Mengisi field custom yang visible",
          "Submit dokumen untuk approval",
        ],
        cannot: [
          "Masuk mode Studio",
          "Menonaktifkan approval",
        ],
        whyDifferent:
          "Operasi harian harus stabil; desain UI bukan tugas sales floor.",
      },
    ],
    notes: [
      "Review akses Studio setiap ganti orang proyek",
      "Samakan disiplin dengan perubahan hak akses Users",
      "Portal user jangan melihat field internal hasil Studio",
    ],
  },
  levels: {
    beginner: [
      "Apa itu Studio vs Developer Mode",
      "Toggle Studio di form, lihat palet field",
      "Tambah satu field Char/Selection tidak required",
      "Isi field pada SO latihan & Save",
    ],
    intermediate: [
      "Tambah kolom list + filter search",
      "Pasang satu approval sederhana",
      "Uji dengan dua user (Sales vs Manager)",
      "Catat technical name di register",
    ],
    advanced: [
      "Automation Studio ringan dengan domain aman",
      "Mini-app non-kritis + access rights",
      "Audit field mati & cleanup",
      "Persiapan inventaris view sebelum upgrade",
    ],
    expert: [
      "Governance portofolio kustomisasi vs roadmap development",
      "Desain approval multi-kondisi tanpa macet operasi",
      "Strategi export/migrasi customization antar DB",
      "Keputusan arsitektur: Studio, Studio+module, atau full module",
    ],
  },
  exercises: [
    {
      id: "ex-stu-field",
      title: "Field Toko Prioritas",
      objective: "Menambah & menguji field Selection di SO",
      prerequisites: ["Studio terpasang", "Akses Admin", "Sales app ada"],
      task: [
        "Toggle Studio pada form SO",
        "Tambah Selection Toko Prioritas (Ya/Tidak)",
        "Close Studio",
        `Isi pada quotation ${customer.name} untuk ${kopi.name}`,
      ],
      expectedResult: "Nilai field tersimpan setelah refresh",
      checklist: ["Label jelas", "Tidak required dulu", "Persist OK", "Technical name dicatat"],
    },
    {
      id: "ex-stu-approval",
      title: "Rule approval diskon",
      objective: "Mengalami Confirm tertahan vs lolos",
      prerequisites: ["Dua user: Sales & Manager", "Field diskon dipahami"],
      task: [
        "Buat approval rule diskon > 15%",
        "SO diskon 20% sebagai Sales — gagal Confirm",
        "Approve sebagai Manager",
        "SO diskon 5% — Confirm langsung",
      ],
      expectedResult: "Rule selektif; bukan memblok semua SO",
      checklist: ["Domain benar", "Approver aktif", "Log approval ada"],
    },
    {
      id: "ex-stu-devmode",
      title: "Inspeksi dengan Developer Mode",
      objective: "Menghubungkan Studio ke metadata teknis",
      prerequisites: ["Field latihan sudah ada"],
      task: [
        "Activate Developer Mode",
        "Bug icon pada SO → temukan field x_studio_…",
        "Catat model & type",
        "Deactivate Developer Mode",
      ],
      expectedResult: "Register memuat technical name valid",
      checklist: ["Dev Mode on/off sadar", "Nama field tercatat", "Tidak edit Technical sembarangan"],
    },
    {
      id: "ex-stu-governance",
      title: "Terima vs tolak request",
      objective: "Melatih keputusan kapan TIDAK memakai Studio",
      prerequisites: ["Pemahaman overview modul ini"],
      task: [
        "Tulis 3 request fiktif (field kecil, integrasi API, app stok paralel)",
        "Putuskan Terima Studio / Tolak untuk masing-masing",
        "Isi template register untuk yang diterima",
        "Tulis alasan penolakan 1–2 kalimat",
      ],
      expectedResult: "Keputusan terdokumentasi ala proyek nyata",
      checklist: ["Ada yang ditolak beralasan", "Ada yang diterima dengan owner", "Tidak semua 'ya'"],
    },
  ],
  coreFlowLinks: [
    { label: "Deep Dive Developer Mode", href: "/materi/developer-mode" },
    { label: "Deep Dive Settings", href: "/materi/settings" },
    { label: "Deep Dive Users", href: "/materi/users" },
    { label: "Deep Dive Sales", href: "/materi/sales" },
    { label: "Deep Dive Contacts", href: "/materi/contacts" },
  ],
};
