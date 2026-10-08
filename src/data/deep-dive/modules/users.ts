import type { DeepDiveModule } from "../types";
import { seed } from "../../seed";
import { odooLab } from "../../odoo-lab";

const company = seed.company;

/**
 * Deep Dive — Users & Access Rights
 * Fokus least privilege, groups Sales/Purchase/Inventory/Accounting User vs Manager.
 */
export const usersDeepDive: DeepDiveModule = {
  slug: "users",
  name: "Users & Access Rights",
  shortTitle: "Users & Access",
  icon: "Shield",
  category: "admin",
  wave: 1,
  availability: "available",
  availabilityNote:
    "Menu Users tersedia di Settings. Beberapa nama group bisa sedikit berbeda di Odoo 19 — verifikasi label di tab Access Rights.",
  apps: ["Settings", "Discuss"],
  overview: {
    function:
      "Users & Access Rights mengatur siapa yang boleh login, aplikasi apa yang terlihat, dan tindakan apa yang diizinkan (create/confirm/post/admin). Di Odoo, hak akses terutama diberikan lewat Groups, bukan centang manual per menu satu per satu.",
    businessProblem:
      "Semua orang pakai akun admin → risiko salah posting, hapus master, dan tidak ada jejak tanggung jawab. Sebaliknya, user tanpa group yang tepat tidak bisa Confirm PO/SO atau Validate picking — operasional macet.",
    typicalUsers: [
      "System / Functional Administrator",
      "Finance Manager (meninjau group Accounting)",
      "Sales Manager / Purchase Manager",
      "Internal Auditor (review segregation of duties)",
    ],
    whenNeeded:
      "Setelah Company dasar terbentuk, sebelum banyak orang menyentuh transaksi. Wajib sebelum go-live multi-user dan sebelum latihan least privilege di lab.",
    relatedModules: [
      "Settings / Companies",
      "Sales",
      "Purchase",
      "Inventory",
      "Accounting",
      "Contacts",
    ],
    businessScenario: `Di ${company.name}, Admin membuat user operasional: Sales User untuk input SO ke ${seed.customers.toko.name}, Purchase User untuk RFQ ke ${seed.vendors.bahan.name}, Inventory User untuk receipt/delivery, dan Accounting User untuk invoice/bill. Manager mendapat group Manager pada modulnya. Setiap user login sendiri ke ${odooLab.url} (DB ${odooLab.database}) — bukan berbagi admin/admin untuk kerja harian.`,
  },
  prerequisites: {
    modules: [
      "Company profil sudah diisi",
      "Apps operasional (Sales/Purchase/Inventory/Accounting) sudah di-install agar group terkait muncul",
    ],
    masterData: [
      "Minimal satu Company aktif",
      "Email unik per user (boleh domain .test untuk lab)",
    ],
    configuration: [
      "Settings → Users & Companies → Users",
      "Developer Mode hanya jika perlu meninjau Technical groups (opsional Developer Mode)",
    ],
    access: [
      "Hanya Admin / Settings Manager yang boleh membuat user & mengubah groups",
      "Jangan delegasikan Manage Users ke Sales User biasa",
    ],
    relationships:
      "User login → Groups → Access Rights (model) + Menu visibility. User juga bisa di-link sebagai Salesperson/Buyer pada Contact dan dokumen. Company pada user menentukan company default (single-company lab).",
  },
  installation: {
    how: [
      "Users adalah bagian dari base Settings — tidak perlu install app terpisah bernama Users.",
      "Settings → Users & Companies → Users.",
      "Pastikan apps bisnis terpasang agar tab Access Rights menampilkan Administration level per modul (Sales, Purchase, dll.).",
    ],
    dependencies: [
      "base, mail",
      "sales_team / sale — group Sales",
      "purchase — group Purchase",
      "stock — group Inventory",
      "account — group Accounting / Invoicing",
    ],
    afterInstall: [
      "Review user Admin bawaan — ganti password di produksi (lab boleh admin/admin).",
      "Buat minimal satu user non-admin untuk uji least privilege.",
      "Catat matriks role: User vs Manager per modul.",
    ],
    newMenus: [
      "Settings → Users & Companies → Users",
      "Settings → Users & Companies → Groups (sering butuh Developer Mode)",
      "Settings → Users & Companies → Companies",
    ],
    newSettings: [
      "Settings → General Settings → Permissions (opsi terkait invitation/portal — verifikasi UI)",
      "Default access rights saat invite user baru",
    ],
  },
  configurations: [
    {
      id: "cfg-user-type",
      name: "User Type (Internal / Portal / Public)",
      location: "Settings → Users → form → tab Access Rights / Preferences",
      what: "Internal User = karyawan; Portal = customer/vendor terbatas; Public = publik.",
      whyEnable:
        "Memisahkan pekerja internal dari login portal pelanggan agar tidak mendapat menu backend.",
      whenEnable: "Selalu set Internal untuk staf ${company.name}.",
      whenNot: "Jangan beri Internal User ke pelanggan hanya agar mereka “lihat SO”.",
      businessExample:
        "Kasir/admin sales = Internal; customer portal Toko Maju Jaya = Portal (lanjutan).",
      impact: "Portal tidak melihat Apps backend; Internal melihat sesuai groups.",
      screenshot: {
        src: "/screenshots/odoo19e/w1-user-form-new.png",
        caption: "Form User — tipe dan Access Rights",
        whatYouSee: "Settings Users form Access Rights",
      },
    },
    {
      id: "cfg-sales-groups",
      name: "Sales: User vs Administrator/Manager",
      location: "Users → Access Rights → Sales",
      what: "Level akses aplikasi Sales.",
      whyEnable:
        "Sales User input & confirm sesuai kebijakan; Manager melihat semua order/tim dan konfigurasi sales.",
      whenEnable: "Saat merekrut/menugaskan staf penjualan.",
      whenNot: "Jangan semua orang Sales Manager — konfigurasi pricelist rawan diubah.",
      businessExample:
        "Staff SO untuk Toko Maju Jaya = Sales / User; kepala toko pusat = Sales Administrator.",
      impact:
        "User: dokumen milik sendiri/tim; Manager: lihat semua + settings Sales.",
      screenshot: {
        src: "/screenshots/odoo19e/w1-user-form-new.png",
        caption: "Dropdown Sales access level pada User",
        whatYouSee: "",
      },
    },
    {
      id: "cfg-purchase-groups",
      name: "Purchase: User vs Administrator",
      location: "Users → Access Rights → Purchase",
      what: "Level akses RFQ/PO dan konfigurasi pembelian.",
      whyEnable: "Buyer operasional vs manager yang atur approval/config.",
      whenEnable: "Ada staf pembelian terpisah dari sales.",
      whenNot: "Sales User tidak otomatis butuh Purchase Admin.",
      businessExample: `Buyer PO ke ${seed.vendors.bahan.name} = Purchase User.`,
      impact: "Tanpa Purchase User, menu Purchase tidak efektif / read-only terbatas.",
    },
    {
      id: "cfg-inventory-groups",
      name: "Inventory: User vs Administrator",
      location: "Users → Access Rights → Inventory",
      what: "Hak validate receipt/delivery vs konfigurasi gudang/routes.",
      whyEnable:
        "Operator gudang validate picking; Manager ubah warehouse & lokasi.",
      whenEnable: "Operasi stok harian dipisah dari admin master gudang.",
      whenNot: "Jangan beri Inventory Admin ke semua kasir.",
      businessExample:
        "Petugas receiving = Inventory User; desain 1-step WH = Inventory Admin.",
      impact: "User tanpa Inventory tidak bisa Validate picking.",
    },
    {
      id: "cfg-accounting-groups",
      name: "Accounting / Invoicing: User vs Billing vs Administrator",
      location: "Users → Access Rights → Accounting",
      what: "Dari buat invoice sampai posting journal & konfigurasi pajak.",
      whyEnable: "Pisahkan staf penagihan dari yang menutup periode / ubah COA.",
      whenEnable: "Ada fungsi AR/AP terpisah.",
      whenNot: "Sales User biasanya cukup invoicing terbatas — bukan Accounting Admin.",
      businessExample:
        "AR clerk post invoice customer; Accounting Admin setup pajak 11%.",
      impact: "Posting & laporan keuangan terkunci sesuai level.",
      screenshot: {
        src: "/screenshots/odoo19e/w1-user-form-new.png",
        caption: "Accounting access levels",
        whatYouSee: "",
      },
    },
    {
      id: "cfg-administration",
      name: "Administration: Access Rights / Settings",
      location: "Users → Access Rights → Administration",
      what: "Settings = admin aplikasi; Access Rights = kelola users/groups.",
      whyEnable: "Hanya untuk functional admin yang mengelola sistem.",
      whenEnable: "1–2 orang bertanggung jawab lab/produksi.",
      whenNot: "Jangan berikan ke Sales/Purchase User harian.",
      businessExample: `Hanya admin lab (${odooLab.user}) yang Manage Users di latihan.`,
      impact: "Pemegang Access Rights bisa menaikkan privilege diri/orang lain — risiko tinggi.",
    },
    {
      id: "cfg-multi-company-user",
      name: "Allowed Companies pada User",
      location: "Users → form → Companies / Multi-company fields",
      what: "Company mana yang boleh diakses user.",
      whyEnable: "Di lingkungan multi-company, membatasi data antar entitas.",
      whenEnable: "Multi-company; di lab single-company cukup default.",
      whenNot: "Jangan ekspos semua company ke magang.",
      businessExample: `Lab: hanya ${company.name}.`,
      impact: "Record rules memfilter data per company.",
    },
  ],
  masterData: [
    {
      id: "md-internal-user",
      name: "Internal User",
      purpose: "Akun login karyawan untuk bekerja di backend Odoo.",
      required: true,
      whyNeeded: "Tanpa user, tidak ada akuntabilitas; semua aksi tertempel admin.",
      fields: [
        {
          field: "Name",
          type: "char",
          required: true,
          purpose: "Nama tampilan",
          why: "Muncul di chatter & salesperson",
          example: "Ayu Sales",
          impactIfEmpty: "Tidak bisa simpan user",
        },
        {
          field: "Email / Login",
          type: "char",
          required: true,
          purpose: "Identitas login",
          why: "Unik per database",
          example: "ayu.sales@nusantara-demo.test",
          impactIfEmpty: "Login gagal / tidak unik",
        },
        {
          field: "Password",
          type: "char",
          required: true,
          purpose: "Autentikasi",
          why: "Keamanan akses",
          example: "(set via Change Password / invite)",
          impactIfEmpty: "User tidak bisa masuk",
        },
        {
          field: "Language",
          type: "many2one",
          required: false,
          purpose: "Bahasa UI",
          why: "Produktivitas",
          example: "Indonesian / English",
          impactIfEmpty: "Pakai default company/browser",
        },
        {
          field: "Timezone",
          type: "selection",
          required: false,
          purpose: "Zona waktu user",
          why: "Timestamp aktivitas benar",
          example: "Asia/Jakarta",
          impactIfEmpty: "Waktu dokumen bisa bergeser",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w1-user-form-new.png",
        caption: "Form User baru Internal",
        whatYouSee: "New User form",
      },
    },
    {
      id: "md-access-matrix",
      name: "Matriks Group operasional lab",
      purpose: "Paket groups yang dipakai latihan least privilege.",
      required: true,
      whyNeeded: "Menstandarkan role agar latihan bisa diulang.",
      fields: [
        {
          field: "Sales access",
          type: "selection",
          required: false,
          purpose: "Level Sales",
          why: "SO & customer",
          example: "User",
          impactIfEmpty: "Menu Sales terbatas/tidak ada",
        },
        {
          field: "Purchase access",
          type: "selection",
          required: false,
          purpose: "Level Purchase",
          why: "RFQ/PO",
          example: "User",
          impactIfEmpty: "Tidak bisa buat PO",
        },
        {
          field: "Inventory access",
          type: "selection",
          required: false,
          purpose: "Level Inventory",
          why: "Receipt/Delivery",
          example: "User",
          impactIfEmpty: "Tidak bisa Validate picking",
        },
        {
          field: "Accounting access",
          type: "selection",
          required: false,
          purpose: "Level Accounting",
          why: "Invoice/Bill/Laporan",
          example: "Billing / Accountant",
          impactIfEmpty: "Tidak bisa post invoice",
        },
        {
          field: "Administration",
          type: "selection",
          required: false,
          purpose: "Settings vs Access Rights",
          why: "Kelola sistem",
          example: "(kosong untuk user operasional)",
          impactIfEmpty: "Aman untuk least privilege — diharapkan kosong",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w1-user-form-new.png",
        caption: "Tab Access Rights terisi level User (bukan Admin)",
        whatYouSee: "",
      },
    },
  ],
  dependencies: {
    nodes: [
      { id: "company", label: "Company" },
      { id: "apps", label: "Apps terpasang" },
      { id: "groups", label: "Security Groups" },
      { id: "user", label: "User" },
      { id: "menus", label: "Menu visibility" },
      { id: "docs", label: "PO / SO / Picking / Invoice" },
    ],
    edges: [
      {
        from: "company",
        to: "user",
        why: "User terikat company default",
      },
      {
        from: "apps",
        to: "groups",
        why: "Install app mendaftarkan groups modul",
      },
      {
        from: "groups",
        to: "user",
        why: "User di-assign ke groups",
      },
      {
        from: "user",
        to: "menus",
        why: "Groups menentukan menu yang terlihat",
      },
      {
        from: "user",
        to: "docs",
        why: "Create/confirm/post dicek ACL + record rules",
      },
    ],
    summary:
      "Apps → Groups → User → Menu & ACL. Salah urutan (user sebelum app terpasang) membuat dropdown access kosong.",
  },
  forms: [
    {
      id: "form-user",
      name: "User Form",
      menuPath: "Settings → Users & Companies → Users → New",
      fields: [
        {
          field: "Name",
          required: true,
          purpose: "Nama user",
          why: "Identitas",
          example: "Budi Purchase",
        },
        {
          field: "Email",
          required: true,
          purpose: "Login",
          why: "Unik",
          example: "budi.purchase@nusantara-demo.test",
        },
        {
          field: "Access Rights (per app)",
          required: false,
          purpose: "Level group per aplikasi",
          why: "Least privilege",
          example: "Purchase = User; Sales = kosong",
        },
        {
          field: "Administration",
          required: false,
          purpose: "Settings / Access Rights",
          why: "Hanya admin",
          example: "(kosong)",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w1-settings.png",
        caption: "Form Users di Settings",
        whatYouSee: "",
        whatToFill: "Name, Email, Access Rights",
      },
    },
    {
      id: "form-change-password",
      name: "Change Password Wizard",
      menuPath: "Users → Action → Change Password",
      fields: [
        {
          field: "New Password",
          required: true,
          purpose: "Password login",
          why: "Aktivasi akun lab tanpa email nyata",
          example: "SalesUser123!",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w1-user-form-new.png",
        caption: "Wizard ganti password user",
        whatYouSee: "",
      },
    },
  ],
  procedures: [
    {
      id: "proc-create-sales-user",
      title: "Membuat Sales User dan set password",
      goal: "User operasional Sales bisa login dan membuat Quotation tanpa Settings admin.",
      preparation: [
        `Login ${odooLab.user} di ${odooLab.url}`,
        "App Sales sudah terpasang",
      ],
      steps: [
        "Settings → Users & Companies → Users → New.",
        "Name: Ayu Sales; Email: ayu.sales@nusantara-demo.test.",
        "User Type: Internal User.",
        "Tab Access Rights → Sales = User.",
        "Inventory = User (agar bisa memahami delivery terkait SO — opsional).",
        "Administration = kosong.",
        "Save.",
        "Action → Change Password → set password lab → Confirm.",
        "Logout admin → login sebagai Ayu Sales → verifikasi menu.",
      ],
      expectedResult:
        "Ayu melihat Sales (dan apps yang diberi). Tidak melihat Manage Users.",
      verification: [
        "Login sukses dengan email/password baru",
        "Bisa New Quotation untuk customer seed",
        "Settings Users tidak tersedia / access error",
      ],
      fillFields: [
        {
          field: "Name",
          value: "Ayu Sales",
          where: "User form",
          how: "Ketik",
          required: true,
        },
        {
          field: "Email",
          value: "ayu.sales@nusantara-demo.test",
          where: "User form",
          how: "Ketik",
          required: true,
        },
        {
          field: "Sales",
          value: "User",
          where: "Access Rights",
          how: "Pilih",
          required: true,
        },
        {
          field: "Administration",
          value: "(kosong)",
          where: "Access Rights",
          how: "Pilih",
          note: "Least privilege",
        },
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w1-user-form-new.png",
        caption: "Sales User setelah Access Rights di-set",
        whatYouSee: "",
      },
    },
    {
      id: "proc-create-purchase-user",
      title: "Membuat Purchase User",
      goal: "Buyer dapat membuat RFQ/PO tanpa mengubah konfigurasi Purchase.",
      preparation: ["Admin login", "App Purchase terpasang"],
      steps: [
        "Users → New → Budi Purchase / budi.purchase@nusantara-demo.test.",
        "Purchase = User; Inventory = User (untuk receipt terkait).",
        "Sales & Administration kosong kecuali dibutuhkan.",
        "Set password → login uji → buat RFQ ke vendor seed.",
      ],
      expectedResult: "RFQ bisa dibuat & di-confirm sesuai hak User.",
      verification: [
        "Menu Purchase terlihat",
        "Configuration Purchase tidak penuh seperti Admin",
      ],
      fillFields: [
        {
          field: "Name",
          value: "Budi Purchase",
          where: "User form",
          how: "Ketik",
          required: true,
        },
        {
          field: "Purchase",
          value: "User",
          where: "Access Rights",
          how: "Pilih",
          required: true,
        },
        {
          field: "Inventory",
          value: "User",
          where: "Access Rights",
          how: "Pilih",
        },
      ],
    },
    {
      id: "proc-manager-vs-user",
      title: "Membandingkan User vs Manager di Sales",
      goal: "Memahami perbedaan visibility dan konfigurasi.",
      preparation: [
        "Ada Sales User (Ayu)",
        "Ada Sales Manager / Admin terpisah atau naikkan sementara di sandbox",
      ],
      steps: [
        "Login sebagai Sales User → buat SO milik sendiri.",
        "Coba buka Settings → Sales (harus gagal/terbatas).",
        "Login sebagai Sales Administrator → lihat semua SO.",
        "Buka Sales → Configuration — opsi lebih lengkap.",
        "Kembalikan least privilege setelah uji.",
      ],
      expectedResult:
        "Tabel perbedaan: User operasional vs Manager konfigurasi terdokumentasi.",
      verification: [
        "Screenshot menu Configuration dari kedua role",
        "Catatan: Manager melihat order milik user lain",
      ],
      screenshot: {
        src: "/screenshots/odoo19e/w1-users-list.png",
        caption: "Perbandingan menu Sales User vs Manager",
        whatYouSee: "",
      },
    },
    {
      id: "proc-least-privilege-test",
      title: "Uji least privilege end-to-end singkat",
      goal: "Satu user hanya punya group yang dibutuhkan tugasnya.",
      preparation: ["Empat user: Sales, Purchase, Inventory, Accounting (level User)"],
      steps: [
        "Sales User: buat SO — jangan beri Purchase Admin.",
        "Purchase User: buat PO — jangan beri Accounting Admin.",
        "Inventory User: validate receipt/delivery.",
        "Accounting User: buat/post invoice & bill.",
        "Setiap role coba buka Settings → Users → pastikan ditolak.",
      ],
      expectedResult: "Rantai P2P/O2C berjalan dengan 4 role tanpa akun superuser.",
      verification: [
        "Access Error muncul saat menyentuh Manage Users",
        "Dokumen berhasil pada tugas masing-masing",
      ],
    },
  ],
  scenarios: [
    {
      id: "sc-new-hire-sales",
      title: "Karyawan baru Sales",
      whenToUse: "Onboarding staf yang hanya handle Order-to-Cash sebagian.",
      flow: [
        "Create Internal User",
        "Sales = User; Contacts creation jika perlu",
        "Inventory User opsional untuk delivery",
        "Set password / invite",
        "Login uji Quotation ke customer seed",
      ],
    },
    {
      id: "sc-buyer-warehouse",
      title: "Buyer + operator gudang terpisah",
      whenToUse: "Segregation: yang beli ≠ yang terima barang.",
      flow: [
        "Purchase User tanpa Inventory Admin",
        "Inventory User tanpa Purchase Admin",
        "PO oleh buyer → Receipt oleh gudang",
        "Audit: dua user berbeda di chatter/log",
      ],
      notes: "Praktik baik untuk mengurangi fraud receiving.",
    },
    {
      id: "sc-finance-only",
      title: "Staf AR/AP",
      whenToUse: "Finance tidak boleh ubah harga jual atau route gudang.",
      flow: [
        "Accounting level Billing/Accountant",
        "Tanpa Sales/Purchase Admin",
        "Post invoice/bill + register payment",
        "Baca Aged AR/AP",
      ],
    },
    {
      id: "sc-break-glass-admin",
      title: "Akun admin terbatas",
      whenToUse: "Hanya untuk setup & insiden.",
      flow: [
        "Simpan admin untuk Settings",
        "Kerja harian pakai user role",
        "Setelah config, logout admin",
      ],
      notes: `Lab memakai ${odooLab.user}/${odooLab.password} — jangan ditiru di produksi tanpa harden.`,
    },
  ],
  integrations: [
    {
      id: "int-sales-user",
      withModule: "Sales",
      relationship: "Salesperson = res.users",
      whatHappens:
        "SO menyimpan user_id/salesperson; group Sales menentukan apakah user bisa confirm & lihat order.",
    },
    {
      id: "int-purchase-user",
      withModule: "Purchase",
      relationship: "Buyer pada PO & Contact",
      whatHappens: "Group Purchase mengontrol create/confirm RFQ/PO.",
    },
    {
      id: "int-stock-user",
      withModule: "Inventory",
      relationship: "Validate picking butuh stock user groups",
      whatHappens: "Tanpa group Inventory, tombol Validate error akses.",
    },
    {
      id: "int-account-user",
      withModule: "Accounting",
      relationship: "Post moves & reports",
      whatHappens: "Level Accounting membatasi posting, rekonsiliasi, dan settings pajak.",
    },
  ],
  mistakes: [
    {
      id: "err-everyone-admin",
      problem: "Semua staf diberi Administration = Settings/Access Rights",
      why: "Siapa saja bisa menaikkan hak atau mengubah fiscal config",
      detect: "Banyak user di list punya Access Rights",
      fix: "Cabut Administration dari user operasional",
      prevent: "Policy: max 2 admin bernama",
    },
    {
      id: "err-share-admin-password",
      problem: "Berbagi password admin untuk kerja harian",
      why: "Tidak ada jejak siapa yang Confirm/Post",
      detect: "Chatter selalu Administrator",
      fix: "Buat user per orang; ganti password admin",
      prevent: "SOP login individu",
    },
    {
      id: "err-manager-for-all",
      problem: "Semua Sales User dijadikan Sales Administrator",
      why: "Konfigurasi pricelist/team bisa diubah tanpa kontrol",
      detect: "Dropdown Sales = Administrator pada banyak user",
      fix: "Turunkan ke User; Manager hanya kepala tim",
      prevent: "Matriks role tertulis sebelum create user",
    },
    {
      id: "err-missing-inventory",
      problem: "Sales User harus delivery tetapi tidak punya Inventory User",
      why: "Validate delivery gagal — proses O2C macet",
      detect: "Access Error pada stock.picking",
      fix: "Tambah Inventory = User atau serahkan ke user gudang",
      prevent: "Desain role end-to-end sebelum go-live",
    },
    {
      id: "err-portal-as-internal",
      problem: "Customer diberi Internal User",
      why: "Kebocoran harga, stok, data vendor",
      detect: "Email customer muncul di Users Internal",
      fix: "Ubah ke Portal atau archive; buat ulang dengan benar",
      prevent: "Checklist User Type saat New",
    },
  ],
  troubleshooting: [
    {
      id: "tr-access-error-confirm",
      problem: "Access Error saat Confirm SO/PO",
      causes: [
        "Group User tidak cukup / belum Save",
        "Record rules milik tim lain",
        "User Type salah",
      ],
      diagnosis: [
        "Login admin → buka user → cek Access Rights",
        "Coba Confirm sebagai admin untuk isolasi",
        "Cek ownership dokumen (salesperson/buyer)",
      ],
      solution: [
        "Naikkan level ke User yang benar (bukan langsung Admin)",
        "Assign user ke sales team yang tepat",
        "Save user → logout/login ulang",
      ],
      prevention: "Uji role setelah create user sebelum dipakai produksi",
    },
    {
      id: "tr-menu-missing",
      problem: "Menu aplikasi tidak muncul setelah login",
      causes: [
        "App belum di-install",
        "Group aplikasi kosong",
        "Cache browser / session lama",
      ],
      diagnosis: [
        "Admin: Apps → pastikan installed",
        "Cek dropdown access user",
        "Hard refresh / login ulang",
      ],
      solution: [
        "Install app → edit user groups → login ulang",
      ],
      prevention: "Install apps sebelum membuat matriks user",
    },
    {
      id: "tr-cannot-login",
      problem: "User baru tidak bisa login",
      causes: [
        "Password belum di-set",
        "Email typo",
        "User di-archive / tidak aktif",
      ],
      diagnosis: [
        "Admin Action Change Password",
        "Cek Active",
        `Pastikan DB name ${odooLab.database}`,
      ],
      solution: [
        "Set password ulang",
        "Perbaiki login email",
        "Unarchive user",
      ],
      prevention: "Checklist: Save → set password → uji login sebelum serah terima",
    },
  ],
  behind: {
    models: [
      "res.users — akun login",
      "res.groups — security groups",
      "ir.model.access — ACL CRUD per model",
      "ir.rule — record rules (tim/company)",
      "res.company — company user",
    ],
    relations: [
      "res.users.groups_id ↔ res.groups",
      "res.users.company_id / company_ids",
      "sale.order.user_id → salesperson",
      "purchase.order.user_id → buyer",
    ],
    automations: [
      "Invite email (jika outgoing mail dikonfigurasi)",
      "Default groups dari template user (jika dipakai)",
    ],
    securityNotes: [
      "Group Implication: Manager sering mengimplies User",
      "Access Rights group = superpower — audit berkala",
      "Portal vs Internal dipisah ketat",
    ],
    note: "Deep Dive ini fungsional: Anda mengatur groups di UI, bukan menulis ACL Python.",
  },
  reporting: [
    {
      name: "Users List",
      path: "Settings → Users & Companies → Users",
      kpi: "Jumlah internal users aktif & yang punya Administration",
      decision: "Apakah terlalu banyak admin?",
    },
    {
      name: "Groups membership",
      path: "Settings → Users → Groups (Developer Mode)",
      kpi: "Keanggotaan per group kritis",
      decision: "Siapa saja Sales Administrator?",
    },
    {
      name: "Audit chatter dokumen",
      path: "SO/PO/Invoice → chatter history",
      kpi: "User yang Confirm/Post",
      decision: "Apakah segregation of duties berjalan?",
    },
  ],
  security: {
    roles: [
      {
        role: "Settings / Access Rights Admin",
        can: [
          "Create/edit users",
          "Assign any group",
          "Ubah company settings",
        ],
        cannot: [
          "Mengabaikan hukum/policy perusahaan — tetap harus least privilege",
        ],
        whyDifferent: "Kontrol penuh konfigurasi keamanan.",
      },
      {
        role: "Module Manager (Sales/Purchase/Inventory/Accounting Admin)",
        can: [
          "Konfigurasi aplikasi modulnya",
          "Lihat semua dokumen modul",
          "Override sebagian batasan User",
        ],
        cannot: ["Manage Users global (kecuali juga diberi Access Rights)"],
        whyDifferent: "Kuasa fungsional modul, bukan platform admin.",
      },
      {
        role: "Module User",
        can: ["Transaksi harian sesuai modul", "Edit dokumen yang diizinkan record rules"],
        cannot: [
          "Configuration sensitif",
          "Manage Users",
          "Naikkan privilege sendiri",
        ],
        whyDifferent: "Operasional aman dengan jejak jelas.",
      },
    ],
    notes: [
      "Least privilege default; naikkan hak hanya jika uji gagal dengan alasan jelas.",
      "Pisahkan buyer vs receiver vs accountant bila memungkinkan.",
      "Review bulanan: siapa masih punya Administration?",
    ],
  },
  levels: {
    beginner: [
      "Membuka menu Users",
      "Membuat Internal User + password",
      "Memilih Sales/Purchase User",
      "Login sebagai user tersebut",
    ],
    intermediate: [
      "Matriks User vs Manager multi-modul",
      "Uji Access Error yang diharapkan",
      "Menyusun role P2P dan O2C terpisah",
      "Timezone & language user",
    ],
    advanced: [
      "Record rules & sales teams",
      "Portal users",
      "Multi-company allowed companies",
      "Audit keanggotaan groups",
    ],
    expert: [
      "Segregation of duties design untuk audit",
      "Role catalog perusahaan + joiner/mover/leaver",
      "Integrasi SSO/LDAP (konsep — di luar lab dasar)",
      "Privilege review otomatis berkala",
    ],
  },
  exercises: [
    {
      id: "ex-four-users",
      title: "Buat empat user operasional",
      objective: "Menerapkan least privilege per modul inti.",
      prerequisites: [`Admin ${odooLab.user}`, "Apps Sales/Purchase/Inventory/Accounting terpasang"],
      task: [
        "Buat Ayu Sales (Sales User)",
        "Buat Budi Purchase (Purchase + Inventory User)",
        "Buat Citra Gudang (Inventory User)",
        "Buat Dedi Finance (Accounting User/Billing)",
        "Set password masing-masing dan uji login",
      ],
      expectedResult: "Empat session berbeda; tidak ada yang punya Administration.",
      checklist: [
        "Email unik",
        "Administration kosong",
        "Login sukses",
        "Access Error saat buka Manage Users",
      ],
    },
    {
      id: "ex-so-as-sales-user",
      title: "SO sebagai Sales User",
      objective: "Membuktikan group Sales User cukup untuk O2C awal.",
      prerequisites: ["Ayu Sales aktif", `Customer ${seed.customers.toko.name}`],
      task: [
        "Login Ayu",
        `Quotation untuk ${seed.customers.toko.name} produk ${seed.products.kopi.name}`,
        "Confirm SO bila hak mengizinkan",
        "Catat apakah delivery perlu user gudang",
      ],
      expectedResult: "SO tercipta atas nama Ayu; admin tidak dipakai.",
      checklist: ["Salesperson = Ayu", "Tidak ada akses Settings Users"],
    },
    {
      id: "ex-compare-manager",
      title: "Naik-turun Manager (sandbox)",
      objective: "Mengobservasi perbedaan menu Configuration.",
      prerequisites: ["User Sales uji"],
      task: [
        "Screenshot menu sebagai User",
        "Naikkan ke Sales Administrator",
        "Screenshot Configuration",
        "Kembalikan ke User",
      ],
      expectedResult: "Dokumentasi visual perbedaan hak.",
      checklist: ["Dikembalikan ke User", "Catatan perbedaan terlampir"],
    },
  ],
  coreFlowLinks: [
    { label: "Core: Users & Access", href: "/modul/users-access" },
    { label: "Core: Setup Perusahaan", href: "/modul/setup-perusahaan" },
    { label: "Deep Dive: Settings", href: "/materi/settings" },
  ],
};
